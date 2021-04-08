import React from "react"; // On importe React
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"; // Router de React
import Home from "../../pages/Home"; // On importe la page Home
import Profil from "../../pages/Profil"; // On importe la page Profil
import Navbar from "../Navbar";

// On se fait notre routeur pour s'importer Home & Profil (notre navigation)
const index = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profil" exact component={Profil} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
};

export default index;
