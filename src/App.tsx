import { Route, Routes, useLocation } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import Login from "./Pages/Login";

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
      </Routes>
    </>
  );
};

export default App;
