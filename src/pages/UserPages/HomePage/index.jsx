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
        "/logos/afacan-Photoroom.jpg",
        "/logos/agdag-Photoroom.jpg",
        "/logos/andeli-Photoroom.jpg",
        "/logos/apel-Photoroom.jpg",
        "/logos/Ariston-Photoroom.jpg",
        "/logos/askaynak-Photoroom.jpg",
        "/logos/atlas-Photoroom.jpg",
        "/logos/aulmo-Photoroom.jpg",
        "/logos/betek-Photoroom.jpg",
        "/logos/beybi-Photoroom.jpg",
        "/logos/borsan-Photoroom.jpg",
        "/logos/bosch-Photoroom.jpg",
        "/logos/cagsan-Photoroom.jpg",
        "/logos/dekor-Photoroom.jpg",
        "/logos/DeWalt-Photoroom.jpg",
        "/logos/dyo-Photoroom.jpg",
        "/logos/ECA-Photoroom.jpg",
        "/logos/elkay-Photoroom.jpg",
        "/logos/espa-Photoroom.jpg",
        "/logos/fab-Photoroom.jpg",
        "/logos/farbex-Photoroom.jpg",
        "/logos/finder-Photoroom.jpg",
        "/logos/fisco-Photoroom.jpg",
        "/logos/genc-Photoroom.jpg",
        "/logos/gewiss-Photoroom.jpg",
        "/logos/gilan_knauf-Photoroom.jpg",
        "/logos/giper-Photoroom.jpg",
        "/logos/global radiator-Photoroom.jpg",
        "/logos/GPD-Photoroom.jpg",
        "/logos/Grohe-Photoroom.jpg",
        "/logos/hillfan-Photoroom.jpg",
        "/logos/imergas-Photoroom.jpg",
        "/logos/izeltas-Photoroom.jpg",
        "/logos/kablosan-Photoroom.jpg",
        "/logos/kas-MO930xU-Photoroom.jpg",
        "/logos/klingspor-Photoroom.jpg",
        "/logos/knauf-Photoroom.jpg",
        "/logos/legrand-Photoroom.jpg",
        "/logos/magmaweld-Photoroom.jpg",
        "/logos/marshall-Photoroom.jpg",
        "/logos/matanat a-Photoroom.jpg",
        "/logos/maxima-Photoroom.jpg",
        "/logos/metak-Photoroom.jpg",
        "/logos/Milwaukee-Photoroom.jpg",
        "/logos/mirsa-Photoroom.jpg",
        "/logos/modi-Photoroom.jpg",
        "/logos/mr fix-Photoroom.jpg",
        "/logos/neotek-Photoroom.jpg",
        "/logos/nobel-Photoroom.jpg",
        "/logos/norm-Photoroom.jpg",
        "/logos/norton-Photoroom.jpg",
        "/logos/panda-Photoroom.jpg",
        "/logos/polemak-Photoroom.jpg",
        "/logos/PRYSMİAN-Photoroom.jpg",
        "/logos/sait demirci-Photoroom.jpg",
        "/logos/schneider-Photoroom.jpg",
        "/logos/sika-Photoroom.jpg",
        "/logos/sobsan-Photoroom.jpg",
        "/logos/soudal-Photoroom.jpg",
        "/logos/stargil-Photoroom.jpg",
        "/logos/texnonikol-Photoroom.jpg",
        "/logos/ugur industry-Photoroom.jpg",
        "/logos/uplast-Photoroom.jpg",
        "/logos/v max-Photoroom.jpg",
        "/logos/yildiz qaz-Photoroom.jpg",
        "/logos/zhwei-Photoroom.jpg"
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
