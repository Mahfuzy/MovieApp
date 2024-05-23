import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "./Firebase";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    re_password: "",
  });
  const [errors, setErrors] = useState({}); // State for holding error messages

  const { email, username, password, re_password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const history = useHistory();

  const FormSignUp = async (e) => {
    e.preventDefault();
    let tempErrors = {}; // Temporary object to hold errors
    if (password !== re_password) {
      tempErrors.passwordsMatch = 'Passwords do not match';
    }
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors); // Update errors state if any
      return; // Exit early if there are errors
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: username
      });
      console.log("user signed up: ", userCredential.user);
      history.push("/");
    } catch (error) {
      console.error('Sign up error: ', error.message);
    }
  };

  return (
    <div className="signInPage bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="signIn bg-white p-10 rounded-lg shadow-md w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={FormSignUp}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email or Phone Number</label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              placeholder="Email or phone number"
              value={email}
              onChange={onChange}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={onChange}
              minLength="6"
            />
            {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              minLength="6"
            />
            {errors.passwordsMatch && <p className="text-red-600 text-xs mt-1">{errors.passwordsMatch}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="re_password" className="block text-gray-700 text-sm font-bold mb-2">Re-enter Password</label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="re_password"
              placeholder="Re-enter password"
              value={re_password}
              onChange={onChange}
              minLength="6"
            />
            {errors.re_password && <p className="text-red-600 text-xs mt-1">{errors.re_password}</p>}
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Sign Up
          </button>
        </form>
        <div className="mt-4">
          <p>Already have an account? <Link className="text-blue-500 hover:text-blue-700" to="/login">Sign In now.</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
