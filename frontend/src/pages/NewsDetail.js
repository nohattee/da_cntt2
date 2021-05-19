import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import service from "../service";

export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function fetchData(id) {
          const responseNews = await service.getDetailNews({ id });
          // const responseCategories = await service.getListCategories();
          if (mounted) {
            setNews(responseNews);
            // setListCategories(responseCategories.results)
          }
        }
        fetchData(id)
        return () => (mounted = false);
    }, [id])

    return (
        <div>
            {
                news !== null ? (
                    <article>
                        <h1>{news.title}</h1>
                        <span>{(new Date(news.published_at)).toLocaleString()}</span>
                        <img src={news.image_link} alt=""/>
                        <div>{news.content}</div>
                        <div>{news.author}</div>
                    </article>

                ) : ''
            }
        </div>
    )
}