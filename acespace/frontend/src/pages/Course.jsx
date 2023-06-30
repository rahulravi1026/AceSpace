import { useNavigate, useParams } from 'react-router-dom';
import HeaderText from '../components/HeaderText';
// import FormLabelText from '../components/FormLabelText';
import { auth, db, storage } from "../firebaseConfig";
import { collection, getDocs, getDoc, doc, updateDoc, arrayUnion, query, where } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
import TipCard from '../components/TipCard';
import ResourceCard from '../components/ResourceCard';
import axios from 'axios';
import TipEditPopupForm from '../components/TipEditPopupForm';

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
    const [resources, setResources] = useState(null);

    const [isTipPopupOpen, setIsTipPopupOpen] = useState(false);
    const [isResourcePopupOpen, setIsResourcePopupOpen] = useState(false);

    const [isTipEditPopupOpen, setIsTipEditPopupOpen] = useState(false);

    const [isTipsVisible, setIsTipsVisible] = useState(false);
    const [isResourcesVisible, setIsResourcesVisible] = useState(false);

    const [tipID, setTipID] = useState('');
    const [oldTitle, setOldTitle] = useState('');
    const [oldTime, setOldTime] = useState('');
    const [oldText, setOldText] = useState('');

    const { v4: uuidv4 } = require('uuid');

    const toggleTipPopup = () => {
      setIsTipPopupOpen(!isTipPopupOpen);
    };  

    const toggleResourcePopup = () => {
        setIsResourcePopupOpen(!isResourcePopupOpen);
    };  

    const openTipEditPopup = (oldID, oldTitle, oldTime, oldText) => {
        setIsTipEditPopupOpen(true);
        setTipID(oldID);
        setOldTitle(oldTitle);
        setOldTime(oldTime);
        setOldText(oldText);
    };

    const closeTipEditPopup = () => {
        setIsTipEditPopupOpen(false);
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
                        setResources(professorData?.resources);
                    }
                }
            } catch (e) {
                console.error("Error searching for professor: ", e);
            }
        }
        getSharedNotesAndTips();
    }, [professorSelected, fullCourse, major]);

    const handleTipSubmit = async (newTitle, newTime, newText) => {
        const professorRef = await doc(db, "majors", major, "courses", fullCourse, "professors", professorSelected);

        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));

        const uniqueId = uuidv4();

        await updateDoc(professorRef, {
            tips: arrayUnion({id: uniqueId, title: newTitle, time: newTime, text: newText, votes: 0, upvoteUsers: null, downvoteUsers: null, user: querySnapshot.docs[0].data().email})
        });

        const professorData = (await getDoc(doc(db, "majors", major, "courses", fullCourse, "professors", professorSelected))).data();
        setTips(professorData?.tips);
        setIsTipPopupOpen(!isTipPopupOpen);
        toast.info('Your tip has been added!', {
            theme: "dark",
            icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
        });
    }

    const handleResourceSubmit = async (newTitle, newTime, newFile) => {
        const professorRef = await doc(db, "majors", major, "courses", fullCourse, "professors", professorSelected);

        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("email", "==", user?.email)));

        const formData = new FormData();
        formData.append('pdf', newFile);
        
        const imageURL = await convertPDFToImage(formData);

        console.log(newFile.name);
        const storageRef = ref(storage, newFile.name);
        uploadBytes(storageRef, newFile)
            .then(() => {
                getDownloadURL(storageRef)
                .then(async (url) => {
                    console.log("File URL: ", url);
                    await updateDoc(professorRef, {
                        resources: arrayUnion({title: newTitle, time: newTime, file: url, image: imageURL, user: querySnapshot.docs[0].data().email})
                    })

                    const professorData = (await getDoc(doc(db, "majors", major, "courses", fullCourse, "professors", professorSelected))).data();
                    setResources(professorData?.resources);
                    toast.info('Your resource has been added!', {
                        theme: "dark",
                        icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
                    });
                })
                .catch((e) => {
                    console.error("Error getting file URL: ", e)
                })
            })
            .catch((e) => {
                console.error("Error uploading file: ", e);
            })
        
        setIsResourcePopupOpen(!isResourcePopupOpen);
    }

    const handleTipsClick = () => {
        setIsTipsVisible(!isTipsVisible);
    }

    const handleResourcesClick = () => {
        setIsResourcesVisible(!isResourcesVisible);
    }

    const convertPDFToImage = async (formData) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/convert-pdf", formData, {
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                //     'Access-Control-Allow-Credentials': true
                //   },
            });
            const data = response.data;
            return data.image_url;
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpvote = async (id) => {
        const professorRef = await doc (db, "majors", major, "courses", fullCourse, "professors", professorSelected);
        const professorSnapshot = await getDoc(professorRef);
        if(professorSnapshot.exists()) {
            const tips = professorSnapshot.data().tips;
            const tipToUpdate = tips.find((tip) => tip.id === id);

            if(!tipToUpdate?.upvoteUsers?.includes(user?.email)) {
                if(tipToUpdate?.downvoteUsers?.includes(user?.email)) {
                    tipToUpdate.downvoteUsers = tipToUpdate.downvoteUsers.filter((email) => email !== user?.email);
                }

                if(!tipToUpdate.upvoteUsers) {
                    tipToUpdate.upvoteUsers = [user?.email];
                }
                else {
                    tipToUpdate.upvoteUsers.push(user?.email);
                }
            }
            else {
                tipToUpdate.upvoteUsers = tipToUpdate.upvoteUsers.filter((email) => email !== user?.email);
            }

            tipToUpdate.votes = (tipToUpdate.upvoteUsers?.length || 0) - (tipToUpdate.downvoteUsers?.length || 0);

            setTips(tips);
            await updateDoc(professorRef, { tips });
        }
    };

    const handleDownvote = async (id) => {
        const professorRef = await doc (db, "majors", major, "courses", fullCourse, "professors", professorSelected);
        const professorSnapshot = await getDoc(professorRef);
        if(professorSnapshot.exists()) {
            const tips = professorSnapshot.data().tips;
            const tipToUpdate = tips.find((tip) => tip.id === id);

            if(!tipToUpdate?.downvoteUsers?.includes(user?.email)) {
                if(tipToUpdate?.upvoteUsers?.includes(user?.email)) {
                    tipToUpdate.votes -= 2;
                    tipToUpdate.upvoteUsers = tipToUpdate.upvoteUsers.filter((email) => email !== user?.email);
                }
                else {
                    tipToUpdate.votes -= 1;
                }

                if(!tipToUpdate.downvoteUsers) {
                    tipToUpdate.downvoteUsers = [user?.email];
                }
                else {
                    tipToUpdate.downvoteUsers.push(user?.email);
                }

            }
            else {
                tipToUpdate.votes += 1;
                tipToUpdate.downvoteUsers = tipToUpdate.downvoteUsers.filter((email) => email !== user?.email);
            }

            setTips(tips);
            await updateDoc(professorRef, { tips });
        }
    };

    const handleTipEdit = (id, title, time, text) => {
        openTipEditPopup(id, title, time, text);
    }

    const handleTipEditSubmit = async (newTitle, newTime, newText) => {
        const professorRef = await doc (db, "majors", major, "courses", fullCourse, "professors", professorSelected);
        const professorSnapshot = await getDoc(professorRef);
        if(professorSnapshot.exists()) {
            const tips = professorSnapshot.data().tips;
            const tipToUpdate = tips.find((tip) => tip.id === tipID);
            console.log(tipToUpdate);
            
            tipToUpdate.title = newTitle;
            tipToUpdate.time = newTime;
            tipToUpdate.text = newText;

            setTips(tips);
            await updateDoc(professorRef, { tips });
        }
        closeTipEditPopup();
        toast.info('Your tip has been saved!', {
            theme: "dark",
            icon: ({theme, type}) =>  <img src={infoIcon} alt="Info Icon"/>,
        });
    }

    const handleTipDelete = async () => {
        const professorRef = await doc (db, "majors", major, "courses", fullCourse, "professors", professorSelected);
        const professorSnapshot = await getDoc(professorRef);
        if(professorSnapshot.exists()) {
            const tips = professorSnapshot.data().tips;
            const updatedTips = tips.filter((tip) => tip.id !== tipID);

            setTips(updatedTips);
            await updateDoc(professorRef, { tips : updatedTips });
        }
        closeTipEditPopup();
        toast.info('Your tip has been deleted!', {
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
            <div className = "professors">
                {professors?.map((professor, index) => (
                    <ListedProfessor key = {index} className="listedProfessor" 
                                   style={{ textDecoration: professorSelected === professor ? 'underline' : 'none', 
                                            textDecorationColor: professorSelected === professor ? '#c35cf7' : '#000000',
                                            fontWeight: professorSelected === professor ? 'bold' : 'normal'
                                         }} 
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
            <div className = "resourcesContainer">
                <CourseHeading onClick={handleResourcesClick}>resources</CourseHeading>
                <img src = {addIcon} className = "addIcon" onClick={toggleResourcePopup} alt = "addIcon"></img>
            </div>
            {isResourcesVisible && 
                <div className = "coursesTakenTitle">
                    <div className = "resourceCards">
                        {(resources && resources.length > 0) ? (
                            resources?.map((resource, index) => (
                                <ResourceCard key = {index} title = {resource.title} time = {resource.time} image = {resource.image} selectedFile = {resource.file}  />
                            ))
                        ) : 
                            <span className = "noneDisplay">No resources to display :(</span>
                        }
                    </div>
                </div>
            }
            <div className = "tipsContainer">
                <CourseHeading onClick={handleTipsClick}>tips & tricks</CourseHeading>
                <img src = {addIcon} className = "addIcon" onClick={toggleTipPopup} alt = "addIcon"></img>
            </div>
            {isTipsVisible && 
                <div className = "coursesTakenTitle">
                    <div className = "tipCards">
                        {(tips && tips.length > 0) ? (
                            tips?.map((tip, index) => (
                                <TipCard key = {index} id = {tip.id} title = {tip.title} time = {tip.time} text = {tip.text} votes = {tip.votes} 
                                onUpvote={handleUpvote} onDownvote = {handleDownvote} userUpvoted = {tip.upvoteUsers?.includes(user?.email)} 
                                userDownvoted = {tip.downvoteUsers?.includes(user?.email)} userUploaded = {tip.user === user?.email}
                                onEdit = { () => handleTipEdit(tip.id, tip.title, tip.time, tip.text)}/>
                            ))
                        ) :
                            <span className = "noneDisplay">No tips to display :(</span>
                        }
                    </div>
                </div>
            }
            {isTipPopupOpen && <TipPopupForm handleSubmit={handleTipSubmit} handleCancel={toggleTipPopup} />}
            {isResourcePopupOpen && <ResourcePopupForm handleSubmit={handleResourceSubmit} handleCancel={toggleResourcePopup} />}
            {isTipEditPopupOpen && <TipEditPopupForm oldTitle = {oldTitle} oldTime = {oldTime} oldText = {oldText} 
            handleSubmit = {(newTitle, newTime, newText) => handleTipEditSubmit(newTitle, newTime, newText)} handleDelete={handleTipDelete} />}
        </div>
        )}
        </>
    );
}

export default Course;