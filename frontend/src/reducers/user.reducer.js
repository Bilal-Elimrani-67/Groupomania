import { GET_USER, UPDATE_BIO, UPLOAD_PICTURE } from "../actions/user.actions"; // On importe nos actions

const initialState = {}; // Tout les reducers ont un state de base vide

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    // On traite GET_USER
    case GET_USER:
      return action.payload; // On envoie la data dans le state qui est vide {}

    // On traite UPLOAD_PICTURE
    case UPLOAD_PICTURE:
      return {
        ...state,
        picture: action.payload,
      };

    // On traite UPDATE_BIO
    case UPDATE_BIO:
      return {
        ...state,
        bio: action.payload,
      };
    default:
      return state;
  }
}
