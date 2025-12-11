import './index.scss'
import Banner from "../../../components/UserComponents/Banner/index.jsx";
import CategoryCardWrapper from "../../../components/UserComponents/CategoryCardWrapper/index.jsx";
import Title from "../../../components/UserComponents/Title/index.jsx";
import CardWrapper from "../../../components/UserComponents/CardWrapper/index.jsx";
import OfferWrapper from "../../../components/UserComponents/OfferWrapper/index.jsx";
import Loader from "../../../components/Loader";
import {
    useGetCategoriesQuery,
    useGetProductsGreatOfferQuery,
    useGetProductsInDiscountQuery,
    useGetProductsInNewQuery,
    useGetProductsPopularQuery
} from "../../../services/userApi.jsx";
import PageTop from "../../../components/PageTop/index.jsx";
import PageBottom from "../../../components/PageBottom/index.jsx";
import usePageLoader from "../../../hooks/index.jsx";
import {useNavigate} from "react-router";

function HomePage() {
    const {data: getProductsGreatOffer, isLoading: loadingGreatOffer} = useGetProductsGreatOfferQuery();
    const productsGreatOffer = getProductsGreatOffer?.data;

    const {data: getProductsPopular, isLoading: loadingPopular} = useGetProductsPopularQuery();
    const productsPopular = getProductsPopular?.data;

    const {data: getProductsInDiscount, isLoading: loadingDiscount} = useGetProductsInDiscountQuery();
    const productsInDiscount = getProductsInDiscount?.data;

    const {data: getProductsInNew, isLoading: loadingNew} = useGetProductsInNewQuery();
    const productsInNew = getProductsInNew?.data;

    const {data: getCategories, isLoading: loadingCategories} = useGetCategoriesQuery()
    const categories = getCategories?.data


    const isAnyLoading = loadingGreatOffer || loadingPopular || loadingDiscount || loadingNew || loadingCategories;

    const showLoader = usePageLoader(isAnyLoading);
    const navigate = useNavigate();

    return (<>
        {showLoader && <Loader isVisible={isAnyLoading}/>}
        <PageTop/>
        <section id="homePage">
            {/*<Banner/>*/}
            <CategoryCardWrapper categories={categories}/>
            <Title text={"Endirimdə olan məhsullar"} type={"discount"}/>
            <div className="container">
                <CardWrapper products={productsInDiscount}/>
            </div>
            <Title text={"Ən çox satılan məhsullar"} type={"most"}/>
            <div className="container">
                <CardWrapper products={productsPopular}/>
            </div>
            <div className={"discountWrapper1"}>
                <Title text={"Əla təkliflər"} type={"best"} discount={true}/>
                <div className="container">
                    <OfferWrapper products={productsGreatOffer}/>
                </div>
            </div>
            <Title text={"Yeni məhsullar"} type={"new"}/>
            <div className="container">
                <CardWrapper type={"new"} products={productsInNew}/>
            </div>
        </section>
        <PageBottom/>
    </>);
}

export default HomePage;
