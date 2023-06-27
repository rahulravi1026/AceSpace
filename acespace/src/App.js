import './App.css';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Test from './pages/Test'
import Course from './pages/Course';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebaseConfig';
import { useEffect } from 'react';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
		if (loading || error) {
			return;
		}
		if (!user) {
			navigate("/login");
		} 
	}, [user, loading, error, navigate]);

  return (
    //<Router>
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "login" element = {<SignIn />} />
        <Route path = "profile" element = {<Profile />} />
        <Route path = "test" element = {<Test />} />
        <Route path="/course/:courseName" element={<Course />} />
      </Routes>
    //</Router>
  );
}

export default App;
