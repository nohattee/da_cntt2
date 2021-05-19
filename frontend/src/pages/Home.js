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
                      <Link to={`news/${item.id}`} >
                        <img src={item.thumbnail_link} alt="Thumbnail news" onError={e => {e.target.onerror = null; e.target.src=NoImage}} />
                      </Link>
                    </div>
                    <div className="md:flex-grow">
                      <Link to={`news/${item.id}`} >
                        <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">{item.title}</h2>
                      </Link>
                      <p className="leading-relaxed">{item.summary}</p>
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