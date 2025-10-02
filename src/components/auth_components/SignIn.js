import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null); // New state for holding error message

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const history = useHistory();

  const FormLogin = async (e) => {
    e.preventDefault();

    try {
      // Auth removed
      history.push('/');
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No user found with this email. Please sign up.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password. Please try again.";
          break;
        default:
          errorMessage = "Please sign up if you do not have an account.";
          break;
      }
      setError(errorMessage);
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="signInPage bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="signIn bg-white p-10 rounded-lg shadow-md w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        <form onSubmit={FormLogin}>
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
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Sign In
          </button>
        </form>
        <div className="mt-4">
          <p>Forgot your password? <Link className="text-blue-500 hover:text-blue-700" to="/reset-password">Reset it here.</Link></p>
          <p>New to our platform? <Link className="text-blue-500 hover:text-blue-700" to="/signup">Create an account.</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
