import HeaderText from '../components/HeaderText';
import FormLabelText from '../components/FormLabelText';
import InputField from '../components/InputField';
// import logo from '../assets/logo.png';

import '../styles/profile-styles.css';
import { signOut } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { useEffect, useState } from 'react';

function Profile() {
    const [user] = useAuthState(auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email);
    const [college, setCollege] = useState('');

    function logout() {
        signOut(auth);
    }

    useEffect(() => {
        const getExistingProfileInfo = async () => {
            try {
                const usersRef = collection(db, "users");
                const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
              
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setName(userData.name);
                    setEmail(userData.email);
                    setCollege(userData.college);
                } else {
                  console.log("No user found with the specified email.");
                }
            } catch (e) {
                console.error("Error searching for user: ", e)
            }
    
        };
        getExistingProfileInfo();

	}, [user?.email]);

    return (
        //<div className = "loginPage">
        <div>
            <div className = "header">
                <HeaderText>create your <span className = "primaryText">profile</span></HeaderText>
            </div>
            <div className='fieldTitles'>
                <FormLabelText leftColumn>name</FormLabelText>
                <FormLabelText rightColumn>email</FormLabelText>
            </div>
            <div className='fields'>
                <InputField value={name} leftColumn></InputField>
                <InputField value={email} rightColumn></InputField>
            </div>
            <div className = "fieldTitles">
                <FormLabelText leftColumn>college</FormLabelText>
                <FormLabelText rightColumn>grad year</FormLabelText>
            </div>
            <div className='fields'>
                <InputField leftColumn></InputField>
                <InputField rightColumn></InputField>
            </div>
            {/* <HeaderText>{name}</HeaderText>
            <HeaderText>{email}</HeaderText>
            <HeaderText>{college}</HeaderText>
            <img src = {user?.photoURL} referrerPolicy = "no-referrer" alt = "Google User"></img> */}
            <button onClick = {logout}>Logout</button>
        </div>
    );
}

export default Profile;

