import React, { useEffect, useState, useLayoutEffect } from "react";
import service from "../service";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import ListView from "./components/ListView";
import Pagination from './components/Pagination';
import Footer from '../pages/components/Footer';

export default function ListNews() {
  const { id } = useParams();
  let location = useLocation();
  let history = useHistory();
  let searchParams = new URLSearchParams(location.search);
  const [page, setPage] = useState(
    parseInt(searchParams.getAll('page')) || 1
  );
  const [prefix, setPrefix] = useState(`?offset=${page * 20 - 20}`);
  const [listNews, setListNews] = useState([]);
  const [category, setCategory] = useState('');
  const [pagination, setPagination] = useState({
    prev: '',
    next: '',
  });

  const content = {
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const title = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const section = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  useEffect(() => {
    let searchParams = new URLSearchParams(location.search);
    let page = parseInt(searchParams.getAll('page')) || 1;
    setPage(page);
    setPrefix(`?offset=${page * 20 - 20}`);
  }, [location]);

  useEffect(() => {
    let mounted = true;
    async function fetchData(id, prefix) {
      const responseNews = await service.getListNews({ id, prefix });
      let prevUrl = responseNews.previous || '0';
      let nextUrl = responseNews.next || '0';
      let prefixPrev = prevUrl.split('/');
      let prefixNext = nextUrl.split('/');
      if (mounted) {
        setListNews(responseNews.results);
        setCategory(responseNews.results[0].categories[0].name);
        setPagination({
          prev: prefixPrev[prefixPrev.length - 1],
          next: prefixNext[prefixNext.length - 1]
        });
      }
    }
    fetchData(id, prefix)
    return () => (mounted = false);
  }, [id, prefix]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [prefix])

  function handlePageChange(pageNumb) {
    history.push({
      pathname: location.pathname,
      search: "?" + new URLSearchParams({ page: pageNumb }).toString(),
    });
  }

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className='container mx-auto'
    >
      <motion.div variants={content} animate="animate" initial="initial" >
        <motion.div variants={title} className="py-10 uppercase text-center text-3xl font-semibold lg:text-4xl">
          <h1 className='font-extrabold mb-10'>{category}</h1>
          <hr className='mb-10 border-black' />
        </motion.div>
        <motion.section variants={section} className="text-gray-600 body-font overflow-hidden">
          <div className="mb-24">
            <ListView listNews={listNews} />
          </div>
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            pageNumb={page}
          />
          <footer className='mx-2 lg:mx-0 mt-20 mb-10'>
            <Footer />
          </footer>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}