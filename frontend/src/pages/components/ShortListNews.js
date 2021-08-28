import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import service from "../../service";
import queryString from 'query-string';
import NoImage from "../../images/noimage.png";
import PropsTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';
import '../css/ShortListNews.css';

ShortListNews.propsTypes = {
    id: PropsTypes.object.int,
}

export default function ShortListNews(props) {
    const { id } = props;
    const [shortListNews, setShortListNews] = useState(['']);
    const [hover, setHover] = useState(false);
    const [prefix] = useState({
        limit: 7,
    });
    let options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    let listNewsSide = shortListNews.slice(1, 3);
    let listNewsBottom = shortListNews.slice(3, 7);

    useEffect(() => {
        let mounted = true;
        async function fetchData(id, prefix) {
            let paramsString = '?' + queryString.stringify(prefix);
            const responseListNews = await service.getShortListNews({ id, paramsString });
            if (mounted) {
                setShortListNews(responseListNews.results);
            }
        }
        fetchData(id, prefix);
        return () => (mounted = false);
    }, [id, prefix]);

    return (
        <div className='news-container mx-2 px-4 lg:px-0'>
            <div className='card-large'
                onMouseEnter={() => {
                    setHover(true);
                }}
                onMouseLeave={() => {
                    setHover(false);
                }}>
                <LazyLoad
                    placeholder={<Skeleton height={100} />}
                    className="hover overflow-hidden"
                    style={{ textDecoration: hover && 'underline' }}>
                    <Link to={`/news/${shortListNews[0].id}`}>
                        <img src={shortListNews[0].thumbnail_link} alt="Thumbnail news"
                            onError={e => { e.target.onerror = null; e.target.src = NoImage }}
                            className='image w-full'
                            style={{ transform: hover && 'scale(1.05)' }} />
                    </Link>
                </LazyLoad>
                <Link to={`/news/${shortListNews[0].id}`} >
                    <h2 className='font-bold mt-4 font-medium text-2xl'
                        style={{ textDecoration: hover && 'underline' }}>
                        {shortListNews[0].title}
                    </h2>
                </Link>
                <div className='mt-2 text-base'>
                    <p className='text-sm text-gray-500'>{(new Date(shortListNews[0].published_at)).toLocaleString('vi-VN', options)}</p>
                    <p className='mt-3' dangerouslySetInnerHTML={{ __html: shortListNews[0].summary }} />

                </div>
            </div >
            <div className='card-side flex flex-col'>
                {listNewsSide.map(item => (
                    <div className='mb-10' key={item.id}>
                        <LazyLoad
                            placeholder={<Skeleton height={100} />}
                            className="w-full">
                            <Link to={`/news/${item.id}`}>
                                <img src={item.thumbnail_link} alt="Thumbnail news"
                                    onError={e => { e.target.onerror = null; e.target.src = NoImage }}
                                    className='object-contain w-full' />
                            </Link>
                        </LazyLoad>
                        <Link to={`/news/${item.id}`} >
                            <h2 className='hover:underline mt-3 font-bold md:text-lg lg:text-xl'>{item.title}</h2>
                        </Link>
                        <p className='mt-1 text-sm text-gray-500'>{(new Date(shortListNews[0].published_at)).toLocaleString('vi-VN', options)}</p>
                    </div>
                ))}
            </div>
            <div className='card-bottom grid grid-cols-1 lg:grid-cols-2 lg:gap-x-20'>
                {listNewsBottom.map(item => (
                    <div className='mb-10 flex flex-row' key={item.id}>
                        <LazyLoad
                            height={100}
                            placeholder={<Skeleton height={100} />}
                            className="w-48 lg:w-44 hidden md:block">
                            <Link to={`/news/${item.id}`}>
                                <img src={item.thumbnail_link} alt="Thumbnail news"
                                    onError={e => { e.target.onerror = null; e.target.src = NoImage }}
                                    className='object-fill md:h-28 lg:h-24 w-full' />
                            </Link>
                        </LazyLoad>
                        <div className='ml-4'>
                            <Link to={`/news/${item.id}`} >
                                <h2 className='hover:underline font-bold text-base'>{item.title}</h2>
                            </Link>
                            <p className='mt-2 text-sm text-gray-500'>{(new Date(shortListNews[0].published_at)).toLocaleString('vi-VN', options)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}