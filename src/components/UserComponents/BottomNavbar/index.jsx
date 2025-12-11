import './index.scss';
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {BiCategoryAlt} from "react-icons/bi";
import {IoChevronDown} from "react-icons/io5";
import {navigateToAboutPage, navigateToDiscountsPage, navigateToHomePage} from "../../../utils";
import {useLocation, useNavigate} from "react-router-dom";
import {useGetCategoriesQuery} from "../../../services/userApi.jsx";
import {HiBars3BottomRight} from "react-icons/hi2";
import {Drawer} from "antd";
import logo from "/public/assets/logo.png";
import {FaEnvelope, FaFacebookF, FaInstagram, FaPhoneAlt, FaTelegramPlane, FaTwitter, FaYoutube} from "react-icons/fa";
import {FaWhatsapp} from "react-icons/fa6";

function BottomNavbar() {
    const {t} = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [openMega, setOpenMega] = useState(false);
    const [activeCatId, setActiveCatId] = useState(null);
    const location = useLocation();
    const navRef = useRef(null);
    const navigate = useNavigate();
    const megaRef = useRef(null);

    useEffect(() => {
        const onDocClick = (e) => {
            if (!openMega) return;
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenMega(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [openMega]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!openMega) return;

            // mega panel yoxdursa skip et
            if (megaRef.current && !megaRef.current.contains(e.target)) {
                setOpenMega(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMega]);


    const {data: categoriesData, isLoading} = useGetCategoriesQuery();

    const [mobileSearch, setMobileSearch] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && openMega) {
                setOpenMega(false);
            }
        };
        if (openMega) {
            document.body.classList.add('no-scroll');
            window.addEventListener('keydown', onKey);
        } else {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', onKey);
        }
        return () => {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', onKey);
        };
    }, [openMega]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!openMega) return;

            // mega panel yoxdursa skip et
            if (megaRef.current && !megaRef.current.contains(e.target)) {
                setOpenMega(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMega]);


    useEffect(() => {
        if (categoriesData?.data?.length > 0 && !activeCatId) {
            setActiveCatId(categoriesData.data[0].id);
        }
    }, [categoriesData, activeCatId]);

    const isActive = (path) => location.pathname === path;

    const closeMega = () => setOpenMega(false);

    const handleCategoryClick = (catId) => {
        setActiveCatId(catId);
        if (isMobile) {
            closeMega();
        }
    };

    const handleProductClick = (prod) => {
        navigate(`/${prod.categoryId}/${prod.subCategoryId}/${prod.id}`);
        closeMega();
    };

    const CategoryTrigger = (
        <button
            type="button"
            className={`cat-trigger ${openMega ? 'active' : ''}`}
            onClick={() => !isMobile && setOpenMega(v => !v)}
            aria-expanded={openMega}
            aria-controls="megaMenu"
        >
            <BiCategoryAlt className="icon"/>
            <span>Bütün kateqoriyalar</span>
            <IoChevronDown className={`chev ${openMega ? 'rot' : ''}`}/>
        </button>
    );

    const selectedCategory = categoriesData?.data?.find(c => c.id === activeCatId) || categoriesData?.data?.[0];

    return (
        <section id="bottomNavbar" ref={navRef}>
            <div className="container">
                <nav>
                    {isMobile ? (
                        <>
                            <input
                                placeholder="Axtarış....."
                                value={mobileSearch}
                                onChange={(e) => setMobileSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && mobileSearch.trim() !== "") {
                                        navigate(`/filter?search=${mobileSearch.trim()}`);
                                        setMobileSearch("");
                                    }
                                }}
                            />

                            <HiBars3BottomRight
                                style={{fontSize: '30px', color: 'var(--about-text)'}}
                                className="cartIcon"
                                onClick={() => setOpenDrawer(true)}
                            />
                        </>
                    ) : (
                        <>
                            {CategoryTrigger}

                            <div className="number">
                                <span
                                    onClick={() => {
                                        navigateToHomePage();
                                        closeMega();
                                    }}
                                    className={isActive('/') ? 'selected' : ''}
                                >
                                    Ana səhifə
                                </span>

                                <span
                                    onClick={() => {
                                        navigateToDiscountsPage();
                                        closeMega();
                                    }}
                                    className={isActive('/discounts') ? 'selected' : ''}
                                >
                                    Endirimlər
                                </span>

                                <span
                                    onClick={() => {
                                        navigateToAboutPage();
                                        closeMega();
                                    }}
                                    className={isActive('/about') ? 'selected' : ''}
                                >
                                    Haqqımızda
                                </span>
                            </div>

                            {openMega && <div className="mega-overlay" onClick={closeMega}/>}

                            <div
                                id="megaMenu"
                                className={`mega-panel ${openMega ? 'open' : ''}`}
                                role="dialog"
                                aria-hidden={!openMega}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mega-wrapper" onClick={(e) => e.stopPropagation()}>
                                    <div className="mega-inner">
                                        <aside className="mega-left">
                                            <ul>
                                                {categoriesData?.data?.map(cat => (
                                                    <li
                                                        key={cat.id}
                                                        className={cat.id === activeCatId ? "active" : ""}
                                                        onMouseEnter={() => !isMobile && setActiveCatId(cat.id)}
                                                        onClick={() => isMobile && handleCategoryClick(cat.id)}
                                                    >
                                                        {cat.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </aside>

                                        <section className="mega-right">
                                            {selectedCategory?.subCategories?.map(sub => {
                                                const chunkedProducts = [];
                                                if (sub.products?.length) {
                                                    for (let i = 0; i < sub.products.length; i += 3) {
                                                        chunkedProducts.push(sub.products.slice(i, i + 3));
                                                    }
                                                }

                                                return (
                                                    <div key={sub.id} className="col-wrapper">
                                                        <h4>{sub.name}</h4>
                                                        {chunkedProducts.length > 0 ? (
                                                            <div className="col-group">
                                                                {chunkedProducts.map((chunk, idx) => (
                                                                    <div key={idx} className="col">
                                                                        {chunk.map(prod => (
                                                                            <a
                                                                                key={prod.id}
                                                                                onClick={() => handleProductClick(prod)}
                                                                            >
                                                                                {prod.name}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="no-products">Məhsul tapılmadı</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </section>
                                    </div>
                                </div>

                                <div style={{visibility: 'hidden'}}>
                                    {CategoryTrigger}
                                </div>
                            </div>
                        </>
                    )}
                </nav>
            </div>

            <Drawer
                title=""
                placement="right"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                width={"85%"}
            >
                <div className="mobile-menu-wrapper">
                    <div className="mobile-menu-logo">
                        <img src={logo} alt="Logo"/>
                    </div>

                    <div className="mobile-menu-separator"></div>

                    <div className="mobile-menu-items">
                        <div className="menu-item" onClick={() => {
                            navigate('/');
                            setOpenDrawer(false);
                        }}>
                            Ana Səhifə
                        </div>

                        <div className="menu-item" onClick={() => {
                            navigate('/discounts');
                            setOpenDrawer(false);
                        }}>
                            Endirimlər
                        </div>

                        <div className="menu-item" onClick={() => {
                            navigate('/about');
                            setOpenDrawer(false);
                        }}>
                            Haqqımızda
                        </div>
                    </div>

                    <div className="mobile-menu-separator-bottom"></div>
                    <div className="mobile-menu-socials">
                        <a href="https://www.instagram.com/gpsazerbaijan/" target="_blank"
                           rel="noopener noreferrer">
                            <FaInstagram/>
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF/>
                        </a>
                        <a href="https://wa.me/994507093929" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp/>
                        </a>
                        <a href="tel:+994507093929">
                            <FaPhoneAlt/>
                        </a>
                        <a href="mailto:info@gpsazerbaijan.com">
                            <FaEnvelope/>
                        </a>
                    </div>
                </div>
            </Drawer>
        </section>
    );
}

export default BottomNavbar;