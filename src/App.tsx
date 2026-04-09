import { RouterProvider } from 'react-router-dom'
import {router} from "@/routes/routes"

import { Toaster } from "@/components/ui/sonner"
function App() {


  return (
    <>
     <Toaster position="top-right" duration={3000}/>
    <RouterProvider router={router}/>
   
    </>
  )
}

export default App
