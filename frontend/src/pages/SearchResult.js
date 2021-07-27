import React, { useState, useEffect, useLayoutEffect } from 'react';
import service from '../service';
import { useHistory, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import ListView from './components/ListView'
import Pagination from './components/Pagination';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsArrowRight } from 'react-icons/bs';
import Footer from '../pages/components/Footer';
import './css/SearchResult.css';

export default function SearchResult() {
    let history = useHistory();
    let location = useLocation();
    let searchParams = new URLSearchParams(location.search);
    const [searchTerm, setSearchTerm] = useState(searchParams.getAll('key'));
    const [page, setPage] = useState(
        parseInt(searchParams.getAll('page')) || 1
    );
    const [prefix, setPrefix] = useState(`?offset=0&search=${searchTerm.toString()}`);
    const [listNews, setListNews] = useState([]);
    const [count, setCount] = useState('');
    const [pagination, setPagination] = useState({
        prev: '',
        next: '',
    });

    const transition = {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
    };

    const exit = {
        exit: { x: 100, opacity: 0, transition },
        enter: { x: 0, opacity: 1, transition: { delay: 0.5, ...transition } }
    };

    useEffect(() => {
        let searchParams = new URLSearchParams(location.search);
        let searchTerm = searchParams.getAll('key').toString();
        let page = parseInt(searchParams.getAll('page')) || 1;
        setSearchTerm(searchTerm);
        setPage(page);
        setPrefix(`?offset=${page * 20 - 20}&search=${searchTerm}`);
    }, [location]);

    useEffect(() => {

        let mounted = true;
        async function fetchData(prefix) {
            const responseNews = await service.getSearchNews({ prefix });
            let prevUrl = responseNews.previous || '0';
            let nextUrl = responseNews.next || '0';
            let prefixPrev = prevUrl.split('/');
            let prefixNext = nextUrl.split('/');
            if (mounted) {
                setListNews(responseNews.results);
                setCount(responseNews.count);
                setPagination({
                    prev: prefixPrev[prefixPrev.length - 1],
                    next: prefixNext[prefixNext.length - 1]
                })
            }
        }
        fetchData(prefix);
        return () => (mounted = false);
    }, [prefix]);

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [prefix]);

    function handlePageChange(pageNumb) {
        history.push({
            pathname: '/search/',
            search: "?" + new URLSearchParams({ key: searchTerm }) + '&' + new URLSearchParams({ page: pageNumb }),
        });
    }

    function handleInput(text) {
        text = text.trim();
        return text
    }

    function handleSubmit(e) {
        if (searchTerm === '') {
            e.preventDefault();
            e.stopPropagation();
        } else {
            history.push({
                pathname: '/search/',
                search: "?" + new URLSearchParams({ key: handleInput(searchTerm) }).toString() + '&' + new URLSearchParams({ page: 1 }),
            });
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function handleChange(e) {
        setSearchTerm(e.target.value);
    }

    return (
        <motion.main variants={exit} initial="exit" animate="enter" exit="exit" className='container mx-auto mb-10'>
            <div className='mb-10 pl-3 py-10 '>
                <div className='mb-4 text-gray-500'>
                    <p>Tìm thấy {count} kết quả</p>
                </div>
                <form
                    className='flex space-x-10 border-b-4 border-black mx-2 lg:mx-0'
                    onSubmit={handleSubmit}>
                    <AiOutlineSearch className='text-3xl mt-4' />
                    <input
                        className='w-full h-15 focus:outline-none mb-2 text-3xl lg:text-5xl lg:mb-5 font-bold'
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder='Search' />
                    <button
                        type='submit'
                        className='btn-submit text-3xl focus:outline-none'>
                        <BsArrowRight />
                    </button>
                </form>
            </div>
            {
                parseInt(count) !== 0 ?
                    (<section className='container mx-auto'>
                        <div className="px-2 mb-24">
                            <ListView listNews={listNews} />
                        </div>
                        <Pagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            pageNumb={page}
                        />
                        <footer className='mx-2 lg:mx-0 mt-20'>
                            <Footer />
                        </footer>
                    </section >) :
                    (
                        <section className="body-font">
                            <div className="container px-3 mx-auto">
                                <div className='text-gray-600 text-xl mb-10'>Không tìm thấy kết quả phủ hợp.
                                </div>
                                <div className='text-3xl font-medium'>Vui lòng thử một cụm từ tìm kiếm khác.</div>
                            </div>
                        </section>
                    )
            }
        </motion.main >
    )
}