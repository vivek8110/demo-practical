import React, { useEffect, useState } from "react";
import useTasks from "../hooks/useTasks";
import Edittask from "./Edittask";

function TasksList() {
  const { tasks, changeTaskStatus, removeTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showall, setShowall] = useState(false);
  const [showunCompleted, setShowunCompleted] = useState(false);
  const [finalTasks, setFinalTasks] = useState([]);
  const [editedTask, setEditedTask] = useState({ id: null, taskName: '' });

  // Maintain separate state for each task's modal
  const [taskModals, setTaskModals] = useState({});

  useEffect(() => {
    let filteredTasks = tasks.filter(t => t.taskName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (showCompleted === true) {
      filteredTasks = filteredTasks.filter(t => t.taskStatus === true);
      setShowall(false);
      setShowunCompleted(false);
    }

    if (showall === true) {
      filteredTasks = tasks;
      setShowCompleted(false);
      setShowunCompleted(false);
    }

    if (showunCompleted === true) {
      filteredTasks = filteredTasks.filter(t => t.taskStatus !== true);
      setShowCompleted(false);
      setShowall(false);
    }

    setFinalTasks(filteredTasks);
  }, [showCompleted, showunCompleted, showall, searchTerm, tasks]);

  const updateTask = (task) => {
    // Open the modal and set the task data
    setEditedTask({ id: task.id, taskName: task.taskName });

    // Open the modal for the specific task
    setTaskModals(prevState => ({
      ...prevState,
      [task.id]: true
    }));
  };

  const handleCloseModal = (taskId) => {
    // Close the modal for the specific task
    setTaskModals(prevState => ({
      ...prevState,
      [taskId]: false
    }));
  };

  const handleFormSubmit = (editedData) => {
    // Handle form submission, e.g., update the task with editedData
    console.log(editedData);

    // Close the modal after handling the submission
    const updatedTasks = finalTasks.map((t) => (
      t.id === editedData.id ? { ...t, taskName: editedData.taskName } : t
    ));

    setTaskModals(prevState => ({
      ...prevState,
      [editedData.id]: false
    }));

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setFinalTasks(updatedTasks);
  };
  return (
    <div className="space-y-4">
      <div className="">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full mb-5 p-1 border-3e5c76 rounded shadow hover:border-1d2d44 transition-colors duration-200"
        />
        <label className="ml-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showall}
            onChange={e => setShowall(e.target.checked)}
            className="mr-2"
          />
          Show All
        </label>
        <label className="ml-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={e => setShowCompleted(e.target.checked)}
            className="mr-2"
          />
          Show completed
        </label>
        <label className="ml-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showunCompleted}
            onChange={e => setShowunCompleted(e.target.checked)}
            className="mr-2"
          />
          Show Uncompleted
        </label>
      </div>
      {
        finalTasks.length > 0 &&
        finalTasks.map(task => (
          <div key={task.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-f0ebd8 rounded shadow">
            <div className="flex-grow mr-4 text-left">
              <span className={`cursor-pointer text-lg ${task.taskStatus ? 'line-through text-0d1321' : 'hover:text-0d1321'} transition-colors duration-200 text-left`} onClick={() => changeTaskStatus(task.id)}>
                {task.taskName}
              </span>
            </div>
            <span className="text-white cursor-pointer bg-0d1321 rounded shadow hover:bg-1d2d44 transition-colors duration-200 mx-3 p-2" onClick={() => removeTask(task.id)}>
              Delete
            </span>
            <span className="text-white cursor-pointer hover:bg-red bg-0d1321 rounded shadow hover:bg-1d2d44 transition-colors duration-200 mx-3 p-2" onClick={() => updateTask(task)}>
              Edit
            </span>

            {/* Pass the specific task modal state and handlers */}
            {taskModals[task.id] && (
              <Edittask
                task={editedTask}
                onFormSubmit={handleFormSubmit}
                onCloseModal={() => handleCloseModal(task.id)}
              />
            )}
          </div>
        ))
      }
    </div>
  );
}

function AddTaskForm(props) {
  const [taskName, setTaskName] = React.useState("")
  const [taskStatus, setTaskStatus] = React.useState(false);

  const { addTask } = useTasks()

  function addTaskEvent(event) {
    event.preventDefault();
    addTask(taskName, taskStatus)
    props.hideForm()
  }


  return (
    <form onSubmit={event => addTaskEvent(event)} className="space-y-4">
      <input value={taskName} onChange={event => setTaskName(event.target.value)} type="text" name="taskName" id="taskName" placeholder="task name" className="w-full p-2 border-3e5c76 rounded shadow hover:border-1d2d44 transition-colors duration-200" />
      <div className="flex items-center">
        <span>Is Completed</span>
        <input type="checkbox" value={taskStatus} onChange={event => setTaskStatus(event.target.checked)} name="isCompleted" id="isCompleted" className="ml-2 hover:border-1d2d44 transition-colors duration-200" />
      </div>
      <button type="submit" className="w-full p-2 text-white bg-0d1321 rounded shadow hover:bg-1d2d44 transition-colors duration-200">submit</button>
    </form>
  )
}

export default function Tasks() {
  const [showTaskAddForm, setShowTaskAddForm] = React.useState(false)

  const handleAddTask = () => {
    setShowTaskAddForm(true)
  }

  const hideAddTaskForm = () => setShowTaskAddForm(false)

  return (
    <>
      <button className="w-40 p-2 text-white bg-3e5c76 rounded shadow hover:bg-1d2d44 transition-colors duration-200" onClick={handleAddTask}>Add Task</button>
      <div className="p-4 space-y-4 w-full">
        {showTaskAddForm ? <AddTaskForm hideForm={hideAddTaskForm} /> : <TasksList />}
      </div>
    </>
  );
}