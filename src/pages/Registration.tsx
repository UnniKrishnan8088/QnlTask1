import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

type FormData = {
  email: string;
  password: string;
};

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  // Define a function to handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Define a function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://reqres.in/api/register", {
        email: formData.email,
        password: formData.password,
      });
      if (response?.status === 200) {
        navigate("/login");
      }
      console.log(response, "==>>");
    } catch (error: any) {
      alert(error.message);

    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <div className="inputs">
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputs">
          <label htmlFor="">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="btn">
          <button>Register</button>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
