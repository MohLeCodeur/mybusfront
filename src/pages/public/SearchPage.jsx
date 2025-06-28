// src/pages/public/SearchPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FiLoader, FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';
import TrajetCard from '../../components/public/TrajetCard.jsx';
import { Button } from '../../components/ui/Button.jsx';

const LIMIT = 9;
const SearchPage = () => {
  // --- "company" est retiré de l'état des filtres ---
  const [filters, setFilters] = useState({ departure: '', arrival: '', date: '', sortBy: 'date' });
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ docs: [], totalPages: 1, total: 0 });
  const [meta, setMeta] = useState({ allCities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTrajets = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = {
      villeDepart: filters.departure,
      villeArrivee: filters.arrival,
      date: filters.date,
      // --- Le paramètre "compagnie" n'est plus envoyé ---
      sortBy: filters.sortBy,
      page,
      limit: LIMIT,
    };
    api.get('/public/trajets/search', { params })
      .then(({ data }) => {
        setData({ docs: data.docs || [], totalPages: data.pages || 1, total: data.total || 0 });
        if (data.meta) { setMeta(data.meta); }
      })
      .catch(err => setError(err.response?.data?.message || "Une erreur est survenue."))
      .finally(() => setLoading(false));
  }, [filters.departure, filters.arrival, filters.date, filters.sortBy, page]);
  
  useEffect(() => {
    fetchTrajets();
  }, [fetchTrajets]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleReset = () => {
    // --- "company" est retiré du reset ---
    setFilters({ departure: '', arrival: '', date: '', sortBy: 'date' });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-white">
      <section className="sticky top-20 z-20 bg-white/90 backdrop-blur-lg shadow-md p-4">
        <div className="max-w-7xl mx-auto">
            {/* --- La grille passe à 4 colonnes et le champ compagnie est supprimé --- */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <select name="departure" value={filters.departure} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 bg-white">
                    <option value="">De (toutes villes)</option>
                    {meta.allCities.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <select name="arrival" value={filters.arrival} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 bg-white">
                    <option value="">À (toutes villes)</option>
                    {meta.allCities.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500" />
                <Button onClick={handleReset} variant="outline" className="w-full py-3 flex items-center justify-center gap-2"><FiX/> Effacer</Button>
            </div>

            <div className="lg:hidden">
                <button 
                    onClick={() => setIsMobileFiltersOpen(prev => !prev)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                    <span className="flex items-center gap-2 font-semibold text-gray-700"><FiFilter />Filtrer les résultats</span>
                    <FiChevronDown className={`transform transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isMobileFiltersOpen && (
                        <motion.div
                            key="mobile-filters"
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-gray-50 border rounded-lg space-y-4">
                                <select name="departure" value={filters.departure} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 bg-white">
                                    <option value="">De (toutes villes)</option>
                                    {meta.allCities.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                                <select name="arrival" value={filters.arrival} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg border-Ggray-300 focus:ring-2 focus:ring-pink-500 bg-white">
                                    <option value="">À (toutes villes)</option>
                                    {meta.allCities.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                                <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500" />
                                {/* --- Le champ de recherche compagnie est supprimé --- */}
                                <Button onClick={handleReset} variant="outline" className="w-full py-3 flex items-center justify-center gap-2"><FiX/> Effacer</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </section>

      {/* Section des résultats */}
      <main className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {loading ? 'Recherche...' : `${data.total} trajet${data.total > 1 ? 's' : ''} trouvé${data.total > 1 ? 's' : ''}`}
            </h2>
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="px-4 py-2 rounded-lg border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500">
                <option value="date">Trier par : Date</option>
                <option value="price_asc">Trier par : Prix (croissant)</option>
                <option value="price_desc">Trier par : Prix (décroissant)</option>
            </select>
        </div>

        {loading ? (
          <div className="flex justify-center mt-20"><FiLoader className="animate-spin text-5xl text-blue-500" /></div>
        ) : error ? (
          <div className="text-center space-y-4 text-red-600 bg-red-50 p-8 rounded-lg">
            <p><strong>Erreur :</strong> {error}</p>
            <Button onClick={fetchTrajets}>Réessayer</Button>
          </div>
        ) : data.docs.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-sm">
            <FiSearch className="mx-auto text-6xl mb-4 text-gray-300" />
            <p className="font-semibold">Aucun trajet ne correspond à votre recherche.</p>
            <p className="text-sm">Essayez de modifier ou d'effacer vos filtres.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.docs.map(t => (
                <TrajetCard key={t._id} trajet={t} onReserve={() => navigate(`/reservation/${t._id}`)} />
              ))}
            </div>
            {data.totalPages > 1 && (
              <nav className="flex justify-center mt-12 gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`h-10 w-10 flex items-center justify-center rounded-full border text-sm font-medium transition ${p === page ? 'bg-gradient-to-r from-pink-500 to-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                    {p}
                  </button>
                ))}
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage;