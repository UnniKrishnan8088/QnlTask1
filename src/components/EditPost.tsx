import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

type PostData = {
  name: string;
  job: string;
  userId: number;
  id?: number | null;
};

type EditProps = {
  editData: PostData;
  closeModal: () => void;
  getPosts: () => void;
  setPosts: Dispatch<SetStateAction<PostData[]>>;
};

export default function EditPost({
  editData,
  closeModal,
  getPosts,
}: EditProps) {
  const [inputs, setInputs] = useState<PostData>({
    name: editData.name,
    job: editData.job,
    userId: editData.userId,
    id: editData.id,
  });

  // Define a function to handle changes in input fields
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

  // Define a function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3001/posts/${inputs.id}`,
        inputs
      );
      console.log(response);

      getPosts();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <button className="close-btn" onClick={handleClose}>
          ❌
        </button>
        <h1>Edit Post</h1>
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
          <label htmlFor="">title</label>
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputs">
          <label htmlFor="">body</label>
          <input
            name="job"
            value={inputs.job}
            onChange={handleChange}
            required
          ></input>
        </div>
        <div className="btn">
          <button>Save Changes</button>
        </div>
      </form>
    </div>
  );
}
