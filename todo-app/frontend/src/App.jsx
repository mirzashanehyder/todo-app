import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import CreateTask from './components/CreateTask';
import TaskList from './components/TaskList';
import UserProfile from './components/UserProfile';
import Task from './components/Task';
import RootLayout from './components/RootLayout';
import Header from './components/Header';
import RouterError from './components/RouterError';


function App() {

  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement:<RouterError />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path:"login",
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: 'user-profile',
          element: <UserProfile />,
          children: [
            {
              path: 'create-task',
              element: <CreateTask />,
            },
            { 
              path: 'task-list',
              element: <TaskList />,
            },
            {
              path: 'task/:taskId',
              element: <Task />,
            }
          ]
        },
      ]
    }
  ])


  return (
    <div>
      <RouterProvider router={browserRouter}></RouterProvider>
    </div>
  )
}

export default App
