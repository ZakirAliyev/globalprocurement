import './index.scss';
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiCategoryAlt } from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { navigateToAboutPage, navigateToDiscountsPage, navigateToHomePage } from "../../../utils";
import { useLocation } from "react-router-dom";
import {useGetCategoriesQuery} from "../../../services/userApi.jsx";
import {FaBars} from "react-icons/fa";
import {FaBarsStaggered} from "react-icons/fa6";
import {HiMiniBars3BottomRight} from "react-icons/hi2";

function BottomNavbar() {
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [openMega, setOpenMega] = useState(false);
    const [activeCatId, setActiveCatId] = useState(null);
    const location = useLocation();
    const navRef = useRef(null);

    const { data: categoriesData, isLoading } = useGetCategoriesQuery();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ESC ilə bağlama + body scroll lock
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setOpenMega(false);
        if (openMega) {
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

    // nav-dan kənara klikdə bağla
    useEffect(() => {
        const onDocClick = (e) => {
            if (!openMega) return;
            if (navRef.current && !navRef.current.contains(e.target)) setOpenMega(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [openMega]);

    const isActive = (path) => location.pathname === path;

    const CategoryTrigger = (
        <button
            type="button"
            className={`cat-trigger ${openMega ? 'active' : ''}`}
            onClick={() => !isMobile && setOpenMega(v => !v)}
            aria-expanded={openMega}
            aria-controls="megaMenu"
        >
            <BiCategoryAlt className="icon" />
            <span>Bütün kateqoriyalar</span>
            <IoChevronDown className={`chev ${openMega ? 'rot' : ''}`} />
        </button>
    );

    // seçilmiş kateqoriyanı tap
    const selectedCategory = categoriesData?.data?.find(c => c.id === activeCatId) || categoriesData?.data?.[0];

    return (
        <section id="bottomNavbar" ref={navRef}>
            <div className="container">
                <nav>
                    {isMobile ? (
                        <>
                            <BiCategoryAlt className="icon" />
                            <input placeholder="Axtarış....." />
                            <HiMiniBars3BottomRight style={{ fontSize: '28px', color: 'var(--about-text)' }} className="cartIcon" />
                        </>
                    ) : (
                        <>
                            {CategoryTrigger}

                            <div className="number">
                                <span onClick={navigateToHomePage} className={isActive('/') ? 'selected' : ''}>Ana səhifə</span>
                                <span onClick={navigateToDiscountsPage} className={isActive('/discounts') ? 'selected' : ''}>Endirimlər</span>
                                <span onClick={navigateToAboutPage} className={isActive('/about') ? 'selected' : ''}>Haqqımızda</span>
                            </div>

                            {/* Ekranı qaraldan overlay */}
                            {openMega && <div className="mega-overlay" onClick={() => setOpenMega(false)} />}

                            {/* Mega menü paneli */}
                            <div
                                id="megaMenu"
                                className={`mega-panel ${openMega ? 'open' : ''}`}
                                onClick={(e) => e.stopPropagation()}
                                role="dialog"
                                aria-hidden={!openMega}
                            >
                                <div className="mega-inner">
                                    {/* Sol panel */}
                                    <aside className="mega-left">
                                        <ul>
                                            {categoriesData?.data?.map(cat => (
                                                <li
                                                    key={cat.id}
                                                    className={cat.id === (activeCatId || categoriesData?.data?.[0]?.id) ? "active" : ""}
                                                    onClick={() => setActiveCatId(cat.id)}
                                                >
                                                    {cat.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </aside>

                                    {/* Sağ panel */}
                                    {/* Sağ panel */}
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
                                                    <div className="col-group">
                                                        {chunkedProducts.map((chunk, idx) => (
                                                            <div key={idx} className="col">
                                                                {chunk.map(prod => (
                                                                    <a key={prod.id}>{prod.name}</a>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </section>

                                </div>
                            </div>

                            <div style={{ visibility: 'hidden' }}>
                                {CategoryTrigger}
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </section>
    );
}

export default BottomNavbar;
