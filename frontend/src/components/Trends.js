import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrends } from "../actions/post.actions";
import { isEmpty } from "./Utils";
import { NavLink } from "react-router-dom";

const Trends = () => {
  const posts = useSelector((state) => state.postReducer);
  //const usersData = useSelector((state) => state.usersReducer);
  const trendList = useSelector((state) => state.trendingReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (posts) {
      const postsArr = Object.keys(posts).map((i) => posts[i]);
      let sortedArray = postsArr.sort((a, b) => {
        if (b.likes !== undefined && a.likes !== undefined)
          return b.likes.length - a.likes.length;
        return 0;
      });

      sortedArray.length = 3; //posts.length > 3 ? 3 : posts.length;
      dispatch(getTrends(sortedArray));
    }
  }, [posts, dispatch]);

  return (
    <div className="trending-container">
      <h4>Trending</h4>
      <NavLink exact to="/trending">
        <ul>
          {trendList.length &&
            trendList.map((post) => {
              return (
                <li key={post.id}>
                  <div>
                    {post.image && <img src={post.image} alt="post-pic" />}
                    {post.video && (
                      <iframe
                        src={post.video}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={post.id}
                      ></iframe>
                    )}
                    {isEmpty(post.image) && isEmpty(post.video) && (
                      <img
                        src={
                          post.profil_pic
                            ? post.profil_pic
                            : "./uploads/profil/random-user.png"
                        }
                        alt="profil-pic"
                      />
                    )}
                  </div>
                  <div className="trend-content">
                    <p>{post.message}</p>
                    <span>Lire</span>
                  </div>
                </li>
              );
            })}
        </ul>
      </NavLink>
    </div>
  );
};

export default Trends;
