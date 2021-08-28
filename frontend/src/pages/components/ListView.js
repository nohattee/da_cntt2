import React from "react";
import { Link } from "react-router-dom";
import PropsTypes from 'prop-types';
import NoImage from "../../images/no_image.jpeg";
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';

ListView.propsTypes = {
    listNews: PropsTypes.object.isRequired,
}

ListView.defaultProps = {
    listNews: null,
}

export default function ListView(props) {
    let { listNews } = props;
    let options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }

    return (
        <div className="px-4 -my-8 divide-y-2 divide-gray-200">
            {
                listNews.map(item => (
                    <div key={item.id} className="py-8 flex flex-wrap md:flex-nowrap">
                        <LazyLoad
                            once
                            placeholder={<Skeleton height={200} width={250} />}
                            className="w-full md:w-64 md:mb-0 mb-6 flex-shrink-1 md:flex-shrink-0 lg:flex-shrink-0 flex flex-col md:mr-4 lg:mr-4">
                            <Link to={`/news/${item.id}`} >
                                <img src={item.thumbnail_link} alt="Thumbnail news" className='w-full' onError={e => { e.target.onerror = null; e.target.src = NoImage }} />
                            </Link>
                        </LazyLoad>
                        <div className="md:flex-grow">
                            <Link to={`/news/${item.id}`} >
                                <h2 className="text-2xl font-bold text-gray-900 title-font hover:underline">{item.title}</h2>
                            </Link>
                            <p className='date pt-2 mb-2 text-gray-500 text-base'>{(new Date(item.published_at)).toLocaleString('vi-VN', options)}</p>
                            <p className="leading-relaxed text-black text-lg" dangerouslySetInnerHTML={{ __html: item.summary }} />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}