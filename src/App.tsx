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
// import Hebdo from "./Pages/Project/Hebdo";
import TaskProject from "./Pages/Project/ManageProject/TaskManager/TaskProject";
import PhaseAdvancement from "./Pages/Project/ManageProject/TaskManager/PhaseAdvancement";
import DetailsAndHistoricProject from "./Pages/Project/ManageProject/DetailsAndHistoric/Index";
import DetailsProject from "./Pages/Project/ManageProject/DetailsAndHistoric/DetailsProject";

import HistoricProject from "./Pages/Project/ManageProject/DetailsAndHistoric/HistoricProject";
import UpdateAdvancement from "./Pages/Project/ManageProject/UpdateProject/UpdateAdvancement";
import Activity from "./Pages/Project/Activity/Activity";
import AllActivity from "./Pages/Project/Activity/AllActivity";
import AllNotifications from "./Pages/Notifications/AllNotifications";
import PageNotFound from "./components/PageNotFound";
// *******************//
// import Chronogramme from "./Pages/Waiting/Chronogramme";
import GanttView from "./Pages/Project/GanttView";

import "./App.css";
import ProjectLayout from "./layout/ProjectLayout";
import ActivityDetails from "./Pages/Project/ManageProject/DetailsAndHistoric/ActivityDetails";
import PrivateRoute from "./components/PrivateRoute";
import Archivedprojects from "./Pages/Project/ManageProject/Archivedprojects";
import CompletedProject from "./Pages/Project/ManageProject/CompletedProject";
import UpdateTaskPageWrapper from "./Pages/Project/UpdateTaskPageWrapper";
import UpdateActivityPageWrapper from "./Pages/Project/UpdateActivityPageWrapper";

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
            <PrivateRoute>
            <>
              <PageTitle title="Admin" />
              <ManageUser />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="gmp/admin/access"
          element={
             <PrivateRoute>
            <>
              <PageTitle title="Admin" />
              <ManageAccess />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="gmp/admin/hierarchy"
          element={
             <PrivateRoute>
            <>
              <PageTitle title="Admin" />
              <ManageHierarchie />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/gmp/home"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <Home />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/gmp/project/advancement/:projectId/update"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <UpdateAdvancement />
            </>
            </PrivateRoute>
          }
        />

        <Route
          path="/gmp/project/details/:projectId"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <DetailsAndHistoricProject />
            </>
            </PrivateRoute>
          }
          children={
            <>
              <Route
                path="/gmp/project/details/:projectId/historic"
                element={
                  <PrivateRoute>
                  <>
                    <PageTitle title="G.M.P" />
                    <HistoricProject />
                  </>
                  </PrivateRoute>
                }
              />
              <Route
                path="/gmp/project/details/:projectId/details"
                element={
                  <PrivateRoute>
                  <>
                    <PageTitle title="G.M.P" />
                    <DetailsProject />
                  </>
                  </PrivateRoute>
                }
              />
            </>
          }
        />
       <Route
        path="/gmp/project/activity-details/:activityType/:activityId"
        element={
          <PrivateRoute>
          <>
            <PageTitle title="Détails Activité" />
            <ProjectLayout>
              <ActivityDetails />
            </ProjectLayout>
          </>
          </PrivateRoute>
        }
      />
        <Route
          path="/gmp/project/task/:projectId"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <TaskProject />
            </>
            </PrivateRoute>
          }
          children={
            
            <>
              <Route
                path="/gmp/project/task/:projectId/:phaseId"
                element={
                  <PrivateRoute>
                  <>
                    <PageTitle title="G.M.P" />
                    <PhaseAdvancement />
                  </>
                  </PrivateRoute>
                }
              />
            </>
          }
        />
        <Route
          path="/gmp/activity/:userid/list/:activityType/:activityId"
          element={
            <PrivateRoute>
              <PageTitle title="Modification Activité" />
              <UpdateActivityPageWrapper />
            </PrivateRoute>
          }
        />


        <Route
          path="/gmp/activity/:userid"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <Activity />
            </>
            </PrivateRoute>
          }
          children={
            <>
              <Route
                path="/gmp/activity/:userid/list"
                element={
                  <PrivateRoute>
                  <>
                    <PageTitle title="G.M.P" />
                    <AllActivity />
                  </>
                  </PrivateRoute>
                }
              />
            </>
          }
        />

        <Route
          path="/gmp/project/list"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <ManageProjects />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/gmp/project/add"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <AddProject />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/gmp/project/update/:projectId"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <UpdateProject />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/gmp/project/notification/:userId"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <AllNotifications />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/gmp/project/projetarchivés"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <Archivedprojects />
            </>
            </PrivateRoute>
          }
        />
         <Route
          path="/gmp/project/projetterminés"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <CompletedProject />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/gmp/activity/list"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <Activity />
            </>
            </PrivateRoute>
          }
        />
        <Route
          path="/no-access"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="hierarchy management" />
              <NoAccessPage />
            </>
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/gmp/project/:projectId/phase/:phaseId/task/:taskId/update"
          element={
            
          <PrivateRoute>
            <PageTitle title="Modification Tâche" />
              <UpdateTaskPageWrapper />
            </PrivateRoute>}
        />

      
        <Route
          path="/gmp/gantt"
          element={
            <PrivateRoute>
            <>
              <PageTitle title="G.M.P" />
              <GanttView />
            </>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
