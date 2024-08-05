import { ReactNode, useState } from "react";
import AdminSideBar from "../components/Sidebar/AdminSideBar";
import Header from "../components/Header";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
