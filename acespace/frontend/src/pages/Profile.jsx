import HeaderText from '../components/HeaderText';
import FormLabelText from '../components/FormLabelText';
import InputField from '../components/InputField';
import CourseTitle from '../components/CourseTitle';
import PrimaryButton from '../components/PrimaryButton';
import ButtonText from '../components/ButtonText';
// import logo from '../assets/logo.png';
import infoIcon from '../assets/info-icon.png';

import '../styles/profile-styles.css';
import { signOut } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast-styles.css';
import StyledToastContainer from '../components/StyledToastContainer';

function Profile() {
    const navigate = useNavigate();

    const [user] = useAuthState(auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email);
    const [college, setCollege] = useState('');
    const [gradYear, setGradYear] = useState('');
    const [coursesTaken, setCoursesTaken] = useState([]);
    const [currentCourses, setCurrentCourses] = useState([]);

    const [takenCoursesSearchQuery, setTakenCoursesSearchQuery] = useState("");
    const [takenCoursesSearchResults, setTakenCoursesSearchResults] = useState([]);

    const [currentCoursesSearchQuery, setCurrentCoursesSearchQuery] = useState("");
    const [currentCoursesSearchResults, setCurrentCoursesSearchResults] = useState([]);

    const [takenCoursesDropdownVisible, setTakenCoursesDropdownVisible] = useState(false);
    const [currentCoursesDropdownVisible, setCurrentCoursesDropdownVisible] = useState(false);

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
                    setCurrentCourses(userData.currentCourses);
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
      
            for (const doc of querySnapshot.docs) {
              const coursesForMajor = await getDocs(collection(db, "majors", doc.id, "courses"));
      
              if (!coursesForMajor.empty) {
                for (const course of coursesForMajor.docs) {
                  const combinedString = doc.id.toUpperCase() + " " + formatCourseName(course.id);
                  console.log(combinedString);
                  if (combinedString.toLowerCase().includes(takenCoursesSearchQuery.toLowerCase())) {
                    queryCourses.push(combinedString);
                  }
                }
              }
            }
            if(takenCoursesSearchQuery !== '') {
                setTakenCoursesSearchResults(queryCourses);
            }
          } catch (error) {
            console.error('Error fetching search results:', error);
          }
        };
      
        if (takenCoursesSearchQuery === '') {
          setTakenCoursesSearchResults([]);
        } else {
          fetchSearchResults();
        }
      }, [takenCoursesSearchQuery]); 

      useEffect(() => {
        const fetchSearchResults = async () => {
          try {
            const majorsRef = collection(db, "majors");
            const querySnapshot = await getDocs(majorsRef);
            let queryCourses = [];
      
            for (const doc of querySnapshot.docs) {
              const coursesForMajor = await getDocs(collection(db, "majors", doc.id, "courses"));
      
              if (!coursesForMajor.empty) {
                for (const course of coursesForMajor.docs) {
                  const combinedString = doc.id.toUpperCase() + " " + formatCourseName(course.id);
                  console.log(combinedString);
                  if (combinedString.toLowerCase().includes(currentCoursesSearchQuery.toLowerCase())) {
                    queryCourses.push(combinedString);
                  }
                }
              }
            }
            if(currentCoursesSearchQuery !== '') {
                setCurrentCoursesSearchResults(queryCourses);
            }
          } catch (error) {
            console.error('Error fetching search results:', error);
          }
        };
      
        if (currentCoursesSearchQuery === '') {
          setCurrentCoursesSearchResults([]);
        } else {
          fetchSearchResults();
        }
      }, [currentCoursesSearchQuery]); 

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

    const handleTakenCoursesSearchChange = (event) => {
        setTakenCoursesSearchQuery(event.target.value);
        setTakenCoursesDropdownVisible(takenCoursesSearchResults.length >= 0);
    };

    const handleCurrentCoursesSearchChange = (event) => {
        setCurrentCoursesSearchQuery(event.target.value);
        setCurrentCoursesDropdownVisible(currentCoursesSearchResults.length >= 0);
    };

    const handleTakenCourseResultClick = (result) => {
        const nextElement = result.split(' ')[0] + ' ' + result.split(' ')[1];
        
        if (!coursesTaken.includes(nextElement)) {
            setCoursesTaken([...coursesTaken, nextElement]);
        }
    };

    const handleCurrentCourseResultClick = (result) => {
        const nextElement = result.split(' ')[0] + ' ' + result.split(' ')[1];
        
        if (!currentCourses.includes(nextElement)) {
            setCurrentCourses([...currentCourses, nextElement]);
        }
    };

    const handleTakenCourseRemove = (course) => {
        const updatedCourses = coursesTaken.filter((c) => c !== course);
        setCoursesTaken(updatedCourses);
    };

    const handleCurrentCourseRemove = (course) => {
        const updatedCourses = currentCourses.filter((c) => c !== course);
        setCurrentCourses(updatedCourses);
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
            coursesTaken: coursesTaken,
            currentCourses: currentCourses
        });
        toast.info('Your profile has been saved!', {
            theme: "dark",
            icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
        });
    }

    return (
        <div className = "profilePage">
            <StyledToastContainer position="top-left" theme="dark"/>
            <div className = "header">
                <HeaderText className = "createProfileText">create your <span className = "primaryText">profile</span></HeaderText>
                <nav className = "navBar">
                    <ButtonText onClick={goHome}>Home</ButtonText>
                    {/* <ButtonText onClick={goTest}>Test</ButtonText> */}
                    <ButtonText onClick={logout}>Logout</ButtonText>
                </nav>
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
                        <CourseTitle key={index} onRemove={handleTakenCourseRemove}>{course}</CourseTitle>
                    ))}
                </div>
            </div>
            <div className='searchField'>
                <InputField placeholder = "search by course name..." value = {takenCoursesSearchQuery} onChange = {handleTakenCoursesSearchChange} leftColumn></InputField>
                {takenCoursesDropdownVisible && (
                    <ul className="dropdown">
                        {takenCoursesSearchResults.map((result, index) => (
                            <li className="dropdownElement" key={index} onClick={() => handleTakenCourseResultClick(result)}>
                                {result}
                            </li>
                        ))}
                     </ul>
                )}
            </div>

            <div className = "coursesTakenTitle">
                <FormLabelText leftColumn>current courses</FormLabelText>
                <div className="courseTitles">
                    {currentCourses.map((course, index) => (
                        <CourseTitle key={index} onRemove={handleCurrentCourseRemove}>{course}</CourseTitle>
                    ))}
                </div>
            </div>
            <div className='searchFieldCurrent'>
                <InputField placeholder = "search by course name..." value = {currentCoursesSearchQuery} onChange = {handleCurrentCoursesSearchChange} leftColumn></InputField>
                {currentCoursesDropdownVisible && (
                    <ul className="dropdown">
                        {currentCoursesSearchResults.map((result, index) => (
                            <li className="dropdownElement" key={index} onClick={() => handleCurrentCourseResultClick(result)}>
                                {result}
                            </li>
                        ))}
                     </ul>
                )}
            </div>
            
            <div className = "saveButton">
                <PrimaryButton onClick={saveFields}>Save</PrimaryButton>
            </div>
        </div>
    );
}

export default Profile;