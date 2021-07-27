import React, { useState, useEffect } from 'react';
import service from '../service';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import LazyLoad from 'react-lazyload';
import Slideshow from './components/Slideshow';
import ShortListNews from './components/ShortListNews';
import ShortListNews2 from './components/ShortListNews2';
import Footer from './components/Footer';
import { IoChevronForward } from 'react-icons/io5';
import './css/Home.css';

export default function Home() {
    const [listCategories, setListCategories] = useState([]);
    const transition = {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
    };

    const backVariants = {
        initial: { y: 100, opacity: 0 },
        enter: { y: 0, opacity: 1, transition },
        exit: { y: -100, opacity: 0, transition }
    };

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            const responseCategories = await service.getListCategories();
            if (mounted) {
                setListCategories(responseCategories.results);
            }
        }
        fetchData()
        return () => (mounted = false);
    }, []);

    const listCategories1 = listCategories.slice(0, 7);
    const listCategories2 = listCategories.slice(8, 14);

    return (
        <motion.main className='container mx-auto'
            initial="initial"
            animate="enter"
            exit="exit"
            variants={backVariants}>
            <Slideshow />
            <div className='h-auto mb-5 border-bottom-2'>
                {listCategories1.map(category => (
                    <section key={category.id} className='pb-2'>
                        <div className='border-t-4 border-b-2 border-black uppercase font-extrabold cursor-pointer'>
                            <Link
                                to={{
                                    pathname: `/categories/${category.id}`,
                                    search: "?" + new URLSearchParams({ page: 1 }).toString(),
                                }}>
                                <div className='news-category-header flex py-6 text-xl ml-2 space-x-2'>
                                    <h2>{category.name}</h2>
                                    <IoChevronForward className='arrow mt-1 ml-4' />
                                </div>
                            </Link>
                        </div>
                        <LazyLoad once={true} height={500} offset={200}>
                            <ShortListNews id={category.id} />
                        </LazyLoad>
                    </section>
                )
                )}
            </div>
            <div className='grid gap-y-10 gap-x-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-3'>
                {listCategories2.map(category => (
                    <section key={category.id} className='pb-2 w-full lg:w-10/12'>
                        <div className='border-t-4 border-b-2 border-black uppercase font-extrabold cursor-pointer'>
                            <Link
                                to={{
                                    pathname: `/categories/${category.id}`,
                                    search: "?" + new URLSearchParams({ page: 1 }).toString(),
                                }}>
                                <div className='news-category-header flex py-6 text-xl ml-2 space-x-2'>
                                    <h2 className='text-lg '>{category.name}</h2>
                                    <IoChevronForward className='arrow mt-1 ml-4' />
                                </div>
                            </Link>
                        </div>
                        <LazyLoad once={true} debounce={100} height={100} offset={100} >
                            <ShortListNews2 id={category.id} />
                        </LazyLoad>
                    </section>
                )
                )}
            </div>
            <motion.footer className='mx-2 lg:mx-0 mt-10 mb-10'
                initial="initial"
                animate="enter"
                exit="exit"
                variants={backVariants}>
                <Footer />
            </motion.footer>
        </motion.main >
    )
}