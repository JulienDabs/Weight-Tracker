import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "./AuthContext";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { checkAuthStatus } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);
  const [error401, setError401] = useState(false);
  const [error404, setError404] = useState(false);
  const [error500, setError500] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleKey = () => {
    setSuccess(false);
    setError401(false);
    setError404(false);
    setError500(false);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const { email, password } = data;

      await axios.post(
        "http://localhost:3000/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      await checkAuthStatus();
      setSuccess(true); // Set success to true on successful response
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.message);
      }
      if (error.response && error.response.status === 401) {
        setError401(true);
      }
      if (error.response && error.response.status === 404) {
        setError404(true);
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  return (
    <>
      <h1>Identification</h1>
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
            onKeyDown={handleKey}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            {...register("password", {
              required: "Mot de passe est requis",
            })}
            onKeyDown={handleKey}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <input type="submit" value="Se connecter" />
      </form>

      {error401 && <p>Email ou mot de passe invalide veuillez réésayer</p>}
      {error404 && <p>Le compte n'existe pas</p>}
      {error500 && <p>Erreur serveur</p>}

      {success && <p>Connexion réussie. Bienvenue !</p>}
    </>
  );
};

export default LoginForm;
