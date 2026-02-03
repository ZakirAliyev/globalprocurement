import "./index.scss";
import { useState, useEffect } from "react";
import { MdChevronRight } from "react-icons/md";
import { useTranslation } from "react-i18next";

import Card from "../../../components/UserComponents/Card";
import heart from "/src/assets/heart.png";
import endirim1 from "/src/assets/endirim1.png";
import PageTop from "../../../components/PageTop";
import PageBottom from "../../../components/PageBottom";
import Loader from "../../../components/Loader";
import { useGetWishlistQuery } from "../../../services/userApi";
import { navigateToHomePage } from "../../../utils";
import usePageLoader from "../../../hooks";
import image1 from "/src/assets/wishlistEmpty.png";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";

function WishlistPage() {
    const { t } = useTranslation();
    const { auth } = useAuth();
    const { wishlist: localWishlist, toggleWishlist } = useWishlist();

    const [selectedButton, setSelectedButton] = useState("all");

    // 🔹 Backend wishlist
    const {
        data: getWishlist,
        isLoading,
        refetch
    } = useGetWishlistQuery(undefined, {
        skip: !auth?.token
    });

    // 🔹 Auth varsa backend, yoxdursa local
    const wishlist = auth?.token
        ? getWishlist?.data || []
        : localWishlist.map((id) => ({
            wishlistId: id,
            productDto: { id, discount: null }
        }));

    const showLoader = usePageLoader(isLoading);

    const filteredItems =
        selectedButton === "all"
            ? wishlist
            : wishlist.filter(
                (item) =>
                    item.productDto.discount !== null &&
                    item.productDto.discount > 0
            );

    const handleButtonClick = (type) => {
        setSelectedButton(type);
    };

    // 🔹 Wishlist dəyişəndə refetch (login user üçün)
    useEffect(() => {
        const handleWishlistChange = async () => {
            if (auth?.token) {
                await refetch();
            }
        };

        document.addEventListener(
            "wishlistChanged",
            handleWishlistChange
        );

        return () => {
            document.removeEventListener(
                "wishlistChanged",
                handleWishlistChange
            );
        };
    }, [auth?.token, refetch]);

    return (
        <>
            {showLoader && <Loader isVisible={isLoading} />}
            <PageTop />

            <section id="wishlistPage">
                <div className="container">
                    {/* -------- BREADCRUMB -------- */}
                    <div className="navigation">
                        <div
                            className="navText"
                            onClick={navigateToHomePage}
                        >
                            {t("wishlist.home")}
                        </div>
                        <MdChevronRight className="navText" />
                        <div className="selected navText">
                            {t("wishlist.title")}
                        </div>
                    </div>

                    {/* -------- FILTER BUTTONS -------- */}
                    <div className="buttonWrapper">
                        <div
                            className={`button ${
                                selectedButton === "all"
                                    ? "selected all"
                                    : ""
                            }`}
                            onClick={() =>
                                handleButtonClick("all")
                            }
                        >
                            <img
                                src={heart}
                                alt={t("wishlist.allAlt")}
                                className="endirim"
                            />
                            <span>
                                {t("wishlist.allItems")}
                            </span>
                        </div>

                        <div
                            className={`button ${
                                selectedButton === "discounted"
                                    ? "selected discounted"
                                    : ""
                            }`}
                            onClick={() =>
                                handleButtonClick("discounted")
                            }
                        >
                            <img
                                src={endirim1}
                                alt={t("wishlist.discountedAlt")}
                                className="endirim"
                            />
                            <span>
                                {t("wishlist.discounted")}
                            </span>
                        </div>
                    </div>

                    {/* -------- WISHLIST CONTENT -------- */}
                    <div className="row">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div
                                    className="col-60-12 col-60-md-15 col-60-sm-20 col-60-xs-30"
                                    key={item.wishlistId}
                                >
                                    <Card
                                        item={item.productDto}
                                        onWishlistToggle={() => {
                                            toggleWishlist(
                                                item.productDto.id
                                            );

                                            if (auth?.token) {
                                                document.dispatchEvent(
                                                    new Event(
                                                        "wishlistChanged"
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    gap: "12px",
                                    margin: "50px auto",
                                    padding: "0 8px"
                                }}
                            >
                                <img
                                    src={image1}
                                    alt={t("wishlist.emptyAlt")}
                                />

                                <div
                                    style={{
                                        fontWeight: "500",
                                        marginTop: "12px"
                                    }}
                                >
                                    {t("wishlist.emptyTitle")}
                                </div>

                                <div
                                    style={{
                                        maxWidth: "420px",
                                        textAlign: "center",
                                        width: "100%",
                                        lineHeight: "25px",
                                        fontSize: "14px"
                                    }}
                                >
                                    {t("wishlist.emptyDesc")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <PageBottom />
        </>
    );
}

export default WishlistPage;
