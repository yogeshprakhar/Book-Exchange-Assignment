import Signin from "./pages/Signin";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import BookList from "./pages/BookList";
import Match from "./pages/Match";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/matches" element={<Match />} />
          <Route path="/listing" element={<BookList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
