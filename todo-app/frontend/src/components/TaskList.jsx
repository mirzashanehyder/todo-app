import { useContext, useState } from "react";
import { loginContextObj } from "../contexts/LoginContext";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import '../App.css';

function TaskList() {
  const { currentUser, setCurrentUser } = useContext(loginContextObj);
  const { register, handleSubmit, setValue, reset } = useForm();

  // modal state
  const [modalState, setModalState] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  // open edit modal
  const openModal = (taskObj) => {
    setTaskBeingEdited(taskObj);
    setValue("taskName", taskObj.taskName);
    setValue("description", taskObj.description);
    setModalState(true);
  };

  // close modal
  const closeModal = () => {
    setModalState(false);
    setTaskBeingEdited(null);
    reset();
  };

  // save edited task
  const saveModifiedTask = async (modifiedTaskObj) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/user-api/edit-todo/userid/${currentUser._id}/taskid/${taskBeingEdited._id}`,
        modifiedTaskObj,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCurrentUser(res.data.payload); // ✅ full updated user
        closeModal();
      }
    } catch (err) {
      console.error("Edit failed:", err.response?.data || err.message);
      alert("Failed to save task");
    }
  };

  // mark task as completed
  const setTaskCompleted = async (taskid) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/user-api/edit-status/userid/${currentUser._id}/taskid/${taskid}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCurrentUser(res.data.payload);
      }
    } catch (err) {
      console.error("Status update failed:", err.response?.data || err.message);
    }
  };

  // delete task
  const deleteTask = async (taskid) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/user-api/delete-todo/userid/${currentUser._id}/taskid/${taskid}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCurrentUser(res.data.payload);
      }
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className= {`mt-4 bg-anime `} >
      

      <h1 className="text-center text-success">List of Tasks</h1>

      {currentUser?.todos?.length === 0 && (
        <p className="text-center text-muted"><img className="w-50" src="\src\assets\empty-task.jpg" alt="" /></p>
      )}

      {currentUser?.todos?.map((todoObj) => (
        <div
          key={todoObj._id}
          className={`border p-3 mb-3 rounded position-relative ${
            todoObj.status === "completed" ? "task-completed" : ""
          }`}
        >
          {/* delete button */}
          <div className="">
          <button
            className="btn-close  task-close"
            onClick={() => deleteTask(todoObj._id)}
            style={{ top: "10px", right: "10px" }}
          />
          </div>

          {/* status */}
          <div className="text-end mb-2">
            <span
              className={`badge status-badge${
                todoObj.status === "completed"
                  ? "bg-success"
                  : "bg-warning text-info"
              }`}
            >
              {todoObj.status}
            </span>
          </div>

          <h5>{todoObj.taskName}</h5>
          <p>{todoObj.description}</p>

          <div className="d-flex justify-content-end gap-2 task-actions">
            {todoObj.status !== "completed" && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setTaskCompleted(todoObj._id)}
              >
                Mark as completed
              </button>
            )}

            <button
              className="btn btn-primary btn-sm"
              onClick={() => openModal(todoObj)}
            >
              <FaRegEdit />
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      <Modal show={modalState} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit(saveModifiedTask)}>
            <input
              type="text"
              {...register("taskName", { required: true })}
              className="form-control mb-3"
              placeholder="Task name"
            />

            <input
              type="text"
              {...register("description", { required: true })}
              className="form-control mb-3"
              placeholder="Description"
            />

            <button type="submit" className="btn btn-success w-100">
              Save <MdTaskAlt/>
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TaskList;
