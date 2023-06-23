import HeaderText from '../components/HeaderText';
import ButtonText from '../components/ButtonText';

import '../styles/home-styles.css';
import { signOut } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
//import { useAuthState } from "react-firebase-hooks/auth";

function Profile() {
    const navigate = useNavigate();
    //const [user] = useAuthState(auth);

    function goProfile() {
        navigate("profile");
    }

    function logout() {
        signOut(auth);
    }

    return (
        <div className = "homePage">
            <div className = "header">
                <HeaderText className = "yourHomeText">this is your <span className = "primaryText">home</span></HeaderText>
                <ButtonText onClick={goProfile}>Profile</ButtonText>
                <ButtonText onClick={logout}>Logout</ButtonText>
            </div>
        </div>
    );
}

export default Profile;

