import { useEffect, useState } from "react";
import { auth } from "./Firebase";

const AuthChecker = () => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // User is signed in
                setUser(authUser);
                authUser.getIdToken()
                    .then(token => setAuthToken(token))
                    .catch(error => console.error('Error getting user token:', error));
            } else {
                // User is signed out
                setUser(null);
                setAuthToken(null);
            }
        });

        // Cleanup function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    return { user, authToken };
};

export default AuthChecker;
