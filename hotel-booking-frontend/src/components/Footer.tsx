import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Crown,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200">
                Nearly Palace
              </span>
            </div>
            <p className="text-amber-100/80 leading-relaxed font-medium">
              Experience luxury accommodations worldwide. Your gateway to unforgettable stays in the finest hotels and resorts.
            </p>
            <div className="flex items-center gap-2 text-amber-300">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-semibold">Premium Booking Experience</span>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-amber-400 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <Facebook className="w-5 h-5 text-amber-200 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-amber-400 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <Twitter className="w-5 h-5 text-amber-200 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-amber-400 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <Instagram className="w-5 h-5 text-amber-200 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-amber-400 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <Linkedin className="w-5 h-5 text-amber-200 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/search"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Hotels
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Booking Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100/80 hover:text-amber-200 transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></span>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400 transition-colors">
                  <Mail className="w-5 h-5 text-amber-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1">Email</p>
                  <span className="text-amber-100/90 font-medium">support@nearlypalace.com</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400 transition-colors">
                  <Phone className="w-5 h-5 text-amber-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1">Phone</p>
                  <span className="text-amber-100/90 font-medium">+1 (555) 123-4567</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400 transition-colors">
                  <MapPin className="w-5 h-5 text-amber-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1">Address</p>
                  <span className="text-amber-100/90 font-medium">
                    123 Luxury Lane, Palace District
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-400/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-amber-100/70 text-sm font-medium flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            © 2025 Nearly Palace. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="text-amber-100/70 hover:text-amber-200 text-sm transition-colors font-medium"
            >
              Privacy Policy
            </a>
            <span className="text-amber-400/30">•</span>
            <a
              href="#"
              className="text-amber-100/70 hover:text-amber-200 text-sm transition-colors font-medium"
            >
              Terms of Service
            </a>
            <span className="text-amber-400/30">•</span>
            <a
              href="#"
              className="text-amber-100/70 hover:text-amber-200 text-sm transition-colors font-medium"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
