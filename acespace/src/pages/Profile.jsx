import HeaderText from '../components/HeaderText';
import FormLabelText from '../components/FormLabelText';
import InputField from '../components/InputField';
import CourseTitle from '../components/CourseTitle';
import PrimaryButton from '../components/PrimaryButton';
import ButtonText from '../components/ButtonText';
// import logo from '../assets/logo.png';

import '../styles/profile-styles.css';
import { signOut } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();

    const [user] = useAuthState(auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email);
    const [college, setCollege] = useState('');
    const [gradYear, setGradYear] = useState('');
    const [coursesTaken, setCoursesTaken] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [dropdownVisible, setDropdownVisible] = useState(false);

    function goHome() {
        navigate("/");
    }

    function logout() {
        signOut(auth);
    }

    const formatCourseName = (courseName) => {
        const words = courseName.split(' ');
        const convertedWords = words.map((word, index) => {
          if(index !== 0) {
            const firstLetter = word.charAt(0).toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();
            return firstLetter + restOfWord;
          }
          return word.toUpperCase();
        });
        return convertedWords.join(' ');
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
                    setGradYear(userData.gradYear);
                    setCoursesTaken(userData.coursesTaken);
                    console.log(college);
                } else {
                  console.log("No user found with the specified email.");
                }
            } catch (e) {
                console.error("Error searching for user: ", e)
            }
    
        };
        getExistingProfileInfo();
        // eslint-disable-next-line
	}, [user?.email]);

    useEffect(() => {
        const fetchSearchResults = async () => {
          try {
            const majorsRef = collection(db, "majors");
            const querySnapshot = await getDocs(majorsRef);
            let queryCourses = [];
            querySnapshot.forEach((doc) => {
                const courses = doc.data().courses;
                courses.forEach((course) => {
                    const combinedString = doc.id.toUpperCase() + " " + formatCourseName(course);
                    if (combinedString.toLowerCase().includes(searchQuery.toLowerCase())) {
                      queryCourses.push(combinedString);
                    }
                });
            });
            setSearchResults(queryCourses.slice(0,3));
          } catch (error) {
            console.error('Error fetching search results:', error);
          }
        };
    
        if (searchQuery === '') {
            setSearchResults([]);
        }
        else {
            fetchSearchResults();
        }
    }, [searchQuery]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleCollegeChange = (event) => {
        setCollege(event.target.value);
    };

    const handleGradYearChange = (event) => {
        setGradYear(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setDropdownVisible(searchQuery.length >= 0);
    };

    const handleResultClick = (result) => {
        const nextElement = result.split(' ')[0] + ' ' + result.split(' ')[1];
        
        // if (!coursesTaken.includes(nextElement)) {
        //     setCoursesTaken([...coursesTaken, nextElement]);
        // }
    };

    const handleCourseRemove = (course) => {
        const updatedCourses = coursesTaken.filter((c) => c !== course);
        setCoursesTaken(updatedCourses);
        console.log(coursesTaken);
    };

    const saveFields = async () => {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
        const userRef = doc(db, "users", querySnapshot.docs[0].id);
        await updateDoc(userRef, {
            name: name,
            email: email,
            college: college,
            gradYear: gradYear,
            coursesTaken: coursesTaken
        });
    }

    return (
        <div className = "profilePage">
            <div className = "header">
                <HeaderText className = "createProfileText">create your <span className = "primaryText">profile</span></HeaderText>
                <ButtonText onClick={goHome}>Home</ButtonText>
                <ButtonText onClick={logout}>Logout</ButtonText>
            </div>
            <div className='fieldTitles'>
                <FormLabelText leftColumn>name</FormLabelText>
                <FormLabelText rightColumn>email</FormLabelText>
            </div>
            <div className='fields'>
                <InputField defaultValue={name} onChange = {handleNameChange} leftColumn></InputField>
                <InputField defaultValue={email} onChange = {handleEmailChange} rightColumn></InputField>
            </div>
            <div className = "fieldTitles">
                <FormLabelText leftColumn>college</FormLabelText>
                <FormLabelText rightColumn>grad year</FormLabelText>
            </div>
            <div className='fields'>
                <InputField placeholder="e.g. UCLA" defaultValue = {college} onChange = {handleCollegeChange} leftColumn></InputField>
                <InputField placeholder="e.g. 2026" defaultValue = {gradYear} onChange = {handleGradYearChange} rightColumn></InputField>
            </div>
            <div className = "coursesTakenTitle">
                <FormLabelText leftColumn>courses taken</FormLabelText>
                <div className="courseTitles">
                    {coursesTaken.map((course, index) => (
                        <CourseTitle key={index} onRemove={handleCourseRemove}>{course}</CourseTitle>
                    ))}
                </div>
            </div>
            <div className='searchField'>
                <InputField placeholder = "search by course name..." value = {searchQuery} onChange = {handleSearchChange} leftColumn></InputField>
                {dropdownVisible && (
                    <ul className="dropdown">
                        {searchResults.map((result, index) => (
                            <li className="dropdownElement" key={index} onClick={() => handleResultClick(result)}>
                                {result}
                            </li>
                        ))}
                     </ul>
                )}
            </div>
            <div className = "saveButton">
                <PrimaryButton onClick={saveFields}>Save</PrimaryButton>
            </div>
            {/* <PrimaryButton onClick = {logout}>Logout</PrimaryButton> */}
        </div>
    );
}

export default Profile;