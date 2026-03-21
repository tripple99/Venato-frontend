import toast from 'react-hot-toast';



// ApiServiceErrors.ts
export function handleServiceError(error: any) {
  // Log to console or send to monitoring service
  console.error("API Error:", error);

  if (error.response) {
    // Server returned an error
    const status = error.response.status;
    const message = error.response.data?.message || "Something went wrong";
    switch (status) {
      case 400:
        toast.error(message)
        // handle bad request
        break;
      case 404:
        toast.error(message)
        // handle not found
        break;
       case 409:
        toast.error(message)
        // handle conflict
        break;
      case 401:
       toast.error(message)
        // handle unauthorized (e.g., redirect to login)
        break;
      case 403:
        toast.error(message)
        // forbidden
        break;
      case 500:
        toast.error(message)
        // server error
        break;
    }

    return message;
  } else if (error.request) {
    // Request made but no response
    return "No response from server. Check your network.";
  } else {
    // Something else
    return "Request setup error";
  }
}
