import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import service from "../../service";
import PropsTypes from 'prop-types';
import Slider from "react-slick";
import NoImage from '../../images/noimage.png';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

RecommendList.PropsTypes = {
    id: PropsTypes.object.int
}

export function DesktopLoading() {
    return (
        <>
            <SkeletonTheme highlightColor="#E2E2E2">
                <div className='flex flex-row justify-between'>
                    <p>
                        <Skeleton height={200} width={275} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                    <p>
                        <Skeleton height={200} width={275} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                    <p>
                        <Skeleton height={200} width={275} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                    <p>
                        <Skeleton height={200} width={275} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                </div>
            </SkeletonTheme>
        </>
    )
}

export function TabletLoading() {
    return (
        <>
            <SkeletonTheme highlightColor="#E2E2E2">
                <div className='flex flex-row justify-between'>
                    <p>
                        <Skeleton height={200} width={220} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                    <p>
                        <Skeleton height={200} width={220} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                    <p>
                        <Skeleton height={200} width={220} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                </div>
            </SkeletonTheme>
        </>
    )
}

export function MobileLoading() {
    return (
        <>
            <SkeletonTheme highlightColor="#E2E2E2">
                <div className='flex flex-row justify-between'>
                    <p>
                        <Skeleton height={150} width={165} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                    <p>
                        <Skeleton height={150} width={165} duration={2} />
                        <Skeleton count={3} duration={2} />
                    </p>
                </div>
            </SkeletonTheme>
        </>
    )
}


export function NextArrow(props) {
    const { onClick } = props;
    return (
        <div>
            <div
                className="next-arrow"
                onClick={onClick}>
                <RiArrowRightSLine />
            </div>
        </div>
    );
}

export function PrevArrow(props) {
    const { onClick } = props;
    return (
        <div>
            <div className="prev-arrow"
                onClick={onClick}>
                <RiArrowLeftSLine /> </div>
        </div>
    );
}

export default function RecommendList(props) {
    const { id } = props;
    const [recommendNews, setRecommendNews] = useState([]);
    const settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 4,
        draggable: false,
        lazyLoad: true,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    draggable: true,
                }
            },
        ],
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    useEffect(() => {
        let mounted = true;
        async function fetchData(id) {
            const responseNews = await service.getRecommendNews({ id });
            if (mounted) {
                setRecommendNews(responseNews);
            }
        }
        fetchData(id);
        return () => (mounted = false);
    }, [id]);


    const loadingAnimation = () => {
        if (window.innerWidth >= 1025) {
            return <DesktopLoading />;
        } else if (window.innerWidth > 640) {
            return <TabletLoading />;
        } else {
            return <MobileLoading />
        }
    }

    return (
        recommendNews.length !== 0 ? (
            <Slider {...settings}>
                {
                    recommendNews.map(news => (
                        <div key={news.id}>
                            <div>
                                <Link to={`/news/${news.id}`}>
                                    {news.thumbnail_link !== null ?
                                        (<img src={news.thumbnail_link}
                                            alt="Thumbnail news"
                                            className='w-full object-fill h-36 lg:h-68 md:h-48 '
                                            onError={e => { e.target.onerror = null; e.target.src = NoImage }} />) :
                                        (<img src={news.image_link}
                                            alt="Thumbnail news"
                                            className='w-full object-fill lg:h-68 md:h-48'
                                            onError={e => { e.target.onerror = null; e.target.src = NoImage }} />)}
                                </Link>
                            </div>
                            <div className='mt-2'>
                                <Link to={`/news/${news.id}`}>
                                    <h3 className='hover:underline font-semibold text-base lg:text-lg text-center'>{news.title}</h3>
                                </Link>
                            </div>
                        </div>

                    ))
                }
            </Slider>
        ) : (
            loadingAnimation()
        )
    )
}