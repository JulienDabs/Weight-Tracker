import React from 'react';

const TC: React.FC = () => {
    return (
        <div style={{ padding: '20px'}}>
            <h1>Politique de Traitement des Données Personnelles</h1>
            <p>
                Chez <strong>Better Me</strong>, la protection de vos données personnelles est une priorité absolue. 
                Nous nous engageons à respecter la <strong>Réglementation Générale sur la Protection des Données (RGPD)</strong> 
                (Règlement UE 2016/679) en assurant la transparence, la sécurité et le respect de vos droits en matière de traitement des données.
            </p>
            
            <h2>1. Responsable du traitement des données</h2>
            <p>
                Better Me est le responsable du traitement des données. Pour toute question relative à vos données personnelles 
                ou à leur utilisation, vous pouvez nous contacter à l’adresse suivante : <strong>rgpd@betterme.com</strong>. 0
            </p>
            
            <h2>2. Types de données collectées</h2>
            <ul>
                <li><strong>Données d’identification :</strong> Nom, prénom, adresse e-mail.</li>
                <li><strong>Données biométriques :</strong> Taille, poids, IMC (indice de masse corporelle), rythme cardiaque, pression artérielle, tour de taille, hanche, poitrine et cuisse.</li>
                <li><strong>Données de progression :</strong> Objectifs de poids, historique des mesures, activités physiques.</li>
                <li><strong>Données d’activité :</strong> Fréquence d’utilisation de l’application.</li>
            </ul>
            <p>
                Toutes ces données sont collectées exclusivement dans le cadre de la gestion de votre suivi de poids et d’objectifs personnels.
            </p>
            
            <h2>3. Finalités du traitement</h2>
            <p>Les données personnelles collectées sont utilisées pour :</p>
            <ol>
                <li>Vous fournir une expérience personnalisée sur l’application.</li>
                <li>Calculer et afficher des indicateurs comme l’IMC ou le nombre de semaines nécessaires pour atteindre vos objectifs.</li>
                <li>Envoyer des rappels hebdomadaires (si activé).</li>
                <li>Améliorer l’application grâce à des analyses anonymisées.</li>
            </ol>

            <h2>4. Durée de conservation des données</h2>
            <p>
                Conformément au principe de limitation de la durée de conservation des données prévu par le RGPD, 
                vos données personnelles sont conservées pendant une durée maximale d’un an à compter de votre dernière activité sur l’application.
            </p>
            <p>
                Si aucune activité n’est enregistrée pendant cette période, un préavis de suppression automatique vous sera envoyé. 
                En l’absence de réponse ou d’activité dans les 30 jours suivant le préavis, vos données seront automatiquement et définitivement supprimées de nos serveurs.
            </p>

            <h2>5. Partage des données</h2>
            <p>
                Vos données personnelles ne seront jamais vendues, échangées ou louées à des tiers. Elles ne sont accessibles qu’aux membres autorisés de notre équipe 
                et à nos prestataires techniques dans le cadre strictement nécessaire au bon fonctionnement de l’application.
            </p>

            <h2>6. Sécurité des données</h2>
            <p>
                Better Me met en place des mesures techniques et organisationnelles pour protéger vos données :
            </p>
            <ul>
                <li>Stockage sécurisé sur des serveurs conformes aux normes européennes.</li>
                <li>Chiffrement des données sensibles en transit et au repos.</li>
                <li>Accès restreint aux données aux seuls personnels autorisés.</li>
            </ul>

            <h2>7. Droits des utilisateurs</h2>
            <p>En tant qu’utilisateur de Better Me, vous disposez des droits suivants :</p>
            <ul>
                <li><strong>Droit d’accès :</strong> Demander une copie de vos données personnelles.</li>
                <li><strong>Droit de rectification :</strong> Corriger les informations inexactes ou incomplètes.</li>
                <li><strong>Droit à l’effacement :</strong> Demander la suppression de vos données.</li>
                <li><strong>Droit à la portabilité :</strong> Récupérer vos données sous un format lisible par une machine.</li>
                <li><strong>Droit d’opposition :</strong> Vous opposer à certains traitements de vos données.</li>
                <li><strong>Droit de limitation :</strong> Restreindre temporairement le traitement de vos données.</li>
            </ul>
            <p>
                Pour exercer ces droits, contactez-nous à <strong>[adresse email de contact dédiée à la RGPD]</strong>. 
                Nous nous engageons à répondre à votre demande dans un délai maximal de 30 jours.
            </p>

            <h2>8. Consentement et mise à jour</h2>
            <p>
                En utilisant Better Me, vous consentez au traitement de vos données personnelles tel que décrit dans cette politique. 
                Vous pouvez gérer vos préférences dans les paramètres de l’application.
            </p>

            <h2>9. Modifications de cette politique</h2>
            <p>
                Nous nous réservons le droit de mettre à jour cette politique pour refléter les évolutions législatives ou techniques. 
                Vous serez informé de toute modification substantielle avant qu’elle n’entre en vigueur.
            </p>

            <p>
                Pour toute question ou réclamation, contactez l’autorité compétente en matière de protection des données personnelles : 
                la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) en France.
            </p>

            <p><strong>Better Me</strong>, votre partenaire pour une meilleure gestion de votre poids et de vos données personnelles.</p>
        </div>
    );
};

export default TC;
