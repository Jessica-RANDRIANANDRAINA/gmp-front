import { Route, Routes } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import Login from "./Pages/Authentication/Login";
import LoginProject from "./Pages/Authentication/LoginProject";
import ManageUser from "./Pages/Admin/ManageUser";
import ManageAccess from "./Pages/Admin/ManageAccess";
import ManageHierarchie from "./Pages/Admin/ManageHierarchie";
import NoAccessPage from "./components/NoAccessPage";
import Home from "./Pages/Project/Home";
import ManageProjects from "./Pages/Project/ManageProject/ManageProjects";
import Hebdo from "./Pages/Project/Hebdo";
import "./App.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Login" />
              <LoginProject />
            </>
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <>
              <PageTitle title="Login" />
              <Login />
            </>
          }
        />
        <Route
          path="/admin/user"
          element={
            <>
              <PageTitle title="Admin" />
              <ManageUser />
            </>
          }
        />
        <Route
          path="/admin/access"
          element={
            <>
              <PageTitle title="Admin" />
              <ManageAccess />
            </>
          }
        />
        <Route
          path="/admin/hierarchy"
          element={
            <>
              <PageTitle title="Admin" />
              <ManageHierarchie />
            </>
          }
        />
        <Route
          path="/tsikilo/project/home"
          element={
            <>
              <PageTitle title="Tsikilo" />
              <Home />
            </>
          }
        />
        <Route
          path="/tsikilo/project/list"
          element={
            <>
              <PageTitle title="Tsikilo" />
              <ManageProjects />
            </>
          }
        />
        <Route
          path="/tsikilo/project/hebdo"
          element={
            <>
              <PageTitle title="Tsikilo" />
              <Hebdo />
            </>
          }
        />
        <Route
          path="/no-access"
          element={
            <>
              <PageTitle title="hierarchy management" />
              <NoAccessPage />
            </>
          }
        ></Route>
      </Routes>
    </>
  );
};

export default App;
