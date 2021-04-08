import React, { useState } from "react";
import axios from "axios"; // On importe Axios pour faire des requêtes

// Pour se connecter
const SingInForm = () => {
  const [email, setEmail] = useState(""); // On utilise les hooks avec useState pour récup la data
  const [password, setPassword] = useState(""); // " "

  const handleLogin = (e) => {
    e.preventDefault(); // On évite le rechargement de la page
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");

    // On communique au back ce que l'user à saisie pour se connecter avec la methode POST
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/user/login`,
      withCredentials: true,
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.data.errors) {
          emailError.innerHTML = res.data.email;
          passwordError.innerHTML = res.data.password;
        } else {
          window.location = "/"; // On se met à l'accueil
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // C'est la qu'on se code le formulaire pour se connecter
  return (
    <form action="" onSubmit={handleLogin} id="sign-up-form">
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <div className="email error"></div>
      <br />
      <label htmlFor="password">Mot de passe</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <div className="password error"></div>
      <br />
      <input type="submit" value="Se connecter" />
    </form>
  );
};

export default SingInForm;
