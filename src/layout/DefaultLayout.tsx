import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSideBar from "../components/Sidebar/AdminSideBar";
import Header from "../components/Header";
import { IDecodedToken } from "../types/user";
import { decodeToken } from "../services/Function/TokenService";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("_au_ad");
    const currentPath = location.pathname;
    if (!token && !currentPath.includes("no-access")) {
      navigate("/no-access");
    }

    if (token) {
      try {
        const decoded = decodeToken("ad");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Invalid token ${error}`);
        navigate("/no-access");
      }
    }
  }, [location, navigate]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* page wrapper start */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar start */}
        <AdminSideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Sidebar end */}

        {/* content start */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* header start */}
          <Header
            sidebarOpen={sidebarOpen}
            userConnected={decodedToken}
            setSidebarOpen={setSidebarOpen}
          />
          {/* Header end */}
          {/* Main content start */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* Main content end */}
        </div>
        {/* content end */}
      </div>
      {/* page wrapper end */}
    </div>
  );
};

export default DefaultLayout;
