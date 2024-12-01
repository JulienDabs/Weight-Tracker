import React, { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthState } from "../../auth/AuthStateContext";
import Header from "../../Header/header";
import "../../../Style/CreateProfile.css";

interface IFormInput {
  firstname: string;
  lastname: string;
  weight: number;
  height: number | string;
  weightGoal: number;
  bloodPressure: string;
  currentActive: number;
  gender: string;
  birthday: Date;
  hip: number;
  thigh: number;
  waist: number;
  chest: number;
}

const CreateProfile: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();
  const { user } = useContext(AuthContext);
  const { isVerified } = useAuthState();
  const [notSafe, setNotSafe] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated or not verified
  useEffect(() => {
    if (!user || !isVerified) {
      navigate("/login");
    }
  }, [user, isVerified, navigate]);

  // Function to check if the weight goal is too low
  const checkGoalWeight = () => {
    const currentWeight = getValues("weight");
    const weightGoal = getValues("weightGoal");

    if (weightGoal < 0.8 * currentWeight) {
      setNotSafe(true);
    } else {
      setNotSafe(false);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!user) {
      console.error("User ID is not available");
      return;
    }
    const dataUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.gender,
      height: parseInt(data.height.toString(), 10),
      birthday: new Date(data.birthday)
    };
    const dataWeight: Record<string, any> = {
      weight: parseFloat(data.weight.toString()), // Ensure weight is a number
      weightGoal: parseFloat(data.weightGoal.toString()), // Ensure weightGoal is a number
      bloodPressure: data.bloodPressure || "", // Optional string
      currentActive: parseInt(data.currentActive.toString(), 10), // Ensure currentActive is an integer
      ...(data.hip ? { hip: parseFloat(data.hip.toString()) } : {}), // Include only if present
      ...(data.thigh ? { thigh: parseFloat(data.thigh.toString()) } : {}), // Include only if present
      ...(data.waist ? { waist: parseFloat(data.waist.toString()) } : {}), // Include only if present
      ...(data.chest ? { chest: parseFloat(data.chest.toString()) } : {}), // Include only if present
      userId: user.id.toString(), // Include userId
    };
    setLoading(true);

    // Convert height from meters to centimeters if applicable
    let height = data.height;

    if (
      typeof height === "string" &&
      height.includes(".") &&
      height.length <= 4
    ) {
      height = parseFloat(height) * 100; // Convert to centimeters
      data.height = Math.round(height); // Round to nearest whole number
    }

    try {
      const responseUser = await axios.patch(
        `${import.meta.env.VITE_URL_USER}/${user.id}`,
        dataUser
      );

      if (responseUser.data) {
        const responseWeight = await axios.post(
          `${import.meta.env.VITE_URL_WEIGHT}/${user.id}`,
          dataWeight
        );
        if (responseWeight.data) {
          setSuccess(true);
          reset();
        }
      }

      if (!responseUser) {
        console.log(data);
        throw new Error("Failed to register user");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <Header />
      <h1>Créer votre profil</h1>
      <h3>
        Afin de calculer votre poids idéal veuillez entrer les informations
        ci-dessous
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Prénom</label>
          <input
            {...register("firstname", {
              required: "Votre prénom est requis",
            })}
          />
        </div>

        <div>
          <label>Nom de famille</label>
          <input
            {...register("lastname", {
              required: "Votre nom de famille est requis",
            })}
          />
        </div>

        <div>
          <label>Votre poids (kg)</label>
          <input
            type="number"
            step="0.01"
            {...register("weight", {
              required: "Votre poids est requis",
            })}
          />
        </div>

        <div>
          <label>Poids souhaité (kg)</label>
          <input
            type="number"
            step="0.01"
            {...register("weightGoal", {
              required: "Votre poids est requis",
            })}
            onKeyUp={checkGoalWeight}
          />
        </div>

        {notSafe && (
          <p style={{ color: "red" }}>
            Le poids souhaité est trop bas pour être considéré comme sain.
          </p>
        )}

        <div>
          <label>Taille (cm)</label>
          <input
            {...register("height", {
              required: "Mettre votre taille en cm ex : 1,80m = 180cm",
              pattern: {
                value: /^(?:(?:\d{2,3})|(?:\d(?:\.\d{1,2})))$/,
                message:
                  "Veuillez entrer une valeur en cm (par ex. 180) ou en mètres (par ex. 1.80)",
              },
            })}
          />
        </div>

        <div>
          <label>Tour de hanche (cm) (Optionnel)</label>
          <input
            {...register("hip", {
              pattern: {
                value: /^(?:(?:\d{2,3})|(?:\d(?:\.\d{1,2})))$/,
                message:
                  "Veuillez entrer une valeur en cm (par ex. 180) ou en mètres (par ex. 1.80)",
              },
            })}
          />
        </div>

        <div>
          <label>Tour de poitrine (cm) (Optionnel)</label>
          <input
            {...register("chest", {
              pattern: {
                value: /^(?:(?:\d{2,3})|(?:\d(?:\.\d{1,2})))$/,
                message:
                  "Veuillez entrer une valeur en cm (par ex. 180) ou en mètres (par ex. 1.80)",
              },
            })}
          />
        </div>

        <div>
          <label>Tour de ventre (cm) (Optionnel)</label>
          <input
            {...register("waist", {
              pattern: {
                value: /^(?:(?:\d{2,3})|(?:\d(?:\.\d{1,2})))$/,
                message:
                  "Veuillez entrer une valeur en cm (par ex. 180) ou en mètres (par ex. 1.80)",
              },
            })}
          />
        </div>

        <div>
          <label>Tour de cuisse (cm) (Optionnel)</label>
          <input
            {...register("thigh", {
              pattern: {
                value: /^(?:(?:\d{2,3})|(?:\d(?:\.\d{1,2})))$/,
                message:
                  "Veuillez entrer une valeur en cm (par ex. 180) ou en mètres (par ex. 1.80)",
              },
            })}
          />
        </div>

        <div>
          <label>Tension artérielle (optionnel)</label>
          <input type="text" {...register("bloodPressure")} />
        </div>

        <div>
          <label>Activité</label>
          <select
            {...register("currentActive", {
              required: "Votre niveau d'activité est requis",
            })}
          >
            <option value="">Sélectionnez votre niveau d'activité</option>
            <option value="1">1 - Sédentaire (peu de sport)</option>
            <option value="2">2 - Actif (sport 2 à 3 fois par semaine)</option>
            <option value="3">3 - Très actif (sport tous les jours)</option>
          </select>
          {errors.currentActive && (
            <p className="error">{errors.currentActive.message}</p>
          )}
        </div>

        <div>
          <label>Genre</label>
          <select {...register("gender", { required: "Le genre est requis" })}>
            <option value="">Sélectionner</option>
            <option value="MALE">Homme</option>
            <option value="FEMALE">Femme</option>
          </select>
        </div>

        <div>
          <label htmlFor="birthday">Date de naissance</label>
          <input
            type="date"
            id="birthday"
            {...register("birthday", {
              required: "Votre date de naissance est requise",
            })}
            lang="fr" // Ensures the date picker is in French
          />
          {errors.birthday && (
            <p style={{ color: "red" }}>{errors.birthday.message}</p>
          )}
        </div>

        <input type="submit" value="Créer mon profil" />
      </form>
      {loading && <p className="warning">Chargement...</p>}
      {success && navigate("/dashboard")}
    </>
  );
};

export default CreateProfile;
