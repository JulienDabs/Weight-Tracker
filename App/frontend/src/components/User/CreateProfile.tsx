import React, { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface IFormInput {
  firstname: string;
  lastname: string;
  currentWeight: number;
  height: number | string;
  weightGoal: number;
  bloodPressure: string;
  currentActive: number;
  gender: string;
  birthday: Date;
}
const CreateProfile: React.FC = () => {
  const { register, handleSubmit, getValues } = useForm<IFormInput>();
  const { user } = useContext(AuthContext);
  const [notSafe, setNotSafe] = useState(false);
  const [success, setSuccess] = useState(false);
  //const navigate = useNavigate(); // Hook for navigation

  // Redirect to login if user is not authenticated
  // useEffect(() => {
  //     if (!user) {
  //       navigate("/login");
  //     }
  //   }, [user, navigate]);

  // Function to check if the weight goal is too low
  const checkGoalWeight = () => {
    const currentWeight = getValues("currentWeight");
    const weightGoal = getValues("weightGoal");

    if (weightGoal < 0.8 * currentWeight) {
      setNotSafe(true);
    } else {
      setNotSafe(false);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(user);
    if (!user) {
      console.error("User ID is not available");
      return;
    }

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
      const response = await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        data
      );

      if (response.data) {
        setSuccess(true);
      }

      if (!response) {
        console.log(data);
        throw new Error("Failed to register user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>Créer votre profil</h1>
      <h3>
        Afin de calculer votre poids ideal veuillez entrer les informations
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
            step="0.1"
            {...register("currentWeight", {
              required: "Votre poids est requis",
            })}
          />
        </div>

        <div>
          <label>Poids souhaité (kg)</label>
          <input
            type="number"
            step="0.1"
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
          <label>Taille (cm ou m)</label>
          <input
            {...register("height", {
              required: "Mettre votre taille en cm ou en mètres",
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
          <label>Activité (1-3)</label>
          <input
            type="number"
            min="1"
            max="3"
            {...register("currentActive", {
              required: "Votre niveau d'activité est requis",
            })}
          />
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
          <label>Date de naissance</label>
          <input
            type="date"
            {...register("birthday", {
              required: "Votre date de naissance est requise",
            })}
          />
        </div>

        <input type="submit" value="Créer mon profil" />
      </form>
      {success && <p>Profil créé avec succès !</p>}
    </>
  );
};

export default CreateProfile;
