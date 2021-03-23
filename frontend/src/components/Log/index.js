import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import SingInForm from "./SingInForm";

const Log = (props) => {
  const [signUpModal, setSignUpModal] = useState(props.signup);
  const [signInModal, setSignInModal] = useState(props.signin);

  const handleModales = (e) => {
    if (e.target.id === "register") {
      setSignInModal(false);
      setSignUpModal(true);
    } else if (e.target.id === "login") {
      setSignUpModal(false);
      setSignInModal(true);
    }
  };

  return (
    <div className="connection-form">
      <div className="form-container">
        <ul>
          <li
            onClick={handleModales}
            id="register"
            className={signUpModal ? "active-btn" : null}
          >
            S'inscrire
          </li>
          <li
            onClick={handleModales}
            id="login"
            className={signInModal ? "active-btn" : null}
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
