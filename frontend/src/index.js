import React from "react"; // On importe React
import ReactDOM from "react-dom";
import App from "./App"; // On importe App
import "./styles/index.scss"; // On importe tout le style SCSS
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk"; // Thunk : MDLW qui permet de faire des requêtes async avec Redux
import rootReducer from "./reducers"; // On importe notre rootReducer

// Outils de développement
import { composeWithDevTools } from "redux-devtools-extension";

import { getUsers } from "./actions/users.actions";
import { getPosts } from "./actions/post.actions";

// On se créer notre store
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

store.dispatch(getUsers()); // On se lance getUsers dès qu'on ouvre l'appli
store.dispatch(getPosts());

// Ici que va contenir tout l'affichage, la logique...
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") // On injecte tout dans le root(index.html)
);
