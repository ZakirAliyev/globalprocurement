import './index.scss';
import { useState } from 'react';
import { TbShoppingCartCheck } from 'react-icons/tb';
import { FiShoppingCart } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useBasket } from '../../../context/BasketContext';
import { PRODUCT_IMAGES } from '../../../contants';
import newImage from "/public/assets/new.png";

export default function Card({ item = {}, type }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addItem } = useBasket();
    const [added, setAdded] = useState(false);

    const liked = isInWishlist(item.id);

    const handleAddToCart = () => {
        if (added) return;
        addItem(item, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000); // 1 saniyədən sonra bərpa et
    };

    const imageId = item.images?.[0] || item.cardImage;
    const src = imageId ? `${PRODUCT_IMAGES}/${imageId}` : '/assets/placeholder.png';

    const isNew = item?.isNew || item?.new === true; // 🔹 məhsul yeni olub-olmadığını yoxla

    return (
        <section id="card">
            <div
                className="imageWrapper"
                onClick={() =>
                    navigate(`/${item.categoryId}/${item.subCategoryId}/${item.id}`)
                }
            >
                <img src={src} alt={item.name || t('No Name')} className="img" />

                {/* 🔹 "Yeni" badge yalnız məhsul yenidirsə göstər */}
                {isNew && (
                    <>
                        <img src={newImage} alt="Yeni məhsul" className="imgNew" />
                        <span className="spanNew">Yeni</span>
                    </>
                )}
            </div>

            <span
                onClick={() =>
                    navigate(`/${item.categoryId}/${item.subCategoryId}/${item.id}`)
                }
            >
                {item.name}
            </span>

            <div className="cart">
                <div className="like" onClick={() => toggleWishlist(item.id)}>
                    {liked ? <FaHeart className="icon liked" /> : <FaRegHeart className="icon" />}
                </div>

                <div
                    className={`addToCart ${added ? 'added' : ''}`}
                    onClick={handleAddToCart}
                >
                    {added ? (
                        <TbShoppingCartCheck className="cartIcon" />
                    ) : (
                        <>
                            <FiShoppingCart className="cartIcon" />
                            <div className="text">{t('Səbətə at')}</div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
