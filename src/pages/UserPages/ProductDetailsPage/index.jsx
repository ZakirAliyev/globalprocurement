import './index.scss';
import { MdChevronRight } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { Image } from "antd";
import { useRef, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import Title from "../../../components/UserComponents/Title";
import CardWrapper from "../../../components/UserComponents/CardWrapper";
import PageTop from "../../../components/PageTop";
import PageBottom from "../../../components/PageBottom";
import Loader from "../../../components/Loader";
import ImagePreview from "../../../components/ImagePreview";
import { useGetProductByIdQuery, useGetProductsQuery } from "../../../services/userApi";
import { PRODUCT_IMAGES } from "../../../contants";
import usePageLoader from "../../../hooks";
import {
    navigateToCategoryPage,
    navigateToHomePage,
    navigateToSubCategoryPage
} from "../../../utils";

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function Accordion({ title, children }) {
    const contentRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }, [isOpen]);

    return (
        <div className="accordion">
            <div className="summary" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <IoChevronDown
                    className="chevron"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
            </div>
            <div
                className="content"
                style={{ height: `${height}px` }}
                ref={contentRef}
            >
                {children}
            </div>
        </div>
    );
}

function ProductDetailsPage() {
    const mainImageRef = useRef(null);
    const [thumbHeight, setThumbHeight] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();

    const { data: getProductById, isLoading: loadingProductById } = useGetProductByIdQuery(id);
    const productById = getProductById?.data;

    const { data: getProducts, isLoading: loadingProducts } = useGetProductsQuery();
    const products = getProducts?.data ?? [];

    const filteredProducts = useMemo(
        () => products.filter(p => String(p.id) !== String(id)),
        [products, id]
    );

    const shuffledProducts = useMemo(() => shuffleArray(filteredProducts), [filteredProducts]);
    const limitedProducts = useMemo(() => shuffledProducts.slice(0, 10), [shuffledProducts]);

    const isAnyLoading = loadingProductById || loadingProducts;
    const showLoader = usePageLoader(isAnyLoading);

    useEffect(() => {
        const updateHeight = () => {
            if (mainImageRef.current) {
                setThumbHeight(mainImageRef.current.offsetWidth);
            }
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading} />}
            <PageTop />
            <section id="productDetailsPage">
                <div className="container">
                    <div className="navigation">
                        <div className="navText" onClick={navigateToHomePage}>Ana səhifə</div>
                        <MdChevronRight className="navText" />
                        <div className="navText" onClick={() => navigateToCategoryPage(productById?.categoryId)}>
                            {productById?.categoryName}
                        </div>
                        <MdChevronRight className="navText" />
                        <div className="navText"
                             onClick={() => navigateToSubCategoryPage(productById?.categoryId, productById?.subCategoryId)}>
                            {productById?.subCategoryName}
                        </div>
                        <MdChevronRight className="navText" />
                        <div className="selected navText">{productById?.name}</div>
                    </div>

                    <div className="row">
                        {/* --- Left Side --- */}
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="sticky-wrapper">
                                <div className="row rowCenter">
                                    <div className="col-3 box2 scroll-thumbs box3" style={{ maxHeight: thumbHeight }}>
                                        <div className="thumb-list">
                                            {productById?.images?.map((item, i) => (
                                                <div key={i} className="box box1">
                                                    <Image
                                                        preview={{ mask: <ImagePreview /> }}
                                                        src={PRODUCT_IMAGES + item}
                                                        alt="Product"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-9 box2">
                                        <div className="box" ref={mainImageRef}>
                                            <Image
                                                preview={{ mask: <ImagePreview /> }}
                                                src={PRODUCT_IMAGES + productById?.cardImage}
                                                alt="Main Product"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Right Side --- */}
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="text">{productById?.name}</div>
                            <div className="priceWrapper">
                                {productById?.discount && (
                                    <div className="discountPrice">{productById?.discount?.toFixed(2)} ₼</div>
                                )}
                                <div className="price">{productById?.price?.toFixed(2)} ₼</div>
                                {productById?.discount && (
                                    <div className="discount">
                                        - {(productById?.discount - productById?.price)} ₼
                                    </div>
                                )}
                            </div>

                            <div className="textWrapper">
                                <div className="textDesc">Brend : {productById?.brand}</div>
                                <div className="textDesc">Model : {productById?.model}</div>
                                <div className="textDesc">Kateqoriya : {productById?.categoryName}</div>
                                <div className="textDesc">Alt kateqoriya : {productById?.subCategoryName}</div>
                            </div>

                            <div className="accordionWrapper">
                                <Accordion title="Məhsulun özəllikləri">
                                    <ul>
                                        {productById?.specifications?.map((spec, i) => (
                                            <li key={i}>
                                                <span>{spec?.key}:</span>
                                                <span className="properties">{spec?.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Accordion>
                            </div>

                            <div className="line" />
                            <div className="cart">
                                <div className="like">
                                    <FaRegHeart className="icon" />
                                </div>
                                <div className="quantityControl">
                                    <button className="qtyBtn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                    <span className="qtyDisplay">{quantity}</span>
                                    <button className="qtyBtn" onClick={() => setQuantity(q => q + 1)}>+</button>
                                </div>
                                <div className="addToCart">
                                    <FiShoppingCart />
                                    <div>Səbətə at</div>
                                </div>
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
}

export default ProductDetailsPage;
