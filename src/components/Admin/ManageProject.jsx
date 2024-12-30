import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "ToDo",
    deadline: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const statusColumns = ["ToDo", "InProgress", "Done"];

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      // Filter users by role "developer" only
      const developers = response.data.filter((user) => user.role === "developer");
      setUsers(developers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      status: newTask.status,
      deadline: newTask.deadline,
    };

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/tasks/${editTaskId}`, taskData);
        setToastMessage("Task updated successfully!");
      } else {
        await axios.post("http://localhost:5000/tasks", taskData);
        setToastMessage("Task added successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchTasks();
      setShowToast(true);
    } catch (error) {
      console.error("Error adding/editing task:", error);
    }
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      status: "ToDo",
      deadline: "",
    });
    setEditMode(false);
    setEditTaskId(null);
  };

  const handleEdit = (task) => {
    setShowModal(true);
    setEditMode(true);
    setEditTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      status: task.status,
      deadline: task.deadline,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
      setToastMessage("Task deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId;
    updatedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(updatedTasks);

    try {
      await axios.put(`http://localhost:5000/tasks/${movedTask.id}`, movedTask);
      setToastMessage("Task status updated!");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Task Management</h2>

      <Button
        variant="primary"
        className="mb-4"
        onClick={() => {
          setShowModal(true);
          resetForm();
        }}
      >
        Add Task
      </Button>

      {/* Modal for Adding/Editing Task */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              className="form-control mb-2"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Description"
              className="form-control mb-2"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              required
            />
            <select
              className="form-control mb-2"
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              required
            >
              <option value="">Assign To</option>
              {users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="form-control mb-2"
              value={newTask.deadline}
              onChange={(e) =>
                setNewTask({ ...newTask, deadline: e.target.value })
              }
              required
            />
            <Button variant="success" type="submit" className="w-100">
              {editMode ? "Update Task" : "Add Task"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          show={showToast}
          autohide
          delay={3000}
          onClose={() => setShowToast(false)}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Drag and Drop Task Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="d-flex justify-content-between">
          {statusColumns.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="p-3 bg-light rounded shadow-sm"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ width: "30%" }}
                >
                  <h4 className="text-center">{status}</h4>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="card mb-2 p-3"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h6>{task.title}</h6>
                            <p>{task.description}</p>
                            <small>
                              Assignee: {task.assignee} <br />
                              Deadline: {task.deadline}
                            </small>
                            <div className="d-flex justify-content-end mt-2">
                              <Button
                                size="sm"
                                variant="warning"
                                className="me-2"
                                onClick={() => handleEdit(task)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(task.id)}
                              >
                                Delete
                              </Button>
                            </div>

                            {/* Display Comments */}
                            <div className="mt-3">
                              <h6>Comments</h6>
                              {task.comments && task.comments.length > 0 ? (
                                task.comments.map((comment, idx) => (
                                  <p key={idx}>{comment}</p>
                                ))
                              ) : (
                                <p>No comments yet.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ManageTasks;
