import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateParser, isEmpty } from "../Utils"; // On se récupère le dateParser
import LikeButton from "./LikeButton"; // On s'importe LikeButton
import { updatePost } from "../../actions/post.actions";
import DeleteCard from "./DeleteCard";
import CardComments from "./CardComments"; // On s'importe CardComments

// Component pour les post

const Card = ({ post }) => {
  const [isLoading, setIsLoading] = useState(true); // Chargement du loading tant qu'on a pas la data
  const [isUpdated, setIsUpdated] = useState(false); // Pour modifier un texte
  const [textUpdate, setTextUpdate] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const usersData = useSelector((state) => state.usersReducer); // On veut toutes les données
  const userData = useSelector((state) => state.userReducer); // On veut la donnée du client
  const dispatch = useDispatch();

  // Fonction pour mettre à jour le message
  const updateItem = () => {
    if (textUpdate) {
      dispatch(updatePost(post.id, textUpdate, post.author));
    }
    setIsUpdated(false);
  };

  useEffect(() => {
    !isEmpty(usersData[0]) && setIsLoading(false);
  }, [usersData]);

  // Rendu JSX
  return (
    <li className="card-container" key={post.id}>
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          {/* PHOTO DE L'UTILISATEUR DANS LE POST */}
          <div className="card-left">
            <img
              src={
                post.profil_pic
                  ? post.profil_pic
                  : "./uploads/profil/random-user.png"
              }
              alt="profil-pic"
            />
          </div>
          {/* PSEUDO DE L'UTILISATEUR DANS LE POST + DATE DU POST */}
          <div className="card-right">
            <div className="card-header">
              <div className="pseudo">
                <h3>{post.pseudo}</h3>
              </div>
              <span>{dateParser(post.created_at)}</span>
            </div>
            {isUpdated === false && <p>{post.message}</p>}
            {isUpdated && (
              <div className="update-post">
                <textarea
                  defaultValue={post.message}
                  onChange={(e) => setTextUpdate(e.target.value)}
                />
                <div className="button-container">
                  <div className="btn" onClick={updateItem}>
                    Valider modifications
                  </div>
                </div>
              </div>
            )}
            {/* AFFICHER UNE IMAGE */}
            {post.image && (
              <img src={post.image} alt="card-pic" className="card-pic" />
            )}
            {/* AFFICHER UNE VIDEO */}
            {post.video && (
              <iframe
                width="500"
                height="300"
                src={post.video}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={post.id}
              ></iframe>
            )}
            {/* L'ID du Poster ID */}
            <div className="button-container">
              {(userData.id === post.author || userData.permissions) && (
                <div onClick={() => setIsUpdated(!isUpdated)}>
                  <img src="./img/icons/edit.svg" alt="edit" />
                </div>
              )}
              {userData.permissions && (
                <DeleteCard id={post.id} author={post.author} />
              )}
            </div>
            {/* COMMENTER LES POSTS */}
            <div className="card-footer">
              <div className="comment-icon">
                <img
                  onClick={() => setShowComments(!showComments)}
                  src="./img/icons/message1.svg"
                  alt="comment"
                />
                <span>{post.comments.length}</span>
              </div>
              {/* COMPONENTS LikeButton */}
              <LikeButton post={post} />
            </div>
            {showComments && <CardComments post={post} />}
          </div>
        </>
      )}
    </li>
  );
};

export default Card;
