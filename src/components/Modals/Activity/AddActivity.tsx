import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { BeatLoader } from "react-spinners";
import { IActivityAdd, IUserProject } from "../../../types/Project";
import { 
  createInterContract,
  createTransverse,
  getProjectByUserId,
  createTaskPhase,
 } from "../../../services/Project";
import { v4 as uuid4 } from "uuid";
import { intercontractType, transverseType } from "../../../constants/Activity";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { IMyHabilitation } from "../../../types/Habilitation";
import { IDecodedToken } from "../../../types/user";
import { decodeToken } from "../../../services/Function/TokenService";
// import {IUserProject } from "../../../types/Project";
import { getAllUsers } from "../../../services/User";
//import ListUsers from "../../UIElements/ListUsers";
//import { getAllUsers } from "../../../services/User/UserServices";
 import { getInitials } from "../../../services/Function/UserFunctionService";
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AddActivity = ({
  modalOpen,
  setModalOpen,
  setIsActivityFinished,
  myHabilitation,
}: {
  modalOpen: boolean;
  myHabilitation?: IMyHabilitation;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsActivityFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userid } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const userPopUp = useRef<any>(null);
 const [isDropdownUserOpen, setIsDropDownUserOpen] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<Array<any>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<any>>([]);
  //const [showUserList, setShowUserList] = useState<boolean>(false);
   const [assignedPerson, setAssignedPerson] = useState<Array<IUserProject>>([]);
  const [activityData, setActivityData] = useState<IActivityAdd>({
    title: "",
    description: "",
    type: "",
    status: "Backlog",
    dailyEffort: 1,
    startDate: "",
    dueDate: "",
    endDate:"",
    fichier: "",
    projectTitle: "",
    phaseTitle: "",
    projectId: "",
    phaseId: "",
    transverseType: "",
    intercontractType: "",
  });

  const [projectTitle, setProjectTitle] = useState<Array<string>>([]);
  const [phaseTitle, setPhaseTitle] = useState<Array<string>>([]);
  const [projectData, setProjectData] = useState<any>();

  useEffect(() => {
    const token = localStorage.getItem("_au_pr");
    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Invalid token ${error}`);
      }
    }
  }, []);

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
      setIsDropDownUserOpen(false);
    } else {
      const filtered = usersList.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setIsDropDownUserOpen(true);
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
      setIsDropDownUserOpen(false);
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

        setProjectTitle(projectName);
        setProjectData(data);
      }
    } catch (error) {
      console.error(`Error at fetch project data : ${error}`);
    }
  };

  useEffect(() => {
    const project = projectData?.filter(
      (pr: { title: string }) => pr?.title === activityData.projectTitle
    );
    const listPhase = project?.[0]?.listPhases;

    const arrayPhaseTitle: Array<string> = [];
    listPhase?.map((lp: { phase1: string; status: string }) => {
      if (lp.status !== "Terminé") {
        arrayPhaseTitle.push(lp?.phase1);
      }
    });

    setActivityData({
      ...activityData,
      projectId: project?.[0]?.id,
    });

    if (activityData.phaseTitle !== "") {
      const phase = listPhase?.filter(
        (lp: { phase1: string }) => lp.phase1 === activityData.phaseTitle
      );
      setActivityData({
        ...activityData,
        phaseId: phase?.[0]?.id,
      });
    }

    setPhaseTitle(arrayPhaseTitle);
  }, [activityData.projectTitle, activityData.phaseTitle]);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  //close user pop up if click outside
useEffect(() => {
  const clickHandler = ({ target }: MouseEvent) => {
    if (!userPopUp.current) return;
    if (!userPopUp || userPopUp.current.contains(target)) return;
    setIsDropDownUserOpen(false);
  };
  document.addEventListener("click", clickHandler);
  return () => document.removeEventListener("click", clickHandler);
}, []);

  const handleCreateActivity = async () => {
    setIsLoading(true);
    try {
      const id = uuid4();
      
      // Validate required fields
      if (!activityData?.title || !activityData?.startDate || !activityData?.dueDate) {
        throw new Error("Title, start date, and due date are required");
      }
  
      if (activityData?.type === "Projet") {
        const formatUser = [
          {
            userid: userid,
            taskid: id,
          },
        ];
        // Validate project-specific fields
        // if (!activityData?.projectId || !activityData?.phaseId) {
        //   throw new Error("Project and phase selection are required");
        // }
  
        // const formatUser = assignedPerson.map(user => ({
        //   userid: user.userid,
        //   activityid: id,
        // }));
        
        // Add current user if list is empty
        // if (formatUser.length === 0 && userid) {
        //   formatUser.push({
        //     userid: userid,
        //     activityid: id,
        //   });
        // }
  
        const initiatorId = decodedToken?.jti;
        const initiatorName = decodedToken?.name;
        
        if (!initiatorId || !initiatorName) {
          throw new Error("User information is missing");
        }
  
        const dataToSend = {
          id,
          title: activityData?.title,
          description: activityData?.description || "", // Ensure description exists
          phaseid: activityData?.phaseId,
          projectid: activityData?.projectId,
          priority: "Moyen",
          startDate: new Date(activityData?.startDate).toISOString(), // Ensure proper date format
          dueDate: new Date(activityData?.dueDate).toISOString(),
          fichier: activityData?.fichier || "", // Ensure fichier exists
          dailyEffort: activityData?.dailyEffort || 1,
          status: activityData?.status || "Backlog",
          listUsers: formatUser,
          initiatorId,
          initiatorName,
        };
  
        await createTaskPhase(dataToSend);
      } else if (activityData.type === "Transverse") {
        if (!activityData.transverseType) {
          throw new Error("Transverse type is required");
        }
  
        const dataToSend = {
          id,
          dailyEffort: activityData.dailyEffort || 1,
          description: activityData.description || "",
          startDate: new Date(activityData.startDate).toISOString(),
          endDate: new Date(activityData.dueDate).toISOString(),
          status: activityData?.status || "Backlog",
          title: activityData.title,
          type: activityData.transverseType,
          userid,
          fichier: activityData.fichier || "",
        };
        await createTransverse(dataToSend);
      } else if (activityData.type === "Intercontract") {
        if (!activityData.intercontractType) {
          throw new Error("Intercontract type is required");
        }
  
        const dataToSend = {
          id,
          dailyEffort: activityData.dailyEffort || 1,
          description: activityData.description || "",
          startDate: new Date(activityData.startDate).toISOString(),
          endDate: new Date(activityData.dueDate).toISOString(),
          status: activityData?.status || "Backlog",
          title: activityData.title,
          type: activityData.intercontractType,
          userid,
          fichier: activityData.fichier || "",
        };
        await createInterContract(dataToSend);
      }
      
      notyf.success("Création de l'activité réussie.");
      setIsActivityFinished(true);
      handleCloseModal();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Une erreur s'est produite";
      notyf.error(errorMessage);
      console.error("Error at create activity:", error);
      
      // Log additional details for debugging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      header="Ajouter une activité"
      heightSize="80vh"
      widthSize="medium"
    >
      <ModalBody>
        <div className="space-y-4">
          {/* Section Assignation */}
          <div className="space-y-2">
            
            
            {/* Input de recherche */}
            <div className="relative">
              <CustomInput
              required={true}
                type="text"
                label="Assigné à : "
                rounded="medium"
                className="text-sm"
                onChange={(e) => handleUserSearch(e.target.value)}
                onFocus={() => setIsDropDownUserOpen(true)}
              />
              
              {/* Liste des utilisateurs filtrés */}
              {isDropdownUserOpen  && filteredUsers.length > 0 && (
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
          {/* Reste du formulaire */}
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
          
          {/* ... (le reste du formulaire reste inchangé) ... */}
          <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
            <CustomSelect
              required={true}
              label="Type"
              data={[
                "Projet",
                ...(myHabilitation?.transverse.create ? ["Transverse"] : []),
                ...(myHabilitation?.intercontract.create
                  ? ["Intercontract"]
                  : []),
              ]}
              value={activityData.type}
              onValueChange={(e) => {
                setActivityData({
                  ...activityData,
                  type: e,
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
                activityData.type === "Projet" ? "flex" : "hidden"
              } `}
            >
              <CustomSelect
                required={true}
                label="Titre du projet"
                data={projectTitle}
                value={activityData?.projectTitle}
                onValueChange={(e) => {
                  setActivityData({
                    ...activityData,
                    projectTitle: e,
                  });
                }}
              />
              <CustomSelect
                required={true}
                className={` ${
                  activityData?.projectTitle === "" ? "hidden" : ""
                }`}
                label="Titre de la phase"
                data={phaseTitle}
                value={activityData?.phaseTitle?.slice(0, 20)}
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
                activityData.type === "Transverse" ? "flex" : "hidden"
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
                activityData.type === "Intercontract" ? "flex" : "hidden"
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
              label="Date de début"
              rounded="medium"
              className="text-sm"
              value={activityData?.startDate}
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
              label="Date de fin"
              rounded="medium"
              className="text-sm"
              min={activityData.startDate}
              value={activityData?.dueDate}
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
            label="Temps à consacré (heures)"
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
            activityData?.type === "Intercontract" &&
            activityData?.intercontractType !== "";

          const isDisabled =
            hasRequiredFields &&
            (isProjectComplete ||
              istransverseComplete ||
              isIntercontractComplete);
          const buttonClassName = !isDisabled
            ? "cursor-not-allowed bg-graydark"
            : "cursor-pointer bg-green-700 hover:opacity-85";

          return (
            <button
              disabled={!isDisabled}
              type="button"
              onClick={handleCreateActivity}
              className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${buttonClassName}`}
            >
              {isLoading ? (
                <BeatLoader size={5} className="mr-2" color={"#fff"} />
              ) : null}
              Créer
            </button>
          );
        })()}
      </ModalFooter>
    </Modal>
  );
};

export default AddActivity;