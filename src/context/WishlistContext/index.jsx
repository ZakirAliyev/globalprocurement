import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { useGetWishlistQuery, usePostWishlistManageMutation } from '../../services/userApi.jsx';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { auth } = useAuth();
    const prevToken = useRef(auth?.token);
    const [wishlist, setWishlist] = useState([]);

    const { data: serverData, refetch: refetchServer } = useGetWishlistQuery(undefined, { skip: !auth?.token });
    const [manageWishlist] = usePostWishlistManageMutation();

    // 1️⃣ Guest initial load from localStorage
    useEffect(() => {
        if (!auth?.token) {
            const saved = localStorage.getItem('wishlist');
            if (saved) {
                try { setWishlist(JSON.parse(saved)); } catch {}
            }
        }
    }, [auth?.token]);

    // 2️⃣ On serverData arrival when logged in: override local state
    useEffect(() => {
        if (auth?.token && serverData?.data) {
            const ids = serverData.data.map(item => item.productDto.id);
            setWishlist(ids);
            localStorage.setItem('wishlist', JSON.stringify(ids));
        }
    }, [auth?.token, serverData]);

    // 3️⃣ Login/Logout detect for diff-based sync
    useEffect(() => {
        // on login only
        if (auth?.token && !prevToken.current) {
            refetchServer().unwrap()
                .then(res => {
                    const serverIds = res.data.map(i => i.productDto.id);
                    const localIds = wishlist;

                    const adds = localIds.filter(id => !serverIds.includes(id)).map(id => ({ productId: id }));
                    const removes = serverIds.filter(id => !localIds.includes(id)).map(id => ({ productId: id }));

                    const diff = [...adds, ...removes];
                    if (diff.length) {
                        // single bulk call
                        manageWishlist(diff)
                            .unwrap()
                            .catch(console.warn)
                            .finally(() => {
                                refetchServer()
                                    .unwrap()
                                    .then(finalRes => {
                                        const finalIds = finalRes.data.map(i => i.productDto.id);
                                        setWishlist(finalIds);
                                        localStorage.setItem('wishlist', JSON.stringify(finalIds));
                                    })
                                    .catch(console.warn);
                            });
                    }
                })
                .catch(console.warn);
        }

        // on logout
        if (!auth?.token && prevToken.current) {
            setWishlist([]);
            localStorage.removeItem('wishlist');
        }

        prevToken.current = auth?.token;
    }, [auth?.token]);

    // 4️⃣ Toggle single item
    const toggleWishlist = useCallback((productId) => {
        setWishlist(prev => {
            const exists = prev.includes(productId);
            const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];

            if (auth?.token) {
                manageWishlist([{ productId }]).catch(console.warn);
            } else {
                localStorage.setItem('wishlist', JSON.stringify(next));
            }

            return next;
        });
    }, [auth?.token, manageWishlist]);

    const isInWishlist = useCallback(id => wishlist.includes(id), [wishlist]);

    // 5️⃣ Clear all
    const clearWishlist = useCallback(() => {
        if (auth?.token && wishlist.length) {
            const removes = wishlist.map(id => ({ productId: id }));
            manageWishlist(removes).catch(console.warn);
        }
        setWishlist([]);
        localStorage.removeItem('wishlist');
    }, [auth?.token, manageWishlist, wishlist]);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
