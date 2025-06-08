// src/pages/public/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { FiLoader, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import TrajetCard from '../../components/public/TrajetCard.jsx';
import { Button } from '../../components/ui/Button.jsx'; // <-- LIGNE À AJOUTER

const LIMIT = 15;

const SearchPage = () => {
  const [filters, setFilters] = useState({ departure: '', arrival: '', date: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trajets, setTrajets] = useState([]);
  const [allVilles, setAllVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Lancement de la recherche de trajets avec les filtres :", filters, "et la page :", page);
    setLoading(true);
    setError(null);
    
    const params = {
      villeDepart: filters.departure || undefined,
      villeArrivee: filters.arrival || undefined,
      date: filters.date || undefined,
      page,
      limit: LIMIT,
    };

    api.get('/public/trajets/search', { params })
      .then(({ data }) => {
        console.log("Données reçues du backend :", data);
        setTrajets(data.docs || []);
        setTotalPages(data.pages || 1);

        if (page === 1) {
            const villes = new Set();
            (data.docs || []).forEach(t => {
                if(t.villeDepart) villes.add(t.villeDepart);
                if(t.villeArrivee) villes.add(t.villeArrivee);
            });
            setAllVilles(Array.from(villes).sort());
        }
      })
      .catch(err => {
        console.error("Erreur API dans SearchPage:", err);
        setError(err.response?.data?.message || "Une erreur est survenue lors de la recherche.")
      })
      .finally(() => setLoading(false));

  }, [filters, page]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ departure: '', arrival: '', date: '' });
    setPage(1);
  };

  const handleReserve = (id) => navigate(`/reservation/${id}`);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <section className="relative bg-[url('/assets/search-bg.webp')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <h1 className="text-4xl font-playfair font-bold mb-8 text-center">Trouvez votre trajet</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/20 backdrop-blur-xl p-6 rounded-2xl border border-white/30 shadow-lg">
            <select name="departure" value={filters.departure} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg bg-white/80 border border-gray-200 focus:ring-2 focus:ring-pink-500">
              <option value="">Ville de Départ</option>
              {allVilles.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select name="arrival" value={filters.arrival} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg bg-white/80 border border-gray-200 focus:ring-2 focus:ring-pink-500">
              <option value="">Ville d'Arrivée</option>
              {allVilles.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-lg bg-white/80 border border-gray-200 focus:ring-2 focus:ring-pink-500" />
            <Button onClick={handleReset} className="w-full py-3">Réinitialiser</Button>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
        {loading ? (
          <div className="flex justify-center mt-20"><FiLoader className="animate-spin text-4xl text-pink-500" /></div>
        ) : error ? (
          <div className="text-center space-y-4 text-red-500 bg-red-50 p-6 rounded-lg">
            <p><strong>Erreur :</strong> {error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        ) : trajets.length === 0 ? (
          <div className="text-center text-gray-500 bg-gray-100 p-8 rounded-lg">
            <FiSearch className="mx-auto text-5xl mb-4" />
            <p>Aucun trajet ne correspond à votre recherche.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {trajets.map(t => (
                <TrajetCard key={t._id} trajet={t} onReserve={() => handleReserve(t._id)} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`px-4 py-2 rounded-full border text-sm font-medium ${p === page ? 'bg-gradient-to-r from-pink-500 to-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
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