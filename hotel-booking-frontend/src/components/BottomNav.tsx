import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Search,
    Calendar,
    Building2,
    User,
    MessageSquare
} from "lucide-react";
import useAppContext from "../hooks/useAppContext";

const BottomNav = () => {
    const { isLoggedIn, userRole } = useAppContext();
    const location = useLocation();

    if (!isLoggedIn) return null;

    const isActive = (path: string) => location.pathname === path;

    const navItemClass = (path: string) => `
    flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300
    ${isActive(path) ? "text-amber-600 scale-110" : "text-slate-400 hover:text-amber-500"}
  `;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-luxury-lg rounded-2xl h-16 flex items-center justify-around px-2 relative overflow-hidden">
                {/* Animated Active Background Indicator (Optional/Subtle) */}

                {/* Home */}
                <Link to="/" className={navItemClass("/")}>
                    <Home className={`w-5 h-5 ${isActive("/") ? "fill-amber-50" : ""}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
                </Link>

                {/* Search */}
                <Link to="/search" className={navItemClass("/search")}>
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Explore</span>
                </Link>

                {/* Dynamic: My Hotels or My Bookings */}
                {userRole === "hotel_owner" ? (
                    <Link to="/my-hotels" className={navItemClass("/my-hotels")}>
                        <Building2 className={`w-5 h-5 ${isActive("/my-hotels") ? "fill-amber-50" : ""}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Hotels</span>
                    </Link>
                ) : (
                    <Link to="/my-bookings" className={navItemClass("/my-bookings")}>
                        <Calendar className={`w-5 h-5 ${isActive("/my-bookings") ? "fill-amber-50" : ""}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Bookings</span>
                    </Link>
                )}

                {/* Messages Placeholder/Link */}
                <Link to="/profile" className={navItemClass("/profile-messages")}>
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Inbox</span>
                </Link>

                {/* Profile */}
                <Link to="/profile" className={navItemClass("/profile")}>
                    <User className={`w-5 h-5 ${isActive("/profile") ? "fill-amber-50" : ""}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Me</span>
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;
