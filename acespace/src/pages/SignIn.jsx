import HeaderText from '../components/HeaderText';
import MainText from '../components/MainText';
// import GoogleButton from 'react-google-button';
import GoogleSignInButton from '../components/GoogleSignInButton';
import GoogleIcon from '../components/GoogleIcon';
import logo from '../assets/logo.png';
import { auth, provider, db } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

import '../styles/signin-styles.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";

import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; 

function SignIn() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    const userExists = async (email) => {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("email", "==", email)));
      
        if (querySnapshot.empty) {
          console.log("User not found");
          return false;
        } else {
          console.log("User found");
          return true;
        }
    };

    const formatName = (name) => {
        const words = name.split(' ');
        const convertedWords = words.map(word => {
          const firstLetter = word.charAt(0).toUpperCase();
          const restOfWord = word.slice(1).toLowerCase();
          return firstLetter + restOfWord;
        });
        return convertedWords.join(' ');
    }

    useEffect(() => {
        const navigateAfterSignIn = async () => {
            if (user) {
              const exists = await userExists(user?.email);
              if(exists) {
                navigate('/');
              }
              else {
                navigate('/profile');
                // eslint-disable-next-line
                const collegeName = user?.email.split('@')[1].split('.')[1].toUpperCase()
                const formattedDisplayName = formatName(user?.displayName);
                try {
                    const docRef = await addDoc(collection(db, "users"), {
                      name: formattedDisplayName,
                      email: user?.email,
                      college: null,
                      gradYear: null,
                      coursesTaken: [],
                      currentCourses: []
                    });
                    console.log("Document written with ID: ", docRef.id);
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }
              }
            }
        };

        navigateAfterSignIn();
	}, [user, loading, error, navigate]);

	function login() {
		signInWithPopup(auth, provider, );
	}

    return (
        <div className = "loginPage">
            <div className = "header">
                <HeaderText>ace space</HeaderText>
                <img className = "logo" src = {logo} alt = "Logo" />
            </div>
            <MainText>get closer to <br/> <span className = "primaryText">acing</span> your classes</MainText>
            {/* <GoogleButton type="light" />  */}
            <GoogleSignInButton onClick = {login}>
                <GoogleIcon />
                <span className = "googleSignInText">Sign in with Google</span>
            </GoogleSignInButton>
        </div>
    );
}

export default SignIn;

