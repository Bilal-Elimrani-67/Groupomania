import React, { useContext } from "react";
import { UidContext } from "../components/AppContext";
import LeftNav from "../components/LeftNav"; // On s'importe notre LeftNav
import NewPostForm from "../components/Post/NewPostForm"; // On s'importe notre NewPostForm
import Thread from "../components/Thread"; // On s'importe notre Thread
import Log from "../components/Log"; // On s'importe notre Log

// Components page Home

const Home = () => {
  const uid = useContext(UidContext);

  // Rendu JSX
  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="home-header">
          {uid ? <NewPostForm /> : <Log signin={true} signup={false} />}
        </div>
        {uid ? <Thread /> : ""}
      </div>
    </div>
  );
};

export default Home;
