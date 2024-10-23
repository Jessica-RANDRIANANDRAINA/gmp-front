import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { BeatLoader } from "react-spinners";
import { CutomInputUserSearch } from "../../UIElements";
import { Iteam, IUserProject } from "../../../types/Project";
import { getProjectById, updateTeamProject } from "../../../services/Project";
import { getInitials } from "../../../services/Function/UserFunctionService";
import { decodeToken } from "../../../services/Function/TokenService";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateTeamMember = ({
  showModalTeam,
  setShowModalTeam,
  setIsModifTeamApplied,
}: {
  showModalTeam: boolean;
  setShowModalTeam: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModifTeamApplied: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  // const [projectData, setProjectData] = useState<IProjectData>();
  const [userTeam, setUserTeam] = useState<Array<Iteam>>([]);

  const fetchProjectData = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      const userArray = project?.listUsers?.map(
        (userProject: IUserProject) => ({
          id: userProject?.user?.id,
          name: userProject?.user?.name,
          email: userProject?.user?.email,
          role: userProject?.role,
        })
      );
      setUserTeam(userArray);
      // setProjectData(project);
    }
  };
  useEffect(() => {
    fetchProjectData();
  }, []);

  // REMOVE A USER FROM TEAM LIST
  const handleRemoveTeamList = (id: string | undefined) => {
    let filteredList = userTeam.filter((team) => team.id !== id);
    setUserTeam(filteredList);
  };

  const handleConfirmChange = async () => {
    setLoading(true);
    try {
      const userProjects = userTeam.map((item) => ({
        userId: item.id,
        role: item.role,
        projectId: projectId,
      }));
      const userConnected = decodeToken("pr");
      const data = {
        userProjects,
        initiator: userConnected?.name,
      };
      if (projectId) {
        await updateTeamProject(projectId, data);
        notyf.success("Modification apportée avec succès");
        setIsModifTeamApplied(true);
      }
    } catch (error) {
      notyf.error(
        "Une erreur s'est produite lors de la modification. Veuillez réessayer plus tard."
      );
      console.error(`Error at update team membre: ${error}`);
    } finally {
      setLoading(false);
      setShowModalTeam(false);
    }
  };
  return (
    <Modal
      modalOpen={showModalTeam}
      setModalOpen={setShowModalTeam}
      header="Modifier les membres de ce projet"
      heightSize="60vh"
      widthSize="medium"
    >
      <ModalBody>
        <div className="space-y-2">
          {/* ===== PROJECT DIRECTOR START ===== */}
          <div>
            <div>Chef de projet</div>
            <div className="hide-scrollbar">
              {userTeam?.filter((team) => team.role === "director").length ===
                0 && (
                <CutomInputUserSearch
                  placeholder="Recherche"
                  label="Assigner"
                  userSelected={userTeam}
                  setUserSelected={setUserTeam}
                  role="director"
                />
              )}
              <div className="flex gap-4 mt-2 flex-wrap">
                {userTeam
                  ?.filter((team) => team.role === "director")
                  ?.map((team) => {
                    const initials = getInitials(team.name);
                    return (
                      <div
                        key={team.id}
                        className="relative group -ml-2 first:ml-0 hover:z-50"
                        onClick={() => {
                          handleRemoveTeamList(team.id);
                        }}
                      >
                        <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                          {initials}
                        </p>
                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] transform ">
                          <p>{team?.name}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* ===== PROJECT DIRECTOR END ===== */}
          {/* ===== PROJECT TEAM START ===== */}
          <div>
            <div>Membre</div>
            <div className="hide-scrollbar">
              <CutomInputUserSearch
                placeholder="Recherche"
                label="Assigner"
                userSelected={userTeam}
                setUserSelected={setUserTeam}
                role="member"
              />
              <div className="flex gap-1 mt-2 flex-wrap">
                {userTeam
                  ?.filter((team) => team.role === "member")
                  ?.map((team) => {
                    const initials = getInitials(team.name);
                    return (
                      <div
                        key={team.id}
                        className="relative group first:ml-0 hover:z-50"
                        onClick={() => {
                          handleRemoveTeamList(team.id);
                        }}
                      >
                        <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                          {initials}
                        </p>
                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] transform ">
                          <p>{team?.name}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* ===== PROJECT TEAM END ===== */}
          {/* ===== PROJECT OBSERVATOR START ===== */}
          <div>
            <div>Observateur</div>
            <div className="hide-scrollbar">
              <CutomInputUserSearch
                placeholder="Recherche"
                label="Assigner"
                userSelected={userTeam}
                setUserSelected={setUserTeam}
                role="observator"
              />
              <div className="flex gap-1 mt-2 flex-wrap">
                {userTeam
                  ?.filter((team) => team.role === "observator")
                  ?.map((team) => {
                    const initials = getInitials(team.name);
                    return (
                      <div
                        key={team.id}
                        className="relative group  first:ml-0 hover:z-50"
                        onClick={() => {
                          handleRemoveTeamList(team.id);
                        }}
                      >
                        <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                          {initials}
                        </p>
                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] transform ">
                          <p>{team?.name}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* ===== PROJECT OBSERVATOR END ===== */}
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-gray dark:border-formStrokedark hover:bg-zinc-100 dark:hover:bg-boxdark2"
          onClick={() => {
            setShowModalTeam(false);
          }}
        >
          Annuler
        </button>
        <button
          type="button"
          className={`border text-xs p-2 rounded-md text-white  font-semibold border-primaryGreen bg-primaryGreen dark:border-darkgreen dark:bg-darkgreen hover:bg-opacity-90 md:ease-in md:duration-300 md:transform `}
          onClick={handleConfirmChange}
          //   disabled={projectToArchive && projectToArchive?.length === 0}
        >
          {loading ? (
            <span>
              <BeatLoader size={3} className="mr-2" color={"#fff"} />
            </span>
          ) : null}
          Enregistrer
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateTeamMember;
