import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Toast, ToastContainer } from "react-bootstrap";

const AssignTask = () => {
  const [tasks, setTasks] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const statusColumns = ["ToDo", "InProgress", "Done"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");

      const userFromLS = JSON.parse(localStorage.getItem("user"))
      console.log(userFromLS)
      const tasks = response.data.filter(
        (task) =>
          task.assignee === userFromLS.username

      );


      console.log(response.data, userFromLS)

      setTasks(tasks || []);

    } catch (error) {
      console.error("Error fetching tasks:", error);
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
      setToastMessage("Task status updated successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleAddComment = async (taskId, comment) => {
    if (!comment.trim()) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          comments: task.comments ? [...task.comments, comment] : [comment],
        };
        try {
          axios.put(`http://localhost:5000/tasks/${task.id}`, updatedTask);
        } catch (error) {
          console.error("Error adding comment:", error);
        }
        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    setToastMessage("Comment added successfully!");
    setShowToast(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Assigned Tasks</h2>

      
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
                            className="card mb-3 p-3"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h6>{task.title}</h6>
                            <p>{task.description}</p>
                            <small>
                              Assign Date: {task.assignDate} <br />
                              Deadline: {task.deadline}
                            </small>
                            <div className="mt-3">
                              <input
                                type="text"
                                placeholder="Add a comment"
                                className="form-control mb-2"
                                id={`comment-${task.id}`}
                              />
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  const commentInput = document.getElementById(
                                    `comment-${task.id}`
                                  );
                                  handleAddComment(task.id, commentInput.value);
                                  commentInput.value = "";
                                }}
                              >
                                Add Comment
                              </button>
                              <ul className="mt-3">
                                {task.comments &&
                                  task.comments.map((comment, idx) => (
                                    <li key={idx}>{comment}</li>
                                  ))}
                              </ul>
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

export default AssignTask;
