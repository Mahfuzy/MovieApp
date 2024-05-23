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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
                {!resetSent? (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 focus:ring-offset-1 ring-offset-gray-100"
                            type="email"
                            name="email"
                            placeholder="Email or phone number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Reset Password
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <p>Password reset email sent. Please check your inbox.</p>
                        
                    </div>
                )}
            </div>
        </div>
    );
}

export default PasswordResetForm;
