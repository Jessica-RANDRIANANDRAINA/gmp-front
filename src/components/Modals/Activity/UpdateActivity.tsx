import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { IActivityAdd } from "../../../types/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { BeatLoader } from "react-spinners";
import { CustomInput, CustomSelect } from "../../UIElements";
import { intercontractType, transverseType } from "../../../constants/Activity";
import {
  getProjectByUserId,
  updateIntercontract,
  updateTaskProject,
  updateTransverse,
} from "../../../services/Project";
import { IMyHabilitation } from "../../../types/Habilitation";
import { getAllUsers } from "../../../services/User";
import { getInitials } from "../../../services/Function/UserFunctionService";
import { IUserProject } from "../../../types/Project";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateActivity = ({
  modalUpdateOpen,
  activity,
  setModalUpdateOpen,
  setIsRefreshNeeded,
  myHabilitation,
}: {
  modalUpdateOpen: boolean;
  activity: any;
  myHabilitation?: IMyHabilitation;
  setModalUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userid } = useParams();
  const [activityData, setActivityData] = useState<IActivityAdd>({
    id: activity?.content?.id?.split(".")?.[0],
    title: activity?.content?.title,
    description: activity?.content?.description,
    type: activity?.content?.type,
    dailyEffort: activity?.content?.dailyEffort,
    startDate: activity?.content?.startDate,
    dueDate: activity?.content?.dueDate,
    endDate: activity?.content?.endDate,
    fichier: activity?.content?.fichier,
    projectTitle: activity?.content?.projectTitle,
    phaseTitle: activity?.content?.phaseTitle,
    projectId: activity?.content?.projectId,
    phaseId: activity?.content?.phaseId,
    transverseType: activity?.content?.subType,
    intercontractType: activity?.content?.subType,
    status: activity?.content?.status,
    priority: activity?.content?.priority,
  });
  
  const [usersList, setUsersList] = useState<Array<any>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<any>>([]);
  const [showUserList, setShowUserList] = useState<boolean>(false);
  const [assignedPerson, setAssignedPerson] = useState<Array<IUserProject>>(
    activity?.content?.user?.map((user: any) => ({
      userid: user.userid,
      projectid: activityData.projectId,
      role: "collaborator",
      user: {
        name: user.user?.name || "",
        email: user.user?.email || ""
      }
    })) || []
  );

  const [projectData, setProjectData] = useState<any>();
  const [projectTitle, setProjectTitle] = useState<Array<string>>([]);
  const [phaseTitle, setPhaseTitle] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState({
    projectTitle: "",
    phaseTitle: "",
    projectId: "",
    phaseId: "",
  });

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsersList(users);
        setFilteredUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    fetchUsers();
  }, []);

  const handleUserSearch = (searchTerm: string) => {
    if (searchTerm === "") {
      setFilteredUsers(usersList);
      setShowUserList(false);
    } else {
      const filtered = usersList.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowUserList(true);
    }
  };

  const handleAddUser = (user: {
    id: string;
    name: string;
    email: string;
  }) => {
    if (!assignedPerson.some(u => u.userid === user.id)) {
      const formatUser = {
        userid: user.id,
        projectid: activityData.projectId,
        role: "collaborator",
        user: {
          name: user.name,
          email: user.email
        },
      };
      setAssignedPerson(prev => [...prev, formatUser]);
      setShowUserList(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setAssignedPerson(prev => prev.filter(user => user.userid !== userId));
  };

  const fetchProjectData = async () => {
    try {
      if (userid) {
        const projectName: string[] = [];
        const data = await getProjectByUserId(userid);
        data.map((pr: { title: string }) => {
          projectName.push(pr.title);
        });

        var titleProject = "";
        var titlePhase = "";

        data?.map((dt: { id: string; title: string; listPhases: any[] }) => {
          if (dt?.id === activity?.content?.projectid) {
            titleProject = dt?.title;
            dt.listPhases.map((ph) => {
              if (ph?.id === activity?.content?.phaseid) {
                titlePhase = ph?.phase1;
              }
            });
          }
        });

        setInitial({
          ...initial,
          phaseTitle: titlePhase,
          projectTitle: titleProject,
        });

        setProjectTitle(projectName);
        setProjectData(data);
      }
    } catch (error) {
      console.error(`Error at fetch project data : ${error}`);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  // initialize project title and phase title
  useEffect(() => {
    const project = projectData?.find(
      (pr: { title: string; id: string }) => pr?.id === activityData.projectId
    );
    const listPhase = project?.listPhases;

    const updatedTaskData = {
      ...activityData,
      projectTitle: project?.title || activityData.projectTitle,
    };

    if (activityData.phaseTitle !== "") {
      const phase = listPhase?.find(
        (lp: { phase1: string; id: string }) => lp.id === activityData.phaseId
      );
      updatedTaskData.phaseTitle = phase?.phase1 || activityData.phaseTitle;
    }

    setActivityData(updatedTaskData);
  }, [projectData]);

  // change list of phase available if projectTitle change and change both project id and phaseId
  useEffect(() => {
    const project = projectData?.find(
      (pr: { title: string; id: string }) =>
        pr?.title === activityData.projectTitle
    );
    const listPhase = project?.listPhases;

    const updatedTaskData = {
      ...activityData,
      projectId: project?.id || activityData.projectId,
    };

    const arrayPhaseTitle: Array<string> = [];
    listPhase?.forEach((lp: { phase1: string; status: string }) => {
      if (lp.status !== "Terminé") {
        arrayPhaseTitle.push(lp?.phase1);
      }
    });
    if (activityData.phaseTitle !== "") {
      const phase = listPhase?.find(
        (lp: { phase1: string; id: string }) =>
          lp.phase1 === activityData.phaseTitle
      );
      updatedTaskData.phaseId = phase?.id || activityData.phaseId;
    }

    setActivityData(updatedTaskData);
    setPhaseTitle(arrayPhaseTitle);
  }, [activityData?.projectTitle, activityData?.phaseTitle]);

  const handleCloseModal = () => {
    setModalUpdateOpen(false);
  };

  const handleUpdateActivity = async () => {
    setIsLoading(true);
    try {
      const cleanDate = (date: string | null | undefined): string | undefined => {
        if (!date) return undefined;
        return date.includes('T') ? date.split('T')[0] : date;
      };
      
      if (activityData?.type === "Transverse") {
        const dataToSend = {
          title: activityData.title,
          startDate: activityData.startDate,
          endDate: cleanDate(activityData.dueDate ?? undefined),
          dailyEffort: activityData.dailyEffort,
          type: activityData.transverseType,
          description: activityData.description,
          status: activityData.status,
          fichier: activityData?.fichier,
        };
        if (activityData.id) {
          await updateTransverse(activityData.id, dataToSend);
        }
      } else if (activityData?.type === "InterContract") {
        const dataToSend = {
          title: activityData.title,
          startDate: activityData.startDate,
          endDate: cleanDate(activityData.dueDate ?? undefined),
          dailyEffort: activityData.dailyEffort,
          type: activityData.intercontractType,
          description: activityData.description,
          status: activityData.status,
          fichier: activityData?.fichier,
        };

        if (activityData.id) {
          await updateIntercontract(activityData.id, dataToSend);
        }
      } else {
        const formatUser = assignedPerson.map(user => ({
          userid: user.userid,
          taskid: activityData.id,
        }));
        
        const dataToSend = {
          startDate: activityData?.startDate,
          dueDate: activityData?.dueDate,
          description: activityData?.description,
          dailyEffort: activityData?.dailyEffort,
          title: activityData?.title,
          priority: activityData?.priority,
          status: activityData?.status,
          fichier: activityData?.fichier,
          listUsers: formatUser,
        };
        
        if (activityData.id) {
          await updateTaskProject(activityData.id, dataToSend);
        }
      }
      setIsRefreshNeeded(true);
      notyf.success("Modification de l'activité réussi");
      handleCloseModal();
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard");
      console.error(`Error at update activity : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      modalOpen={modalUpdateOpen}
      setModalOpen={setModalUpdateOpen}
      header={`${activity?.content?.title}`}
      heightSize="80vh"
      widthSize="medium"
    >
      <ModalBody>
        <div className="space-y-4">
          {/* Section Assignation */}
          <div className="space-y-2">
           
            
            
            <div className="relative">
              <CustomInput
                type="text"
                label="Assigné à :"
                rounded="medium"
                className="text-sm"
                onChange={(e) => handleUserSearch(e.target.value)}
                onFocus={() => setShowUserList(true)}
              />
              
              
              {showUserList && filteredUsers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-boxdark border dark:border-formStrokedark rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-boxdark2 cursor-pointer"
                      onClick={() => handleAddUser(user)}
                    >
                      <div className="w-8 h-8 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Liste des utilisateurs assignés */}
            <div className="flex flex-wrap gap-2">
              {assignedPerson.map((user) => (
                <div 
                  key={user.userid} 
                  className="flex items-center bg-gray-100 dark:bg-boxdark rounded-full px-3 py-1"
                >
                  <div className="w-6 h-6 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2 text-xs">
                    {getInitials(user.user?.name)}
                  </div>
                  <span className="text-sm mr-2">{user.user?.name}</span>
                  <button 
                    onClick={() => handleRemoveUser(user.userid!)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <CustomInput
            required={true}
            type="text"
            label="Titre"
            rounded="medium"
            className="text-sm"
            value={activityData.title}
            onChange={(e) => {
              setActivityData({
                ...activityData,
                title: e.target.value,
              });
            }}
          />
          
          <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
            <CustomSelect
              label="Type"
              data={["Projet", "Transverse", "InterContract"]}
              value={activityData.type}
              onValueChange={(e) => {
                setActivityData({
                  ...activityData,
                  type: e,
                  transverseType: "",
                  intercontractType: ""
                });
              }}
            />

            <CustomSelect
              label="Statut"
              data={[
                "Backlog",
                "En cours",
                "Traité",
                "En pause",
                "Abandonné",
              ]}
              value={activityData.status}
              onValueChange={(e) => {
                setActivityData({
                  ...activityData,
                  status: e,
                });
              }}
            />
          </div>
          
          <div
            className={` w-full *:w-full flex-wrap md:flex-nowrap  gap-2 ${
              activity.content.type === "Projet" ? "flex" : "hidden"
            } `}
          >
            <CustomSelect
              label="Titre du projet"
              data={projectTitle}
              value={activityData.projectTitle}
              onValueChange={(e) => {
                setActivityData({
                  ...activityData,
                  projectTitle: e,
                  phaseTitle: "",
                  phaseId: ""
                });
              }}
            />
            <CustomSelect
              className={` ${
                activityData?.projectTitle === "" ? "hidden" : ""
              }`}
              label="Titre de la phase"
              data={phaseTitle}
              value={
                activityData?.phaseTitle === ""
                  ? initial?.phaseTitle?.slice(0, 20)
                  : activityData?.phaseTitle?.slice(0, 20)
              }
              onValueChange={(e) => {
                setActivityData({
                  ...activityData,
                  phaseTitle: e,
                });
              }}
            />
          </div>
          <div
            className={` w-full *:w-full flex-wrap md:flex-nowrap  gap-2 ${
              activity.content.type === "Transverse" ? "flex" : "hidden"
            } `}
          >
            <CustomSelect
              required={true}
              label="Type de transverse"
              data={transverseType}
              value={activityData.transverseType}
              onValueChange={(e) => {
                setActivityData({
                  ...activityData,
                  transverseType: e,
                });
              }}
            />
          </div>
          <div
            className={` w-full *:w-full flex-wrap md:flex-nowrap  gap-2 ${
              activity.content.type === "InterContract" ? "flex" : "hidden"
            } `}
          >
            <CustomSelect
              required={true}
              label="Type d'intercontrat"
              data={intercontractType}
              value={activityData.intercontractType}
              onValueChange={(e) => {
                setActivityData({
                  ...activityData,
                  intercontractType: e,
                });
              }}
            />
          </div>
          <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
            <CustomInput
              required={true}
              type="date"
              label="Date début"
              rounded="medium"
              className="text-sm"
              value={
                activityData?.startDate
                  ? activityData?.startDate?.split("T")?.[0]
                  : ""
              }
              onChange={(e) => {
                setActivityData({
                  ...activityData,
                  startDate: e.target.value,
                });
              }}
            />
            <CustomInput
              required={true}
              type="date"
              label="Date fin"
              rounded="medium"
              className="text-sm"
              value={
                activityData?.endDate 
                  ? activityData.endDate.includes('T') 
                    ? activityData.endDate.split('T')[0] 
                    : activityData.endDate
                  : ""
              }
              min={activityData.startDate}
              onChange={(e) => {
                setActivityData({
                  ...activityData,
                  dueDate: e.target.value,
                });
              }}
            />
          </div>
          <CustomInput
            type="number"
            min={1}
            max={8}
            label="Temps a consacré (heures)"
            rounded="medium"
            className="text-sm"
            value={activityData.dailyEffort}
            onChange={(e) => {
              let value = parseInt(e.target.value);
              if (value > 8) value = 8;
              if (value < 1) value = 1;
              setActivityData({
                ...activityData,
                dailyEffort: value,
              });
            }}
          />

          <CustomInput
            type="textarea"
            label="Description"
            rounded="medium"
            className="text-sm"
            rows={5}
            value={activityData.description}
            onChange={(e) => {
              setActivityData({
                ...activityData,
                description: e.target.value,
              });
            }}
          />
          <CustomInput
            type="text"
            label="Ajouter un lien"
            rounded="medium"
            className="text-sm"
            value={activityData.fichier}
            onChange={(e) => {
              setActivityData({
                ...activityData,
                fichier: e.target.value,
              });
            }}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <p
          className={`text-xs text-red-500 justify-center items-center ${
            (!myHabilitation?.transverse?.update &&
              activityData?.type === "Transverse") ||
            (!myHabilitation?.intercontract?.update &&
              activityData?.type === "InterContract")
              ? "flex"
              : "hidden"
          }`}
        >
          * Vous n'avez pas accès à la modification
        </p>
        <button
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2 "
          type="button"
          onClick={handleCloseModal}
        >
          Annuler
        </button>
        {(() => {
          const hasRequiredFields =
            activityData?.title !== "" &&
            activityData?.type !== "" &&
            activityData?.startDate !== "" &&
            activityData?.dueDate !== "";

          const isProjectComplete =
            activityData?.type === "Projet" &&
            activityData?.projectTitle !== "" &&
            activityData?.phaseTitle !== "";

          const istransverseComplete =
            activityData?.type === "Transverse" &&
            activityData?.transverseType !== "";
          const isIntercontractComplete =
            activityData?.type === "InterContract" &&
            activityData?.intercontractType !== "";

          var isDisabled;

          if (activityData?.type === "Transverse") {
            isDisabled =
              hasRequiredFields &&
              (isProjectComplete ||
                istransverseComplete ||
                isIntercontractComplete) &&
              myHabilitation?.transverse.update;
          } else if (activityData?.type === "InterContract") {
            isDisabled =
              hasRequiredFields &&
              (isProjectComplete ||
                istransverseComplete ||
                isIntercontractComplete) &&
              myHabilitation?.intercontract.update;
          } else {
            isDisabled =
              hasRequiredFields &&
              (isProjectComplete ||
                istransverseComplete ||
                isIntercontractComplete);
          }
          const buttonClassName = !isDisabled
            ? "cursor-not-allowed bg-graydark"
            : "cursor-pointer bg-green-700 hover:opacity-85";

          return (
            <button
              type="button"
              disabled={!isDisabled}
              onClick={handleUpdateActivity}
              className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${buttonClassName}`}
            >
              {isLoading ? (
                <BeatLoader size={5} className="mr-2" color={"#fff"} />
              ) : null}
              Valider
            </button>
          );
        })()}
      </ModalFooter>
    </Modal>
  );
};

export default UpdateActivity;