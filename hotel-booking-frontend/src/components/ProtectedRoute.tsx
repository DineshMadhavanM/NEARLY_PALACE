import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const location = useLocation();

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner message="Checking authentication..." />
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    // Handle role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        const userRole = (user?.publicMetadata?.role as string) || "user";

        // Grant admin access if role matches OR if user is the specific admin email
        const isAdminEmail = userEmail === "kit27.ad17@gmail.com";
        const hasRequiredRole = allowedRoles.includes(userRole);

        if (!hasRequiredRole && !isAdminEmail) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
