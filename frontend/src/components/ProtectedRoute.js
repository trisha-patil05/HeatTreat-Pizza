import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();

    // Loading ho toh wait karo
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                color: 'var(--orange)',
                fontSize: '1.2rem'
            }}>
                🍕 Loading...
            </div>
        );
    }

    // Login nahi hai toh login page pe bhejo
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admin page hai but user admin nahi hai
    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return children;
}