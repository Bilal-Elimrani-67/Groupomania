import { GET_ALL_POSTS } from "../actions/post.actions";

const initalState = {};

export default function allPostsReducer(state = initalState, action) {
  switch (action.type) {
    case GET_ALL_POSTS:
      return action.payload;
    default:
      return state;
  }
}
