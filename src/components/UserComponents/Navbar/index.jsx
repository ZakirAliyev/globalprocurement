import './index.scss';
import { useTranslation } from "react-i18next";
import logo from "/public/assets/logo.png";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa6";
import { HiOutlineShoppingCart, HiOutlineUser } from "react-icons/hi";
import { HiMiniBars3 } from "react-icons/hi2";
import LoginRegisterModal from "../LoginRegisterModal/index.jsx";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext/index.jsx";
import { navigateToWishlistPage } from "../../../utils/index.js";
import { useWishlist } from "../../../context/WishlistContext/index.jsx";
import {useBasket} from "../../../context/BasketContext/index.jsx";

function Navbar() {
    const { t } = useTranslation();
    const { auth } = useAuth();
    const [isMobile, setIsMobile] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { wishlist } = useWishlist();
    const { kinds: basketKinds } = useBasket(); // <-- SƏBƏT SAYI

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener('resize', handleResize);

        const theme = localStorage.getItem('theme');
        setIsDarkTheme(theme === 'dark');

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAuthClick = () => setShowModal(true);
    const handleProfileClick = () => navigate('/user');
    const handleWishlistClick = () => {
        if (auth) navigateToWishlistPage();
        else setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);
    const handleCartClick = () => navigate('/basket'); // <-- SƏBƏTƏ GET

    const getInitial = () => {
        if (auth?.user?.name) return auth.user.name.charAt(0).toUpperCase();
        return <HiOutlineUser className={"icon"} />;
    };

    const wishlistCount = wishlist.length;

    return (
        <section id="navbar">
            <div className="container">
                <nav>
                    <img
                        src={logo}
                        alt="Logo"
                        style={isDarkTheme ? { filter: 'brightness(0) invert(1)' } : {}}
                        onClick={() => navigate('/')}
                    />

                    {!isMobile && (
                        <div className="inputWrapper">
                            <input placeholder="İstədiyin məhsulu axtar......" />
                            <FiSearch className="icon" />
                        </div>
                    )}

                    <div className="right">
                        {auth ? (
                            <div className="profile-avatar" onClick={handleProfileClick}>
                                {getInitial()}
                            </div>
                        ) : (
                            <>
                                <HiOutlineUser className={"icon"} onClick={handleAuthClick} style={{ cursor: 'pointer' }} />
                                <div className="vertical"></div>
                                <div className="textWrapper" onClick={handleAuthClick} style={{ cursor: 'pointer' }}>
                                    <span>{t('Giriş')}</span>
                                    <span className="hesab">{t('Hesab')}</span>
                                </div>
                            </>
                        )}

                        {/* Wishlist icon + badge */}
                        <div className="icon-wrapper" onClick={handleWishlistClick} style={{ cursor: auth ? 'pointer' : 'not-allowed' }}>
                            <FaRegHeart
                                className={"icon"}
                                style={{ opacity: auth ? 1 : 0.5 }}
                            />
                            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                        </div>

                        <div className="icon-wrapper" onClick={handleCartClick} style={{ cursor: 'pointer' }}>
                            <HiOutlineShoppingCart className={"icon"} />
                            {basketKinds > 0 && <span className="badge">{basketKinds}</span>}
                        </div>
                    </div>
                </nav>
            </div>

            {showModal && <LoginRegisterModal onClose={handleCloseModal} />}
        </section>
    );
}

export default Navbar;
