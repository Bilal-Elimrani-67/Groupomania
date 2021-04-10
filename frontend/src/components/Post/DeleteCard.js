import React from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../actions/post.actions";

// Component pour supprimer un post (message,image,video)

const DeleteCard = (props) => {
  const dispatch = useDispatch();
  const deleteQuote = () => dispatch(deletePost(props.id, props.author));

  // Rendu JSX
  return (
    <div
      onClick={() => {
        console.log(props);
        if (window.confirm("Voulez-vous supprimer cet article ?")) {
          deleteQuote();
        }
      }}
    >
      <img src="./img/icons/trash.svg" alt="trash" />
    </div>
  );
};

export default DeleteCard;
