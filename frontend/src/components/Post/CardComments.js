import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getPosts } from "../../actions/post.actions";
import { isEmpty, timestampParser } from "../Utils";
import EditDeleteComment from "./EditDeleteComment"; // On s'importe EditDeleteComment

// Component pour les commentaires

const CardComments = ({ post }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  // Pour s'envoyer le texte du commentaire
  const handleComment = (e) => {
    e.preventDefault(); // Tu nous changes pas de page

    if (text) {
      dispatch(addComment(post.id, userData.id, text, userData.pseudo))
        .then(() => dispatch(getPosts()))
        .then(() => setText(""));
    }
  };

  // Rendu JSX
  return (
    <div className="comments-container">
      {post.comments.map((comment) => {
        return (
          <div
            className={
              comment.author === userData.id
                ? "comment-container client"
                : "comment-container"
            }
            key={comment.id}
          >
            {/* PHOTO DE PROFIL DE CELUI QUI COMMENTE */}
            <div className="left-part">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user.id === comment.author)
                        return userData.profil_pic
                          ? userData.profil_pic
                          : "./uploads/profil/random-user.png";
                      else return null;
                    })
                    .join("")
                }
                alt="commenter-pic"
              />
            </div>
            {/* PSEUDO ET DATE DE CELUI QUI COMMENTE */}
            <div className="right-part">
              <div className="comment-header">
                <div className="pseudo">
                  <h3>{comment.pseudo}</h3>
                </div>
                <span>{timestampParser(comment.created_at)}</span>
              </div>
              <p>{comment.message}</p>
              <EditDeleteComment
                comment={comment}
                postId={post.id}
                user={userData}
              />
            </div>
          </div>
        );
      })}
      {/* FORMULAIRE POUR LAISSER UN COMMENTAIRE */}
      {userData.id && (
        <form action="" onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Laisser un commentaire"
          />
          <br />
          <input type="submit" value="Envoyer" />
        </form>
      )}
    </div>
  );
};

export default CardComments;
