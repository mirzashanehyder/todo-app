import React from 'react'
import CreateTask from './CreateTask';
import TaskList from './TaskList'
import '../App.css'
import { useState } from 'react';

function UserProfile() {
    const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className={`user-profile  bg-anime ${darkMode ? "dark-mode" : ""}`}>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-sm btn-dark"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <div className="row g-0">
        <div className="col-sm-5 profile-card">
          <CreateTask />
        </div>
        <div className="col-sm-7 profile-card">
          <TaskList />
        </div>
      </div>
    </div>
  )
}

export default UserProfile
