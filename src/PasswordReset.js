import React, { useState } from "react";
import { auth } from "./Firebase";

const PasswordResetForm = () => {
    const [email, setEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await auth.sendPasswordResetEmail(email);
            setResetSent(true);
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
        }
    }

    return (
        <div>
            {!resetSent ? (
                <form onSubmit={handleReset} className="flex flex-col">
                    <h2>Reset Password</h2>
                    <input required className="input p-2 w-[500px] bg-slate-400 text-white text-lg" type="email" name="email" placeholder="Email or phone number" value={email} onChange={e => setEmail(e.target.value)}/> 
                    <button className="signIn-btn p-2 text-white bg-red-500 w-[300px] rounded-sm self-center" type="submit">Reset Password</button>
                </form>
            ) : (
                <div>
                    <p>Password reset email sent. Please check your inbox.</p>
                    {/* You can add additional UI elements here if needed */}
                </div>
            )}
        </div>
    );
}

export default PasswordResetForm;
