// src/pages/auth/LoginPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
// NOUVEAU : On importe les icônes d'œil
import { FiLogIn, FiLoader, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaUserAlt, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // NOUVEAU : État pour gérer la visibilité du mot de passe
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const successMessageFromState = location.state?.message;
  const [successMessage, setSuccessMessage] = useState(successMessageFromState);
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, location.pathname, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  // NOUVEAU : Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8 font-playfair">Connexion</h2>
        
        {successMessage && (
            <div className="text-green-700 bg-green-50 text-center p-3 rounded-lg mb-4 flex items-center justify-center gap-2">
                <FiCheckCircle /> {successMessage}
            </div>
        )}
        {error && <p className="text-red-500 bg-red-50 text-center p-3 rounded-lg mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-pink-400">
              <FaUserAlt className="text-gray-400 mr-2" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required className="w-full outline-none text-gray-800 bg-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Mot de passe</label>
            {/* MODIFIÉ : Le conteneur du champ de mot de passe inclut maintenant l'icône de l'œil */}
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
              <FaLock className="text-gray-400 mr-2" />
              <input 
                // MODIFIÉ : Le type est maintenant dynamique
                type={isPasswordVisible ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                className="w-full outline-none text-gray-800 bg-transparent" 
              />
              {/* NOUVEAU : Le bouton avec l'icône de l'œil */}
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Afficher ou masquer le mot de passe"
              >
                {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center disabled:opacity-50">
            {loading ? <FiLoader className="animate-spin" /> : <><FiLogIn className="mr-2" /> Se connecter</>}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Inscrivez-vous ici</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;