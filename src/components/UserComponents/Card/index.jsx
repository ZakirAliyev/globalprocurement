import "./index.scss";
import { useState } from "react";
import { TbShoppingCartCheck } from "react-icons/tb";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";
import { useBasket } from "../../../context/BasketContext";
import { PRODUCT_IMAGES } from "../../../contants";
import newImage from "/public/assets/new.png";

export default function Card({ item = {}, type }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addItem } = useBasket();

    const [added, setAdded] = useState(false);

    const liked = isInWishlist(item.id);

    const handleAddToCart = () => {
        if (added) return;
        addItem(item, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    };

    /* -------- LANGUAGE AWARE PRODUCT NAME -------- */
    const lang = i18n.language;
    const productName =
        lang === "ru"
            ? item?.nameRu
            : lang === "en"
                ? item?.nameEng
                : item?.name;

    const imageId = item.images?.[0] || item.cardImage;
    const src = imageId
        ? `${PRODUCT_IMAGES}/${imageId}`
        : "/assets/placeholder.png";

    const isNew = item?.isNew || item?.new === true;

    const goToDetail = () => {
        navigate(`/${item.categoryId}/${item.subCategoryId}/${item.id}`);
    };

    return (
        <section id="card">
            <div className="imageWrapper" onClick={goToDetail}>
                <img
                    src={src}
                    alt={t("card.productImageAlt", { name: productName })}
                    className="img"
                />

                {/* 🔹 NEW BADGE */}
                {isNew && (
                    <>
                        <img
                            src={newImage}
                            alt={t("card.newBadgeAlt")}
                            className="imgNew"
                        />
                        <span className="spanNew">
                            {t("card.new")}
                        </span>
                    </>
                )}
            </div>

            <span onClick={goToDetail}>
                {productName}
            </span>

            <div className="cart">
                <div
                    className="like"
                    onClick={() => toggleWishlist(item.id)}
                    aria-label={t("card.wishlist")}
                >
                    {liked ? (
                        <FaHeart className="icon liked" />
                    ) : (
                        <FaRegHeart className="icon" />
                    )}
                </div>

                <div
                    className={`addToCart ${added ? "added" : ""}`}
                    onClick={handleAddToCart}
                    aria-label={t("card.addToCart")}
                >
                    {added ? (
                        <TbShoppingCartCheck className="cartIcon" />
                    ) : (
                        <>
                            <FiShoppingCart className="cartIcon" />
                            <div className="text">
                                {t("card.addToCart")}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
