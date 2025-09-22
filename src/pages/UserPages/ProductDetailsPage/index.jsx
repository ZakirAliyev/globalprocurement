import './index.scss';
import {MdChevronRight} from "react-icons/md";
import image from "/public/assets/category1.png";
import {useRef, useEffect, useState, useMemo} from "react";
import {IoChevronDown, IoEyeOutline} from "react-icons/io5";
import {FaRegHeart} from "react-icons/fa6";
import {FiShoppingCart} from "react-icons/fi";
import Title from "../../../components/UserComponents/Title/index.jsx";
import CardWrapper from "../../../components/UserComponents/CardWrapper/index.jsx";
import {useGetProductByIdQuery, useGetProductsQuery} from "../../../services/userApi.jsx";
import {useParams} from "react-router";
import {PRODUCT_IMAGES} from "../../../contants/index.js";
import PageTop from "../../../components/PageTop/index.jsx";
import PageBottom from "../../../components/PageBottom/index.jsx";
import usePageLoader from "../../../hooks/index.jsx";
import Loader from "../../../components/Loader/index.jsx";
import {navigateToCategoryPage, navigateToHomePage, navigateToSubCategoryPage} from "../../../utils/index.js";
import {Image} from "antd";
import ImagePreview from "../../../components/ImagePreview/index.jsx";

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function Accordion({title, children}) {
    const contentRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <div className="accordion">
            <div className="summary" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <IoChevronDown
                    className="chevron"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </div>
            <div
                className="content"
                style={{
                    height: `${height}px`,
                }}
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
    const {id} = useParams();

    const {data: getProductById, isLoading: loadingProductById} = useGetProductByIdQuery(id);
    const productById = getProductById?.data;

    const {data: getProducts, isLoading: loadingProducts} = useGetProductsQuery();
    const products = getProducts?.data;

    const filteredProducts = useMemo(() => {
        if (!products || !id) return [];
        return products.filter(p => String(p.id) !== String(id));
    }, [products, id]);

    const shuffledProducts = useMemo(() => {
        return shuffleArray(filteredProducts);
    }, [filteredProducts]);

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

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading}/>}
            <PageTop/>
            <section id="productDetailsPage">
                <div className="container">
                    <div className="navigation">
                        <div className="navText" onClick={() => navigateToHomePage()}>Ana səhifə</div>
                        <MdChevronRight className="navText"/>
                        <div className="navText"
                             onClick={() => navigateToCategoryPage(productById?.categoryId)}>{productById?.categoryName}</div>
                        <MdChevronRight className="navText"/>
                        <div className="navText"
                             onClick={() => navigateToSubCategoryPage(productById?.categoryId, productById?.subCategoryId)}>{productById?.subCategoryName}</div>
                        <MdChevronRight className="navText"/>
                        <div className="selected navText">{productById?.name}</div>
                    </div>
                    <div className="row">
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className={"sticky-wrapper"}>
                                <div className="row rowCenter">
                                    <div
                                        className="col-3 box2 scroll-thumbs box3"
                                        style={{maxHeight: thumbHeight}}
                                    >
                                        <div className="thumb-list">
                                            {productById?.images && productById?.images?.map((item) => (
                                                <div key={item?.id} className="box box1">
                                                    <Image preview={{
                                                        mask: <ImagePreview/>
                                                    }} src={PRODUCT_IMAGES + item} alt="Product"/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-9 box2">
                                        <div className="box" ref={mainImageRef}>
                                            <Image preview={{
                                                mask: <ImagePreview/>
                                            }} src={PRODUCT_IMAGES + productById?.cardImage} alt="Main Product"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="text">{productById?.name}</div>
                            <div className="priceWrapper">
                                {productById?.discount !== null && (
                                    <div className="discountPrice">{productById?.discount?.toFixed(2)} ₼</div>
                                )}
                                <div className="price">{productById?.price?.toFixed(2)} ₼</div>
                                {productById?.discount !== null && (
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
                                        {productById?.specifications && productById?.specifications.map(spec => (
                                            <li key={spec.id}>
                                                <span>{spec?.key}:</span>
                                                <span className={"properties"}>{spec?.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Accordion>
                            </div>
                            <div className={"line"}></div>
                            <div className={"cart"}>
                                <div className={"like"}>
                                    <FaRegHeart className={"icon"}/>
                                </div>
                                <div className="quantityControl">
                                    <button
                                        className="qtyBtn"
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="qtyDisplay">{quantity}</span>
                                    <button
                                        className="qtyBtn"
                                        onClick={() => setQuantity(prev => prev + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className={"addToCart"}>
                                    <FiShoppingCart/>
                                    <div>Səbətə at</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Title text={"Oxşar məhsullar"} type={"most"}/>
                <div className="container">
                    <CardWrapper products={shuffledProducts}/>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default ProductDetailsPage;
