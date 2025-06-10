// src/pages/public/ConfirmationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import { FiCheck, FiDownload, FiCalendar, FiClock, FiUsers, FiLoader, FiMapPin } from 'react-icons/fi';
import { FaTicketAlt, FaBus } from 'react-icons/fa';
import { toPng } from 'html-to-image'; // On utilise une bibliothèque plus moderne et fiable
import { jsPDF } from 'jspdf';

const ConfirmationPage = () => {
  const { id: reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    api.get(`/reservations/${reservationId}`)
      .then(res => setReservation(res.data))
      .catch(err => setError(err.response?.data?.message || 'Réservation introuvable.'))
      .finally(() => setLoading(false));
  }, [reservationId]);

  const handleDownloadTicket = async () => {
    if (!ticketRef.current || downloading) return;
    setDownloading(true);
    try {
        // Utilisation de html-to-image, plus robuste
        const dataUrl = await toPng(ticketRef.current, { 
            quality: 0.95,
            pixelRatio: 2, // Augmente la résolution pour une meilleure qualité
            backgroundColor: 'white'
        });
        
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Obtenir les dimensions de l'image pour le ratio
        const img = new Image();
        img.src = dataUrl;
        await new Promise(resolve => { img.onload = resolve; });

        const imgWidth = pdfWidth - 20; // Laisse 10mm de marge de chaque côté
        const imgHeight = (img.height * imgWidth) / img.width;
        
        // Centrer l'image sur la page
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2 > 10 ? (pdfHeight - imgHeight) / 2 : 10;
        
        pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`MyBus-Ticket-${reservationId}.pdf`);

    } catch (err) {
      console.error('Erreur PDF:', err);
      alert("Une erreur est survenue lors de la création du PDF.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><FiLoader className="text-5xl text-pink-500 animate-spin" /></div>;
  if (error || !reservation) return <div className="min-h-screen flex items-center justify-center text-center p-4"><div className="bg-white p-8 rounded-2xl shadow-xl max-w-md"><h1 className="text-2xl font-bold mb-4 text-red-600">Erreur</h1><p className="text-gray-600 mb-6">{error}</p><Link to="/" className="text-blue-600">Retour</Link></div></div>;
  
  const formattedDate = new Date(reservation.trajet.dateDepart).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  return (
    <main className="py-16 px-4 min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"><FiCheck className="text-4xl text-green-500" /></div>
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600">Réservation confirmée !</h1>
          <p className="text-gray-600">Votre paiement a été effectué avec succès.</p>
          
          {/* --- NOUVEAU MESSAGE DE SUIVI --- */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg max-w-lg mx-auto text-left">
              <div className="flex items-center gap-3">
                  <FiMapPin className="text-2xl"/>
                  <div>
                      <h4 className="font-bold">Suivi en temps réel</h4>
                      <p className="text-sm">Vous pourrez suivre votre bus en direct depuis votre <Link to="/dashboard" className="font-semibold underline hover:text-blue-600">espace "Mon Compte"</Link> une fois l'heure de départ atteinte.</p>
                  </div>
              </div>
          </div>
        </div>

        {/* --- TICKET AMÉLIORÉ --- */}
        <div ref={ticketRef} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 relative mx-auto max-w-2xl">
          <div className="bg-gradient-to-r from-pink-500 to-blue-600 py-6 px-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">MyBus</h2>
                <p className="text-sm font-medium opacity-90">E-Ticket de Voyage</p>
              </div>
              <FaTicketAlt className="text-4xl opacity-80" />
          </div>
          <div className="p-8">
            <div className="border-t-2 border-dashed border-gray-200 relative -mx-8 mb-8"><div className="absolute -left-3 -top-2.5 h-5 w-5 rounded-full bg-white"></div><div className="absolute -right-3 -top-2.5 h-5 w-5 rounded-full bg-white"></div></div>
            <div className="mb-8 text-center"><span className="text-sm text-gray-500">N° de Réservation</span><h3 className="text-xl font-bold text-gray-800">{reservation._id}</h3></div>
            
            <div className="flex justify-between items-center mb-8">
                <div className="text-center w-1/3"><div className="text-sm text-gray-500">Départ</div><div className="text-xl font-bold">{reservation.trajet.villeDepart}</div></div>
                <div className="w-1/3 flex justify-center text-blue-500"><FaBus className="text-3xl"/></div>
                <div className="text-center w-1/3"><div className="text-sm text-gray-500">Arrivée</div><div className="text-xl font-bold">{reservation.trajet.villeArrivee}</div></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3"><div className="bg-pink-100 p-3 rounded-full"><FiCalendar className="text-pink-500"/></div><div><div className="text-sm text-gray-500">Date</div><div className="font-medium">{formattedDate}</div></div></div>
              <div className="flex items-center gap-3"><div className="bg-blue-100 p-3 rounded-full"><FiClock className="text-blue-500"/></div><div><div className="text-sm text-gray-500">Heure</div><div className="font-medium">{reservation.trajet.heureDepart}</div></div></div>
            </div>
            
            <div className="mb-8">
              <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3"><FiUsers /> Passager(s) ({reservation.placesReservees})</h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                {reservation.passagers.map((p, index) => <p key={index} className="font-medium">{p.prenom} {p.nom}</p>)}
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t pt-6">
              <div className="text-lg font-medium">Total Payé</div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600">
                {(reservation.trajet.prix * reservation.placesReservees).toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button onClick={handleDownloadTicket} disabled={downloading} className="px-8 py-3 rounded-full font-semibold text-white flex items-center justify-center gap-2 mx-auto transition bg-gradient-to-r from-pink-500 to-blue-600 hover:brightness-105 active:scale-95 disabled:bg-gray-400">
            {downloading ? <><FiLoader className="animate-spin" /> Génération...</> : <><FiDownload /> Télécharger le billet</>}
          </button>
        </div>
      </div>
    </main>
  );
};
export default ConfirmationPage;