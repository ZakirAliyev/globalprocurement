import "./index.scss";
import { useTranslation } from "react-i18next";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { TbShoppingCartCheck } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";
import { useBasket } from "../../../context/BasketContext";
import image1 from "/public/assets/new.png";
import { PRODUCT_IMAGES } from "../../../contants/index.js";
import { useState } from "react";

function Offer({ item, type }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addItem } = useBasket(); // 🛒 səbət konteksti
    const [added, setAdded] = useState(false); // animasiya və ikon dəyişimi üçün

    const liked = isInWishlist(item?.id);

    // Dilə görə ad seçimi
    const getName = () => {
        switch (i18n.language) {
            case "en":
                return item?.nameEng || item?.name || t("No Name");
            case "ru":
                return item?.nameRu || item?.name || t("No Name");
            default:
                return item?.name || t("No Name");
        }
    };

    // Məhsul səhifəsinə keçid
    const handleNavigate = () => {
        if (item?.categoryId && item?.subCategoryId && item?.id) {
            navigate(`/${item.categoryId}/${item.subCategoryId}/${item.id}`);
        }
    };

    // Like toggle
    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        toggleWishlist(item?.id);
    };

    // 🔹 Add to cart — Card.jsx ilə eyni məntiq
    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (added) return;
        addItem(item, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    };

    const src = item?.cardImage
        ? `${PRODUCT_IMAGES}/${item.cardImage}`
        : "/assets/placeholder.png";

    if (!item || typeof item?.price === "undefined" || typeof item?.discount === "undefined") {
        return <div>Error: Product data is missing</div>;
    }

    return (
        <section id="offer">
            <div className="imageWrapper" onClick={handleNavigate}>
                <img src={src} draggable={false} className="img" alt={getName()} />
                {(type === "new" || item?.isNew) && (
                    <div className="imageWrapper1">
                        <img src={image1} className="type" alt={t("New")} />
                        <div className="new">{t("Yeni")}</div>
                    </div>
                )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span className="productName" onClick={handleNavigate}>
                        {getName()}
                    </span>
                    <span className="sku">SKU: {item?.sku || "12345678"}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "153px" }}>
                    <div className="cart">
                        <div className="like" onClick={handleWishlistToggle}>
                            {liked ? <FaHeart className="icon liked" /> : <FaRegHeart className="icon" />}
                        </div>

                        {/* 🛒 Add to cart animasiyası ilə */}
                        <div
                            className={`addToCart ${added ? "added" : ""}`}
                            onClick={handleAddToCart}
                        >
                            {added ? (
                                <TbShoppingCartCheck className="cartIcon" />
                            ) : (
                                <>
                                    <FiShoppingCart className="cartIcon" />
                                    <div className="text">{t("Səbətə at")}</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Offer;
