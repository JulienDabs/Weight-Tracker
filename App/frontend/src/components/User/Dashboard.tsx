import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import { UserInfo } from "../../Interfaces/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faCalendarDays,
  faDumbbell,
  faHeart,
  faMars,
  faRulerVertical,
  faVenus,
  faWeight,
} from "@fortawesome/free-solid-svg-icons";
import cloudScale from "../../assets/cloudScale.svg";
import bodyMesurement from "../../assets/bodyMesurement.svg";
import "../../Style/dashboard.css";

const TableauDeBord: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Icônes
  const icons = {
    scales: <FontAwesomeIcon icon={faWeight} />,
    male: <FontAwesomeIcon icon={faMars} />,
    female: <FontAwesomeIcon icon={faVenus} />,
    birthday: <FontAwesomeIcon icon={faCakeCandles} />,
    ruler: <FontAwesomeIcon icon={faRulerVertical} />,
    active: <FontAwesomeIcon icon={faDumbbell} />,
    heart: <FontAwesomeIcon icon={faHeart} />,
    calendar: <FontAwesomeIcon icon={faCalendarDays} />,
  };

  const calculerAge = (dateNaissance: string): number => {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Ajuster l'âge si l'anniversaire n'a pas encore eu lieu cette année
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const recupererInfosUtilisateur = async () => {
    if (!user) {
      console.error("Contexte utilisateur invalide");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/users/${user.id}`,
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
        console.error("Échec de la récupération des informations utilisateur, statut :", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur :", error);
    }
  };

  useEffect(() => {
    if (user) {
      recupererInfosUtilisateur();
    }
  }, [user]);

  return (
    <div className="dashboard-list">
      <h1>Tableau de bord de {userInfo?.firstname || "Utilisateur"}</h1>
      <ul>
        <li>
          {icons.scales} Poids actuel : {userInfo?.currentWeight || "Non disponible"} kg
        </li>
        <li>
          <img src={cloudScale} alt="Échelle nuage" className="cScale" /> IMC : {userInfo?.currentBmi || "Non disponible"}
        </li>
        <li>
          {icons.birthday} Âge : {userInfo?.birthday ? calculerAge(userInfo.birthday) : "Non disponible"} ans
        </li>
        <li>
          {icons.ruler} Taille : {userInfo?.height || "Non disponible"} cm
        </li>
        <li>
          {icons.heart} Fréquence cardiaque : {userInfo?.bloodPressure ? `${userInfo.bloodPressure} bpm` : "Non renseigné"}
        </li>
        <li>
          {icons.active} Niveau d'activité : {userInfo?.currentActive || "Non disponible"}
        </li>
        <li>
          <img src={bodyMesurement} alt="Mesure corporelle" className="cScale" />
        </li>
      </ul>
    </div>
  );
};

export default TableauDeBord;
