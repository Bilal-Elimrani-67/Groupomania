import axios from "axios"; // On importe la bibliothèque Axios
import cookie from "js-cookie"; // On traite les données

export const GET_USER = "GET_USER"; // On exporte les données de l'utilisateur
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";

export const GET_USER_ERRORS = "GET_USER_ERRORS";

const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, { expires: 1 });
  }
};

// Action qui permet de récupérer notre utilisateur et on se le dispatch(envoi) à notre reducer
export const getUser = (uid) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`)
      .then((res) => {
        dispatch({
          type: GET_USER,
          payload: res.data[0],
        });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteProfil = (data) => {
  return (dispatch) => {
    return axios
      .delete(`${process.env.REACT_APP_API_URL}api/user/${data}`, {
        withCredentials: true,
      })
      .then(() => {
        removeCookie("jwt");
        window.location = "/";
      })
      .catch((err) => console.log(err));
  };
};

// Action qui permet de stocker la data dans notre Back
export const uploadPicture = (data, id) => {
  return (dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_API_URL}api/user/upload`, data, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: GET_USER_ERRORS, payload: res.data.errors });
        } else {
          dispatch({ type: GET_USER_ERRORS, payload: "" });
          return axios
            .get(`${process.env.REACT_APP_API_URL}api/user/${id}`)
            .then((res) => {
              // On se récupére le chemin et on dispatch au reducer
              dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture });
            });
        }
      })
      .catch((err) => console.log(err));
  };
};

// Action qui permet de update une bio
export const updateBio = (userId, bio) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/user/` + userId,
      withCredentials: true,
      data: { bio },
    })
      .then((res) => {
        // On dispatch la bio au reducer
        dispatch({ type: UPDATE_BIO, payload: bio });
      })
      .catch((err) => console.log(err));
  };
};
