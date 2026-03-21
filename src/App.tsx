import { RouterProvider } from 'react-router-dom'
import {router} from "@/routes/Routes"

import { Toaster } from "@/components/ui/sonner"
function App() {


  return (
    <>
    <RouterProvider router={router}/>
    <Toaster position="top-right" />
    </>
  )
}

export default App
