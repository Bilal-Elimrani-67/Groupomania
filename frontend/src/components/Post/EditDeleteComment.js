import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, editComment } from "../../actions/post.actions";
import { UidContext } from "../AppContext";

const EditDeleteComment = ({ comment, postId, user }) => {
  const [isAuthor, setIsAuthor] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  const handleEdit = (e) => {
    e.preventDefault();

    if (text) {
      dispatch(editComment(comment.author, comment.id, text));
      setText("");
      setEdit(false);
      window.location.reload(true);
    }
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment.author, comment.id));
    window.location.reload(true);
  };

  useEffect(() => {
    const checkAuthor = () => {
      if (uid === comment.author) {
        setIsAuthor(true);
      }
    };
    const checkMod = () => {
      if (user.permissions == 1) {
        setIsMod(true);
      }
    };
    checkMod();
    checkAuthor();
  }, [uid, comment.author, isMod]);

  return (
    <div className="edit-comment">
      {(isAuthor || isMod) && edit === false && (
        <span onClick={() => setEdit(!edit)}>
          <img src="./img/icons/edit.svg" alt="edit-comment" />
        </span>
      )}
      {(isAuthor || isMod) && edit && (
        <form action="" onSubmit={handleEdit} className="edit-comment-form">
          {isAuthor && (
            <>
              <label htmlFor="" onClick={() => setEdit(!edit)}>
                Editer
              </label>
              <br />
              <input
                type="text"
                name="text"
                onChange={(e) => setText(e.target.value)}
                defaultValue={comment.text}
              />
              <br />{" "}
            </>
          )}

          <div className="btn">
            <span
              onClick={() => {
                if (window.confirm("Voulez-vous supprimer ce commentaire ?")) {
                  handleDelete();
                }
              }}
            >
              <img src="./img/icons/trash.svg" alt="delete" />
            </span>
            {isAuthor && <input type="submit" value="Valider modification" />}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditDeleteComment;
