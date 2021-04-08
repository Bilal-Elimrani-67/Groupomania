import axios from "axios"; // On importe la bibliothèque Axios

export const GET_USERS = "GET_USERS"; // Pour obtenir toute la data des utilisateurs

// Pour obtenir tout utilisateurs
export const getUsers = () => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/user`)
      .then((res) => {
        // On dispatch toute la data à notre store
        dispatch({ type: GET_USERS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
