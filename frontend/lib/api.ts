import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if needed
});

export const createReview = async (review: any) => {
  const res = await API.post("/reviews", review);
  return res.data;
};