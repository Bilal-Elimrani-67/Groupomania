import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext"; // On importe notre Uid
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";

const LikeButton = ({ post }) => {
  let [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();
  let loaded = false;

  const like = () => {
    dispatch(likePost(post.id, uid)); // On lance l'action
    setLiked(true);
  };

  const unlike = () => {
    dispatch(unlikePost(post.id, uid)); // On lance l'action
    setLiked(false);
  };

  useEffect(() => {
    if (!loaded && post.likes !== undefined) {
      for (let i = 0; post.likes.length > i; i++) {
        if (post.likes[i].author === uid) {
          setLiked(true);
        }
      }
      // eslint-disable-next-line
      loaded = true;
    }
  }, [uid, post.likes, liked]);

  return (
    <div className="like-container">
      {uid && liked === false && (
        <img src="./img/icons/heart.svg" onClick={like} alt="like" />
      )}
      {uid && liked && (
        <img src="./img/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
      )}
      {/* <span>{post.likes.length}</span> */}
    </div>
  );
};

export default LikeButton;
