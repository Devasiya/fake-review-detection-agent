export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 pt-16 pb-10 border-t border-gray-200">
      
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="font-bold text-lg mb-3">
            Fake<span className="text-pink-500">Detect</span>
          </h3>
          <p className="text-sm text-gray-600">
            AI-powered fake review detection platform for modern businesses.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Dashboard</li>
            <li>Submit Review</li>
            <li>Analytics</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Docs</li>
            <li>API</li>
            <li>Support</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        © 2026 FakeDetect. All rights reserved.
      </div>
    </footer>
  );
}