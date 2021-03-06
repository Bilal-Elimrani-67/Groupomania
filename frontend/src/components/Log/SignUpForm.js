import React, { useState } from "react";
import axios from "axios";
import SingInForm from "./SingInForm";

// Component pour enregistrer un utilisateur

const SignUpForm = () => {
  const [formSubmit, setFormSubmit] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [controlPassword, setControlPassword] = useState("");

  let handleRegister = async (e) => {
    e.preventDefault(); // On casse l'événement par défault
    // On se remonte les erreurs
    const terms = document.getElementById("terms");
    const pseudoError = document.querySelector(".pseudo.error");
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");
    const passwordConfirmError = document.querySelector(
      ".password-confirm.error"
    );
    const termsError = document.querySelector(".terms.error");

    passwordConfirmError.innerHTML = "";
    termsError.innerHTML = "";

    if (password !== controlPassword || !terms.checked) {
      if (password !== controlPassword)
        passwordConfirmError.innerHTML =
          "Les mots de passe ne correspondent pas";

      if (!terms.checked)
        termsError.innerHTML = "Veuillez valider les conditions générales";
    } else {
      // On communique au back ce que l'user à saisie pour s'inscrire avec la methode POST
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}api/user/register`,
        data: {
          pseudo,
          email,
          password,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.errors) {
            pseudoError.innerHTML = res.data.pseudo;
            emailError.innerHTML = res.data.email;
            passwordError.innerHTML = res.data.password;
          } else {
            setFormSubmit(true);
          }
        })
        .catch((err, res) => {
          console.log(res);
          console.log(err);
        });
    }
  };

  // Rendu JSX
  return (
    <>
      {formSubmit ? (
        <>
          <SingInForm />
          <span></span>
          <h4 className="success">
            Enregistrement réussi, veuillez-vous connecter
          </h4>
        </>
      ) : (
        <form action="" onSubmit={handleRegister} id="sign-up-form">
          {/* PSEUDO */}
          <label htmlFor="pseudo">Pseudo</label>
          <br />
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            onChange={(e) => setPseudo(e.target.value)} // Permet de récupérer la valeur dans l'input
            value={pseudo}
            required
          />
          <div className="pseudo error"></div>
          <br />
          {/* EMAIL */}
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="text"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)} // Idem
            value={email}
          />
          <div className="email error"></div>
          <br />
          {/* MOT DE PASSE */}
          <label htmlFor="password">Mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)} // Idem
            value={password}
          />
          <div className="password error"></div>
          <br />
          {/* CONFIRMER LE MOT DE PASSE */}
          <label htmlFor="password-conf">Confirmer mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password-conf"
            onChange={(e) => setControlPassword(e.target.value)} // Idem
            value={controlPassword}
          />
          <div className="password-confirm error"></div>
          <br />
          {/* CHECKBOX */}
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">
            J'accepte les{" "}
            <a href="/" target="_blank" rel="noopener noreferrer">
              conditions générales
            </a>
          </label>
          <div className="terms error"></div>
          <br />
          <input type="submit" value="Valider inscription" />
        </form>
      )}
    </>
  );
};

export default SignUpForm;
