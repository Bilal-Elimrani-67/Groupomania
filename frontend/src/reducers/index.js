// Ce fichier index.js permet de regrouper tout nos reducers

import { combineReducers } from "redux"; // On combine tout nos reducers avant de les envoyer dans le store
import userReducer from "./user.reducer";
import usersReducer from "./users.reducer";
import postReducer from "./post.reducer";
import errorReducer from "./error.reducer";
import allPostsReducer from "./allPosts.reducer";

// Puis on s'exporte notre combineReducers
export default combineReducers({
  userReducer,
  usersReducer,
  postReducer,
  errorReducer,
  allPostsReducer,
});
