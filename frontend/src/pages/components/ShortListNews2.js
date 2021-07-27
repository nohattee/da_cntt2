import React, { useState, useEffect } from 'react';
import service from "../../service";
import queryString from 'query-string';
import NoImage from "../../images/noimage.png";
import PropsTypes from 'prop-types';
import { Link } from "react-router-dom";
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';

ShortListNews2.propsTypes = {
    id: PropsTypes.object.int,
}

ShortListNews2.defaultProps = {
    id: null,
}

export default function ShortListNews2(props) {
    const { id } = props;
    const [shortListNews, setShortListNews] = useState(['']);
    const [hover, setHover] = useState(false);
    const [prefix] = useState({
        limit: 5
    });
    let listNews = shortListNews.slice(1, 5);

    useEffect(() => {
        let mounted = true;
        const paramsString = '?' + queryString.stringify(prefix);
        async function fetchData(id) {
            const responseListNews = await service.getShortListNews({ id, paramsString });
            if (mounted) {
                setShortListNews(responseListNews.results);
            }
        }
        fetchData(id, prefix);
        return () => (mounted = false);
    }, [id, prefix]);

    return (
        <div className='px-2 lg:px-0'>
            <div className='mb-2 mt-5'
                onMouseEnter={() => {
                    setHover(true);
                }}
                onMouseLeave={() => {
                    setHover(false);
                }}>
                <LazyLoad
                    placeholder={<Skeleton height={100} />}
                    className="hover overflow-hidden flex flex-col flex-shrink-1"
                >
                    <Link to={`/news/${shortListNews[0].id}`}>
                        <img src={shortListNews[0].thumbnail_link} alt="Thumbnail news"
                            onError={e => { e.target.onerror = null; e.target.src = NoImage }}
                            className='image object-fill lg:h-72 md:h-48 w-full'
                            style={{ transform: hover && 'scale(1.05)' }} />
                    </Link>
                </LazyLoad>
                <Link to={`/news/${shortListNews[0].id}`} >
                    <h2 className='mt-2 font-bold text-lg'
                        style={{ textDecoration: hover && 'underline' }}>
                        {shortListNews[0].title}
                    </h2>
                </Link>
            </div>
            {listNews.map(item => (
                <Link to={`/news/${item.id}`} key={item.id}>
                    <p className='hover:underline font-bold mb-3 text-lg'>{item.title}</p>
                </Link>
            ))}
        </div >
    )
}