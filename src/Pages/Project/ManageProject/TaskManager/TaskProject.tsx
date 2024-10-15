import { useState, useEffect } from "react";
import { useParams, NavLink, Outlet, useNavigate } from "react-router-dom";
import ProjectLayout from "../../../../layout/ProjectLayout";
import Breadcrumb from "../../../../components/BreadCrumbs/BreadCrumb";
import { IProjectData } from "../../../../types/Project";
import { getProjectById } from "../../../../services/Project";
import ListUsers from "../../../../components/UIElements/ListUsers";
import UpdateTeamMember from "../../../../components/Modals/Task/UpdateTeamMember";
import PhaseSettings from "../../../../components/Modals/Task/PhaseSettings";

const TaskProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<IProjectData>();
  const [isTitleExpanded, setIsTitleExpanded] = useState<boolean>(false);
  const [showModalTeam, setShowModalTeam] = useState<boolean>(false);
  const [showModalSettings, setShowModalSettings] = useState<boolean>(false);
  const [isModifTeamApplied, setIsModifTeamApplied] = useState<boolean>(false);

  const fetchProject = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      setProjectData(project);
      const phase = project?.listPhases?.sort(
        (a: { rank: number }, b: { rank: number }) => a.rank - b.rank
      );
      navigate(`/gmp/project/task/${projectId}/${phase?.[0]?.id}`);
    }
  };

  useEffect(() => {
    fetchProject();
    setIsModifTeamApplied(false);
  }, [isModifTeamApplied]);

  return (
    <ProjectLayout>
      <div className="">
        <div className="bg-white dark:bg-boxdark pt-4 pb-3 px-9 shadow-sm">
          <Breadcrumb pageName="Tache" />
          {/* ===== PROJECT DATA START ==== */}
          <div className="flex justify-between">
            <div>
              <p>
                Projet :{" "}
                {isTitleExpanded ? (
                  <span className="font-semibold">{projectData?.title}</span>
                ) : (
                  <span className="font-semibold">
                    {projectData?.title?.substring(0, 40)}
                  </span>
                )}
                <span
                  className={`${
                    projectData?.title && projectData?.title?.length > 20
                      ? ""
                      : "hidden"
                  }`}
                >
                  {" "}
                  ...
                  <button
                    type="button"
                    onClick={() => {
                      setIsTitleExpanded(!isTitleExpanded);
                    }}
                    className={`ml-2 text-blue-400 text-xs  font-semibold hover:underline mt-2 `}
                  >
                    {isTitleExpanded ? "Moins" : "Plus"}
                  </button>
                </span>
              </p>
            </div>
            <div>
              <ListUsers
                data={projectData?.listUsers ? projectData?.listUsers : []}
                type="all"
              />
            </div>
          </div>
          {/* ===== PROJECT DATA END ==== */}
          {/* ===== PHASES START ===== */}
          <div className="flex w-full justify-between flex-wrap">
            <div
              className={
                "flex  gap-4 *:p-3 *:rounded-md *:mt-5 text-xs font-semibold overflow-x-scroll hide-scrollbar mb-2 whitespace-nowrap"
              }
            >
              {projectData?.listPhases
                ?.filter((phase) => phase?.rank !== undefined)
                ?.sort((a, b) => (a?.rank ?? 0) - (b?.rank ?? 0))
                ?.map((phase) => (
                  <NavLink
                    key={phase.rank}
                    className={({ isActive }) =>
                      isActive
                        ? "text-green-700 bg-green-50 dark:bg-green-100"
                        : "hover:text-green-700 text-slate-600   "
                    }
                    to={`/gmp/project/task/${projectId}/${phase.id}`}
                  >
                    {phase?.phase1}
                  </NavLink>
                ))}
            </div>
            <div className=" flex gap-2 justify-between items-end py-3 text-xs font-semibold px-2">
              <span
                className="border p-1.5 rounded-md border-slate-300 dark:border-boxdark2 dark:bg-boxdark2 dark:hover:bg-opacity-85 cursor-pointer  hover:bg-whiten   "
                onClick={() => {
                  setShowModalTeam(true);
                }}
              >
                <svg
                  height="20"
                  width="20"
                  version="1.1"
                  id="Capa_1"
                  viewBox="-32.85 -32.85 394.20 394.20"
                  className="fill-black dark:fill-whiten stroke-black-2  dark:stroke-white"
                  strokeWidth={9}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-black-2 dark:stroke-whiten"
                    strokeWidth="0.657"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <polygon points="96.333,150.918 96.333,135.918 55.667,135.918 55.667,95.251 40.667,95.251 40.667,135.918 0,135.918 0,150.918 40.667,150.918 40.667,191.583 55.667,191.583 55.667,150.918 "></polygon>{" "}
                        <path d="M259.383,185.941H145.858c-38.111,0-69.117,31.006-69.117,69.117v39.928H328.5v-39.928 C328.5,216.948,297.494,185.941,259.383,185.941z M313.5,279.987H91.741v-24.928c0-29.84,24.276-54.117,54.117-54.117h113.524 c29.84,0,54.117,24.277,54.117,54.117L313.5,279.987L313.5,279.987z"></path>{" "}
                        <path d="M202.621,178.84c40.066,0,72.662-32.597,72.662-72.663s-32.596-72.663-72.662-72.663s-72.663,32.596-72.663,72.663 S162.555,178.84,202.621,178.84z M202.621,48.515c31.795,0,57.662,25.867,57.662,57.663s-25.867,57.663-57.662,57.663 c-31.796,0-57.663-25.868-57.663-57.663S170.825,48.515,202.621,48.515z"></path>{" "}
                      </g>{" "}
                      <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                      <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                      <g> </g> <g> </g> <g> </g>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </span>
              <span
                className="border p-1.5 rounded-md border-slate-300 dark:border-boxdark2 dark:bg-boxdark2 dark:hover:bg-opacity-85 cursor-pointer  hover:bg-whiten  "
                onClick={() => {
                  setShowModalSettings(true);
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 1024 1024"
                  strokeWidth="5"
                  className="fill-black-2 dark:fill-whiten stroke-black-2 dark:stroke-whiten"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      className="fill-black-2 dark:fill-whiten"
                      d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>
          {/* ===== PHASES END ===== */}
          {/* ===== UPDATE TEAM MODAL START ===== */}
          {showModalTeam && (
            <UpdateTeamMember
              setShowModalTeam={setShowModalTeam}
              showModalTeam={showModalTeam}
              setIsModifTeamApplied={setIsModifTeamApplied}
            />
          )}
          {/* ===== UPDATE TEAM MODAL END ===== */}
          {/* PHASE SETTINGS START */}
          {showModalSettings && (
            <PhaseSettings
              showModalSettings={showModalSettings}
              setShowModalSettings={setShowModalSettings}
            />
          )}
          {/* PHASE SETTINGS END */}
        </div>
        <div className="">
          <Outlet />
        </div>
      </div>
    </ProjectLayout>
  );
};

export default TaskProject;
