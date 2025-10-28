import './index.scss';
import {MdChevronRight} from 'react-icons/md';
import Card from '../../../components/UserComponents/Card/index.jsx';
import endirim1 from '/public/assets/endirim1.png';
import PageTop from '../../../components/PageTop/index.jsx';
import PageBottom from '../../../components/PageBottom/index.jsx';
import {useGetProductsGreatOfferQuery, useGetProductsPopularQuery} from '../../../services/userApi.jsx';
import usePageLoader from "../../../hooks/index.jsx";
import Loader from "../../../components/Loader/index.jsx";
import {navigateToHomePage} from "../../../utils/index.js";

function GreatOffersPage() {
    const {data: getProductsInDiscount, isLoading: loadingProductsInDiscount} = useGetProductsPopularQuery();
    const productsInDiscount = getProductsInDiscount?.data;

    const isAnyLoading = loadingProductsInDiscount
    const showLoader = usePageLoader(isAnyLoading);

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading}/>}
            <PageTop/>
            <section id="greatOffersPage">
                <div className="container">
                    <div className="navigation">
                        <div className="navText" onClick={() => navigateToHomePage()}>Ana səhifə</div>
                        <MdChevronRight className="navText"/>
                        <div className="selected navText">Ən çox satılan məhsullar</div>
                    </div>
                    <div className="row">
                        {loadingProductsInDiscount ? (
                            <div>Loading discounted items...</div>
                        ) : productsInDiscount.length > 0 ? (
                            productsInDiscount.map((item, index) => (
                                <div className="col-60-12 col-60-md-15 col-60-sm-20 col-60-xs-30" key={index}>
                                    <Card item={item}/>
                                </div>
                            ))
                        ) : (
                            <div>No discounted items available.</div>
                        )}
                    </div>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default GreatOffersPage;