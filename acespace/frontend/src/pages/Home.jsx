import HeaderText from '../components/HeaderText';
import ButtonText from '../components/ButtonText';
import HomeCourseTitle from '../components/HomeCourseTitle';

import '../styles/home-styles.css';
import { signOut } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, arrayUnion, setDoc, getDoc, deleteDoc, doc, updateDoc, query, where, onSnapshot } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import infoIcon from '../assets/info-icon.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast-styles.css';
import StyledToastContainer from '../components/StyledToastContainer';
import HelpPopupForm from '../components/HelpPopupForm';
import CourseHeading from '../components/CourseHeading';
import HelpCard from '../components/HelpCard';
import FulfillCard from '../components/FulfillCard';

function Home() {
    const { v4: uuidv4 } = require('uuid');

    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [currentCourses, setCurrentCourses] = useState(null);
    // const [helpRequests, setHelpRequests] = useState(null);
    // eslint-disable-next-line
    const [convertedHelpRequests, setConvertedHelpRequests] = useState([]);
    // const [fulfillRequests, setFulfillRequests] = useState(null);
    // eslint-disable-next-line
    const [convertedFulfillRequests, setConvertedFulfillRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);
    const [courseForHelp, setCourseForHelp] = useState('');

    const [isHelpRequestsVisible, setIsHelpRequestsVisible] = useState(false);
    const [isFulfillRequestsVisible, setIsFulfillRequestsVisible] = useState(false);

    const toggleHelpPopup = () => {
      setIsHelpPopupOpen(!isHelpPopupOpen);
    };  

    function goProfile() {
        navigate("profile");
    }

    function goToCourse(courseName) {
        navigate(`/course/${courseName}`);
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

    const formatCourseTitle = (courseName) => {
      const words = courseName.split(' ');
      const convertedWords = words.map((word, index) => {
          const firstLetter = word.charAt(0).toUpperCase();
          const restOfWord = word.slice(1).toLowerCase();
          return firstLetter + restOfWord;
      });
      return convertedWords.join(' ');
  }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setDropdownVisible(searchQuery.length >= 0);
    };

    useEffect(() => {
        const getExistingProfileInfo = async () => {
            try {
                const usersRef = collection(db, "users");
                const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
              
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setCurrentCourses(userData.currentCourses);
                    // setHelpRequests(userData.helpRequests);
                    // setFulfillRequests(userData.fulfillRequests);
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
    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
        const documentID = querySnapshot.docs[0].id;
  
        const unsub = onSnapshot(doc(db, "users", documentID), async (document) => {
          const docData = document.data();
          const helpRequests = docData.helpRequests;
          const fulfillRequests = docData.fulfillRequests;
  
          if (helpRequests) {
            const convertedRequests = [];
  
            for (const helpRequest of helpRequests) {
              const requestRef = doc(db, "requests", helpRequest.id);
              const requestSnapshot = await getDoc(requestRef);
              const requestData = requestSnapshot.data();
              convertedRequests.push(requestData);
            }
  
            setConvertedHelpRequests(convertedRequests);
          } else {
            setConvertedHelpRequests([]);
          }

          if (fulfillRequests) {
            const convertedRequests = [];
  
            for (const fulfillRequest of fulfillRequests) {
              const requestRef = doc(db, "requests", fulfillRequest.id);
              const requestSnapshot = await getDoc(requestRef);
              const requestData = requestSnapshot.data();
              convertedRequests.push(requestData);
            }
  
            setConvertedFulfillRequests(convertedRequests);
          } else {
            setConvertedFulfillRequests([]);
          }
        });
  
        return () => unsub();
      } catch (e) {
        console.error("Error fetching user data: ", e);
      }
    };
  
    fetchUserData();
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
                  if (combinedString.toLowerCase().includes(searchQuery.toLowerCase())) {
                    queryCourses.push(combinedString);
                  }
                }
              }
            }
            if(searchQuery !== '') {
                setSearchResults(queryCourses);
            }
          } catch (error) {
            console.error('Error fetching search results:', error);
          }
        };
      
        if (searchQuery === '') {
          setSearchResults([]);
        } else {
          fetchSearchResults();
        }
      }, [searchQuery]);      

    function extractMajor(str) {
        const regex = /^[^0-9]*/;
        const match = str.match(regex);
        if (match) {
          return match[0];
        }
        return str;
    }

    function extractCourse(str) {
        const regex = /[0-9].*/;
        const match = str.match(regex);
        if (match) {
          return match[0];
        }
        return str;
    }

    const getCourseName = async (course) => {
      const major = extractMajor(course).slice(0,-1).toLowerCase();
      const coursesForMajor = await getDocs(collection(db, "majors", major, "courses"));
      if(!coursesForMajor.empty) {
        for (const c of coursesForMajor.docs) {
          if(c.id.split(' ')[0].toLowerCase() === extractCourse(course).split(' ')[0].toLowerCase()) {
            return formatCourseTitle(c.id.split(" ").slice(1).join(" "));
          }
        }
      }
    };

    const handleResultClick = (result) => {
        const courseName = extractMajor(result).slice(0,-1) + ' ' + extractCourse(result).split(' ')[0];
        goToCourse(courseName);
    };

    const handleCurrentCourseRemove = async (course) => {
      const updatedCourses = currentCourses.filter((c) => c !== course);
      setCurrentCourses(updatedCourses);

      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
      const userRef = doc(db, "users", querySnapshot.docs[0].id);
      await updateDoc(userRef, {
          currentCourses: updatedCourses
      });
       toast.info('Your profile has been saved!', {
          theme: "dark",
          icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
      });
    };

    // HELP FUNCTIONALITY

    const openRequestPopup = async (course) => {
        setIsHelpPopupOpen(true);
        setCourseForHelp(course);
    };  

    const handleHelpSubmit = async (newTitle, newDescription, courseForHelp) => {
      const uniqueId = uuidv4();

      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
      const userRef = doc(db, "users", querySnapshot.docs[0].id);

      const allUsers = await getDocs(usersRef);
      let potentialHelpers = [];

      allUsers.forEach(async (user) => {
        const userData = user.data();
        const takenCourses = userData.coursesTaken || [];

        if(takenCourses.includes(courseForHelp)) {
          potentialHelpers.push(userData.email);
          const potentialHelperSnapshot = await getDocs(query(usersRef, where("email", "==", userData.email)));
          const potentialHelperRef = doc(db, "users", potentialHelperSnapshot.docs[0].id);

          await updateDoc(potentialHelperRef, {
            fulfillRequests: arrayUnion({ id: uniqueId, status: 0 })
          })
        }
      });

      if(potentialHelpers.length === 0) {
        toast.info('There is no one to help with your request!', {
          theme: "dark",
          icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
        });
        setIsHelpPopupOpen(!isHelpPopupOpen);
        return;
      }

      await updateDoc(userRef, {
        helpRequests: arrayUnion({ id: uniqueId, status: 0 })
      });

      try {
        const docRef = await setDoc(doc(db, "requests", uniqueId), {
          id: uniqueId,
          title: newTitle,
          description: newDescription,
          course: courseForHelp,
          from: user?.email,
          potentialHelpers: potentialHelpers,
        });
        console.log("New document created with ID: ", docRef.id);
      } catch (e) {
        console.error("Error creating document: ", e);
      }

      setIsHelpPopupOpen(!isHelpPopupOpen);
      toast.info('Your help request has been submitted!', {
          theme: "dark",
          icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
      });
    }

    const handleHelpTitleClick = () => {
      setIsHelpRequestsVisible(!isHelpRequestsVisible);
    }

    const handleFulfillTitleClick = () => {
      setIsFulfillRequestsVisible(!isFulfillRequestsVisible);
    }

    const handleHelpCardDelete = async (id) => {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
      const userRef = await doc(db, "users", querySnapshot.docs[0].id);
      const userSnapshot = await getDoc(userRef);

      if(userSnapshot.exists()) {
        const existingHelpRequests = userSnapshot.data().helpRequests;
        const updatedHelpRequests = existingHelpRequests.filter((existingHelpRequest) => existingHelpRequest.id !== id);

        // setHelpRequests(updatedHelpRequests);
        await updateDoc(userRef, { helpRequests : updatedHelpRequests });
      }

      const requestRef = doc(db, "requests", id);
      const requestSnapshot = await getDoc(requestRef);
      
      if(requestSnapshot.exists()) {
        const potentialHelpers = requestSnapshot.data().potentialHelpers;

        potentialHelpers.forEach(async (potentialHelper) => {
          const querySnapshot = await getDocs(query(usersRef, where("email", "==", potentialHelper)));
          const potentialHelperRef = await doc(db, "users", querySnapshot.docs[0].id);
          const potentialHelperSnapshot = await getDoc(potentialHelperRef);

          if(potentialHelperSnapshot.exists()) {
            const existingFulfillRequests = potentialHelperSnapshot.data().fulfillRequests;
            const updatedFulfillRequests = existingFulfillRequests.filter((existingFulfillRequest) => existingFulfillRequest.id !== id);
    
            // setFulfillRequests(updatedFulfillRequests);
            await updateDoc(potentialHelperRef, { fulfillRequests : updatedFulfillRequests });
          }

          const requestSnapshot = await getDoc(requestRef);
          const requestData = requestSnapshot.data();
          console.log(requestData);
          convertedFulfillRequests.push(requestData);
        });
      }

      await deleteDoc(doc(collection(db, "requests"), id));
      toast.info('Your help request has been deleted!', {
        theme: "dark",
        icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
    });
    }

    const handleFulfillCardDelete = async (id) => {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
        const userRef = await doc(db, "users", querySnapshot.docs[0].id);
        const userSnapshot = await getDoc(userRef);

        if(userSnapshot.exists()) {
          const existingFulfillRequests = userSnapshot.data().fulfillRequests;
          const updatedFulfillRequests = existingFulfillRequests.filter((existingFulfillRequest) => existingFulfillRequest.id !== id);

          // setFulfillRequests(updatedFulfillRequests);
          await updateDoc(userRef, { fulfillRequests : updatedFulfillRequests });
        }

        const requestRef = doc(db, "requests", id);
        const requestSnapshot = await getDoc(requestRef);
        
        if(requestSnapshot.exists()) {
          const existingPotentialHelpers = requestSnapshot.data().potentialHelpers;
          const updatedPotentialHelpers = existingPotentialHelpers.filter((existingPotentialHelper) => existingPotentialHelper !== user?.email);

          await updateDoc(requestRef, {potentialHelpers : updatedPotentialHelpers});
        }

        toast.info('Thank you for letting us know you are unable to help with that request!', {
            theme: "dark",
            icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
        });
    }

    return (
        <div className = "homePage">
            <StyledToastContainer position="top-left" theme="dark"/>
            <div className = "header">
                <HeaderText className = "yourHomeText">this is your <span className = "primaryText">home</span></HeaderText>
                <nav className = "navBar">
                    <ButtonText onClick={goProfile}>Profile</ButtonText>
                    <ButtonText onClick={logout}>Logout</ButtonText>
                </nav>
            </div>
            <div className="searchBar">
                <SearchBar placeholder = "search by course name..." value = {searchQuery} onChange = {handleSearchChange}></SearchBar>
                {dropdownVisible && (
                    <ul className="homeDropdown">
                        {searchResults.map((result, index) => (
                            <li className="homeDropdownElement" key={index} onClick={() => handleResultClick(result)}>
                                {result}
                            </li>
                        ))}
                     </ul>
                )}
            </div>
            {currentCourses?.map((currentCourse, index) => (
                <HomeCourseTitle key = {index} goToCourse={() => goToCourse(currentCourse)} getCourseName={getCourseName} onRemove={handleCurrentCourseRemove} onHelp = {() => openRequestPopup(currentCourse)}>{currentCourse}</HomeCourseTitle>
            ))}
            <div className = "resourcesContainer">
                <CourseHeading onClick = {handleHelpTitleClick}>help requests</CourseHeading>
            </div>
            {isHelpRequestsVisible && 
                <div className = "coursesTakenTitle">
                    <div className = "resourceCards">
                        {(convertedHelpRequests && convertedHelpRequests.length > 0) ? (
                            convertedHelpRequests?.map((helpRequest, index) => 
                              helpRequest ? (
                                <HelpCard key = {index} id = {helpRequest.id} course = {helpRequest.course} title = {helpRequest.title} description = {helpRequest.description}  
                                onDelete={handleHelpCardDelete}/>
                            ) : null
                        ) ) : (
                            <span className = "noneDisplay">No help requests to display :)</span>
                        )}
                    </div>
                </div>
            }
            <div className = "resourcesContainer">
                <CourseHeading onClick = {handleFulfillTitleClick}>fulfill requests</CourseHeading>
            </div>
            {isFulfillRequestsVisible && 
                <div className = "coursesTakenTitle">
                    <div className = "resourceCards">
                        {(convertedFulfillRequests && convertedFulfillRequests.length > 0) ? (
                            convertedFulfillRequests?.map((fulfillRequest, index) => 
                              fulfillRequest ? (
                                <FulfillCard key = {index} id = {fulfillRequest.id} course = {fulfillRequest.course} title = {fulfillRequest.title} description = {fulfillRequest.description} 
                                 onDelete={handleFulfillCardDelete}/>
                            ) : null
                        )) : (
                            <span className = "noneDisplay">No fulfill requests to display :)</span>
                        )}
                    </div>
                </div>
            }
            {isHelpPopupOpen && <HelpPopupForm courseForHelp = {courseForHelp} handleCancel={toggleHelpPopup} handleSubmit = {handleHelpSubmit} />}
        </div>
    );
}

export default Home;