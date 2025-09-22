// src/pages/BasketPage/index.jsx
import "./index.scss";
import { MdChevronRight, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import PageBottom from "../../../components/PageBottom/index.jsx";
import PageTop from "../../../components/PageTop/index.jsx";

import { useAuth } from "../../../context/AuthContext/index.jsx";
import { useBasket } from "../../../context/BasketContext/index.jsx";
import { useWishlist } from "../../../context/WishlistContext/index.jsx";

import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import LoginRegisterModal from "../../../components/UserComponents/LoginRegisterModal/index.jsx";
import { PRODUCT_IMAGES } from "../../../contants/index.js";
import sebetbosdur from "/public/assets/sebetbosdur.png";

function BasketPage() {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { items, increment, decrement, setQuantity, removeItem } = useBasket();
    const { toggleWishlist, isInWishlist } = useWishlist();

    // Auth modal
    const [showAuth, setShowAuth] = useState(false);

    const formatAz = (n) => `${(Number(n ?? 0)).toFixed(2)} ₼`;

    const getImageSrc = (p) => {
        const idOrUrl = p.image || (Array.isArray(p.images) && p.images[0]) || p.cardImage;
        if (!idOrUrl) return "/assets/placeholder.png";
        const looksLikeUrl = typeof idOrUrl === "string" && /^https?:\/\//i.test(idOrUrl);
        return looksLikeUrl ? idOrUrl : `${PRODUCT_IMAGES}/${idOrUrl}`;
    };

    // Toplamlar (compare-at = discount, cari = price)
    const { currentSubtotal, compareSubtotal, savings } = useMemo(() => {
        let cur = 0;
        let comp = 0;
        for (const p of items) {
            const qty = Number(p.quantity || 1);
            const price = Number(p.price || 0);
            const compare = Number(p.discount || 0);
            cur += price * qty;
            comp += (compare > price ? compare : price) * qty;
        }
        return { currentSubtotal: cur, compareSubtotal: comp, savings: Math.max(0, comp - cur) };
    }, [items]);

    // “Davam et”
    const handleGoCheckout = () => {
        if (items.length === 0) return;
        if (!auth) {
            setShowAuth(true);
            return;
        }
        navigate("/checkout");
    };

    // Login olunduqdan sonra /checkout
    useEffect(() => {
        if (showAuth && auth) {
            setShowAuth(false);
            navigate("/checkout");
        }
    }, [auth, showAuth, navigate]);

    const handleWishlist = (productId) => {
        toggleWishlist(productId); // login tələb etmir
    };

    return (
        <>
            <PageTop />
            <section id="basketPage">
                <div className="container">
                    {/* breadcrumb */}
                    <div className="navigation">
                        <div className="navText" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                            Ana səhifə
                        </div>
                        <MdChevronRight className="navText" />
                        <div className="selected navText">Səbət</div>
                    </div>

                    {/* title */}
                    <h2>Səbətiniz ({items.length} məhsul)</h2>
                    <div className="line3"></div>

                    <div className="row">
                        {/* left: məhsul siyahısı */}
                        <div className="col-9">
                            {/* header yalnız bir dəfə */}
                            {items.length > 0 && (
                                <div className="basket-header">
                                    <div className="product-col">Məhsul</div>
                                    <div className="quantity-col">Kəmiyyət</div>
                                    <div className="total-col">Qiymət</div>
                                    <div className="total-col1">Cəm</div>
                                </div>
                            )}

                            {items.length === 0 ? (
                                <div
                                    className="empty"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "48px",
                                        flexDirection: "column",
                                        textAlign: "center",
                                    }}
                                >
                                    <img src={sebetbosdur} alt="Səbət boşdur" style={{ maxWidth: "200px", width: "100%" }} />
                                    <h3 style={{ fontWeight: 500, fontSize: "16px", marginTop: "16px" }}>
                                        Səbətiniz hazırda boşdur
                                    </h3>
                                    <h4
                                        style={{
                                            fontWeight: 400,
                                            fontSize: "14px",
                                            marginTop: "8px",
                                            color: "var(--message-text)",
                                        }}
                                    >
                                        Məhsul əlavə etmək üçün alış-verişə başlayın.
                                    </h4>
                                </div>
                            ) : (
                                items.map((p) => {
                                    const qty = Number(p.quantity || 1);
                                    const price = Number(p.price || 0);
                                    const compare = Number(p.discount || 0); // compare-at
                                    const showCompare = compare > price;

                                    const lineTotal = price * qty;

                                    const imgSrc = getImageSrc(p);
                                    const wished = isInWishlist(p.id);

                                    return (
                                        <div key={p.id} className="product-row">
                                            <div className="image">
                                                <img src={imgSrc} alt={p.name} />
                                            </div>

                                            <div className="product-info">
                                                <h3>{p.name}</h3>
                                                {p.color && <p>Rəng: {p.color}</p>}
                                                {p.code && <p>Məhsul kodu: {p.code}</p>}

                                                <button
                                                    className={`wishlist ${wished ? "active" : ""}`}
                                                    type="button"
                                                    onClick={() => handleWishlist(p.id)}
                                                    title={wished ? "Seçilmişlərdən çıxar" : "İstək siyahısına əlavə et"}
                                                >
                                                    {wished ? <MdFavorite style={{ color: "var(--top-nav-bg)" }} /> : <MdFavoriteBorder />}
                                                    {wished ? " Seçilib" : " İstək siyahısına əlavə et"}
                                                </button>
                                            </div>

                                            <div className="quantityControl">
                                                <button
                                                    className="qtyBtn"
                                                    onClick={() => decrement(p.id, 1)}
                                                    aria-label="Azalt"
                                                    type="button"
                                                >
                                                    -
                                                </button>

                                                <input
                                                    className="qtyDisplay"
                                                    value={qty}
                                                    onChange={(e) => setQuantity(p.id, Number(e.target.value) || 1)}
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    aria-label="Kəmiyyət"
                                                />

                                                <button
                                                    className="qtyBtn"
                                                    onClick={() => increment(p.id, 1)}
                                                    aria-label="Artır"
                                                    type="button"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Sətir cəmi */}
                                            <div className="price">{formatAz(lineTotal)}</div>

                                            <button
                                                className="remove"
                                                onClick={() => removeItem(p.id)}
                                                aria-label="Sil"
                                                type="button"
                                                title="Səbətdən sil"
                                            >
                                                <LuTrash2 />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* right: yekun panel */}
                        <div className="col-3">
                            <div className="summary">
                                <h3>Səbətin cəmi :</h3>

                                <div className="mini-list">
                                    {items.length === 0 && (
                                        <div
                                            className="empty"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "8px",
                                                flexDirection: "column",
                                                textAlign: "center",
                                            }}
                                        >
                                            <img src={sebetbosdur} alt="Səbət boşdur" style={{ maxWidth: "100px", width: "100%" }} />
                                        </div>
                                    )}

                                    {items.map((p) => {
                                        const imgSrc = getImageSrc(p);
                                        const price = Number(p.price || 0);
                                        const compare = Number(p.discount || 0);
                                        const showCompare = compare > price;
                                        return (
                                            <div key={p.id} className="mini-item">
                                                <div className="mini-image">
                                                    <img src={imgSrc} alt={p.name} />
                                                </div>
                                                <div className="mini-info">
                                                    <h4>{p.name}</h4>
                                                    <p>Say: {p.quantity || 1} ədəd</p>
                                                    <p className="mini-price">
                                                        <span className="current-price">{formatAz(price)}</span>
                                                        {showCompare && (
                                                            <span
                                                                className="old-price"
                                                                style={{ marginLeft: 6, textDecoration: "line-through", opacity: 0.6 }}
                                                            >
                                {formatAz(compare)}
                              </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="divider"></div>

                                <div className="totals">
                                    <div className="totals-row">
                                        <span>Sifarişin cəmi</span>
                                        <span>{formatAz(compareSubtotal)}</span>
                                    </div>
                                    <div className="totals-row">
                                        <span>Endirim</span>
                                        <span>{formatAz(savings)}</span>
                                    </div>
                                    <div className="totals-row total">
                                        <span>Ümumi məbləğ</span>
                                        <span>{formatAz(currentSubtotal)}</span>
                                    </div>
                                </div>

                                <div className="buttonWrapper">
                                    <button
                                        className="checkout"
                                        onClick={handleGoCheckout}
                                        disabled={items.length === 0}
                                        title={items.length === 0 ? "Səbət boşdur" : "Davam et"}
                                    >
                                        <IoCartOutline /> Davam et
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Auth Modal: auth yoxdursa Davam et klikində açılır */}
            {showAuth && <LoginRegisterModal onClose={() => setShowAuth(false)} />}

            <PageBottom />
        </>
    );
}

export default BasketPage;
