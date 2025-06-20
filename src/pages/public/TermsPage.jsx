// src/pages/public/TermsPage.jsx
import React from 'react';
import LegalPageLayout from '../../layouts/LegalPageLayout'; // <-- Importer le layout

const TermsPage = () => {
  return (
    <LegalPageLayout title="Conditions Générales d'Utilisation" lastUpdated="24/05/2024">
        <h2>1. Objet</h2>
        <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme MyBus. L'utilisation de nos services implique votre acceptation pleine et entière de ces CGU.</p>

        <h2>2. Services Proposés</h2>
        <p>MyBus offre une plateforme numérique pour :</p>
        <ul>
            <li>La réservation de billets de transport.</li>
            <li>Le suivi en temps réel de la position GPS des bus.</li>
            <li>La gestion et le suivi de l'expédition de colis.</li>
        </ul>

        <h2>3. Compte Utilisateur</h2>
        <p>La création d'un compte est nécessaire pour accéder à nos services. Vous vous engagez à fournir des informations exactes et à protéger la confidentialité de votre mot de passe. Vous êtes responsable de toute activité sur votre compte.</p>

        <h2>4. Réservations et Paiements</h2>
        <p>Toute réservation est soumise à la disponibilité et n'est confirmée qu'après validation du paiement via nos partenaires sécurisés. En cas d'échec du paiement, la réservation est annulée. Les politiques d'annulation sont propres à chaque compagnie de transport partenaire.</p>
        
        <h2>5. Responsabilité</h2>
        <p>MyBus agit en tant qu'intermédiaire technologique. La ponctualité, la sécurité et l'exécution du transport sont de la responsabilité exclusive de nos compagnies partenaires. Notre rôle est de garantir le bon fonctionnement de la plateforme.</p>

        <h2>6. Données Personnelles</h2>
        <p>Votre vie privée est importante. Nous collectons et utilisons vos données conformément à notre <a href="/privacy">Politique de Confidentialité</a>.</p>
        
        <h2>7. Modifications et Contact</h2>
        <p>Nous nous réservons le droit de modifier ces CGU à tout moment. Pour toute question, contactez-nous à <strong>support@mybus.ml</strong>.</p>
    </LegalPageLayout>
  );
};

export default TermsPage;