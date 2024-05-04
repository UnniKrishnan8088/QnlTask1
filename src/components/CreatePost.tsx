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
  userId: number;
};

export default function CreatePost({ closeModal, getPosts }: CrudProps) {
  const [inputs, setInputs] = useState<PostData>({
    name: "",
    job: "",
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
      //   const response = await axios.post(
      //     "https://jsonplaceholder.typicode.com/posts",
      //     inputs
      //   );
      const response = await axios.post("http://localhost:3001/posts", inputs);
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
          <label htmlFor="">Name</label>
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </div>
        <div className="input">
          <label htmlFor="">Job</label>
          <input name="job" value={inputs.job} onChange={handleChange}></input>
        </div>
        <button>Create</button>
      </form>
    </div>
  );
}
