import "./index.scss";
import { useTranslation } from "react-i18next";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";
import image1 from "/public/assets/new.png";
import { PRODUCT_IMAGES } from "../../../contants/index.js";

function Offer({ item, type }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const liked = isInWishlist(item?.id);

    // Select name based on current language
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

    const handleNavigate = () => {
        if (item?.categoryId && item?.subCategoryId && item?.id) {
            navigate(`/${item.categoryId}/${item.subCategoryId}/${item.id}`);
        }
    };

    const handleWishlistToggle = (e) => {
        e.stopPropagation(); // Prevent navigation when clicking heart
        toggleWishlist(item?.id); // Toggle wishlist item
    };

    // Construct image URL
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <span className="productName" onClick={handleNavigate}>
                        {getName()}
                    </span>
                    <span className="sku">SKU: {item?.sku || "12345678"}</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        width: "153px",
                    }}
                >
                    {/*<div className="discountWrapper">*/}
                    {/*    {item.price - item.discount > 0 ? (*/}
                    {/*        <>*/}
                    {/*            <div className="discount">-{item.price - item.discount}₼</div>*/}
                    {/*            <div className="priceWrapper">*/}
                    {/*                <div className="discountPrice">{item.price} ₼</div>*/}
                    {/*                <div className="price">{item.discount} ₼</div>*/}
                    {/*            </div>*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <div className="priceWrapper">*/}
                    {/*            <div className="price">{item.discount} ₼</div>*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                    <div className="cart">
                        <div className="like" onClick={handleWishlistToggle}>
                            {liked ? (
                                <FaHeart className="icon liked" />
                            ) : (
                                <FaRegHeart className="icon" />
                            )}
                        </div>
                        <div className="addToCart">
                            <FiShoppingCart />
                            <div>{t("Səbətə at")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Offer;