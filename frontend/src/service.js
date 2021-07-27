import axios from "axios";

const API_NEWS = "/news/";
const API_CATEGORIES = "/categories/";
const API_RECOMMEND = "/recommend";

const getListNews = async (payload) => {
  const res = await axios.get(API_CATEGORIES + payload.id + API_NEWS + payload.prefix);
  return res.data;
};

const getShortListNews = async (payload) => {
  const res = await axios.get(API_CATEGORIES + payload.id + API_NEWS + payload.paramsString);
  return res.data;
}

const getSliderListNews = async (payload) => {
  const res = await axios.get(API_NEWS + payload.paramsString);
  return res.data;
}

const getDetailNews = async (payload) => {
  const res = await axios.get(API_NEWS + payload.id);
  return res.data;
}

const getSearchNews = async (payload) => {
  const res = await axios.get(API_NEWS + payload.prefix);
  return res.data;
}

const getListCategories = async () => {
  const res = await axios.get(API_CATEGORIES);
  return res.data;
};

const getRecommendNews = async (payload) => {
  const res = await axios.get(API_NEWS + payload.id + API_RECOMMEND);
  return res.data;
}

const service = {
  getListNews,
  getListCategories,
  getDetailNews,
  getShortListNews,
  getSliderListNews,
  getSearchNews,
  getRecommendNews
};

export default service;
