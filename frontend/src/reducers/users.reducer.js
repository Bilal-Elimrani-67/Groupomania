import { GET_USERS } from "../actions/users.actions";

const initialState = {};

// Reducer pour traiter toute la data des utilisateurs
export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return action.payload;
    default:
      return state;
  }
}
