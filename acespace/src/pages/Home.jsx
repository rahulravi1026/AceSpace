import HeaderText from '../components/HeaderText';

import '../styles/signin-styles.css';
import { signOut } from 'firebase/auth';
import { auth } from "../firebaseConfig";
//import { useAuthState } from "react-firebase-hooks/auth";

function Profile() {
    //const [user] = useAuthState(auth);

    function logout() {
        signOut(auth);
    }

    return (
        <div className = "loginPage">
            <HeaderText>this is your <span className = "primaryText">home</span></HeaderText>
            <button onClick = {logout}>Logout</button>
        </div>
    );
}

export default Profile;

