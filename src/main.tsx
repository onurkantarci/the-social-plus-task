import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./pages/UserList";
import UserPosts from "./pages/UserPosts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/user/posts/:id" element={<UserPosts />} />
    </Routes>
  </Router>
);
