import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import Spinner from "./Spinner"

const ProtectedRoute = ({children}) => {
    const { currentUser,loading } = useContext(AuthContext)

    if(loading){
        return <Spinner />
    }

    if(!currentUser){
        return <Navigate to='/login' replace />
    }

    return children
}

export default ProtectedRoute