import "./index.scss";
import { MdChevronRight } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { Image } from "antd";
import { useRef, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

/* -------------------- HELPERS -------------------- */
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
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="accordion clean">
            <div
                className="accordion-header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3>{title}</h3>
                <IoChevronDown className={`icon ${isOpen ? "open" : ""}`} />
            </div>

            <div
                className="accordion-body"
                style={{
                    height:
                        isOpen && contentRef.current
                            ? `${contentRef.current.scrollHeight}px`
                            : 0
                }}
                ref={contentRef}
            >
                <div className="accordion-inner">{children}</div>
            </div>
        </div>
    );
};

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();

    const mainImageRef = useRef(null);
    const [thumbHeight, setThumbHeight] = useState(300);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const { addItem } = useBasket();
    const { toggleWishlist, isInWishlist } = useWishlist();

    /* -------------------- DATA -------------------- */
    const { data: getProductById, isLoading: loadingProductById } =
        useGetProductByIdQuery(id);
    const product = getProductById?.data;

    const { data: getProducts, isLoading: loadingProducts } =
        useGetProductsQuery();
    const products = getProducts?.data || [];

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

    /* -------------------- LANGUAGE AWARE FIELDS -------------------- */
    const lang = i18n.language;

    const productName =
        lang === "ru"
            ? product?.nameRu
            : lang === "en"
                ? product?.nameEng
                : product?.name;

    const categoryName =
        lang === "ru"
            ? product?.categoryNameRu || product?.categoryName
            : lang === "en"
                ? product?.categoryNameEng || product?.categoryName
                : product?.categoryName;

    const subCategoryName =
        lang === "ru"
            ? product?.subCategoryNameRu || product?.subCategoryName
            : lang === "en"
                ? product?.subCategoryNameEng || product?.subCategoryName
                : product?.subCategoryName;

    /* -------------------- RESIZE OBSERVER -------------------- */
    useEffect(() => {
        if (!mainImageRef.current) return;

        const observer = new ResizeObserver(() => {
            if (mainImageRef.current.offsetWidth > 0) {
                setThumbHeight(mainImageRef.current.offsetWidth);
            }
        });

        observer.observe(mainImageRef.current);
        return () => observer.disconnect();
    }, []);

    if (!product) return <Loader isVisible={true} />;

    const liked = isInWishlist(product.id);

    /* -------------------- HANDLERS -------------------- */
    const handleAddToCart = () => {
        if (added) return;
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    };

    const handleToggleWishlist = () => {
        toggleWishlist(product.id);
    };

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading} />}
            <PageTop />

            <section id="productDetailsPage">
                <div className="container">
                    {/* -------- BREADCRUMB -------- */}
                    <div className="navigation">
                        <div
                            className="navText"
                            onClick={navigateToHomePage}
                        >
                            {t("product.home")}
                        </div>
                        <MdChevronRight />

                        <div
                            className="navText"
                            onClick={() =>
                                navigateToCategoryPage(product.categoryId)
                            }
                        >
                            {categoryName}
                        </div>
                        <MdChevronRight />

                        <div
                            className="navText"
                            onClick={() =>
                                navigateToSubCategoryPage(
                                    product.categoryId,
                                    product.subCategoryId
                                )
                            }
                        >
                            {subCategoryName}
                        </div>
                        <MdChevronRight />

                        <div className="selected navText">
                            {productName}
                        </div>
                    </div>

                    <div className="row">
                        {/* -------- LEFT -------- */}
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="sticky-wrapper">
                                <div className="row rowCenter">
                                    <div
                                        className="col-3 scroll-thumbs"
                                        style={{ maxHeight: thumbHeight }}
                                    >
                                        <div className="thumb-list">
                                            {product?.images?.map((img, i) => (
                                                <div key={i} className="thumb">
                                                    <Image
                                                        preview={{
                                                            mask: (
                                                                <ImagePreview />
                                                            )
                                                        }}
                                                        src={`${PRODUCT_IMAGES}${img}`}
                                                        alt={productName}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-9">
                                        <div
                                            className="main-image"
                                            ref={mainImageRef}
                                        >
                                            <Image
                                                preview={{
                                                    mask: (
                                                        <ImagePreview />
                                                    )
                                                }}
                                                src={`${PRODUCT_IMAGES}${product?.cardImage}`}
                                                alt={productName}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* -------- RIGHT -------- */}
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <h1 className="product-name">
                                {productName}
                            </h1>

                            <div className="textWrapper">
                                <div className="textDesc">
                                    {t("product.brand")}:{" "}
                                    {product?.brand || "-"}
                                </div>
                                <div className="textDesc">
                                    {t("product.model")}:{" "}
                                    {product?.model || "-"}
                                </div>
                                <div className="textDesc">
                                    {t("product.category")}:{" "}
                                    {categoryName}
                                </div>
                                <div className="textDesc">
                                    {t("product.subCategory")}:{" "}
                                    {subCategoryName}
                                </div>
                            </div>

                            {product?.specifications?.length > 0 && (
                                <div className="accordionWrapper">
                                    <Accordion
                                        title={t("product.specifications")}
                                    >
                                        <ul>
                                            {product.specifications.map(
                                                (spec, i) => (
                                                    <li key={i}>
                                                        <span className="properties">
                                                            {spec.key}
                                                        </span>
                                                        <span className="properties">
                                                            {spec.value}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </Accordion>
                                </div>
                            )}

                            <div className="line" />

                            {/* -------- CART -------- */}
                            <div className="cart">
                                <button
                                    className={`like1 ${
                                        liked ? "active" : ""
                                    }`}
                                    onClick={handleToggleWishlist}
                                >
                                    {liked ? (
                                        <FaHeart className="icon filled" />
                                    ) : (
                                        <FaRegHeart className="icon" />
                                    )}
                                </button>

                                <div className="quantityControl">
                                    <button
                                        className="qtyBtn"
                                        onClick={() =>
                                            setQuantity(q =>
                                                Math.max(1, q - 1)
                                            )
                                        }
                                    >
                                        -
                                    </button>
                                    <span className="qtyDisplay">
                                        {quantity}
                                    </span>
                                    <button
                                        className="qtyBtn"
                                        onClick={() =>
                                            setQuantity(q => q + 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={`addToCart1 ${
                                        added ? "added" : ""
                                    }`}
                                    onClick={handleAddToCart}
                                >
                                    {added ? (
                                        <FiCheck />
                                    ) : (
                                        <FiShoppingCart />
                                    )}
                                    <span>
                                        {added
                                            ? t("product.added")
                                            : t("product.addToCart")}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Title
                    text={t("product.similarProducts")}
                    type="most"
                />

                <div className="container">
                    <CardWrapper products={limitedProducts} />
                </div>
            </section>

            <PageBottom />
        </>
    );
};

export default ProductDetailsPage;
