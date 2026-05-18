import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="notfound-page">
            <div className="notfound-container">
                <div className="notfound-pizza">🍕</div>
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">Oops! Page Nahi Mila</h2>
                <p className="notfound-sub">
                    Lagta hai yeh page kisi ne kha liya... <br />
                    Ya shayad kabhi tha hi nahi! 😅
                </p>
                <div className="notfound-btns">
                    <button
                        className="btn-primary"
                        onClick={() => navigate(user ? '/home' : '/')}
                    >
                        🏠 Ghar Wapas Jao
                    </button>
                    <button
                        className="btn-outline"
                        onClick={() => navigate(-1)}
                    >
                        ← Peeche Jao
                    </button>
                </div>
            </div>
        </div>
    );
}