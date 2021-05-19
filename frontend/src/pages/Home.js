import { useEffect, useState } from "react";
import service from "../service";
import NoImage from "../no_image.jpeg";
import {Link} from "react-router-dom";

export default function Home() {
  // const [listCategories, setListCategories] = useState([]);
  const [listNews, setListNews] = useState([]);


  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      const responseNews = await service.getListNews();
      // const responseCategories = await service.getListCategories();
      if (mounted) {
        setListNews(responseNews.results);
        // setListCategories(responseCategories.results)
      }
    }
    fetchData()
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <main>
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="container px-5 py-24 mx-auto">
            <div className="-my-8 divide-y-2 divide-gray-100">
              {
                listNews.map(item => (
                  <div key={item.id} className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                      <img src={item.thumbnail_link} alt="Thumbnail news" onError={e => {e.target.onerror = null; e.target.src=NoImage}} />
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">{item.title}</h2>
                      <p className="leading-relaxed">{item.summary}</p>
                      <Link to={`news/${item.id}`} className="text-indigo-500 inline-flex items-center mt-4">Learn More
                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"
                             strokeLinejoin="round" strokeLinecap="round">
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}