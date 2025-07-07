import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import Spinner from "./Spinner"


const AuthorizedRoute = ({children}) => {
    const { currentUser,loading } = useContext(AuthContext)

    if(loading){
        return <Spinner />
    }

    if(currentUser){
        return <Navigate to='/' replace />
    }

    return children
}

export default AuthorizedRoute