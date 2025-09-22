import './index.scss';
import {useState} from 'react';
import {MdChevronRight} from 'react-icons/md';
import Card from '../../../components/UserComponents/Card/index.jsx';
import heart from '/public/assets/heart.png';
import endirim1 from '/public/assets/endirim1.png';
import PageTop from '../../../components/PageTop/index.jsx';
import PageBottom from '../../../components/PageBottom/index.jsx';
import Loader from '../../../components/Loader/index.jsx';
import {useGetWishlistQuery} from '../../../services/userApi.jsx';
import {navigateToHomePage} from '../../../utils/index.js';
import usePageLoader from '../../../hooks/index.jsx';
import image1 from "/public/assets/wishlistEmpty.png"
import {useWishlist} from "../../../context/WishlistContext/index.jsx";
import {useAuth} from "../../../context/AuthContext/index.jsx";

function WishlistPage() {
    const { auth } = useAuth();
    const { wishlist: localWishlist } = useWishlist(); // Get local wishlist from context
    const [selectedButton, setSelectedButton] = useState('all');

    const { data: getWishlist, isLoading } = useGetWishlistQuery(undefined, {
        skip: !auth?.token, // Skip query if no token
    });
    const wishlist = auth?.token ? getWishlist?.data || [] : localWishlist.map(id => ({
        wishlistId: id,
        productDto: { id, discount: null }, // Mock structure for guest users
    }));

    const showLoader = usePageLoader(isLoading);

    const filteredItems = selectedButton === 'all'
        ? wishlist
        : wishlist.filter(item => item.productDto.discount !== null && item.productDto.discount > 0);

    const handleButtonClick = (type) => {
        setSelectedButton(type);
    };

    console.log(filteredItems)

    return (
        <>
            {showLoader && <Loader isVisible={isLoading}/>}
            <PageTop/>
            <section id="wishlistPage">
                <div className="container">
                    <div className="navigation">
                        <div className="navText" onClick={() => navigateToHomePage()}>
                            Ana səhifə
                        </div>
                        <MdChevronRight className="navText"/>
                        <div className="selected navText">İstək siyahısı</div>
                    </div>
                    <div className="buttonWrapper">
                        <div
                            className={`button ${selectedButton === 'all' ? 'selected all' : ''}`}
                            onClick={() => handleButtonClick('all')}
                        >
                            <img src={heart} alt="All" className="endirim"/>
                            <span>Bütün istəkdə olan məhsullar</span>
                        </div>
                        <div
                            className={`button ${selectedButton === 'discounted' ? 'selected discounted' : ''}`}
                            onClick={() => handleButtonClick('discounted')}
                        >
                            <img src={endirim1} alt="Discounted" className="endirim"/>
                            <span>Qiyməti düşənlər</span>
                        </div>
                    </div>
                    <div className="row">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div
                                    className="col-60-12 col-60-md-15 col-60-sm-20 col-60-xs-30"
                                    key={item.wishlistId}
                                >
                                    <Card item={item.productDto}/>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                gap: '12px',
                                margin: '50px auto',
                                padding: '0 8px'
                            }}>
                                <img src={image1} alt="Empty Wishlist"/>
                                <div style={{
                                    fontWeight: '500',
                                    marginTop: '12px',
                                }}>İstək siyahısı boşdur</div>
                                <div style={{
                                    maxWidth: '420px',
                                    textAlign: 'center',
                                    width: '100%',
                                    lineHeight: '25px',
                                    fontSize: '14px',
                                }}>Favoritlərinizi tapmaq üçün məhsullara baxın və ürək ikonuna klikləyin.</div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default WishlistPage;