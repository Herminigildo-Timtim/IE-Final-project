import logo from './logo.svg';
import './App.css';
import './AddTopicMostComment.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MostCommentedTopics from "./(Screens)/MostCommentedTopics";
import AddTopicTags from "./(Screens)/AddTopicTags";
import LandingPage from './(Screens)/landingpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/topTopics" element={<MostCommentedTopics />} />
        <Route path="/addTags" element={<AddTopicTags />} />
        <Route path="/landingpage" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
