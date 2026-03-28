"use client";

import { useState } from "react";
import { createReview } from "@/lib/api";

export default function SubmitPage() {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const review = {
      content,
      rating,
      cool: 0,
      useful: 0,
      funny: 0,
    };

    setLoading(true);

    try {
      const data = await createReview(review);
      setResult(data.review); // 👈 important
    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">
        Submit Review
      </h1>

      <textarea
        className="w-full border p-4 rounded mb-4"
        placeholder="Write your review..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Submit & Analyze"}
      </button>

      {result && (
        <div className="mt-6 p-6 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">
            AI Analysis Result
          </h2>

          <p><strong>Label:</strong> {result.label}</p>
          <p><strong>AI Score:</strong> {result.aiScore}</p>
          <p><strong>Status:</strong> {result.status}</p>
        </div>
      )}
    </div>
  );
}