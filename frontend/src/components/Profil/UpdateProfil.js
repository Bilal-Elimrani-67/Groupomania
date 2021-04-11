import React, { useState } from "react";
import LeftNav from "../LeftNav"; // On s'importe notre LeftNav
import { useDispatch, useSelector } from "react-redux";
import UploadImg from "./UploadImg"; // On s'importe notre UploadImg
import { updateBio } from "../../actions/user.actions";
import { dateParser } from "../Utils";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(updateBio(userData.id, bio));
    setUpdateForm(false);
  };

  return (
    <div className="profil-container">
      <LeftNav />
      <h1>Profil de {userData.pseudo}</h1>
      <div className="update-container">
        {/* PARTIE GAUCHE */}
        <div className="left-part">
          <h3>Photo de profil</h3>
          <img
            src={
              userData.profil_pic
                ? userData.profil_pic
                : "./uploads/profil/random-user.png"
            }
            alt="user-pic"
          />
          <UploadImg />
        </div>
        {/* PARTIE DROITE */}
        <div className="right-part">
          <div className="bio-update">
            <h3>Bio</h3>
            {updateForm === false && (
              <>
                <p onClick={() => setUpdateForm(!updateForm)}>{userData.bio}</p>
                <button onClick={() => setUpdateForm(!updateForm)}>
                  Modifier bio
                </button>
              </>
            )}
            {updateForm && (
              <>
                <textarea
                  type="text"
                  defaultValue={userData.bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <button onClick={handleUpdate}>Valider modifications</button>
              </>
            )}
          </div>
          <h4>Membre depuis le : {dateParser(userData.created_at)}</h4>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfil;
