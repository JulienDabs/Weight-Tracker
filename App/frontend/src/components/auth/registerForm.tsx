import React, { useState } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import axios from "axios";
import "../../Style/registerForm.css";
import Header from "../Header/header";
import { Checkbox } from "@mui/material";
import { Link } from "react-router-dom";

interface IFormInput {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [isTcClicked, setIsTcClicked] = useState(false);

  const password = useWatch({
    control,
    name: "password",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!isTcClicked) {
      alert("Veuillez accepter les Conditions Générales d'Utilisation.");
      return;
    }

    try {
      const { email, password } = data;
      setLoading(true);

      const response = await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });
      console.log("Success:", response.data);
      reset();
      setSuccess(true);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            alert("Invalid request. Please check your input.");
          } else if (error.response.status === 500) {
            alert("Server error. Please try again later.");
          } else if (error.response.status === 401) {
            setUserExist(true);
          }
        } else if (error.request) {
          alert("No response from the server. Please check your connection.");
        }
      } else {
        console.error("Unexpected Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            {...register("email", {
              required: "Email est requis",
              pattern: {
                value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
                message: "Email non valide",
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            {...register("password", {
              required: "Mot de passe est requis",
              pattern: {
                value: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                message:
                  "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, et un chiffre ou un caractère spécial.",
              },
            })}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label>Confirmez le mot de passe</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Veuillez confirmer votre mot de passe",
              validate: (value) =>
                value === password || "Les mots de passe ne correspondent pas",
            })}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div style={{ marginTop: "20px" }}>
          <label>
            <Checkbox
              checked={isTcClicked}
              onChange={() => setIsTcClicked(!isTcClicked)}
              color="primary"
            />
            J'accepte les{" "}
            <Link to="/tc" style={{ textDecoration: "none", color: "#1976d2" }}>
              Conditions Générales d'Utilisation
            </Link>
          </label>
        </div>
      {isTcClicked && (
        <div style={{ marginTop: "20px" }}>
          <input type="submit" value="Soumettre" />
        </div>)}
      </form>

      <a href="/login" className="login-shortcut">
        Déjà enregistré ?
      </a>

      {loading && <p className="warning">Envoi en cours...</p>}

      {success && (
        <p className="warning">
          Merci de confirmer votre email en cliquant sur le lien reçu.
        </p>
      )}

      {userExist && <p className="alert">Cet email est déjà enregistré.</p>}
    </>
  );
};

export default RegisterForm;
