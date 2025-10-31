import './index.scss';
import { MdChevronRight } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { Image } from "antd";
import { useRef, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Title from "../../../components/UserComponents/Title";
import CardWrapper from "../../../components/UserComponents/CardWrapper";
import PageTop from "../../../components/PageTop";
import PageBottom from "../../../components/PageBottom";
import Loader from "../../../components/Loader";
import ImagePreview from "../../../components/ImagePreview";
import {
    useGetProductByIdQuery,
    useGetProductsQuery
} from "../../../services/userApi";
import { PRODUCT_IMAGES } from "../../../contants";
import usePageLoader from "../../../hooks";
import {
    navigateToCategoryPage,
    navigateToHomePage,
    navigateToSubCategoryPage
} from "../../../utils";
import { useBasket } from "../../../context/BasketContext";
import { useWishlist } from "../../../context/WishlistContext";

// 🔹 Helper: Randomize products
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const Accordion = ({ title, children }) => {
    const contentRef = useRef(null);
    const [isOpen, setIsOpen] = useState(true); // Açıq default
    return (
        <div className="accordion clean">
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <h3>{title}</h3>
                <IoChevronDown className={`icon ${isOpen ? "open" : ""}`} />
            </div>
            <div
                className="accordion-body"
                style={{
                    height: isOpen && contentRef.current
                        ? `${contentRef.current.scrollHeight}px`
                        : 0,
                }}
                ref={contentRef}
            >
                <div className="accordion-inner">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ProductDetailsPage = () => {
    const { id } = useParams();
    const mainImageRef = useRef(null);
    const [thumbHeight, setThumbHeight] = useState(300); // default height
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const { addItem } = useBasket();
    const { toggleWishlist, isInWishlist } = useWishlist();

    // 🔹 Queries
    const { data: getProductById, isLoading: loadingProductById } = useGetProductByIdQuery(id);
    const productById = getProductById?.data;

    const { data: getProducts, isLoading: loadingProducts } = useGetProductsQuery();
    const products = getProducts?.data || [];

    // 🔹 Filter similar products
    const filteredProducts = useMemo(
        () => products.filter(p => String(p.id) !== String(id)),
        [products, id]
    );

    const limitedProducts = useMemo(
        () => shuffleArray(filteredProducts).slice(0, 10),
        [filteredProducts]
    );

    const isAnyLoading = loadingProductById || loadingProducts;
    const showLoader = usePageLoader(isAnyLoading);

    // ✅ ResizeObserver ilə thumbnail ölçüsü təyin edilir
    useEffect(() => {
        if (!mainImageRef.current) return;

        const element = mainImageRef.current;

        const observer = new ResizeObserver(() => {
            if (element.offsetWidth > 0) {
                setThumbHeight(element.offsetWidth);
            }
        });

        observer.observe(element);

        // Cleanup
        return () => observer.disconnect();
    }, []);

    if (!productById) return <Loader isVisible={true} />;

    const liked = isInWishlist(productById.id);

    // 🔹 Handlers
    const handleAddToCart = () => {
        if (added) return;
        addItem(productById, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    };

    const handleToggleWishlist = () => {
        toggleWishlist(productById.id);
    };

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading} />}
            <PageTop />
            <section id="productDetailsPage">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="navigation">
                        <div className="navText" onClick={navigateToHomePage}>Ana səhifə</div>
                        <MdChevronRight />
                        <div className="navText" onClick={() => navigateToCategoryPage(productById.categoryId)}>
                            {productById.categoryName}
                        </div>
                        <MdChevronRight />
                        <div
                            className="navText"
                            onClick={() => navigateToSubCategoryPage(productById.categoryId, productById.subCategoryId)}
                        >
                            {productById.subCategoryName}
                        </div>
                        <MdChevronRight />
                        <div className="selected navText">{productById.name}</div>
                    </div>

                    <div className="row">
                        {/* --- Left Side --- */}
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="sticky-wrapper">
                                <div className="row rowCenter">
                                    <div
                                        className="col-3 scroll-thumbs"
                                        style={{ maxHeight: thumbHeight }}
                                    >
                                        <div className="thumb-list">
                                            {productById?.images?.map((item, i) => (
                                                <div key={i} className="thumb">
                                                    <Image
                                                        preview={{ mask: <ImagePreview /> }}
                                                        src={`${PRODUCT_IMAGES}${item}`}
                                                        alt="Product"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-9" style={{
                                        marginTop: '-8px'
                                    }}>
                                        <div className="main-image" ref={mainImageRef}>
                                            <Image
                                                preview={{ mask: <ImagePreview /> }}
                                                src={`${PRODUCT_IMAGES}${productById?.cardImage}`}
                                                alt={productById?.name}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Right Side --- */}
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <h1 className="product-name">{productById?.name}</h1>

                            <div className="textWrapper">
                                <div className="textDesc">Brend: {productById?.brand || "-"}</div>
                                <div className="textDesc">Model: {productById?.model || "-"}</div>
                                <div className="textDesc">Kateqoriya: {productById?.categoryName}</div>
                                <div className="textDesc">Alt kateqoriya: {productById?.subCategoryName}</div>
                            </div>

                            {productById?.specifications?.length > 0 && (
                                <div className="accordionWrapper">
                                    <Accordion title="Məhsulun özəllikləri">
                                        <ul>
                                            {productById.specifications.map((spec, i) => (
                                                <li key={i}>
                                                    <span className="properties">{spec?.key}</span>
                                                    <span className="properties">{spec?.value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion>
                                </div>
                            )}

                            <div className="line" />

                            {/* Cart Section */}
                            <div className="cart">
                                <button
                                    className={`like1 ${liked ? "active" : ""}`}
                                    onClick={handleToggleWishlist}
                                >
                                    {liked ? <FaHeart className="icon filled" /> : <FaRegHeart className="icon" />}
                                </button>

                                <div className="quantityControl">
                                    <button
                                        className="qtyBtn"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="qtyDisplay">{quantity}</span>
                                    <button
                                        className="qtyBtn"
                                        onClick={() => setQuantity(q => q + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={`addToCart1 ${added ? "added" : ""}`}
                                    onClick={handleAddToCart}
                                >
                                    {added ? <FiCheck /> : <FiShoppingCart />}
                                    <span>{added ? "Əlavə edildi" : "Səbətə at"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Title text="Oxşar məhsullar" type="most" />
                <div className="container">
                    <CardWrapper products={limitedProducts} />
                </div>
            </section>
            <PageBottom />
        </>
    );
};

export default ProductDetailsPage;
