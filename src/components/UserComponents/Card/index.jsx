import './index.scss';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import {PRODUCT_IMAGES} from "../../../contants/index.js";
import {useBasket} from "../../../context/BasketContext/index.jsx";

export default function Card({ item = {}, type }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { auth } = useAuth();
    const { addItem, isInCart } = useBasket();

    const liked = isInWishlist(item.id);

    const handleNavigate = () => {
        navigate(`/${item.categoryId}/${item.subCategoryId}/${item.id}`);
    };

    const handleWishlistToggle = () => {
        // Optimistic UI toggle; backend sync handled in context
        toggleWishlist(item.id);
    };

    // Construct image URL
    const imageId = item.images?.[0] || item.cardImage;
    const src = imageId
        ? `${PRODUCT_IMAGES}/${imageId}`
        : '/assets/placeholder.png';

    if (!item || typeof item.price === 'undefined') {
        return <div>Error: Product data is missing</div>;
    }

    return (
        <section id="card">
            <div className="imageWrapper" onClick={handleNavigate}>
                <img
                    src={src}
                    alt={item.name || t('No Name')}
                    draggable={false}
                    className="img"
                />
                {(type === 'new' || item.isNew) && (
                    <div className="imageWrapper1">
                        <img src="/assets/new.png" className="type" alt={t('New')} />
                        <div className="new">{t('Yeni')}</div>
                    </div>
                )}
            </div>

            <span onClick={handleNavigate}>{item.name || t('No Name')}</span>

            <div className="discountWrapper">
                {item.discount - item.price > 0 ? (
                    <>
                        <div className="priceWrapper">
                            <div className="discountPrice">{item.discount} ₼</div>
                            <div className="price">{item.price} ₼</div>
                        </div>
                        <div className="discount">-{item.discount - item.price}₼</div>
                    </>
                ) : (
                    <div className="priceWrapper">
                        <div className="price">{item.price} ₼</div>
                    </div>
                )}
            </div>

            <div className="cart">
                <div className="like" onClick={handleWishlistToggle}>
                    {liked ? (
                        <FaHeart className="icon liked" />
                    ) : (
                        <FaRegHeart className="icon" />
                    )}
                </div>
                <div className="addToCart" onClick={() => addItem(item, 1)}>
                    <FiShoppingCart />
                    <div>{t('Səbətə at')}</div>
                </div>
            </div>
        </section>
    );
}
