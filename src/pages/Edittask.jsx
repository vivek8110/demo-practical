import React, { useState, useEffect } from 'react';

function Edittask({ task, onFormSubmit, onCloseModal,handleedit}) {
  const [editedTask, setEditedTask] = useState({ id: task.id, taskName: task.taskName });
  

  // Reset the state when the task prop changes
  useEffect(() => {
    setEditedTask({ id: task.id, taskName: task.taskName });
  }, [task]);

  return (
    <div className="modal">
      <div className="modal-content">
        {/* Your form goes here */}
        <form onSubmit={(e) => { e.preventDefault(); onFormSubmit(editedTask); }}>
          {/* Render form fields with editedTask data */}
          <label>
            Task Name:
            <input type="text" value={editedTask.taskName} onChange={(e) => setEditedTask({ ...editedTask, taskName: e.target.value })} />
          </label>

          {/* Other form fields go here */}

          <button type="submit">Save</button>
        </form>
        <button onClick={onCloseModal}>Cancel</button>
      </div>
    </div>
  );
}

export default Edittask;
