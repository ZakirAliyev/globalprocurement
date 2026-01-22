import "./index.scss";
import { useTranslation } from "react-i18next";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { TbShoppingCartCheck } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";
import { useBasket } from "../../../context/BasketContext";
import newImage from "/public/assets/new.png";
import { PRODUCT_IMAGES } from "../../../contants/index.js";
import { useState } from "react";

function Offer({ item, type }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addItem } = useBasket();

    const [added, setAdded] = useState(false);

    const liked = isInWishlist(item?.id);

    /* -------- LANGUAGE AWARE PRODUCT NAME -------- */
    const lang = i18n.language;
    const productName =
        lang === "ru"
            ? item?.nameRu
            : lang === "en"
                ? item?.nameEng
                : item?.name;

    const handleNavigate = () => {
        if (item?.categoryId && item?.subCategoryId && item?.id) {
            navigate(`/${item.categoryId}/${item.subCategoryId}/${item.id}`);
        }
    };

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        toggleWishlist(item?.id);
    };

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

    if (
        !item ||
        typeof item?.price === "undefined" ||
        typeof item?.discount === "undefined"
    ) {
        return (
            <div className="offer-error">
                {t("offer.missingData")}
            </div>
        );
    }

    const isNew = type === "new" || item?.isNew === true;

    return (
        <section id="offer">
            <div className="imageWrapper" onClick={handleNavigate}>
                <img
                    src={src}
                    draggable={false}
                    className="img"
                    alt={t("offer.productImageAlt", {
                        name: productName
                    })}
                />

                {isNew && (
                    <div className="imageWrapper1">
                        <img
                            src={newImage}
                            className="type"
                            alt={t("offer.newBadgeAlt")}
                        />
                        <div className="new">
                            {t("offer.new")}
                        </div>
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                    }}
                >
                    <span
                        className="productName"
                        onClick={handleNavigate}
                    >
                        {productName}
                    </span>

                    <span className="sku">
                        {t("offer.sku")}: {item?.sku || "12345678"}
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        width: "153px"
                    }}
                >
                    <div className="cart">
                        <div
                            className="like"
                            onClick={handleWishlistToggle}
                            aria-label={t("offer.wishlist")}
                        >
                            {liked ? (
                                <FaHeart className="icon liked" />
                            ) : (
                                <FaRegHeart className="icon" />
                            )}
                        </div>

                        <div
                            className={`addToCart ${
                                added ? "added" : ""
                            }`}
                            onClick={handleAddToCart}
                            aria-label={t("offer.addToCart")}
                        >
                            {added ? (
                                <TbShoppingCartCheck className="cartIcon" />
                            ) : (
                                <>
                                    <FiShoppingCart className="cartIcon" />
                                    <div className="text">
                                        {t("offer.addToCart")}
                                    </div>
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
