import { RouterProvider } from 'react-router-dom'
import {router} from "@/routes/routes"

import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react";
import { useNotifier } from "@/handlers/NotificationService";
import { setGlobalNotifier, initGlobalErrorHandler } from "@/handlers/GlobalErrorHandler";
function App() {
  const notifier = useNotifier();

  useEffect(() => {
    setGlobalNotifier(notifier);
    const teardown = initGlobalErrorHandler();
    return teardown;
  }, [notifier]);
  return (
    <>
     <Toaster position="top-right" duration={3000}/>
    <RouterProvider router={router}/>
   
    </>
  )
}

export default App
