import React from "react"; // On s'importe React
import axios from "axios"; // On s'importe Axios pour faire nos requêtes
import cookie from "js-cookie"; // Pour traiter les cookies

// Component pour déconnecter l'utilisateur

const Logout = () => {
  const removeCookie = (key) => {
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 }); // Expire dans 1 milliseconde
    }
  };

  // On se retire le cookie en back
  const logout = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}api/user/logout`,
      withCredentials: true,
    })
      .then(() => removeCookie("jwt")) // On se retire le cookie en front également
      .catch((err) => console.log(err));

    window.location = "/"; // Puis on retourne à la page d'accueil
  };

  // Rendu JSX
  return (
    // Au clique on déclenche la fonction logout
    <li onClick={logout}>
      <img src="./img/icons/logout.svg" alt="logout" />
    </li>
  );
};

export default Logout;
