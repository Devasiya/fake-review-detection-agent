"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  ShieldCheck,
  Brain,
  BarChart3,
  Trash2,
  Lightbulb,
  Send,
  Upload,
  Cpu,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* ================= HERO ================= */}
      <section id="home" className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            AI-Powered Review Monitoring & Analysis
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Protect your business from fake reviews with intelligent monitoring.
            Our advanced AI system analyzes review patterns, detects suspicious behavior,
            and provides actionable insights.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a href="/dashboard" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold shadow">
              View Dashboard →
            </a>
            <a href="/submit" className="bg-purple-700 px-6 py-3 rounded-lg font-semibold shadow">
              Submit Review
            </a>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="min-h-screen flex flex-col justify-center bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-600 mb-12 text-lg md:text-xl">
            Everything you need to monitor, analyze, and manage reviews
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Real-time Analysis" },
              { icon: Brain, title: "Hybrid AI Scoring" },
              { icon: BarChart3, title: "Dashboard Insights" },
              { icon: Trash2, title: "Manage Reviews" },
              { icon: Lightbulb, title: "Smart Suggestions" },
              { icon: Send, title: "Easy Submission" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 
                    bg-gradient-to-r from-pink-500 to-indigo-500 text-white mx-auto">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">
                    Powerful AI-driven functionality for smarter decisions.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-white to-gray-50 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12 text-lg md:text-xl">
          Simple and effective in three steps
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-12">
          {[
            { icon: Upload, title: "Submit Reviews" },
            { icon: Cpu, title: "AI Analysis" },
            { icon: CheckCircle, title: "Take Action" },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i}>
                <div className="w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-4 
                  bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section id="cta" className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8 text-lg md:text-xl">
          Start monitoring your reviews today
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href="/dashboard" className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-lg shadow">
            Go to Dashboard
          </a>
          <a href="/reviews" className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-lg shadow">
            Browse Review
          </a>
          <a href="/submitReview" className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-lg shadow">
            Submit Review
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
