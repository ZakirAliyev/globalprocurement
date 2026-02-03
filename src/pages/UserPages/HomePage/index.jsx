import "./index.scss";
import {useTranslation} from "react-i18next";

import Banner from "../../../components/UserComponents/Banner";
import CategoryCardWrapper from "../../../components/UserComponents/CategoryCardWrapper";
import Title from "../../../components/UserComponents/Title";
import CardWrapper from "../../../components/UserComponents/CardWrapper";
import OfferWrapper from "../../../components/UserComponents/OfferWrapper";
import Loader from "../../../components/Loader";
import {
    useGetCategoriesQuery,
    useGetProductsGreatOfferQuery,
    useGetProductsInDiscountQuery,
    useGetProductsInNewQuery,
    useGetProductsPopularQuery
} from "../../../services/userApi";
import PageTop from "../../../components/PageTop";
import PageBottom from "../../../components/PageBottom";
import usePageLoader from "../../../hooks";
import {useNavigate} from "react-router";
import InfiniteCarousel from "../../../components/UserComponents/InfiniteCarousel/index.jsx";

function HomePage() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const images = [
        "/src/assets/logos/afacan-Photoroom.jpg",
        "/src/assets/logos/agdag-Photoroom.jpg",
        "/src/assets/logos/andeli-Photoroom.jpg",
        "/src/assets/logos/apel-Photoroom.jpg",
        "/src/assets/logos/Ariston-Photoroom.jpg",
        "/src/assets/logos/askaynak-Photoroom.jpg",
        "/src/assets/logos/atlas-Photoroom.jpg",
        "/src/assets/logos/aulmo-Photoroom.jpg",
        "/src/assets/logos/betek-Photoroom.jpg",
        "/src/assets/logos/beybi-Photoroom.jpg",
        "/src/assets/logos/borsan-Photoroom.jpg",
        "/src/assets/logos/bosch-Photoroom.jpg",
        "/src/assets/logos/cagsan-Photoroom.jpg",
        "/src/assets/logos/dekor-Photoroom.jpg",
        "/src/assets/logos/DeWalt-Photoroom.jpg",
        "/src/assets/logos/dyo-Photoroom.jpg",
        "/src/assets/logos/ECA-Photoroom.jpg",
        "/src/assets/logos/elkay-Photoroom.jpg",
        "/src/assets/logos/espa-Photoroom.jpg",
        "/src/assets/logos/fab-Photoroom.jpg",
        "/src/assets/logos/farbex-Photoroom.jpg",
        "/src/assets/logos/finder-Photoroom.jpg",
        "/src/assets/logos/fisco-Photoroom.jpg",
        "/src/assets/logos/genc-Photoroom.jpg",
        "/src/assets/logos/gewiss-Photoroom.jpg",
        "/src/assets/logos/gilan_knauf-Photoroom.jpg",
        "/src/assets/logos/giper-Photoroom.jpg",
        "/src/assets/logos/global radiator-Photoroom.jpg",
        "/src/assets/logos/GPD-Photoroom.jpg",
        "/src/assets/logos/Grohe-Photoroom.jpg",
        "/src/assets/logos/hillfan-Photoroom.jpg",
        "/src/assets/logos/imergas-Photoroom.jpg",
        "/src/assets/logos/izeltas-Photoroom.jpg",
        "/src/assets/logos/kablosan-Photoroom.jpg",
        "/src/assets/logos/kas-MO930xU-Photoroom.jpg",
        "/src/assets/logos/klingspor-Photoroom.jpg",
        "/src/assets/logos/knauf-Photoroom.jpg",
        "/src/assets/logos/legrand-Photoroom.jpg",
        "/src/assets/logos/magmaweld-Photoroom.jpg",
        "/src/assets/logos/marshall-Photoroom.jpg",
        "/src/assets/logos/matanat a-Photoroom.jpg",
        "/src/assets/logos/maxima-Photoroom.jpg",
        "/src/assets/logos/metak-Photoroom.jpg",
        "/src/assets/logos/Milwaukee-Photoroom.jpg",
        "/src/assets/logos/mirsa-Photoroom.jpg",
        "/src/assets/logos/modi-Photoroom.jpg",
        "/src/assets/logos/mr fix-Photoroom.jpg",
        "/src/assets/logos/neotek-Photoroom.jpg",
        "/src/assets/logos/nobel-Photoroom.jpg",
        "/src/assets/logos/norm-Photoroom.jpg",
        "/src/assets/logos/norton-Photoroom.jpg",
        "/src/assets/logos/panda-Photoroom.jpg",
        "/src/assets/logos/polemak-Photoroom.jpg",
        "/src/assets/logos/PRYSMİAN-Photoroom.jpg",
        "/src/assets/logos/sait demirci-Photoroom.jpg",
        "/src/assets/logos/schneider-Photoroom.jpg",
        "/src/assets/logos/sika-Photoroom.jpg",
        "/src/assets/logos/sobsan-Photoroom.jpg",
        "/src/assets/logos/soudal-Photoroom.jpg",
        "/src/assets/logos/stargil-Photoroom.jpg",
        "/src/assets/logos/texnonikol-Photoroom.jpg",
        "/src/assets/logos/ugur industry-Photoroom.jpg",
        "/src/assets/logos/uplast-Photoroom.jpg",
        "/src/assets/logos/v max-Photoroom.jpg",
        "/src/assets/logos/yildiz qaz-Photoroom.jpg",
        "/src/assets/logos/zhwei-Photoroom.jpg"
    ];

    const {data: getProductsGreatOffer, isLoading: loadingGreatOffer} =
        useGetProductsGreatOfferQuery();
    const productsGreatOffer = getProductsGreatOffer?.data;

    const {data: getProductsPopular, isLoading: loadingPopular} =
        useGetProductsPopularQuery();
    const productsPopular = getProductsPopular?.data;

    const {data: getProductsInDiscount, isLoading: loadingDiscount} =
        useGetProductsInDiscountQuery();
    const productsInDiscount = getProductsInDiscount?.data;

    const {data: getProductsInNew, isLoading: loadingNew} =
        useGetProductsInNewQuery();
    const productsInNew = getProductsInNew?.data;

    const {data: getCategories, isLoading: loadingCategories} =
        useGetCategoriesQuery();
    const categories = getCategories?.data;

    const isAnyLoading =
        loadingGreatOffer ||
        loadingPopular ||
        loadingDiscount ||
        loadingNew;

    const showLoader = usePageLoader(isAnyLoading);

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading}/>}

            <PageTop/>

            <section id="homePage">
                <Banner/>

                <CategoryCardWrapper categories={categories}/>

                <div className={"container"}>
                    <InfiniteCarousel images={images}/>
                </div>

                <Title
                    text={t("homePage.discountProducts")}
                    type="discount"
                />
                <div className="container">
                    <CardWrapper products={productsInDiscount}/>
                </div>

                <Title
                    text={t("homePage.popularProducts")}
                    type="most"
                />
                <div className="container">
                    <CardWrapper products={productsPopular}/>
                </div>

                <div className="discountWrapper1">
                    <Title
                        text={t("homePage.greatOffers")}
                        type="best"
                        discount={true}
                    />
                    <div className="container">
                        <OfferWrapper products={productsGreatOffer}/>
                    </div>
                </div>

                <Title
                    text={t("homePage.newProducts")}
                    type="new"
                />
                <div className="container">
                    <CardWrapper type="new" products={productsInNew}/>
                </div>
            </section>

            <PageBottom/>
        </>
    );
}

export default HomePage;
