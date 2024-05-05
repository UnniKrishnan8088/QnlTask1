import axios from "axios";
import { useState } from "react";
import { Post } from "../pages/Datas";

type CrudProps = {
  closeModal: () => void;
  getPosts: () => void;
};

type PostData = {
  name: string;
  job: string;
  userId: number | "";
};

export default function CreatePost({ closeModal, getPosts }: CrudProps) {
  const [inputs, setInputs] = useState<PostData>({
    name: "",
    job: "",
    userId: "",
  });

  // Define a function to handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Define a function to handle form submission
  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/posts", inputs);
      console.log(response?.data);
      getPosts();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="popup">
      <form onSubmit={createPost}>
        <button className="close-btn" onClick={closeModal}>
          ❌
        </button>
        <h1>Create Post</h1>
        <div className="inputs">
          <label htmlFor="">User Id</label>
          <input
            type="number"
            name="userId"
            value={inputs.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputs">
          <label htmlFor="">Name</label>
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputs">
          <label htmlFor="">Job</label>
          <input
            name="job"
            value={inputs.job}
            onChange={handleChange}
            required
          ></input>
        </div>
        <div className="btn">
          <button>Create</button>
        </div>
      </form>
    </div>
  );
}
