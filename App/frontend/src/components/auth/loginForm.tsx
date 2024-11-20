import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import "../../Style/loginForm.css";
import { useAuthState } from "./AuthStateContext";
import Header from "../Header/header";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { checkAuthStatus } = useContext(AuthContext);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState({
    success: false,
    error401: false,
    error404: false,
    resent: false,
  });
  const [loading, setLoading] = useState(false);
  const { setIsVerified, setProfileCompleted, isVerified, profileCompleted } =
    useAuthState();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleKey = () => {
    setStatus({
      success: false,
      error401: false,
      error404: false,
      resent: false,
    });
  };

  const handleResent = async (id: string | null) => {
    if (!id) {
      console.error("User ID is not available for resending the email.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:3000/auth/resend-verif-email/${id}`);
      setStatus((prevState) => ({ ...prevState, resent: true }));
    } catch (error) {
      console.error("Failed to resend email", error);
      setStatus((prevState) => ({ ...prevState, resent: false }));
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    navigate("/dashboard");
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    try {
      const authResponse = await axios.post(
        "http://localhost:3000/auth/login",
        data,
        { withCredentials: true }
      );
      await checkAuthStatus();

      const id = authResponse.data.user.id;
      setUserId(id);

      const response = await axios.get(`http://localhost:3000/users/${id}`);

      if (response.data.isVerified) {
        setIsVerified(true);
        setProfileCompleted(response.data.profileCompleted);
        setStatus((prevState) => ({ ...prevState, success: true }));
      } else {
        setIsVerified(false);
        setStatus((prevState) => ({ ...prevState, success: true }));
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setStatus((prevState) => ({ ...prevState, error401: true }));
        } else if (error.response?.status === 404) {
          setStatus((prevState) => ({ ...prevState, error404: true }));
        } else {
          console.error("Unexpected error", error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
      <h1 className="title">Connexion</h1>
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

        <input type="submit" value="Se connecter" disabled={loading} />
      </form>

      {status.error401 && (
        <p className="alert">Email ou mot de passe invalide, veuillez réessayer</p>
      )}
      {status.error404 && <p className="alert">Le compte n'existe pas</p>}
      {status.success && !isVerified && (
        <>
          <p className="warning">
            Pour accéder à votre compte, veuillez confirmer votre adresse email
            en suivant le lien que nous vous avons envoyé.
          </p>

          <button onClick={() => handleResent(userId)}>
            Pas reçu d'email ?
          </button>
        </>
      )}
      {loading && <p>Chargement...</p>}
      {status.success && !isVerified && status.resent && (
        <p className="success">Email renvoyé, merci de vérifier votre boîte</p>
      )}
      {status.success && isVerified && profileCompleted && handleRedirect()}
      {status.success && isVerified && !profileCompleted && (
        <>
          <p className="warning">Veuillez compléter votre profil pour accéder à votre dashboard.</p>
          <button onClick={() => navigate("/createprofile")}>
            Compléter mon profil
          </button>
        </>
      )}
    </>
  );
};

export default LoginForm;
