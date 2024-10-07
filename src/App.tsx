import { Route, Routes } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import LoginProject from "./Pages/Authentication/LoginProject";
import ManageUser from "./Pages/Admin/ManageUser";
import ManageAccess from "./Pages/Admin/ManageAccess";
import ManageHierarchie from "./Pages/Admin/ManageHierarchie";
import NoAccessPage from "./components/NoAccessPage";
import Home from "./Pages/Project/Home";
import ManageProjects from "./Pages/Project/ManageProject/ManageProjects";
import AddProject from "./Pages/Project/ManageProject/AddProject/AddProject";
import UpdateProject from "./Pages/Project/ManageProject/UpdateProject/UpdateProject";
import Hebdo from "./Pages/Project/Hebdo";
import TaskProject from "./Pages/Project/ManageProject/TaskManager/TaskProject";
import PhaseAdvancement from "./Pages/Project/ManageProject/TaskManager/PhaseAdvancement";
import DetailsAndHistoricProject from "./Pages/Project/ManageProject/DetailsAndHistoric/Index";
import DetailsProject from "./Pages/Project/ManageProject/DetailsAndHistoric/DetailsProject";
import HistoricProject from "./Pages/Project/ManageProject/DetailsAndHistoric/HistoricProject";
import UpdateAdvancement from "./Pages/Project/ManageProject/UpdateProject/UpdateAdvancement";
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
          path="gmp/admin/user"
          element={
            <>
              <PageTitle title="Admin" />
              <ManageUser />
            </>
          }
        />
        <Route
          path="gmp/admin/access"
          element={
            <>
              <PageTitle title="Admin" />
              <ManageAccess />
            </>
          }
        />
        <Route
          path="gmp/admin/hierarchy"
          element={
            <>
              <PageTitle title="Admin" />
              <ManageHierarchie />
            </>
          }
        />
        <Route
          path="/gmp/project/home"
          element={
            <>
              <PageTitle title="G.M.P" />
              <Home />
            </>
          }
        />
        <Route
          path="/gmp/project/advancement/:projectId/update"
          element={
            <>
              <PageTitle title="G.M.P" />
              <UpdateAdvancement />
            </>
          }
        />
        
        <Route
          path="/gmp/project/details/:projectId"
          element={
            <>
              <PageTitle title="G.M.P" />
              <DetailsAndHistoricProject />
            </>
          }
          children={
            <>
              <Route
                path="/gmp/project/details/:projectId/historic"
                element={
                  <>
                    <PageTitle title="G.M.P" />
                    <HistoricProject />
                  </>
                }
              />
              <Route
                path="/gmp/project/details/:projectId/details"
                element={
                  <>
                    <PageTitle title="G.M.P" />
                    <DetailsProject />
                  </>
                }
              />
            </>
          }
        />
        <Route
          path="/gmp/project/task/:projectId"
          element={
            <>
              <PageTitle title="G.M.P" />
              <TaskProject />
            </>
          }
          children={
            <>
              <Route
                path="/gmp/project/task/:projectId/:phaseId"
                element={
                  <>
                    <PageTitle title="G.M.P" />
                    <PhaseAdvancement />
                  </>
                }
              />
            </>
          }
        />
        <Route
          path="/gmp/project/list"
          element={
            <>
              <PageTitle title="G.M.P" />
              <ManageProjects />
            </>
          }
        />
        <Route
          path="/gmp/project/add"
          element={
            <>
              <PageTitle title="G.M.P" />
              <AddProject />
            </>
          }
        />
        <Route
          path="/gmp/project/update/:projectId"
          element={
            <>
              <PageTitle title="G.M.P" />
              <UpdateProject />
            </>
          }
        />
        <Route
          path="/gmp/project/hebdo"
          element={
            <>
              <PageTitle title="G.M.P" />
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
