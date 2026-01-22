import "./index.scss";
import { MdChevronRight } from "react-icons/md";
import { useTranslation } from "react-i18next";

import Card from "../../../components/UserComponents/Card/index.jsx";
import PageTop from "../../../components/PageTop/index.jsx";
import PageBottom from "../../../components/PageBottom/index.jsx";
import { useGetProductsInNewQuery } from "../../../services/userApi.jsx";
import usePageLoader from "../../../hooks/index.jsx";
import Loader from "../../../components/Loader/index.jsx";
import { navigateToHomePage } from "../../../utils/index.js";

function NewProductsPage() {
    const { t } = useTranslation();

    const {
        data: getProductsInDiscount,
        isLoading: loadingProductsInDiscount
    } = useGetProductsInNewQuery();

    const productsInDiscount = getProductsInDiscount?.data || [];

    const isAnyLoading = loadingProductsInDiscount;
    const showLoader = usePageLoader(isAnyLoading);

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading} />}
            <PageTop />

            <section id="newProductsPage">
                <div className="container">
                    {/* -------- BREADCRUMB -------- */}
                    <div className="navigation">
                        <div
                            className="navText"
                            onClick={navigateToHomePage}
                        >
                            {t("newProducts.home")}
                        </div>
                        <MdChevronRight className="navText" />
                        <div className="selected navText">
                            {t("newProducts.title")}
                        </div>
                    </div>

                    {/* -------- PRODUCTS -------- */}
                    <div className="row">
                        {loadingProductsInDiscount ? (
                            <div>
                                {t("newProducts.loading")}
                            </div>
                        ) : productsInDiscount.length > 0 ? (
                            productsInDiscount.map((item, index) => (
                                <div
                                    className="col-60-12 col-60-md-15 col-60-sm-20 col-60-xs-30"
                                    key={index}
                                >
                                    <Card item={item} />
                                </div>
                            ))
                        ) : (
                            <div>
                                {t("newProducts.empty")}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <PageBottom />
        </>
    );
}

export default NewProductsPage;
