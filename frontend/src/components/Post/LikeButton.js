import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";

const LikeButton = ({ post }) => {
  let [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();
  let loaded = false;

  const like = () => {
    dispatch(likePost(post.id, uid));

    setLiked(true);
  };

  const unlike = () => {
    dispatch(unlikePost(post.id, uid));

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
      {uid === null && (
        <Popup
          trigger={<img src="./img/icons/heart.svg" alt="like" />}
          position={["bottom center", "bottom right", "bottom left"]}
          closeOnDocumentClick
        >
          <div>Connectez-vous pour aimer un post !</div>
        </Popup>
      )}
      {uid && liked === false && (
        <img src="./img/icons/heart.svg" onClick={like} alt="like" />
      )}
      {uid && liked && (
        <img src="./img/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
      )}
      {/* <span>{post.likers.length}</span> */}
    </div>
  );
};

export default LikeButton;
