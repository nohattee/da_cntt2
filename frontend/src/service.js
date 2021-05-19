import axios from "axios";

const API_NEWS = "/news/";
const API_CATEGORIES = "/categories/"

const getListNews = async (payload) => {
  const res = await axios.get(API_NEWS);
  return res.data;
};

const getListCategories = async (payload) => {
  const res = await axios.get(API_CATEGORIES);
  return res.data;
};

const service = {
  getListNews,
  getListCategories,
};

export default service;
