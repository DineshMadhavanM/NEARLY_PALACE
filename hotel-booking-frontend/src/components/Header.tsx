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
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: unreadCount } = useQuery(
    "fetchUnreadCount",
    apiClient.fetchUnreadCount,
    {
      enabled: isLoggedIn,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const handleLogoClick = () => {
    search.clearSearchValues();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    const linkClass = mobile
      ? "flex items-center text-slate-700 hover:text-primary-600 px-4 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 group"
      : "flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200 group";

    const iconClass = "w-5 h-5 mr-3 group-hover:scale-110 transition-transform";

    return (
      <>
        {/* Analytics Dashboard Link */}
        {(userRole === "hotel_owner" || userRole === "admin") && (
          <Link className={linkClass} to="/analytics" onClick={() => setIsMobileMenuOpen(false)}>
            <BarChart3 className={mobile ? iconClass : "w-4 h-4 mr-2 group-hover:scale-110 transition-transform"} />
            Analytics
          </Link>
        )}

        {/* My Bookings Link */}
        {(userRole === "user" || userRole === "admin") && (
          <Link className={linkClass} to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)}>
            <Calendar className={mobile ? iconClass : "w-4 h-4 mr-2 group-hover:scale-110 transition-transform"} />
            My Bookings
          </Link>
        )}

        {/* My Hotels Link */}
        {(userRole === "hotel_owner" || userRole === "admin") && (
          <Link className={linkClass} to="/my-hotels" onClick={() => setIsMobileMenuOpen(false)}>
            <Building2 className={mobile ? iconClass : "w-4 h-4 mr-2 group-hover:scale-110 transition-transform"} />
            My Hotels
          </Link>
        )}

        {/* Admin Secret Links */}
        {userEmail === "kit27.ad17@gmail.com" && (
          <>
            <Link className={linkClass} to="/api-docs" onClick={() => setIsMobileMenuOpen(false)}>
              <FileText className={mobile ? iconClass : "w-4 h-4 mr-2 group-hover:scale-110 transition-transform"} />
              API Docs
            </Link>
            <Link className={linkClass} to="/api-status" onClick={() => setIsMobileMenuOpen(false)}>
              <Activity className={mobile ? iconClass : "w-4 h-4 mr-2 group-hover:scale-110 transition-transform"} />
              API Status
            </Link>
            <Link className={linkClass} to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
              <ShieldAlert className={mobile ? iconClass : "w-4 h-4 mr-2 group-hover:scale-110 transition-transform"} />
              Admin
            </Link>
          </>
        )}

        {/* Messages */}
        <button
          onClick={() => {
            setIsMessagesOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className={`relative ${linkClass}`}
        >
          <Mail className={mobile ? iconClass : "w-4 h-4 mr-2 group-hover:scale-110 transition-transform"} />
          Messages
          {unreadCount && unreadCount.count > 0 && (
            <span className={`${mobile ? "ml-auto" : "absolute -top-1 -right-1"} bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse`}>
              {unreadCount.count}
            </span>
          )}
        </button>

        {/* Profile Link */}
        <Link className={linkClass} to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
          <UserCircle className={mobile ? iconClass : "w-4 h-4 mr-2 group-hover:scale-110 transition-transform"} />
          Profile
        </Link>
      </>
    );
  };

  return (
    <>
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 shadow-luxury sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <button onClick={handleLogoClick} className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-white/20 to-white/10 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 backdrop-blur-sm border border-white/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-amber-100 transition-all duration-300 drop-shadow-sm">
                Nearly Palace
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <SignedIn>
                <NavLinks />
                <div className="flex items-center ml-2 border-l border-white/20 pl-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
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

            {/* Mobile Header Icons */}
            <div className="flex items-center space-x-2 md:hidden">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Menu Content */}
            <nav className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-slate-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-2">
                <SignedIn>
                  <NavLinks mobile />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="flex items-center w-full bg-primary-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all duration-200 group">
                      <LogIn className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      Sign In to Account
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>

              <div className="mt-auto pt-10 border-t border-slate-100">
                <p className="text-center text-xs text-slate-400 font-medium">
                  © 2026 Nearly Palace Luxury Hotels.
                  <br /> All rights reserved.
                </p>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Messages Modal */}
      <MessagesModal isOpen={isMessagesOpen} onClose={() => setIsMessagesOpen(false)} />
    </>
  );
};

export default Header;
