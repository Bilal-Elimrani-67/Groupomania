import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture, deleteProfil } from "../../actions/user.actions";

const UploadImg = () => {
  const [file, setFile] = useState();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer); // On prend les données de notre utilisateur

  const handlePicture = (e) => {
    e.preventDefault(); // On casse l'événement par défault
    console.log(userData);
    const data = new FormData(); // Mettre dans un package des img + infos
    data.append("name", userData.pseudo);
    data.append("userId", userData.id);
    data.append("file", file);

    dispatch(uploadPicture(data, userData.id));
  };
  const handleProfil = (e) => {
    e.preventDefault();
    let confirm = window.confirm(
      "Etes-vous sur de vouloir supprimer votre profil ?"
    );
    if (confirm) {
      dispatch(deleteProfil(userData.id));
    }
  };

  // Formulaire pour changer d'image et supprimer son profil
  return (
    <>
      {/* CHANGER L'IMAGE DE PROFIL */}
      <form action="" onSubmit={handlePicture} className="upload-pic">
        <label htmlFor="file">Changer d'image</label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <input type="submit" value="Envoyer" />
        <br />
      </form>
      {/* SUPPRIMER LE PROFIL */}
      <form action="" onSubmit={handleProfil}>
        <input type="number" name="id" hidden value={userData.id} />
        <input type="submit" value="Supprimer mon profil" />
      </form>
    </>
  );
};

export default UploadImg;
