import { MdAddTask } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { loginContextObj } from "../contexts/LoginContext";
import axios from "axios";

function CreateTask() {
  let { currentUser ,setCurrentUser} = useContext(loginContextObj);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitNewtask = async (newTask) => {
    console.log(newTask);
    let res = await axios.put(`http://localhost:8000/user-api/todo/${currentUser._id}`, newTask, {
      withCredentials: true,
    });
    console.log("res is ", res);
    if(res.data.message==='todo added'){
      setCurrentUser(res.data.payload)
    }
  };

  return (
    <div className="create-task-container">
      <h1 className="create-task-title">Create Task</h1>
      <form className="" onSubmit={handleSubmit(onSubmitNewtask)}>
        <div className="mb-3">
          <input type="text" {...register("taskName")} className="form-control" placeholder="Task Name" />
          {errors?.taskName?.type === "required" && <p className="text-danger">Task name is required</p>}
        </div>
        <div className="mb-3">
          <input type="text" {...register("description")} className="form-control" placeholder="Task Description" />
          {errors?.description?.type === "required" && <p className="text-danger mt-1">Task Description is required</p>}
        </div>
        <button type="submit" className="btn btn-info create-btn">
          Create Task <MdAddTask />

        </button>
      </form>
    </div>
  );
}

export default CreateTask;
