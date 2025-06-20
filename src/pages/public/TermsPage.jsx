// src/pages/public/TermsPage.jsx

import React from 'react';

const TermsPage = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-lg prose-blue">
        <h1>Conditions Générales d'Utilisation (CGU)</h1>
        <p className="text-sm text-gray-500">Dernière mise à jour : 24/05/2024</p>
        
        <h2>1. Objet</h2>
        <p>Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation de la plateforme MyBus, qui permet la réservation de billets de transport, le suivi de bus et la gestion de colis au Mali. L'utilisation de nos services implique l'acceptation pleine et entière de ces CGU.</p>

        <h2>2. Services Proposés</h2>
        <p>MyBus offre les fonctionnalités suivantes :</p>
        <ul>
          <li><strong>Réservation de billets :</strong> Recherche de trajets, sélection et paiement en ligne via des services de paiement mobile partenaires (VitePay, Orange Money, etc.).</li>
          <li><strong>Suivi de trajet :</strong> Visualisation en temps réel de la position GPS des bus pour les trajets réservés.</li>
          <li><strong>Gestion de colis :</strong> Enregistrement, paiement et suivi du statut des colis expédiés via notre réseau.</li>
          <li><strong>Compte utilisateur :</strong> Gestion des informations personnelles, historique des réservations et des colis.</li>
        </ul>

        <h2>3. Accès et Compte Utilisateur</h2>
        <p>L'accès à certains services nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de son mot de passe. L'utilisateur est seul responsable de toute activité effectuée depuis son compte. Tout compte utilisant une adresse email se terminant par "@admin.ml" sera considéré comme un compte Administrateur, soumis à vérification.</p>

        <h2>4. Réservations et Paiements</h2>
        <p>Toute réservation effectuée sur la plateforme est soumise à la disponibilité des places. La confirmation d'une réservation n'est effective qu'après la validation du paiement. En cas d'échec du paiement, la réservation est automatiquement annulée et les places sont remises en vente. Les conditions d'annulation et de remboursement sont définies par chaque compagnie de transport partenaire et doivent être consultées avant l'achat.</p>
        
        <h2>5. Suivi des Colis</h2>
        <p>MyBus fournit un code de suivi unique pour chaque colis enregistré. Ce code permet de suivre l'état du colis ("enregistré", "en cours", "arrivé"). MyBus s'engage à mettre en œuvre les moyens nécessaires pour assurer la traçabilité mais ne pourra être tenu responsable en cas de perte ou de dommage du contenu, qui relève de la responsabilité de la compagnie de transport.</p>

        <h2>6. Responsabilités</h2>
        <p>MyBus agit en tant qu'intermédiaire technologique. Nous ne sommes pas une compagnie de transport. La ponctualité des bus, la sécurité des passagers et l'intégrité des colis relèvent de la responsabilité exclusive des compagnies de transport partenaires. Notre responsabilité se limite à la fourniture et au bon fonctionnement de la plateforme numérique.</p>

        <h2>7. Protection des Données Personnelles</h2>
        <p>Nous nous engageons à protéger vos données personnelles. Pour plus de détails sur la collecte et l'utilisation de vos données, veuillez consulter notre <a href="/privacy">Politique de Confidentialité</a>.</p>

        <h2>8. Modifications des CGU</h2>
        <p>MyBus se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle. L'utilisation continue du service après modification vaut acceptation des nouvelles conditions.</p>
        
        <h2>9. Contact</h2>
        <p>Pour toute question relative à ces conditions, vous pouvez nous contacter à l'adresse support@mybus.ml.</p>
      </div>
    </div>
  );
};

export default TermsPage;