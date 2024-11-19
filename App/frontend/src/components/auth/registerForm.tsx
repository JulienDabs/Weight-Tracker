import React, { useState } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import axios from 'axios';
import './registerForm.scss'; // Ensure your SCSS file path is correct

interface IFormInput {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<IFormInput>();
  const [success, setSuccess] = useState(false);

  // Use useWatch to watch the password field
  const password = useWatch({
    control,
    name: "password",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Destructure email and password for the API call
      const { email, password } = data;
      console.log(data);

      const response = await axios.post("http://localhost:3000/auth/register", { email, password });
      console.log("Success:", response.data);
      setSuccess(true); // Indicate success
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.message);

        if (error.response) {
          console.error("Response Status:", error.response.status);
          console.error("Response Data:", error.response.data);

          if (error.response.status === 400) {
            alert("Invalid request. Please check your input.");
          } else if (error.response.status === 500) {
            alert("Server error. Please try again later.");
          }
        } else if (error.request) {
          console.error("No Response Received:", error.request);
          alert("No response from the server. Please check your connection.");
        } else {
          console.error("Error Setting Up Request:", error.message);
        }
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  return (
    <>
    <h1>Incription</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            {...register("email", {
              required: "Email est requis",
              pattern: {
                value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
                message: "Email non valide"
              }
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
                message: "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, et un chiffre ou un caractère spécial."
              }
            })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        <div>
          <label>Confirmez le mot de passe</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Veuillez confirmer votre mot de passe",
              validate: (value) => value === password || "Les mots de passe ne correspondent pas"
            })}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
        </div>

        <input type="submit" value="Soumettre" />
      </form>

      <a href=''>Déja enregisté</a>

      {success && (
        <p>Merci de confirmer votre email en cliquant sur le lien reçu.</p>
      )}
    </>
  );
};

export default RegisterForm;

