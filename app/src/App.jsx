import { useState } from 'react'
import Register from './Register'
import Login from './Login'
import Dashboard from './Dashboard'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
function App() {
 
  const router=createBrowserRouter([
    {
      path:'/',
      element:<><Register/></>
    },
    {
      path:'/login',
      element:<><Login/></>
    },
    {
      path:'dash',
      element:<><Dashboard/></>
    }
  ])

  return (
    <>
      <RouterProvider router={router}/>

      
    </>
  )
}

export default App
