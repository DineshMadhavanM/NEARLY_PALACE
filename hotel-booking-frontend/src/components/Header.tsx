import { Link, useNavigate } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
import useSearchContext from "../hooks/useSearchContext";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import {
  FileText,
  Activity,
  BarChart3,
  Building2,
  Calendar,
  LogIn,
  UserCircle,
  ShieldAlert,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import MessagesModal from "./MessagesModal";

const Header = () => {
  const { isLoggedIn, userRole, userEmail } = useAppContext();
  const search = useSearchContext();
  const navigate = useNavigate();
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const { data: unreadCount } = useQuery(
    "fetchUnreadCount",
    apiClient.fetchUnreadCount,
    {
      enabled: isLoggedIn,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const handleLogoClick = () => {
    // Clear search context when going to home page
    search.clearSearchValues();
    navigate("/");
  };

  return (
    <>
      {/* Development Banner */}
      {/* {!import.meta.env.PROD && (
        <div className="bg-yellow-500 text-black text-center py-1 text-xs font-medium">
          🚧 Development Mode - Auth state persists between sessions
        </div>
      )} */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 shadow-luxury sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group"
            >
              <div className="bg-gradient-to-br from-white/20 to-white/10 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 backdrop-blur-sm border border-white/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight group-hover:text-amber-100 transition-all duration-300 drop-shadow-sm">
                Nearly Palace
              </span>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <SignedIn>
                <>
                  {/* Analytics Dashboard Link - Only for owners and admins */}
                  {(userRole === "hotel_owner" || userRole === "admin") && (
                    <Link
                      className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group"
                      to="/analytics"
                    >
                      <BarChart3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Analytics
                    </Link>
                  )}

                  {/* My Bookings Link - For normal users and admins, but not hotel owners */}
                  {(userRole === "user" || userRole === "admin") && (
                    <Link
                      className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group"
                      to="/my-bookings"
                    >
                      <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      My Bookings
                    </Link>
                  )}

                  {/* My Hotels Link - Only for owners and admins */}
                  {(userRole === "hotel_owner" || userRole === "admin") && (
                    <Link
                      className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group"
                      to="/my-hotels"
                    >
                      <Building2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      My Hotels
                    </Link>
                  )}

                  {/* API Documentation Link - Only for specific admin */}
                  {userEmail === "kit27.ad17@gmail.com" && (
                    <>
                      <Link
                        className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group"
                        to="/api-docs"
                      >
                        <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        API Docs
                      </Link>

                      {/* API Status Link */}
                      <Link
                        className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group"
                        to="/api-status"
                      >
                        <Activity className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        API Status
                      </Link>

                      {/* Admin Link */}
                      <Link
                        className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group"
                        to="/admin"
                      >
                        <ShieldAlert className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Admin
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => setIsMessagesOpen(true)}
                    className="relative flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group"
                  >
                    <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Messages
                    {unreadCount && unreadCount.count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount.count}
                      </span>
                    )}
                  </button>

                  <Link
                    to="/profile"
                    className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group"
                  >
                    <UserCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Profile
                  </Link>

                  <div className="flex items-center ml-2 border-l border-white/20 pl-4">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 hover:shadow-medium transition-all duration-200 group">
                    <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Modal */}
      <MessagesModal isOpen={isMessagesOpen} onClose={() => setIsMessagesOpen(false)} />
    </>
  );
};

export default Header;
