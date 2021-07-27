/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import service from '../../service';
import { Link } from "react-router-dom";
import queryString from 'query-string';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../css/Slider.css';
import NoImage from '../../images/noimage.png';
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";


export function NextArrow(props) {
    const { onClick, hover } = props;
    return (
        <div>
            <div
                className="next-slick-arrow"
                onClick={onClick}
                style={{ visibility: hover ? 'visible' : 'hidden' }}>
                <RiArrowRightSLine />
            </div>
        </div>
    );
}

export function PrevArrow(props) {
    const { onClick, hover } = props;
    return (
        <div>
            <div className="prev-slick-arrow"
                onClick={onClick}
                style={{ visibility: hover ? 'visible' : 'hidden' }}>
                <RiArrowLeftSLine /> </div>
        </div>
    );
}

export default function Slideshow() {
    const [listNews, setListNews] = useState([]);
    const [hover, setHover] = useState(false);
    const [prefix] = useState({
        limit: 6,
    });

    const sliderSetting = {
        center: true,
        slidesToShow: 1,
        focusOnSelect: true,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        lazyLoad: true,
        nextArrow: <NextArrow hover={hover} />,
        prevArrow: < PrevArrow hover={hover} />
    }

    useEffect(() => {
        let mounted = true;
        const paramsString = '?' + queryString.stringify(prefix);
        async function fetchData() {
            const responseNews = await service.getSliderListNews({ paramsString });
            if (mounted) {
                setListNews(responseNews.results);
            }
        }
        fetchData()
        return () => (mounted = false);
    }, [prefix]);


    return (
        <div className="slideshow mx-2 xl:mx-64 mb-10"
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}>
            <Slider {...sliderSetting}>
                {listNews.map((item) => (
                    <div
                        className="slide-container"
                        key={item.id}
                    >
                        <div className='slide-img'>
                            <Link to={`/news/${item.id}`}>
                                {item.thumbnail_link !== null ?
                                    (<img src={item.thumbnail_link}
                                        alt="Thumbnail news"
                                        className='w-full'
                                        onError={e => { e.target.onerror = null; e.target.src = NoImage }} />) :
                                    (<img src={item.image_link}
                                        alt="Thumbnail news"
                                        className='w-full'
                                        onError={e => { e.target.onerror = null; e.target.src = NoImage }} />)}
                            </Link>
                        </div>
                        <div className='slide-title'>
                            <Link to={`/news/${item.id}`} >
                                <h2 className="text-base text-white text-center font-medium uppercase py-4 lg:text-3xl">{item.title}</h2>
                            </Link>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>

    )
}
