import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "./index.scss";
import { FreeMode } from "swiper/modules";
import Offer from "../Offer/index.jsx";

function OfferWrapper({ type, products }) {
    const { t } = useTranslation();
    const swiperRef = useRef(null);
    const progressRef = useRef(null);

    const productList = products || [];

    // --- Lazy load state ---
    const [visibleCount, setVisibleCount] = useState(6);

    const handleLoadMore = useCallback(() => {
        if (!productList.length) return;
        setVisibleCount((prev) => Math.min(prev + 6, productList.length));
    }, [productList]);

    // --- Progress bar update ---
    useEffect(() => {
        const swiper = swiperRef.current;
        const progress = progressRef.current;

        if (!swiper || !progress) return;

        const updateProgress = () => {
            const swiperWrapper = swiper.el?.querySelector(".swiper-wrapper");
            if (!swiperWrapper) return;

            const scrollLeft = Math.abs(swiper.translate || 0);
            const scrollWidth = swiperWrapper.scrollWidth - swiper.width;
            const rawPct = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
            const maxWidth = window.innerWidth < 992 ? 92 : 98;
            const clampedPct = Math.min(Math.max(rawPct, 30), maxWidth);
            progress.style.width = `${clampedPct}%`;
        };

        swiper.on("setTranslate", updateProgress);
        swiper.on("resize", updateProgress);
        updateProgress();

        return () => {
            swiper.off("setTranslate", updateProgress);
            swiper.off("resize", updateProgress);
        };
    }, []);

    // --- Infinite scroll (reachEnd) ---
    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        const onReachEnd = () => {
            if (visibleCount < productList.length) {
                handleLoadMore();
            }
        };

        swiper.on("reachEnd", onReachEnd);
        return () => swiper.off("reachEnd", onReachEnd);
    }, [productList, visibleCount, handleLoadMore]);

    return (
        <section id="offerWrapper">
            <div className="scroll-progress-bar" ref={progressRef}></div>
            <div className="swiper-scroll-container">
                <Swiper
                    slidesPerView="auto"
                    freeMode={true}
                    grabCursor={true}
                    modules={[FreeMode]}
                    className="swiper-container"
                    role="region"
                    aria-label={t(`carousel.${type || "offers"}`)}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                >
                    {productList.slice(0, visibleCount).map((item) => (
                        <SwiperSlide
                            key={item.id}
                            style={{
                                width: "320px",
                                padding: "16px 0",
                                margin: "0 clamp(8px, 1.5vw, 16px)",
                            }}
                        >
                            <Offer item={item} type={type} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default OfferWrapper;
