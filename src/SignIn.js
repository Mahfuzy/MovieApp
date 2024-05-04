import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "./Firebase";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Navbar from "./Navbar";


const SignIn = () => {
const [active, isActive] = useState(null);
const [formData, setFormData] = useState({
    email: "",
    password: ""
});

const {email, password} = formData;

function onChange (e) {
    setFormData({
           ...formData,
            [e.target.name]: e.target.value
        });
}

const history = useHistory();

const FormLogin = async(e) => {
    e.preventDefault();
    try {
        await auth.signInWithEmailAndPassword(email, password);
        console.log("Logged in: ", auth.currentUser);
        history.push('/movies');
    } catch (error) {
        console.error("Sign-in error",error.message);
        
    }
    
    
}
    
   
const handleClick = () => {
    if (active === null) {
      isActive(true);
    } else {
        isActive(null);
    }
    }


    return ( 
        <div className="signInPage">
            <Navbar/>
            <div className="signIn">
                <form onSubmit={FormLogin}>
                    <h2>Sign In</h2>
                    <input required className="input" type="email" name="email" placeholder="Email or phone number" value={email} onChange={e => onChange(e)}/> 
                    <input required className="input" type="password" name="password" placeholder="Password" value={password} onChange={e => onChange(e)} minLength={'6'}/>
                    <button className="signIn-btn" type="submit">Sign In</button>
                    <div className="help">
                        <div>
                            <input className="check" type="checkbox" name="remember-me" id="remember-me" />Remember me
                        </div>
                        <a href="#help">Need help?</a>
                    </div>
                    <Link className="text-sm mt-1" to="/reset-password">Forgotten Password?</Link>
                    <div className="new-person">
                    <p>New to Netflix? <Link className="SignUp" to="/signup">Sign up now.</Link></p>
                        <p className="recaptcha">This page is protected by Google reCAPTCHA to ensure you are not a bot. <span onClick={handleClick}>Learn more.</span></p>
                        { active && (<p className="learn-more">The information collected by Google reCAPTCHA is subject to the Google <a href="http://google.com">Privacy Policy</a> and <a href="http://google.com">Terms of Service</a>, and is used for providing, maintaining, and improving the reCAPTCHA service and for general security purposes (it is not used for personalized advertising by Google).</p>)}
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default SignIn;