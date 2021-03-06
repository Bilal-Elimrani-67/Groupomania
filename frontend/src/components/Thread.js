import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post.actions";
import Card from "./Post/Card"; // On s'importe notre Card
import { isEmpty } from "./Utils";

// Component Thread : Fil d'actualité

const Thread = () => {
  const [loadPost, setLoadPost] = useState(true);
  const [count, setCount] = useState(5); // Compteur de post (5posts)
  const dispatch = useDispatch(); // Permet d'envoyer une action
  const posts = useSelector((state) => state.postReducer); // On se récupére tout les posts avec state.postReducer

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >
      document.scrollingElement.scrollHeight
    ) {
      setLoadPost(true);
    }
  };

  useEffect(() => {
    if (loadPost) {
      dispatch(getPosts(count));
      setLoadPost(false);
      setCount(count + 5);
    }

    window.addEventListener("scroll", loadMore);
    return () => window.removeEventListener("scroll", loadMore);
  }, [loadPost, dispatch, count]);

  // Rendu JSX
  return (
    // Tout le fil d'actualité qu'on map
    <div className="thread-container">
      <ul>
        {!isEmpty(posts[0]) &&
          posts.map((post) => {
            return <Card post={post} key={post.id} />;
          })}
      </ul>
    </div>
  );
};

export default Thread;
