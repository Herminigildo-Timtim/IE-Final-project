import logo from "./logo.svg";
import "./App.css";
import "./AddTopicMostComment.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MostCommentedTopics from "./(Screens)/MostCommentedTopics";
import AddTopicTags from "./(Screens)/AddTopicTags";
import LandingPage from './(Screens)/landingpage';
import Home from './(Screens)/home';
import Topvotedpost from './(Screens)/topvotedpost';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/topTopics" element={<MostCommentedTopics />} />
        <Route path="/addTags" element={<AddTopicTags />} />
        <Route path="/topVoted" element={<Topvotedpost />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
