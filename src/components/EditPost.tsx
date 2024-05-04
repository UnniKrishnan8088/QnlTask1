import { useState } from "react";
import axios from "axios";

type PostData = {
  title: string;
  body: string;
  userId: number;
  id?: number | null;
};

type EditProps = {
  editData: PostData;
  closeModal: () => void;
  getPosts: () => void;
};

export default function EditPost({
  editData,
  closeModal,
  getPosts,
}: EditProps) {
  const [inputs, setInputs] = useState<PostData>({
    title: editData.title,
    body: editData.body,
    userId: editData.userId,
    id: editData.id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${inputs.id}`,
        inputs
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <button onClick={handleClose}>X</button>
        <h2>Edit Post</h2>
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
        <button>Save Changes</button>
      </form>
    </div>
  );
}
