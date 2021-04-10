import axios from "axios"; // On importe la bibliothèque Axios

// Posts
export const GET_POSTS = "GET_POSTS";
export const GET_ALL_POSTS = "GET_ALL_POSTS";
export const ADD_POSTS = "ADD_POSTS";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

// Commentaire pour les posts
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// errors

// On se récupère tout les posts
export const getPosts = (num) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/post/`)
      .then((res) => {
        const array = res.data.slice(0, num); // Pour l'infinite scroll
        dispatch({ type: GET_POSTS, payload: array }); // On se l'envoie dans le store
        dispatch({ type: GET_ALL_POSTS, payload: array });
      })
      .catch((err) => console.log(err));
  };
};

export const addPost = (data) => {
  return (dispatch) => {
    return axios.post(`${process.env.REACT_APP_API_URL}api/post/`, data, {
      withCredentials: true,
    });
  };
};

export const likePost = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/like-post/` + postId,
      withCredentials: true,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: LIKE_POST, payload: { postId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

export const unlikePost = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/unlike-post/` + postId,
      withCredentials: true,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: UNLIKE_POST, payload: { postId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

export const updatePost = (postId, message, posterId) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/post/${postId}`,
      withCredentials: true,
      data: { message, posterId },
    })
      .then((res) => {
        dispatch({ type: UPDATE_POST, payload: { message, postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const deletePost = (postId, posterId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/post/${postId}`,
      withCredentials: true,
      data: { posterId },
    })
      .then((res) => {
        dispatch({ type: DELETE_POST, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const addComment = (postId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/comment-post/${postId}`,
      withCredentials: true,
      data: { commenterId, text, commenterPseudo },
    })
      .then((res) => {
        dispatch({ type: ADD_COMMENT, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const editComment = (userId, commentId, message) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/edit-comment-post/${commentId}`,
      withCredentials: true,
      data: { userId, message },
    })
      .then((res) => {
        dispatch({
          type: EDIT_COMMENT,
          payload: { userId, commentId, message },
        });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteComment = (userId, commentId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/delete-comment-post/${commentId}`,
      withCredentials: true,
      data: { userId },
    })
      .then((res) => {
        dispatch({ type: DELETE_COMMENT, payload: { userId, commentId } });
      })
      .catch((err) => console.log(err));
  };
};
