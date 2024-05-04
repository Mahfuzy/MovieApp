import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "./Firebase";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";

const SignUp = () => {
  const [active, isActive] = useState(null)
  // State to manage form data
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    re_password: "",
  });

  const { email, username, password, re_password } = formData;

  // Function to handle input changes and update form data
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const history = useHistory();

  // Function to handle form submission
  const FormSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      if (password !== re_password) {
        throw new Error('Passwords do not match');
      }
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: username
      })
      const actionCodeSettings = {
        url: 'http://localhost:3000/movies',
        handleCodeInApp: true,
      };
      await auth.sendSignInLinkToEmail(email, actionCodeSettings);
      alert('A verification link has been sent to your email. Please verify your email to complete the registration.')
      window.localStorage.setItem('emailForRegistration', email);
      console.log("user signed up: ", userCredential.user);
      history.push("/movies");
    } catch(error) {
        console.error('Sign up error: ', error.message);
    }
  };

  const handleClick = () => {
    if (active === null) {
      isActive(true);
    } else {
        isActive(null);
    }
    }

  // JSX for sign up form
  return (
    <div className="signInPage">
      <Navbar/>
      <div className="signIn">
        <form onSubmit={FormSignUp}>
          <h2>Sign Up</h2>
          {/* Input fields for email, username, password, and re-enter password */}
          <input
            required
            className="input"
            type="email"
            name="email"
            placeholder="Email or phone number"
            value={email}
            onChange={onChange} // Call onChange function on input change
          />
          <input
            required
            className="input"
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={onChange}
            minLength="6" // Set minimum length for username
          />
          <input
            required
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            minLength="6" // Set minimum length for password
          />
          <input
            required
            className="input"
            type="password"
            name="re_password"
            placeholder="Re-enter password"
            value={re_password}
            onChange={onChange}
            minLength="6" // Set minimum length for password
          />
          {/* Sign Up button */}
          <button className="signIn-btn" type="submit">
            Sign Up
          </button>
          {/* Additional UI elements like help links */}
          <div className="help">
            <div>
              <input className="check" type="checkbox" name="remember-me" id="remember-me" />Remember me
            </div>
            <a href="#help">Need help?</a>
          </div>
          <div className="new-person">
            <p>Already have an account? <Link className="sign-in" to="/login">Sign In now.</Link></p>
            <p className="recaptcha">This page is protected by Google reCAPTCHA to ensure you are not a bot. <span onClick={handleClick}>Learn more.</span></p>
            {active && (<p className="learn-more">The information collected by Google reCAPTCHA is subject to the Google <a href="http://google.com">Privacy Policy</a> and <a href="http://google.com">Terms of Service</a>, and is used for providing, maintaining, and improving the reCAPTCHA service and for general security purposes (it is not used for personalized advertising by Google).</p>)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
