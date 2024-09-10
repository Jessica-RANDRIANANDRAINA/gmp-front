import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import ProjectSideBar from "../components/Sidebar/projectSideBar";
import { decodeToken } from "../services/Function/TokenService";

interface DecodedToken {
  sub: string;
  name: string;
  jti: string;
  exp: number;
}

const ProjectLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("_au_pr");
    const currentPath = location.pathname;
    if (!token && !currentPath.includes("no-access")) {
      navigate("/no-access");
    }
    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Invalid token ${error}`);
        navigate("/no-access");
      }
    }
  }, [location, navigate]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/*===== PAGE WRAPPER START ===== */}
      <div className="flex h-screen overflow-hidden">
        {/* ===== SIDEBAR START ===== */}
        <ProjectSideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* ===== SIDEBAR START END ===== */}

        {/* ===== CONTENT START ===== */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* ===== HEADER START ===== */}
          <Header
            sidebarOpen={sidebarOpen}
            userConnected={decodedToken}
            setSidebarOpen={setSidebarOpen}
          />
          {/* ===== HEADER END ===== */}
          {/* ===== MAIN CONTENT START ===== */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* ===== MAIN CONTENT END ===== */}
        </div>
        {/* ===== CONTENT END ===== */}
      </div>
      {/* ===== PAGE WRAPPER END ===== */}
    </div>
  );
};

export default ProjectLayout;
