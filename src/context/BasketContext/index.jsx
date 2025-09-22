import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "basket";
const BasketContext = createContext(null);

/** LocalStorage-dən təhlükəsiz oxu */
function readStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/** LocalStorage-ə təhlükəsiz yazı */
function writeStorage(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
}

/** Qiyməti müəyyənləşdir (endirim varsa onu götür) */
function resolveUnitPrice(p) {
    if (typeof p?.discount === "number" && p.discount > 0) return p.discount;
    return Number(p?.price ?? 0);
}

export function BasketProvider({ children }) {
    const [items, setItems] = useState(readStorage);
    const hasHydrated = useRef(false);

    // İlk mountdan sonra persist
    useEffect(() => {
        if (!hasHydrated.current) {
            hasHydrated.current = true;
            return;
        }
        writeStorage(items);
    }, [items]);

    /** Məhsul əlavə et (bütün datası ilə) */
    const addItem = (product, qty = 1) => {
        if (!product || !product.id) return;
        setItems(prev => {
            const idx = prev.findIndex(x => x.id === product.id);
            if (idx !== -1) {
                const next = [...prev];
                next[idx] = {
                    ...next[idx],
                    quantity: (next[idx].quantity || 1) + qty,
                    unitPrice: resolveUnitPrice(product),
                };
                return next;
            }
            return [
                ...prev,
                {
                    ...product,
                    unitPrice: resolveUnitPrice(product),
                    quantity: Math.max(1, qty),
                    _addedAt: Date.now(),
                },
            ];
        });
    };

    /** Məhsulu səbətdən sil */
    const removeItem = (id) => {
        setItems(prev => prev.filter(x => x.id !== id));
    };

    /** Miqdarı dəyiş */
    const setQuantity = (id, qty) => {
        setItems(prev =>
            prev.map(x =>
                x.id === id ? { ...x, quantity: Math.max(1, Number(qty) || 1) } : x
            )
        );
    };

    /** Miqdarı artır */
    const increment = (id, step = 1) => {
        setItems(prev =>
            prev.map(x =>
                x.id === id ? { ...x, quantity: (x.quantity || 1) + step } : x
            )
        );
    };

    /** Miqdarı azaldır */
    const decrement = (id, step = 1) => {
        setItems(prev =>
            prev.map(x =>
                x.id === id ? { ...x, quantity: Math.max(1, (x.quantity || 1) - step) } : x
            )
        );
    };

    /** Səbəti təmizlə */
    const clear = () => setItems([]);

    /** Ümumi məhsul sayı (miqdar toplama) */
    const count = useMemo(
        () => items.reduce((n, x) => n + (x.quantity || 1), 0),
        [items]
    );

    /** Neçə cür məhsul (distinct product) */
    const kinds = useMemo(
        () => items.length,
        [items]
    );

    /** Cəmi qiymət */
    const subtotal = useMemo(
        () => items.reduce((sum, x) => sum + (x.unitPrice ?? 0) * (x.quantity || 1), 0),
        [items]
    );

    /** Səbətdə varmı? */
    const isInCart = (id) => items.some(x => x.id === id);

    /** ID-ə görə məhsulu al */
    const getItem = (id) => items.find(x => x.id === id);

    const value = {
        items,
        addItem,
        removeItem,
        setQuantity,
        increment,
        decrement,
        clear,
        count,      // ümumi miqdar
        kinds,      // neçə cür məhsul
        subtotal,
        isInCart,
        getItem,
    };

    return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export const useBasket = () => {
    const ctx = useContext(BasketContext);
    if (!ctx) throw new Error("useBasket must be used within BasketProvider");
    return ctx;
};
