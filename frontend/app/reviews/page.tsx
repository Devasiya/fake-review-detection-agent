"use client";

import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import SubNavbar from "@/components/SubNavbar";

type Review = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  content: string;
  rating: number;
  aiScore: number;
  confidence: number;
  model_confidence: number;
  rule_confidence: number;
  hybrid_label: number;
  status: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchUser, setSearchUser] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [filter, setFilter] = useState("All Labels");

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // 🔥 FETCH REVIEWS
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(res.data.reviews);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
    else fetchReviews();
  }, []);

  // 🔄 LABEL
  const getLabel = (val: number) => {
    if (val === 0) return "Normal";
    if (val === 1) return "Mildly Suspicious";
    return "Highly Suspicious";
  };

  // 🎯 Recommendation
  const getRecommendation = (label: number) => {
  if (label === 0) return "Safe (No action needed)";
  if (label === 1) return "Monitor (Needs review)";
  return "High Risk (Take action)";
};

  // 🔍 FILTER
  const filtered = reviews.filter((r) => {
    const matchesUser = r.user?.name
      ?.toLowerCase()
      .includes(searchUser.toLowerCase());

    const matchesContent = r.content
      ?.toLowerCase()
      .includes(searchContent.toLowerCase());

    const label = getLabel(r.hybrid_label);

    const matchesFilter =
      filter === "All Labels" || label === filter;

    return matchesUser && matchesContent && matchesFilter;
  });

  const getBadgeStyle = (label: string) => {
    if (label === "Normal") return "bg-green-100 text-green-700";
    if (label === "Mildly Suspicious")
      return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "text-green-600";
    if (conf >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50">
        <SubNavbar />
      </div>

      {/* CONTENT */}
      <div className="pt-24 px-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-purple-600">
            Reviews Management
          </h1>
          <p className="text-gray-500">
            Browse, filter, and manage all reviews
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-center border rounded-lg px-3 py-2 w-full md:w-[32%] bg-white">
            🔍
            <input
              placeholder="Search by user..."
              className="outline-none w-full ml-2"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 w-full md:w-[32%] bg-white">
            🔍
            <input
              placeholder="Search by review..."
              className="outline-none w-full ml-2"
              value={searchContent}
              onChange={(e) => setSearchContent(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg px-3 py-2 w-full md:w-[32%] bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All Labels</option>
            <option>Normal</option>
            <option>Mildly Suspicious</option>
            <option>Highly Suspicious</option>
          </select>
        </div>

        {/* COUNT */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} of {reviews.length} reviews
        </p>

        {/* TABLE */}
        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th>User</th>
                <th>Stars</th>
                <th>Review</th>
                <th>Score</th>
                <th>Confidence</th>
                <th>Label</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => {
                const label = getLabel(r.hybrid_label);

                return (
                  <Fragment key={r._id}>
                    {/* MAIN ROW */}
                    <tr
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        setExpandedRow(
                          expandedRow === r._id ? null : r._id
                        )
                      }
                    >
                      <td className="p-3">{r._id.slice(-6)}</td>
                      <td>{r.user?.name}</td>
                      <td>{"⭐".repeat(r.rating)}</td>

                      <td className="truncate max-w-xs">
                        {r.content}
                      </td>

                      <td>{r.aiScore?.toFixed(2)}</td>

                      <td
                        className={`font-semibold ${getConfidenceColor(
                          r.confidence
                        )}`}
                      >
                        {r.confidence?.toFixed(0)}%
                      </td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeStyle(
                            label
                          )}`}
                        >
                          {label}
                        </span>
                      </td>

                      <td>{r.status}</td>
                    </tr>

                    {/* 🔥 EXPAND ROW */}
                    {expandedRow === r._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={8} className="p-4">
                          <div className="bg-white border rounded-xl p-4 shadow-md">

                            <h3 className="font-semibold text-purple-600 mb-3">
                              AI Insights
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">

                              <p>
                                <strong>Model Confidence:</strong>{" "}
                                {r.model_confidence?.toFixed(0)}%
                              </p>

                              <p>
                                <strong>Rule Confidence:</strong>{" "}
                                {r.rule_confidence?.toFixed(0)}%
                              </p>

                              <p>
                                <strong>Agentic Action:</strong>{" "}
                                {r.status}
                              </p>

                              <p>
                                <strong>Recommendation:</strong>{" "}
                                {getRecommendation(r.hybrid_label)}
                              </p>

                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}