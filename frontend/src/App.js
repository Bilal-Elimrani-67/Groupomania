import React, { useEffect, useState } from "react";
import Routes from "./components/Routes"; // On s'importe le dossier routes avec le router
import { UidContext } from "./components/AppContext"; // On s'importe notre UidContext
import axios from "axios"; // On importe Axios pour faire des requêtes
import { useDispatch } from "react-redux"; // Utilise le dispatch
import { getUser } from "./actions/user.actions";

const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  // Ce useEffect va controler automatiquement le token
  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((err) => console.log("No token")); // L'utilisateur n'est pas connecté
    };
    fetchToken();

    if (uid) dispatch(getUser(uid)); // On dispatch getUser dans le store
  }, [uid, dispatch]);

  // C'est ici que va contenir toutes les routes de notre appli
  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
