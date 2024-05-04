import React from "react";
import { auth } from "./Firebase";
import { useHistory } from "react-router-dom";

const SignOut = () => {
    const history = useHistory();

    const signOut = async (e) => {
        e.preventDefault();
        try {
            await auth.signOut();
            console.log("Signed out");
            history.push("/"); // Redirect to home after sign out
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <form onSubmit={signOut}>
            <button className="mx-2 hover:bg-slate-700 rounded-md" type="submit">Sign Out</button>
        </form>
    );
}

export default SignOut;
