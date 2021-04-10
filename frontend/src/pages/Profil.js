import React, { useContext } from "react";
import Log from "../components/Log"; // On importe le dossier Log
import { UidContext } from "../components/AppContext"; // On s'importe le UidContext
import UpdateProfil from "../components/Profil/UpdateProfil"; // On importe le fichier UpdateProfil

// Components page Profil

const Profil = () => {
  const uid = useContext(UidContext); // On s'attrape la valeur de UidContext

  // Rendu JSX
  return (
    <div className="profil-page">
      {uid ? (
        <UpdateProfil />
      ) : (
        // On veut la logique Log (s'incrire ou se connecter)
        <div className="log-container">
          <Log signin={false} signup={true} />
          <div className="img-container">
            <img src="./img/log.svg" alt="img-log" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;
