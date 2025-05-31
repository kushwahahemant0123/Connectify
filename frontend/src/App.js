
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Authentication from './pages/authentication';
import LandingPage from './pages/landing';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import VideoMeetComponent from './pages/VideoMeet';
import History from './pages/history';
import HomeComponent from './pages/HomeComponent';

function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Routes>
            {/* <Route path='/home' element=/> */}
            <Route path='/' element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path='/:url' element={<VideoMeetComponent />} />
            <Route path='/history' element={<History />} />
            <Route path='/home' element={<HomeComponent />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}



export default App;
