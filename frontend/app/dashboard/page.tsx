"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SubNavbar from "@/components/SubNavbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    normal: 0,
    mild: 0,
    high: 0,
    total: 0,
  });

  // 🔥 Fetch Reviews
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.reviews;
      setReviews(data);

      console.log("ALL REVIEWS:", data.length);
    console.log(
      "WITH HYBRID:",
      data.filter((r: any) => r.hybrid_label !== undefined).length
    );

    // 🔥 HYBRID LABEL COUNTS
let normal = 0,
  mild = 0,
  high = 0;

data.forEach((r: any) => {
  if (r.hybrid_label === 0) normal++;
  else if (r.hybrid_label === 1) mild++;
  else if (r.hybrid_label === 2) high++;
});

console.log("=== HYBRID LABEL COUNTS ===");
console.log("Normal:", normal);
console.log("Mild:", mild);
console.log("High:", high);

// 🔥 AI SCORE DISTRIBUTION (BAR LOGIC)
console.log("=== AI SCORE DISTRIBUTION ===");

const ranges = [
  { min: 0.0, max: 0.2 },
  { min: 0.2, max: 0.4 },
  { min: 0.4, max: 0.6 },
  { min: 0.6, max: 0.8 },
  { min: 0.8, max: 1.0 },
];

ranges.forEach((range) => {
  const count = data.filter(
    (r: any) => r.aiScore >= range.min && r.aiScore < range.max
  ).length;

  console.log(`${range.min}-${range.max}:`, count);
});

      normal = 0,
        mild = 0,
        high = 0;

      data.forEach((r: any) => {
        if (r.hybrid_label === 0) normal++;
        else if (r.hybrid_label === 1) mild++;
        else if (r.hybrid_label === 2) high++;
      });

      setStats({ normal, mild, high, total: data.length });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  // 📊 BAR DATA (ALL RANGES)
  const getBarData = (reviews: any[]) => {
  const ranges = [
    { min: 0.0, max: 0.2, label: "Low Risk", color: "#22c55e" },
    { min: 0.2, max: 0.4, label: "Low Risk", color: "#4ade80" },
    { min: 0.4, max: 0.6, label: "Moderate Risk", color: "#facc15" },
    { min: 0.6, max: 0.8, label: "High Risk", color: "#fb923c" },
    { min: 0.8, max: 1.0, label: "Very High Risk", color: "#ef4444" },
  ];

  return ranges.map((range, i) => {
    const count = reviews.filter((r) => {
      const score = Number(r.hybrid_score); // 🔥 force number

      if (isNaN(score)) return false; // skip invalid

      // 🔥 include last range properly
      if (i === ranges.length - 1) {
        return score >= range.min && score <= range.max;
      }

      return score >= range.min && score < range.max;
    }).length;

    console.log(`Range ${range.min}-${range.max}:`, count); // 🔥 debug

    return {
      range: `${range.min}-${range.max}`,
      count,
      label: range.label,
      color: range.color,
    };
  });
};

  // 🎯 TOOLTIP
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white p-3 rounded-lg shadow border text-sm">
          <p className="font-semibold">{data.range}</p>
          <p>Count: {data.count}</p>
          <p className="text-gray-500">{data.label}</p>
        </div>
      );
    }
    return null;
  };

  const barData = getBarData(reviews);

  // 🥧 PIE DATA
  const pieData = [
    { name: "Normal", value: stats.normal },
    { name: "Mildly Suspicious", value: stats.mild },
    { name: "Highly Suspicious", value: stats.high },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50">
        <SubNavbar />
      </div>

      <div className="pt-24 px-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-purple-600">
            Review Analytics Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            AI-powered monitoring and analysis
          </p>
        </div>

        {/* 🔍 FILTER REVIEWS */}
        <div className="bg-white rounded-xl p-6 shadow mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Filter Reviews
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by user, business, or ID..."
              className="border rounded-lg px-4 py-2 w-full"
            />

            <select className="border rounded-lg px-4 py-2">
              <option>All Businesses</option>
              <option>BookHaven</option>
              <option>City Auto Repair</option>
              <option>Elite Dental Care</option>
              <option>FitLife Gym</option>
              <option>Luxury Spa & Wellness</option>
              <option>QuickFix Plumbing</option>
              <option>Sunset Restaurant</option>
              <option>Tech Solutions Inc</option>
              <option>The Green Café</option>
            </select>

            <select className="border rounded-lg px-4 py-2">
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Showing {reviews.length} of {stats.total} reviews
          </p>
        </div>

        {/* 📊 STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Card title="Normal Reviews" value={stats.normal} color="green" />
          <Card title="Mildly Suspicious" value={stats.mild} color="yellow" />
          <Card title="Highly Suspicious" value={stats.high} color="red" />
          <Card title="Total Reviews" value={stats.total} color="blue" />
        </div>

        {/* 📈 CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* BAR CHART */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">
              Hybrid Score Distribution
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <p className="text-sm text-gray-500 mt-4">
              Distribution of hybrid scores across all reviews (0.0 = Normal, 1.0 = Highly Suspicious)
            </p>
          </div>

          {/* PIE CHART */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">
              Review Classification
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex justify-center gap-6 mt-4 text-sm">
              <span className="text-green-500">■ Normal</span>
              <span className="text-yellow-500">■ Mildly Suspicious</span>
              <span className="text-red-500">■ Highly Suspicious</span>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Percentage breakdown of review classifications by AI analysis
            </p>
          </div>

        </div>

        {/* 📌 SYSTEM INSIGHTS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-6">
            System Insights
          </h3>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <p className="text-2xl font-bold text-green-600">
                {Math.round((stats.normal / stats.total) * 100)}%
              </p>
              <p className="text-gray-700 font-medium mt-1">
                Approval Rate
              </p>
              <p className="text-sm text-gray-500">
                Reviews classified as normal
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
              <p className="text-2xl font-bold text-red-600">
                {Math.round((stats.high / stats.total) * 100)}%
              </p>
              <p className="text-gray-700 font-medium mt-1">
                High Risk Reviews
              </p>
              <p className="text-sm text-gray-500">
                Require immediate attention
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-2xl font-bold text-blue-600">
                {stats.total}
              </p>
              <p className="text-gray-700 font-medium mt-1">
                Reviews Analyzed
              </p>
              <p className="text-sm text-gray-500">
                Total in current filter
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

/* 🔹 COMPONENTS */

function Card({ title, value, color }: any) {
  const colors: any = {
    green: "bg-green-100 border-green-300",
    yellow: "bg-yellow-100 border-yellow-300",
    red: "bg-red-100 border-red-300",
    blue: "bg-blue-100 border-blue-300",
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color]}`}>
      <h3 className="text-gray-700">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}