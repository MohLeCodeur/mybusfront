// src/components/admin/Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiMap, FiPackage, FiBarChart2, FiLogOut } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa'; // <<< LIGNE CORRIGÉE/AJOUTÉE
import AuthContext from '../../context/AuthContext';

const navLinks = [
  { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/admin/bus', icon: <FaBus />, label: 'Gestion des Bus' }, // <<< LIGNE CORRIGÉE
  { to: '/admin/chauffeurs', icon: <FiUsers />, label: 'Chauffeurs' },
  { to: '/admin/trajets', icon: <FiMap />, label: 'Trajets' },
  { to: '/admin/reservations', icon: <FiPackage />, label: 'Réservations' },
  { to: '/admin/colis', icon: <FiPackage />, label: 'Colis' },
  { to: '/admin/stats', icon: <FiBarChart2 />, label: 'Statistiques' },
];

const SidebarLink = ({ to, icon, label }) => {
  const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors";
  const inactiveClasses = "text-gray-600 hover:bg-gray-200 hover:text-gray-900";
  const activeClasses = "bg-blue-600 text-white shadow-lg";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      {label}
    </NavLink>
  );
};

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <aside className="w-64 bg-white h-screen shadow-lg flex flex-col sticky top-0">
      <div className="p-6 border-b">
        <NavLink to="/" className="flex items-center gap-2">
            <img src="/assets/mybus.webp" alt="MyBus Logo" className="h-15 w-auto" />
        </NavLink>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map(link => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="p-4 rounded-lg bg-gray-100">
            <p className="text-sm font-semibold">{user?.prenom} {user?.nom}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center mt-4 px-4 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-100 transition-colors"
        >
          <FiLogOut className="mr-2" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;