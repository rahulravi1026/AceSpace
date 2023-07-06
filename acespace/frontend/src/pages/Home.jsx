import HeaderText from '../components/HeaderText';
import ButtonText from '../components/ButtonText';
import HomeCourseTitle from '../components/HomeCourseTitle';

import '../styles/home-styles.css';
import { signOut } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';

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

    // useEffect(() => {
    //     const fetchSearchResults = async () => {
    //       try {
    //         const majorsRef = collection(db, "majors");
    //         const querySnapshot = await getDocs(majorsRef);
    //         let queryCourses = [];
    //         for (const doc of querySnapshot.docs) {
    //             const coursesForMajor = await getDocs(collection(db, "majors", doc.id, "courses"));
    //             if(!coursesForMajor.empty) {
    //                 for (const course of coursesForMajor.docs) {
    //                     const combinedString = doc.id.toUpperCase() + " " + formatCourseName(course.id);
    //                     console.log(combinedString);
    //                     if(combinedString.toLowerCase().includes(searchQuery.toLowerCase())) {
    //                         queryCourses.push(combinedString);
    //                     }
    //                 });
    //             }
    //             // courses.forEach((course) => {
    //             //     const combinedString = doc.id.toUpperCase() + " " + formatCourseName(course);
    //             //     if (combinedString.toLowerCase().includes(searchQuery.toLowerCase())) {
    //             //       queryCourses.push(combinedString);
    //             //     }
    //             // });
    //         });
    //         setSearchResults(queryCourses);
    //       } catch (error) {
    //         console.error('Error fetching search results:', error);
    //       }
    //     };
    
    //     if (searchQuery === '') {
    //         setSearchResults([]);
    //     }
    //     else {
    //         fetchSearchResults();
    //     }
    // }, [searchQuery]);

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

    const handleResultClick = (result) => {
        const courseName = extractMajor(result).slice(0,-1) + ' ' + extractCourse(result).split(' ')[0];
        goToCourse(courseName);
    };

    return (
        <div className = "homePage">
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
                <HomeCourseTitle key = {index} onClick={(e) => goToCourse(e.target.innerText)}>{currentCourse}</HomeCourseTitle>
            ))}
        </div>
    );
}

export default Home;

