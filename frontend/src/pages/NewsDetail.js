import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import LazyLoad from 'react-lazyload';
import service from "../service";
import RecommendList from "../pages/components/RecommendList";
import Footer from '../pages/components/Footer';
import './css/RecommendList.css';

export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [categories, setCategories] = useState([]);

    let transition = [0.175, 0.85, 0.42, 0.96];
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }

    const backVariants = {
        exit: {
            y: 100,
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: transition
            }
        },
        enter: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: transition
            }
        }
    };

    useEffect(() => {
        let mounted = true;
        async function fetchData(id) {
            const responseNews = await service.getDetailNews({ id });
            const categories = responseNews.categories;
            if (mounted) {
                setNews(responseNews);
                setCategories(categories);
            }
        }
        fetchData(id);
        return () => (mounted = false);
    }, [id]);

    return (
        news !== null ? (
            <motion.div variants={backVariants} initial="exit" animate="enter" exit="exit">
                <article className='py-5 border-b-2 ' style={{ backgroundColor: '#FCFAF6' }}>
                    <div className='page-header text-center'>
                        {categories.map(item => (
                            <ul key={item.id} className='mb-4 text-xl font-medium cursor-pointer lg:text-2xl'>
                                <Link
                                    to={{
                                        pathname: `/categories/${item.id}`,
                                        search: "?" + new URLSearchParams({ page: 1 }).toString(),
                                    }}>
                                    <li>
                                        <p>{item.name}</p>
                                    </li>
                                </Link>
                            </ul>
                        ))}
                        <h1 className='title uppercase text-3xl font-black md:px-10 lg:text-4xl lg:px-20'>{news.title}</h1>
                        <div className='pt-4 flex flex-row items-center justify-center'>
                            <p className='author mr-2'>{news.author}</p>
                            <p className='text-gray-500'>{(new Date(news.published_at)).toLocaleString('vi-VN', options)}</p>
                        </div>
                    </div>
                    <hr className='mt-5 mx-auto w-3/4 md:w-1/2 lg:w-1/4 border-black' />
                    <div className='container mx-auto page-detail mt-7' >
                        <div className='px-2 xl:px-48'>
                            <div className='summary text-center font-bold text-lg md:text-xl' dangerouslySetInnerHTML={{ __html: news.summary }} />
                            <div>
                                {
                                    news.image_link !== null ?
                                        (<img src={news.image_link} alt="img" className='w-full lg:w-3/4 mx-auto my-7' />) :
                                        (<img src={news.thumbnail_link} alt="img" className='w-full lg:w-3/4 mx-auto my-7' />)
                                }
                            </div>
                            <div className='content text-lg px-2 lg:px-10 md:text-xl' dangerouslySetInnerHTML={{ __html: news.content }} />
                        </div>
                    </div>
                </article>
                <div className='container mx-auto mt-10 px-4 md:px-10 xl:px-48'>
                    <h1 className='text-3xl font-semibold mb-10'>Bạn có thể quan tâm</h1>
                    <LazyLoad LazyLoad once={true} height={100} offset={400}>
                        <RecommendList id={id} />
                    </LazyLoad>
                </div>
                <footer className='mx-2 mt-5 mb-10 lg:mx-0 lg:mt-10'>
                    <Footer />
                </footer>
            </motion.div >
        ) : ('')
    )
}