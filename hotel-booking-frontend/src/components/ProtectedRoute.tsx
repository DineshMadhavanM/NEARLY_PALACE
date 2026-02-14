import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
    children: React.ReactNode;
    allowedRoles?: string[];
    allowedEmails?: string[];
}

const ProtectedRoute = ({ children, allowedRoles, allowedEmails }: Props) => {
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

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const userRole = (user?.publicMetadata?.role as string) || "user";
    const isAdminEmail = userEmail === "kit27.ad17@gmail.com";

    // Handle email-based access (strict)
    if (allowedEmails && allowedEmails.length > 0) {
        const hasRequiredEmail = allowedEmails.includes(userEmail || "");
        if (!hasRequiredEmail) {
            return <Navigate to="/" replace />;
        }
    }

    // Handle role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.includes(userRole);

        if (!hasRequiredRole && !isAdminEmail) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
