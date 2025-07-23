// src/pages/auth/RegisterPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; // Pour de belles animations
// On importe plus d'icônes
import { FiUserPlus, FiLoader, FiEye, FiEyeOff, FiXCircle, FiCheckCircle } from 'react-icons/fi';

// ====================================================================
// NOUVEAU : Composant pour une seule règle de validation
// ====================================================================
const ValidationCriteria = ({ isValid, text }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-2 text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}
        >
            {isValid ? <FiCheckCircle className="shrink-0" /> : <FiXCircle className="shrink-0" />}
            <span>{text}</span>
        </motion.div>
    );
};


const RegisterPage = () => {
    const [formData, setFormData] = useState({
        prenom: '', nom: '', email: '', telephone: '',
        mot_de_passe: '', confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // ====================================================================
    // NOUVEAU : États pour la visibilité et la validation du mot de passe
    // ====================================================================
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // État pour suivre chaque critère de validation
    const [validation, setValidation] = useState({
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        passwordsMatch: false,
    });
    // ====================================================================

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // ====================================================================
    // NOUVEAU : useEffect pour valider le mot de passe en temps réel
    // ====================================================================
    useEffect(() => {
        const { mot_de_passe, confirmPassword } = formData;
        setValidation({
            minLength: mot_de_passe.length >= 8,
            hasUpper: /[A-Z]/.test(mot_de_passe),
            hasLower: /[a-z]/.test(mot_de_passe),
            hasNumber: /[0-9]/.test(mot_de_passe),
            passwordsMatch: mot_de_passe !== '' && mot_de_passe === confirmPassword,
        });
    }, [formData.mot_de_passe, formData.confirmPassword]);
    // ====================================================================

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // On vérifie que tous les critères sont valides avant d'envoyer
        const allValid = Object.values(validation).every(v => v === true);
        if (!allValid) {
            setError("Veuillez vous assurer que votre mot de passe respecte tous les critères.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            await register({
                prenom: formData.prenom,
                nom: formData.nom,
                email: formData.email,
                telephone: formData.telephone,
                mot_de_passe: formData.mot_de_passe
            });
            
            navigate('/login', { 
                replace: true, 
                state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' } 
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-blue-50 to-white">
            <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8 font-playfair">
                    Créer un compte
                </h2>
                
                {error && <p className="text-red-600 bg-red-50 text-center p-3 rounded-lg mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"/>
                        <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone (8 chiffres)" className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                    
                    {/* --- CHAMP MOT DE PASSE MODIFIÉ --- */}
                    <div className="relative">
                        <input 
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="mot_de_passe" 
                            value={formData.mot_de_passe} 
                            onChange={handleChange} 
                            onFocus={() => setIsPasswordFocused(true)} // Affiche le validateur au focus
                            placeholder="Mot de passe" 
                            required 
                            className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none pr-10" 
                        />
                        <button type="button" onClick={() => setIsPasswordVisible(prev => !prev)} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                            {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {/* ==================================================================== */}
                    {/* NOUVEAU : Bloc du validateur de mot de passe */}
                    {/* ==================================================================== */}
                    <AnimatePresence>
                        {isPasswordFocused && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-200"
                            >
                                <ValidationCriteria isValid={validation.minLength} text="Au moins 8 caractères" />
                                <ValidationCriteria isValid={validation.hasUpper} text="Une lettre majuscule" />
                                <ValidationCriteria isValid={validation.hasLower} text="Une lettre minuscule" />
                                <ValidationCriteria isValid={validation.hasNumber} text="Un chiffre" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* ==================================================================== */}

                    {/* --- CHAMP CONFIRMER MOT DE PASSE MODIFIÉ --- */}
                    <div className="relative">
                        <input 
                            type={isConfirmPasswordVisible ? 'text' : 'password'}
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="Confirmer le mot de passe" 
                            required 
                            className={`w-full border p-3 rounded-lg focus:ring-2 outline-none pr-10 ${
                                formData.confirmPassword ? (validation.passwordsMatch ? 'border-green-500 focus:ring-green-400' : 'border-red-500 focus:ring-red-400') : 'border-gray-300'
                            }`}
                        />
                         <button type="button" onClick={() => setIsConfirmPasswordVisible(prev => !prev)} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                            {isConfirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {/* Affiche un message si la confirmation est tapée mais ne correspond pas */}
                    {formData.confirmPassword && !validation.passwordsMatch && (
                        <p className="text-xs text-red-600">Les mots de passe ne correspondent pas.</p>
                    )}
          
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <><FiUserPlus className="mr-2" /> S'inscrire</>}
                    </button>
                </form>
                
                <p className="text-center text-sm text-gray-600 mt-6">
                    Déjà un compte ? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Connectez-vous</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;