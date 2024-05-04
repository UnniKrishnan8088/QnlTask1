import axios from "axios";
import { useState } from "react";

type CrudProps = {
  closeModal: () => void;
  getPosts: () => void;
};

type PostData = {
  title: string;
  body: string;
  userId: number;
};

export default function CreatePost({ closeModal, getPosts }: CrudProps) {
  const [inputs, setInputs] = useState<PostData>({
    title: "",
    body: "",
    userId: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        inputs
      );
      console.log(response?.data);
      getPosts();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="popup">
      <form onSubmit={createPost}>
        <button onClick={closeModal}>X</button>
        <h2>Create Post</h2>
        <div className="input">
          <label htmlFor="">User Id</label>
          <input
            type="number"
            name="userId"
            value={inputs.userId}
            onChange={handleChange}
          />
        </div>
        <div className="input">
          <label htmlFor="">title</label>
          <input
            type="text"
            name="title"
            value={inputs.title}
            onChange={handleChange}
          />
        </div>
        <div className="input">
          <label htmlFor="">body</label>
          <input
            name="body"
            value={inputs.body}
            onChange={handleChange}
          ></input>
        </div>
        <button>Create</button>
      </form>
    </div>
  );
}
