import {useEffect, useRef, useState, useCallback} from "react";
import {useTranslation} from "react-i18next";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import './index.scss';
import {FreeMode} from 'swiper/modules';
import Card from "../Card/index.jsx";

function CardWrapper({type, products}) {
    const {t} = useTranslation();
    const swiperRef = useRef(null);
    const progressRef = useRef();

    // --- Lazy Load State ---
    const [visibleCount, setVisibleCount] = useState(10);

    const handleLoadMore = useCallback(() => {
        if (!products) return;
        setVisibleCount((prev) => Math.min(prev + 10, products.length));
    }, [products]);

    // --- Progress bar update ---
    useEffect(() => {
        const progress = progressRef.current;
        const swiper = swiperRef.current;

        const updateProgress = () => {
            if (!swiper) return;
            const swiperWrapper = swiper.el.querySelector('.swiper-wrapper');
            const scrollLeft = Math.abs(swiper.translate);
            const scrollWidth = swiperWrapper.scrollWidth - swiper.width;
            const rawPct = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
            const maxWidth = window.innerWidth < 992 ? 92 : 98;
            const clampedPct = Math.min(Math.max(rawPct, 30), maxWidth);
            progress.style.width = `${clampedPct}%`;
        };

        if (swiper) {
            swiper.on('progress', updateProgress);
            swiper.on('resize', updateProgress);
            updateProgress();
        }

        return () => {
            if (swiper) {
                swiper.off('progress', updateProgress);
                swiper.off('resize', updateProgress);
            }
        };
    }, []);

    // --- Infinite scroll effect for swiper ---
    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        const onScrollEnd = () => {
            const endReached = swiper.isEnd;
            if (endReached && visibleCount < products.length) {
                handleLoadMore();
            }
        };

        swiper.on('reachEnd', onScrollEnd);
        return () => swiper.off('reachEnd', onScrollEnd);
    }, [products, visibleCount, handleLoadMore]);

    return (
        <section id="cardWrapper">
            <div className="scroll-progress-bar" ref={progressRef}></div>
            <div className="swiper-scroll-container">
                <Swiper
                    slidesPerView="auto"
                    freeMode={true}
                    grabCursor={true}
                    modules={[FreeMode]}
                    className="swiper-container"
                    role="region"
                    aria-label="Category carousel"
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                >
                    {products?.slice(0, visibleCount).map((item) => (
                        <SwiperSlide
                            key={item.id}
                            style={{
                                width: '197px',
                                padding: '16px 0',
                                margin: '0 16px',
                            }}
                        >
                            <Card item={item} type={type}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default CardWrapper;
