import { useNavigate, useParams } from 'react-router-dom';
import HeaderText from '../components/HeaderText';
// import FormLabelText from '../components/FormLabelText';
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, getDoc, doc, updateDoc, arrayUnion, query, where } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import '../styles/course-styles.css';
import ButtonText from '../components/ButtonText';
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast-styles.css';
import StyledToastContainer from '../components/StyledToastContainer';
import infoIcon from '../assets/info-icon.png';
import addIcon from '../assets/add-icon.png';
import { signOut } from 'firebase/auth';
import ListedProfessor from '../components/ListedProfessor';
import CourseHeading from '../components/CourseHeading';
import TipPopupForm from '../components/TipPopupForm';
import ResourcePopupForm from '../components/ResourcePopupForm';

function Course() {
    const { courseName } = useParams();
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const major = extractMajor(courseName).slice(0,-1).toLowerCase();
    const course = extractCourse(courseName).toLowerCase();

    const [fullCourse, setFullCourse] = useState(null);
    const [professors, setProfessors] = useState(null);

    const [professorSelected, setProfessorSelected] = useState(null);
    const [sharedNotes, setSharedNotes] = useState(null);
    const [tips, setTips] = useState(null);

    const [isTipPopupOpen, setIsTipPopupOpen] = useState(false);
    const [isResourcePopupOpen, setIsResourcePopupOpen] = useState(false);

    const toggleTipPopup = () => {
      setIsTipPopupOpen(!isTipPopupOpen);
    };  

    const toggleResourcePopup = () => {
        setIsResourcePopupOpen(!isResourcePopupOpen);
    };  

    function goHome() {
        navigate("/");
    }

    function logout() {
        signOut(auth);
    }

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

    function firstWord(str) {
        return str.split(' ')[0];
    }

    function lastWord(str) {
        const words = str.split(' ');
        return words[words.length - 1];
    }

    useEffect(() => {
        const getCourseInfo = async () => {
            try {
                const coursesForMajor = await getDocs(collection(db, "majors", major, "courses"));
                if(!coursesForMajor.empty) {
                    coursesForMajor.forEach((doc) => {
                        if(firstWord(doc.id).toLowerCase() === lastWord(courseName).toLowerCase()) {
                            setFullCourse(doc.id);
                        }
                    });
                }
            } catch (e) {
                console.error("Error searching for course: ", e);
            }
        }
        getCourseInfo();
    }, [courseName, major]);

    useEffect(() => {
        const getCourseInfo = async () => {
            try {
                if(fullCourse) {
                    const professorsForCourse = await getDocs(collection(db, "majors", major, "courses", fullCourse, "professors"));
                    if(!professorsForCourse.empty) {
                        const professorIds = professorsForCourse.docs.map((doc) => doc.id);
                        setProfessors(professorIds);
                        setProfessorSelected(professorIds[0]);
                    }
                    else {
                        setProfessors([]);
                    }
                }
            } catch (e) {
                console.error("Error searching for professor: ", e);
            }
        }
        getCourseInfo();
    }, [major, fullCourse]);

    useEffect(() => {
        const getSharedNotesAndTips = async () => {
            try {
                if(professorSelected) {
                    const professorSnapshot = await getDoc(doc(db, "majors", major, "courses", fullCourse, "professors", professorSelected));
                    if(professorSnapshot.exists()) {
                        const professorData = professorSnapshot.data();
                        setSharedNotes(professorData?.sharedNotes);
                        setTips(professorData?.tips);
                    }
                }
            } catch (e) {
                console.error("Error searching for professor: ", e);
            }
        }
        getSharedNotesAndTips();
    }, [professorSelected, fullCourse, major]);

    const handleSubmit = async (newTitle, newText) => {
        const professorRef = await doc(db, "majors", major, "courses", fullCourse, "professors", professorSelected);

        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));
        await updateDoc(professorRef, {
            tips: arrayUnion({title: newTitle, text: newText, user: querySnapshot.docs[0].data().email})
        });

        const professorData = (await getDoc(doc(db, "majors", major, "courses", fullCourse, "professors", professorSelected))).data();
        setTips(professorData?.tips);
        setIsTipPopupOpen(!isTipPopupOpen);
        toast.info('Your tip has been added!', {
            theme: "dark",
            icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
        });
    }

    return (
        <>
        {professors && (
        <div className = "coursePage">
            <StyledToastContainer position="top-left" theme="dark"/>
            <div className = "header">
                <HeaderText className = "createProfileText">{major.toUpperCase()} <span className = "primaryText">{course.toUpperCase()}</span></HeaderText>
                <nav className = "navBar">
                    <ButtonText onClick={goHome}>Home</ButtonText>
                    <ButtonText onClick={logout}>Logout</ButtonText>
                </nav>
            </div>
            <div class = "professors">
                {professors?.map((professor, index) => (
                    <ListedProfessor key = {index} className="listedProfessor" 
                                   style={{ textDecoration: professorSelected === professor ? 'underline' : 'none', 
                                            textDecorationColor: professorSelected === professor ? '#c35cf7' : '#000000' }} 
                                   onClick={(e) => setProfessorSelected(e.target.innerText)}>
                        {professor}
                    </ListedProfessor>
                ))}
            </div>
            {sharedNotes !== null ? (
                sharedNotes ? (
                    <div className="sharedNotesContainer">
                        <a href={sharedNotes} className="sharedNotesLink" target="_blank" rel="noreferrer">
                            Access shared notes for the class here! &#8594;
                        </a>
                    </div>
                ) : professors.length > 0 ? (
                    <div className="sharedNotesContainer">
                        <a href="https://www.espn.com/nba/" className="sharedNotesLink" target="_blank" rel="noreferrer">
                            Create shared notes for the class now! &#8594;
                        </a>
                    </div>
                ) : null
            ) : null}
            <div class = "resourcesContainer">
                <CourseHeading>resources</CourseHeading>
                <img src = {addIcon} className = "addIcon" onClick={toggleResourcePopup} alt = "addIcon"></img>
            </div>
            <div class = "tipsContainer">
                <CourseHeading>tips & tricks</CourseHeading>
                <img src = {addIcon} className = "addIcon" onClick={toggleTipPopup} alt = "addIcon"></img>
            </div>
            {isTipPopupOpen && <TipPopupForm handleSubmit={handleSubmit} handleCancel={toggleTipPopup} />}
            {isResourcePopupOpen && <ResourcePopupForm handleCancel={toggleResourcePopup} />}
            {tips?.map((tip, index) => (
                <span key = {index} className = "brodie">
                    {tip.title}: {tip.text} from {tip.user}
                </span>
            ))}
        </div>
        )}
        </>
    );
}

export default Course;