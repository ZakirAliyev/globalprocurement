import "./index.scss";
import { useTranslation } from "react-i18next";

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
import { useNavigate } from "react-router";

function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: getProductsGreatOffer, isLoading: loadingGreatOffer } =
        useGetProductsGreatOfferQuery();
    const productsGreatOffer = getProductsGreatOffer?.data;

    const { data: getProductsPopular, isLoading: loadingPopular } =
        useGetProductsPopularQuery();
    const productsPopular = getProductsPopular?.data;

    const { data: getProductsInDiscount, isLoading: loadingDiscount } =
        useGetProductsInDiscountQuery();
    const productsInDiscount = getProductsInDiscount?.data;

    const { data: getProductsInNew, isLoading: loadingNew } =
        useGetProductsInNewQuery();
    const productsInNew = getProductsInNew?.data;

    const { data: getCategories, isLoading: loadingCategories } =
        useGetCategoriesQuery();
    const categories = getCategories?.data;

    const isAnyLoading =
        loadingGreatOffer ||
        loadingPopular ||
        loadingDiscount ||
        loadingNew ||
        loadingCategories;

    const showLoader = usePageLoader(isAnyLoading);

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading} />}

            <PageTop />

            <section id="homePage">
                <Banner />

                <CategoryCardWrapper categories={categories} />

                <Title
                    text={t("homePage.discountProducts")}
                    type="discount"
                />
                <div className="container">
                    <CardWrapper products={productsInDiscount} />
                </div>

                <Title
                    text={t("homePage.popularProducts")}
                    type="most"
                />
                <div className="container">
                    <CardWrapper products={productsPopular} />
                </div>

                <div className="discountWrapper1">
                    <Title
                        text={t("homePage.greatOffers")}
                        type="best"
                        discount={true}
                    />
                    <div className="container">
                        <OfferWrapper products={productsGreatOffer} />
                    </div>
                </div>

                <Title
                    text={t("homePage.newProducts")}
                    type="new"
                />
                <div className="container">
                    <CardWrapper type="new" products={productsInNew} />
                </div>
            </section>

            <PageBottom />
        </>
    );
}

export default HomePage;
