import { MdAddTask } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { loginContextObj } from "../contexts/LoginContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function CreateTask() {
  const { currentUser, setCurrentUser } = useContext(loginContextObj);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmitNewtask = async (newTask) => {
    try {
      const res = await axios.put(
        `${API_URL}/user-api/todo/${currentUser._id}`,
        newTask,
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.message === "todo added") {
        setCurrentUser(res.data.payload);
        reset(); // clear form
      }
    } catch (err) {
      console.error(
        "Create task failed:",
        err.response?.data || err.message
      );
      alert("Failed to create task");
    }
  };

  return (
    <div className="create-task-container">
      <h1 className="create-task-title">Create Task</h1>

      <form onSubmit={handleSubmit(onSubmitNewtask)}>
        <div className="mb-3">
          <input
            type="text"
            {...register("taskName", { required: true })}
            className="form-control"
            placeholder="Task Name"
          />
          {errors?.taskName && (
            <p className="text-danger">Task name is required</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="text"
            {...register("description", { required: true })}
            className="form-control"
            placeholder="Task Description"
          />
          {errors?.description && (
            <p className="text-danger">Task description is required</p>
          )}
        </div>

        <button type="submit" className="btn btn-info create-btn">
          Create Task <MdAddTask />
        </button>
      </form>
    </div>
  );
}

export default CreateTask;
