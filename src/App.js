<<<<<<< HEAD
import LandingPage from "./(Screens)/landingpage.jsx";

function App() {
  return (
    <>
      <LandingPage />
    </>
=======
import logo from './logo.svg';
import './App.css';
import './AddTopicMostComment.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MostCommentedTopics from "./(Screens)/MostCommentedTopics";
import AddTopicTags from "./(Screens)/AddTopicTags";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/topTopics" element={<MostCommentedTopics />} />
        <Route path="/addTags" element={<AddTopicTags />} />
      </Routes>
    </Router>
>>>>>>> a479d899d9a8ac1d1fdaf199ca9d4260cce86b10
  );
}

export default App;
