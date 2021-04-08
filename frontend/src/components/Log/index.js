import React, { useState } from "react";
import SignUpForm from "./SignUpForm"; // On importe le fichier SignUpForm pour s'inscrire
import SingInForm from "./SingInForm"; // On importe le fichier SignInForm pour se connecter

const Log = (props) => {
  const [signUpModal, setSignUpModal] = useState(props.signup); // Le modal pour s'inscrire
  const [signInModal, setSignInModal] = useState(props.signin); // Le modal pour se connecter

  // On se récupére l'événement de ce qui a été cliqué
  const handleModales = (e) => {
    if (e.target.id === "register") {
      setSignInModal(false);
      setSignUpModal(true);
    } else if (e.target.id === "login") {
      setSignUpModal(false);
      setSignInModal(true);
    }
  };

  // C'est ici que va contenir notre formulaire pour s'inscrire et se connecter
  return (
    <div className="connection-form">
      <div className="form-container">
        <ul>
          <li
            onClick={handleModales}
            id="register"
            className={signUpModal ? "active-btn" : null} // Si signUpModal est true tu mets la classe ""
          >
            S'inscrire
          </li>
          <li
            onClick={handleModales}
            id="login"
            className={signInModal ? "active-btn" : null} // Si signInModal est true tu mets la classe ""
          >
            Se connecter
          </li>
        </ul>
        {signUpModal && <SignUpForm />}
        {signInModal && <SingInForm />}
      </div>
    </div>
  );
};

export default Log;
