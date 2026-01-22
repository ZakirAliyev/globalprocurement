import "./index.scss";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {BiCategoryAlt} from "react-icons/bi";
import {IoChevronDown} from "react-icons/io5";
import {
    navigateToAboutPage, navigateToBestseller,
    navigateToDiscountsPage,
    navigateToHomePage
} from "../../../utils";
import {useLocation, useNavigate} from "react-router-dom";
import {useGetCategoriesQuery} from "../../../services/userApi.jsx";
import {HiBars3BottomRight} from "react-icons/hi2";
import {Drawer} from "antd";
import logo from "/public/assets/logo.png";
import {
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaPhoneAlt
} from "react-icons/fa";
import {FaWhatsapp} from "react-icons/fa6";
import {CATEGORY_IMAGES} from "../../../contants/index.js";

function BottomNavbar() {
    const {t} = useTranslation();

    const [isMobile, setIsMobile] = useState(false);
    const [openMega, setOpenMega] = useState(false);
    const [activeCatId, setActiveCatId] = useState(null);
    const [mobileSearch, setMobileSearch] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const navRef = useRef(null);
    const megaRef = useRef(null);

    const {data: categoriesData, isLoading} = useGetCategoriesQuery();

    /* -------------------- RESPONSIVE -------------------- */
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* -------------------- DEFAULT CATEGORY -------------------- */
    useEffect(() => {
        if (categoriesData?.data?.length && !activeCatId) {
            setActiveCatId(categoriesData.data[0].id);
        }
    }, [categoriesData, activeCatId]);

    /* -------------------- ESC CLOSE -------------------- */
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape" && openMega) setOpenMega(false);
        };

        if (openMega) {
            document.body.classList.add("no-scroll");
            window.addEventListener("keydown", onKey);
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
            window.removeEventListener("keydown", onKey);
        };
    }, [openMega]);

    /* -------------------- CLICK OUTSIDE -------------------- */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!openMega) return;
            if (
                navRef.current &&
                !navRef.current.contains(e.target) &&
                megaRef.current &&
                !megaRef.current.contains(e.target)
            ) {
                setOpenMega(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [openMega]);

    const isActive = (path) => location.pathname === path;

    const selectedCategory =
        categoriesData?.data?.find((c) => c.id === activeCatId) ||
        categoriesData?.data?.[0];

    const CategoryTrigger = (
        <button
            type="button"
            className={`cat-trigger ${openMega ? "active" : ""}`}
            onClick={() => !isMobile && setOpenMega((v) => !v)}
        >
            <BiCategoryAlt className="icon"/>
            <span>{t("bottomNavbar.allCategories")}</span>
            <IoChevronDown className={`chev ${openMega ? "rot" : ""}`}/>
        </button>
    );

    return (
        <section id="bottomNavbar" ref={navRef}>
            <div className="container">
                <nav>
                    {isMobile ? (
                        <>
                            <input
                                placeholder={t(
                                    "bottomNavbar.searchPlaceholder"
                                )}
                                value={mobileSearch}
                                onChange={(e) =>
                                    setMobileSearch(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        mobileSearch.trim()
                                    ) {
                                        navigate(
                                            `/filter?search=${mobileSearch.trim()}`
                                        );
                                        setMobileSearch("");
                                    }
                                }}
                            />

                            <HiBars3BottomRight
                                style={{
                                    fontSize: "30px",
                                    color: "var(--about-text)"
                                }}
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
                                        setOpenMega(false);
                                    }}
                                    className={isActive("/") ? "selected" : ""}
                                >
                                    {t("bottomNavbar.home")}
                                </span>

                                <span
                                    onClick={() => {
                                        navigateToBestseller();
                                        setOpenMega(false);
                                    }}
                                    className={isActive("/best-seller") ? "selected" : ""}
                                >
                                     {t("bottomNavbar.bestseller")}
                                </span>

                                <span
                                    onClick={() => {
                                        navigateToDiscountsPage();
                                        setOpenMega(false);
                                    }}
                                    className={
                                        isActive("/discounts")
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    {t("bottomNavbar.discounts")}
                                </span>

                                <span
                                    onClick={() => {
                                        navigateToAboutPage();
                                        setOpenMega(false);
                                    }}
                                    className={
                                        isActive("/about") ? "selected" : ""
                                    }
                                >
                                    {t("bottomNavbar.about")}
                                </span>
                            </div>

                            {openMega && (
                                <div
                                    className="mega-overlay"
                                    onClick={() => setOpenMega(false)}
                                />
                            )}

                            <div
                                id="megaMenu"
                                className={`mega-panel ${
                                    openMega ? "open" : ""
                                }`}
                                ref={megaRef}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mega-wrapper">
                                    <div className="mega-inner">
                                        <aside className="mega-left">
                                            <ul>
                                                {categoriesData?.data?.map(
                                                    (cat) => (
                                                        <li
                                                            key={cat.id}
                                                            className={
                                                                cat.id ===
                                                                activeCatId
                                                                    ? "active"
                                                                    : ""
                                                            }
                                                            onMouseEnter={() =>
                                                                !isMobile &&
                                                                setActiveCatId(
                                                                    cat.id
                                                                )
                                                            }
                                                            onClick={() =>
                                                                isMobile &&
                                                                setActiveCatId(
                                                                    cat.id
                                                                )
                                                            }
                                                        >
                                                            {cat.name}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </aside>

                                        <section className="mega-right">
                                            {selectedCategory?.subCategories?.map(
                                                (sub) => {
                                                    const chunks = [];
                                                    if (
                                                        sub.products?.length
                                                    ) {
                                                        for (
                                                            let i = 0;
                                                            i <
                                                            sub.products
                                                                .length;
                                                            i += 3
                                                        ) {
                                                            chunks.push(
                                                                sub.products.slice(
                                                                    i,
                                                                    i + 3
                                                                )
                                                            );
                                                        }
                                                    }

                                                    return (
                                                        <div
                                                            key={sub.id}
                                                            className="col-wrapper"
                                                        >
                                                            <h4>
                                                                <img
                                                                    src={
                                                                        CATEGORY_IMAGES +
                                                                        sub.categoryImage
                                                                    }
                                                                    alt={
                                                                        sub.name
                                                                    }
                                                                    className={"categoryImage123123"}
                                                                />
                                                                {sub.name}
                                                            </h4>

                                                            {chunks.length ? (
                                                                <div className="col-group">
                                                                    {chunks.map(
                                                                        (
                                                                            chunk,
                                                                            idx
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="col"
                                                                            >
                                                                                {chunk.map(
                                                                                    (
                                                                                        prod
                                                                                    ) => (
                                                                                        <a
                                                                                            key={
                                                                                                prod.id
                                                                                            }
                                                                                            onClick={() => {
                                                                                                navigate(
                                                                                                    `/${prod.categoryId}/${prod.subCategoryId}/${prod.id}`
                                                                                                );
                                                                                                setOpenMega(
                                                                                                    false
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                prod.name
                                                                                            }
                                                                                        </a>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="no-products">
                                                                    {t(
                                                                        "bottomNavbar.noProducts"
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </section>
                                    </div>
                                </div>

                                <div style={{visibility: "hidden"}}>
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
                width="85%"
            >
                <div className="mobile-menu-wrapper">
                    <div className="mobile-menu-logo">
                        <img src={logo} alt="Logo"/>
                    </div>

                    <div className="mobile-menu-separator"/>

                    <div className="mobile-menu-items">
                        <div
                            className="menu-item"
                            onClick={() => {
                                navigate("/");
                                setOpenDrawer(false);
                            }}
                        >
                            {t("bottomNavbar.home")}
                        </div>

                        <div
                            className="menu-item"
                            onClick={() => {
                                navigate("/discounts");
                                setOpenDrawer(false);
                            }}
                        >
                            {t("bottomNavbar.discounts")}
                        </div>

                        <div
                            className="menu-item"
                            onClick={() => {
                                navigate("/best-seller");
                                setOpenDrawer(false);
                            }}
                        >
                            {t("bottomNavbar.bestseller")}
                        </div>

                        <div
                            className="menu-item"
                            onClick={() => {
                                navigate("/about");
                                setOpenDrawer(false);
                            }}
                        >
                            {t("bottomNavbar.about")}
                        </div>
                    </div>

                    <div className="mobile-menu-separator-bottom"/>

                    <div className="mobile-menu-socials">
                        <a
                            href="https://www.instagram.com/globalservices.az/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram/>
                        </a>
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaFacebookF/>
                        </a>
                        <a
                            href="https://wa.me/994507093929"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
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
