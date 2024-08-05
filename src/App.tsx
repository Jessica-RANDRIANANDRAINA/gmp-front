import { Route, Routes, useLocation } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import Login from "./Pages/Login";
import ManageUser from "./Pages/Admin/ManageUser";

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
            <PageTitle title="Admin"/>
            <ManageUser />
          </>
        }
        >

        </Route>
      </Routes>
    </>
  );
};

export default App;
