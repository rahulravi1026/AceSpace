import HeaderText from '../components/HeaderText';
import ButtonText from '../components/ButtonText';
import HomeCourseTitle from '../components/HomeCourseTitle';

import '../styles/home-styles.css';
import { signOut } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import infoIcon from '../assets/info-icon.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast-styles.css';
import StyledToastContainer from '../components/StyledToastContainer';

function Home() {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [currentCourses, setCurrentCourses] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

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
                <HomeCourseTitle key = {index} goToCourse={() => goToCourse(currentCourse)} getCourseName={getCourseName} onRemove={handleCurrentCourseRemove}>{currentCourse}</HomeCourseTitle>
            ))}
        </div>
    );
}

export default Home;