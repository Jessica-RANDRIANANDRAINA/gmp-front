import { Route, Routes } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import Login from "./Pages/Login";
import ManageUser from "./Pages/Admin/ManageUser";
import ManageAccess from "./Pages/Admin/ManageAccess";
import ManageHierarchie from "./Pages/Admin/ManageHierarchie";
import NoAccessPage from "./components/NoAccessPage";
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
              <Login />
            </>
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <>
              <PageTitle title="Admin" />
              <ManageUser />
            </>
          }
        ></Route>
        <Route
          path="/access"
          element={
            <>
              <PageTitle title="Access management" />
              <ManageAccess />
            </>
          }
        ></Route>
        <Route
          path="/hierarchy"
          element={
            <>
              <PageTitle title="hierarchy management" />
              <ManageHierarchie />
            </>
          }
        ></Route>
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
