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
  );
}

export default App;
