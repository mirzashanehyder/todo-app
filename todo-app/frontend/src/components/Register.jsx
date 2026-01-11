import { useForm } from "react-hook-form";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GrLogin } from "react-icons/gr";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [registerErr, setRegisterErr] = useState("");

  async function onFormSubmit(newUser) {
    newUser.todos = [];

    try {
      let res = await axios.post(
        `${API_URL}/user-api/user`,
        newUser,
        { withCredentials: true }
      );

      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.log("err is ", err.response?.data?.message);
      setRegisterErr(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="user-profile register-bg">
      <h1 className="text-center text-info">User Registration</h1>

      {registerErr && (
        <p className="fs-3 text-warning text-center">{registerErr}</p>
      )}

      <form
        className="w-50 mx-auto mt-4 create-task-container"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        {/* Username */}
        <input
          type="text"
          {...register("name", { required: true, minLength: 4, maxLength: 10 })}
          className="form-control mb-3"
          placeholder="Enter Username"
        />
        {errors?.name?.type === "required" && (
          <p className="text-danger">Username required</p>
        )}

        {/* Email */}
        <input
          type="email"
          {...register("email", { required: true })}
          className="form-control mb-3"
          placeholder="Email"
        />
        {errors?.email && <p className="text-danger">Email required</p>}

        {/* Password */}
        <input
          type="password"
          {...register("password", { required: true })}
          className="form-control mb-3"
          placeholder="Password"
        />
        {errors?.password && (
          <p className="text-danger">Password required</p>
        )}

        <button type="submit" className="btn btn-success sub-btn">
          Register <GrLogin />
        </button>
      </form>
    </div>
  );
}

export default Register;
