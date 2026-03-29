"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SubNavbar from "@/components/SubNavbar";

type User = {
  name: string;
  email: string;
};

type Review = {
  rating: number;
  hybrid_label: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH USER + REVIEWS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        // 👤 Get user
        const userRes = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userRes.data);

        // 📊 Get reviews
        const reviewRes = await axios.get(
          "http://localhost:5000/api/reviews",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReviews(reviewRes.data.reviews);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 📊 CALCULATIONS
  const totalReviews = reviews.length;

  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  const suspiciousCount = reviews.filter(
    (r) => r.hybrid_label === 2
  ).length;

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50">
        <SubNavbar />
      </div>

      <div className="pt-24 px-6 max-w-4xl mx-auto">

        {/* PROFILE CARD */}
        <div className="bg-white p-6 rounded-xl shadow border mb-6">

          <h1 className="text-2xl font-bold text-purple-600 mb-4">
            My Profile
          </h1>

          <p className="text-gray-700">
            <strong>Name:</strong> {user?.name}
          </p>

          <p className="text-gray-700 mt-2">
            <strong>Email:</strong> {user?.email}
          </p>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          <div className="p-4 bg-white rounded-xl shadow border">
            <p className="text-gray-500">Total Reviews</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalReviews}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow border">
            <p className="text-gray-500">Average Rating</p>
            <p className="text-2xl font-bold text-yellow-500">
              ⭐ {avgRating}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow border">
            <p className="text-gray-500">High Risk Reviews</p>
            <p className="text-2xl font-bold text-red-600">
              {suspiciousCount}
            </p>
          </div>

        </div>

        {/* LOGOUT */}
        <div className="bg-white p-6 rounded-xl shadow border flex justify-between items-center">

          <p className="text-gray-600">
            Want to sign out of your account?
          </p>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}