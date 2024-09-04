import { useState, useEffect } from "react";
import ProjectLayout from "../../../layout/ProjectLayout";
import AddProject from "./AddProject";
import { TableProjet } from "../../../components/Tables/projets";

const ManageProjects = () => {
  const [isAddProject, setIsAddProject] = useState(false);
  const [isButtonAnimate, setIsButtonAnimate] = useState(false);

  return (
    <ProjectLayout>
      <div>
        {!isAddProject ? (
          <>
            {/* ===== ADD PROJECT START =====*/}
            <div className="w-full mb-2 flex justify-end items-center">
              <button
                onClick={() => setIsAddProject(true)}
                className={`md:w-fit gap-2 flex w-full cursor-pointer mt-2 py-4 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  
                   `}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12H18M12 6V18"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                Ajouter un nouveau projet
              </button>
            </div>
            {/* ===== ADD PROJECT END =====*/}
            {/* ===== TABLE PROJECT LIST START =====*/}
            <TableProjet data={[]} />
            {/* ===== TABLE PROJECT LIST END =====*/}
          </>
        ) : (
          <AddProject
            setIsAddProject={setIsAddProject}
            setIsButtonAnimate={setIsButtonAnimate}
          />
        )}
      </div>
    </ProjectLayout>
  );
};

export default ManageProjects;
