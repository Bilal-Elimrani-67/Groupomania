import {
  DELETE_COMMENT,
  DELETE_POST,
  EDIT_COMMENT,
  GET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  UPDATE_POST,
} from "../actions/post.actions";

const initialState = {};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      let posts = [];
      const tmp_posts = action.payload;
      for (let i = 0; tmp_posts.length > i; i++) {
        if (tmp_posts[i].id === null) continue;
        let found = false;
        for (let t = 0; t < posts.length; t++) {
          if (tmp_posts[i].id === posts[t].id) {
            if (tmp_posts[i].comment_id !== null) {
              let exist = false;
              for (let x = 0; x < posts[t].comments.length; x++) {
                if (tmp_posts[i].comment_id === posts[t].comments[x].id) {
                  exist = true;
                  break;
                }
              }

              if (!exist) {
                posts[t].comments.push({
                  message: tmp_posts[i].comment_message,
                  author: tmp_posts[i].comment_author,
                  pseudo: tmp_posts[i].comment_pseudo,
                  id: tmp_posts[i].comment_id,
                  profil_pic: tmp_posts[i].comment_profil_pic,
                  created_at: tmp_posts[i].comment_create_at,
                });
              }
            }
            if (tmp_posts[i].like_id !== null) {
              posts[t].likes.push({
                id: tmp_posts[i].like_id,
                author: tmp_posts[i].like_author,
              });
            }
            found = true;
            break;
          }
        }
        if (found) continue;
        let tmp = {
          id: tmp_posts[i].id,
          message: tmp_posts[i].message,
          image: tmp_posts[i].image,
          video: tmp_posts[i].video,
          author: tmp_posts[i].author,
          pseudo: tmp_posts[i].pseudo,
          created_at: tmp_posts[i].created_at,
          comments: [],
          likes: [],
          profil_pic: tmp_posts[i].profil_pic,
        };
        if (tmp_posts[i].comment_id !== null) {
          tmp.comments.push({
            message: tmp_posts[i].comment_message,
            author: tmp_posts[i].comment_author,
            pseudo: tmp_posts[i].comment_pseudo,
            id: tmp_posts[i].comment_id,
            profil_pic: tmp_posts[i].comment_profil_pic,
            created_at: tmp_posts[i].comment_create_at,
          });
        }
        if (tmp_posts[i].like_id !== null) {
          tmp.likes.push({
            id: tmp_posts[i].like_id,
            author: tmp_posts[i].like_author,
          });
        }

        posts.push(tmp);
      }
      return posts;
    case LIKE_POST:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            likers: [action.payload.userId, ...post.likers],
          };
        }
        return post;
      });
    case UNLIKE_POST:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            likers: post.likers.filter((id) => id !== action.payload.userId),
          };
        }
        return post;
      });
    case UPDATE_POST:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            message: action.payload.message,
            posterId: post.author,
          };
        } else {
          return post;
        }
      });
    case DELETE_POST:
      return state.filter((post) => post.id !== action.payload.postId);
    case EDIT_COMMENT:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === action.payload.commentId) {
                return {
                  ...comment,
                  text: action.payload.text,
                };
              } else {
                return comment;
              }
            }),
          };
        } else return post;
      });
    case DELETE_COMMENT:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment._id !== action.payload.commentId
            ),
          };
        } else return post;
      });
    default:
      return state;
  }
}
