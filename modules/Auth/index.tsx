import { signIn, signOut, useSession } from "next-auth/react"
import { Loading } from "../Errors"


export function logout() {
    signOut({callbackUrl:"/"})
}


export function LoginRequired({ children }:{ children:any }) {
    const session = useSession()
    if (session.status === "authenticated") {
        return <>{children}</>
    }else if (session.status === "loading"){
        return <Loading />
    }else{
        signIn("google")
        return <Loading />
    }
}