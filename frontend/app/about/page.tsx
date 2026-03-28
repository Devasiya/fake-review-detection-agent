"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import SubNavbar from "@/components/SubNavbar";
import { ShieldCheck, Zap, Target, Users } from "lucide-react";

export default function AboutPage() {

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50 min-h-screen">

      

      {/* 🔹 SUB NAVBAR */}
      <SubNavbar />

      {/* 🔹 CONTENT STARTS AFTER BOTH NAVBARS */}
      <div className="pt-16">

        {/* 🔹 ABOUT SECTION */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-indigo-500 text-transparent bg-clip-text">
            About Review Monitor AI
          </h1>

          <p className="text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
            Customer feedback plays a critical role in building trust between businesses and consumers.
            Our platform leverages artificial intelligence and machine learning to detect fake,
            misleading, or suspicious reviews and provide reliable insights.
          </p>

          {/* 🔸 CARDS */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm">
              <ShieldCheck className="text-blue-500 mb-3" size={32}/>
              <h3 className="text-xl font-semibold mb-2">Trust & Integrity</h3>
              <p className="text-gray-600">
                Ensuring every review is authentic and trustworthy.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl shadow-sm">
              <Zap className="text-purple-500 mb-3" size={32}/>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Using advanced AI to stay ahead of fraud patterns.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
              <Target className="text-green-500 mb-3" size={32}/>
              <h3 className="text-xl font-semibold mb-2">Accuracy</h3>
              <p className="text-gray-600">
                High precision detection with hybrid models.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm">
              <Users className="text-orange-500 mb-3" size={32}/>
              <h3 className="text-xl font-semibold mb-2">User Focus</h3>
              <p className="text-gray-600">
                Designed for simplicity and real-world usability.
              </p>
            </div>

          </div>
        </section>

        {/* 🔹 TECHNOLOGY SECTION */}
        <section id="technology" className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Our Technology</h2>

            <ul className="space-y-3 text-lg">
              <li>• Natural Language Processing (NLP)</li>
              <li>• Machine Learning Models</li>
              <li>• Rule-Based Detection</li>
              <li>• Behavioral Pattern Analysis</li>
            </ul>
          </div>
        </section>

        {/* 🔹 STATS SECTION */}
        <section id="stats" className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            Platform Statistics
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">

            <div className="bg-white shadow-md p-6 rounded-xl">
              <h3 className="text-4xl font-bold text-blue-500">98%</h3>
              <p className="text-gray-600 mt-2">Detection Accuracy</p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-xl">
              <h3 className="text-4xl font-bold text-green-500">15K+</h3>
              <p className="text-gray-600 mt-2">Reviews Analyzed</p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-xl">
              <h3 className="text-4xl font-bold text-purple-500">&lt;1s</h3>
              <p className="text-gray-600 mt-2">Avg Analysis Time</p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-xl">
              <h3 className="text-4xl font-bold text-orange-500">24/7</h3>
              <p className="text-gray-600 mt-2">Monitoring</p>
            </div>

          </div>
        </section>

        {/* 🔹 CONTACT SECTION */}
        <section id="contact" className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>

          <p className="text-gray-600 mb-6">
            Have questions or want to collaborate? Reach out to us anytime.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-lg shadow hover:opacity-90">
              Contact Us
            </button>

            <button className="border px-6 py-3 rounded-lg hover:bg-gray-100">
              Documentation
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}