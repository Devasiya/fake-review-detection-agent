"use client";

import { useState } from "react";
import axios from "axios";
import SubNavbar from "@/components/SubNavbar";
import { useRouter } from "next/navigation"; // ✅ ADDED

export default function SubmitReviewPage() {
  const router = useRouter(); // ✅ ADDED

  const [form, setForm] = useState({
    rating: 5,
    content: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔄 HANDLE INPUT CHANGE
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⭐ HANDLE SUBMIT
  const handleSubmit = async () => {
    // ✅ FIXED VALIDATION
    if (!form.content.trim()) {
      alert("Please enter review text");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          rating: Number(form.rating),
          content: form.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ REDIRECT AFTER SUCCESS
      router.push("/reviews");

    } catch (err) {
      console.log(err);
      alert("❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50">
        <SubNavbar />
      </div>

      <div className="pt-24 px-6 max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 border">
          <h1 className="text-2xl font-bold text-purple-600">
            Submit New Review
          </h1>
          <p className="text-gray-500 mt-1">
            AI scoring will be performed automatically upon submission.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow border space-y-6">

          {/* STAR RATING */}
          <div>
            <label className="block font-medium mb-1">
              Star Rating *
            </label>
            <div className="flex items-center gap-4">
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n > 1 && "s"}
                  </option>
                ))}
              </select>

              <div className="text-yellow-500 text-lg">
                {"⭐".repeat(Number(form.rating))}
              </div>
            </div>
          </div>

          {/* REVIEW TEXT */}
          <div>
            <label className="block font-medium mb-1">
              Review Text *
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your review here..."
              className="w-full border rounded-lg px-4 py-3 h-32"
            />
            <p className="text-sm text-gray-400 mt-1">
              {form.content.length} characters
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() =>
                setForm({
                  rating: 5,
                  content: "",
                })
              }
              className="px-4 py-2 border rounded-lg"
            >
              Clear Form
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>

        {/* NOTE */}
        <div className="mt-6 p-4 bg-blue-50 border rounded-lg text-sm text-blue-700">
          <strong>Note:</strong> Upon submission, the review will be automatically analyzed by our AI system to detect fake or suspicious patterns.
        </div>

      </div>
    </div>
  );
}