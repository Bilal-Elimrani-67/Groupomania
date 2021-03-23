import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import LeftNav from "../components/LeftNav";
import Card from "../components/Card";
import Trends from "../components/Trends";

const Trending = () => {
  let posts = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (posts) {
      const postsArr = Object.keys(posts).map((i) => posts[i]);
      let sortedArray = postsArr.sort((a, b) => {
        if (b.likes !== undefined && a.likes !== undefined)
          return b.likes.length - a.likes.length;
        return 0;
      });
      sortedArray.length = 3; //posts.length > 3 ? 3 : posts.length;
      // eslint-disable-next-line
      posts = [sortedArray];
    }
  }, [posts]);
  return (
    <div className="trending-page">
      <LeftNav />
      <div className="main">
        <ul>
          {posts.length &&
            posts.map((post) => {
              return <Card post={post} key={post.id} />;
            })}
        </ul>
      </div>
      <div className="right-side">
        <div className="right-side-container">
          <Trends />
        </div>
      </div>
    </div>
  );
};

export default Trending;
