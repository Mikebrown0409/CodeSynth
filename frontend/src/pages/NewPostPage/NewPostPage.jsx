import { useState } from "react";
import { useNavigate } from "react-router";
import * as postService from "../../services/postService";

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Send Request is expecting an Object in the payload (thats why we wrap it {})
      await postService.create({ content });
      navigate("/posts");
    } catch (err) {
      setErrorMsg("Adding Post Failed");
    }
  }

  return (
    <>
      <h2>Add Post!</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <label>Post Content</label>
        <input
          type="text"
          value={content}
          onChange={(evt) => setContent(evt.target.value)}
          required
        />

        <button type="submit">ADD POST</button>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
    </>
  );
}
