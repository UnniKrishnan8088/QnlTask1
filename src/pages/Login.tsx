import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FormData } from "../types/types";
import { useAuth } from "../context/auth";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const auth = useAuth();

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
      const response = await axios.post("https://reqres.in/api/login", {
        email: formData.email,
        password: formData.password,
      });
      // if (response?.data?.token) {
        auth?.login(response?.data?.token);
        // localStorage.setItem("token", response?.data?.token);
        navigate("/details");
      // }
      console.log(response?.data?.token, "==>>");
    } catch (error) {
      console.log(error);
    }
  };

  console.log("TOKEN =>>", localStorage.getItem("token"));

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
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
          <button>Login</button>
          <Link to="/">Register</Link>
        </div>
      </form>
    </div>
  );
}
