import React, { useState, useEffect, useRef, useMemo } from "react";
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
  createInterContract,
  createTransverse,
  createTaskPhase,
} from "../../../services/Project";
import { IDecodedToken } from "../../../types/user";
import { decodeToken } from "../../../services/Function/TokenService";
import { IMyHabilitation } from "../../../types/Habilitation";
import { getAllUsers } from "../../../services/User";
import { getInitials } from "../../../services/Function/UserFunctionService";
import { IUserProject } from "../../../types/Project";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { v4 as uuid4 } from "uuid";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const QuillEditor = ({
  value,
  onChange,
  placeholder = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (!input.files) return;
      const file = input.files[0];

      if (file.size > 2 * 1024 * 1024) {
        notyf.error("L'image ne doit pas dépasser 2MB");
        return;
      }

      try {
        notyf.success("Upload de l'image en cours...");
       
        const formData = new FormData();
        formData.append('file', file);
        const endPoint = import.meta.env.VITE_API_ENDPOINT;

        const response = await fetch(`${endPoint}/api/Task/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Échec de l'upload");
        }

        const data = await response.json();
       
        if (!data.url) {
          throw new Error("URL de l'image manquante dans la réponse");
        }

        const quill = quillRef.current?.getEditor();
        if (!quill) {
          throw new Error("Éditeur Quill non disponible");
        }

        const range = quill.getSelection(true);
        const imageUrl = data.url.startsWith('http') ? data.url : `${endPoint}${data.url}`;

        const sanitizedHtml = DOMPurify.sanitize(
          `<img src="${imageUrl}" style="max-width: 500px; height: 500px;" alt="uploaded image">`
        );
        quill.clipboard.dangerouslyPasteHTML(range?.index || 0, sanitizedHtml);
       
        quill.setSelection((range?.index || 0) + 1, 0);
       
        notyf.success("Image ajoutée avec succès");
      } catch (error: unknown) {
        console.error("Erreur lors de l'upload de l'image:", error);
        let errorMessage = "Échec de l'upload de l'image";
        if (error instanceof Error) {
          errorMessage += `: ${error.message}`;
        }
        notyf.error(errorMessage);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    },
    
  }), []);

  return (
    <div className="text-editor dark:text-white">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="dark:bg-boxdark dark:border-formStrokedark"
      />
    </div>
  );
};

const DuplicateActivity = ({
  modalDuplicateOpen,
  activity,
  setModalDuplicateOpen,
  setIsRefreshNeeded,
  myHabilitation
}: {
  modalDuplicateOpen: boolean;
  activity: any;
  myHabilitation?: IMyHabilitation;
  setModalDuplicateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (!activity || !activity.content) {
    return null;
  }

  const { userid } = useParams();
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [activityData, setActivityData] = useState<IActivityAdd>({
    id: activity?.content?.id?.split(".")?.[0],
    title: activity?.content?.title,
    description: activity?.content?.description,
    type: activity?.content?.type,
    dailyEffort: activity?.content?.dailyEffort,
    startDate: activity?.content?.startDate,
    dueDate: activity?.content?.dueDate || activity?.content?.endDate,
    endDate: activity?.content?.endDate || activity?.content?.dueDate,
    fichier: activity?.content?.fichier,
    projectTitle: activity?.content?.projectTitle,
    phaseTitle: activity?.content?.phaseTitle,
    projectId: activity?.content?.projectId || activity?.content?.projectid,
    phaseId: activity?.content?.phaseId || activity?.content?.phaseid,
    transverseType: activity?.content?.subType,
    intercontractType: activity?.content?.subType,
    status: activity?.content?.status,
    priority: activity?.content?.priority,
  });

  const [usersList, setUsersList] = useState<Array<any>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<any>>([]);
  const [showUserList, setShowUserList] = useState<boolean>(false);
  const [assignedPerson, setAssignedPerson] = useState<Array<IUserProject>>(
    Array.isArray(activity?.content?.user) 
      ? activity.content.user.map((user: any) => ({
          userid: user.userid,
          projectid: activityData.projectId,
          role: "collaborator",
          user: {
            name: user.user?.name || "",
            email: user.user?.email || ""
          }
        }))
      : []
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

  const userPopUp = useRef<any>(null);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsersList(users);
        setFilteredUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        notyf.error("Erreur lors du chargement des utilisateurs");
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
    } else {
      notyf.error("Cet utilisateur est déjà assigné");
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
        data.map((pr: {title: string}) => {
          projectName.push(pr.title);
        });

        var titleProject = "";
        var titlePhase = "";

        data?.map((dt: { id: string; title: string; listPhases: any[] }) => {
          if(dt?.id === activity?.content?.projectid) {
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
      notyf.error("Erreur lors du chargement des projets");
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  useEffect(() => {
    const project = projectData?.find(
      (pr: {title: string; id: string; }) => pr?.id === activityData.projectId
    );
    const listPhase = project?.listPhases;

    const updatedTaskData = {
      ...activityData,
      projectTitle: project?.title || activityData.projectTitle,
    };

    if(activityData.phaseTitle !== "") {
      const phase = listPhase?.find(
        (lp: { phase1: string; id: string }) => lp.id === activityData.phaseId
      );
      updatedTaskData.phaseTitle = phase?.phase1 || activityData.phaseTitle;
    }

    setActivityData(updatedTaskData);
  }, [projectData]);
  
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
    setModalDuplicateOpen(false);
  };

  const processDescription = (html: string): string => {
    const sanitized = DOMPurify.sanitize(html, {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['src', 'alt', 'style', 'width', 'height'],
      ALLOW_DATA_ATTR: false
    });
    return sanitized;
  };

  const handleDuplicateActivity = async () => {
    setIsLoading(true);
    try {
      const cleanDate = (date: string | null | undefined): string => {
        if (!date) return new Date().toISOString().split('T')[0];
        return date.includes('T') ? date.split('T')[0] : date;
      };
      
      const newId = uuid4();
      const processedDescription = processDescription(activityData.description || '');

      if (activityData?.type === "Projet") {
        const formatUser = [
          {
            userid: userid,
            taskid: newId,
          },
          ...assignedPerson.map(user => ({
            userid: user.userid,
            taskid: newId
          }))
        ].filter((user, index, self) => 
          index === self.findIndex(u => u.userid === user.userid)
        );

        const dataToSend = {
          id: newId, 
          title: activityData.title,
          description: processedDescription,
          phaseid: activityData.phaseId,
          projectid: activityData.projectId,
          priority: activityData.priority || "Moyen",
          startDate: cleanDate(activityData.startDate),
          dueDate: cleanDate(activityData.dueDate || activityData.endDate),
          dailyEffort: Number(activityData.dailyEffort) || 1, 
          status: activityData.status || "Backlog", 
          fichier: activityData.fichier || "", 
          listUsers: formatUser
        };
        await createTaskPhase(dataToSend);
      } else if (activityData?.type === "Transverse") {
        const dataToSend = {
          id: newId,
          title: activityData.title,
          description: processedDescription,
          startDate: cleanDate(activityData.startDate),
          endDate: cleanDate(activityData.dueDate ?? activityData.endDate ?? undefined),
          dailyEffort: activityData.dailyEffort,
          type: activityData.transverseType,
          status: activityData.status,
          fichier: activityData.fichier,
          userid: decodedToken?.jti
        };
        await createTransverse(dataToSend);
      } else {
        const dataToSend = {
          id: newId,
          title: activityData.title,
          startDate: cleanDate(activityData.startDate),
          endDate: cleanDate(activityData.dueDate ?? activityData.endDate ?? undefined),
          dailyEffort: activityData.dailyEffort,
          type: activityData.intercontractType,
          description: processedDescription,
          status: activityData.status,
          fichier: activityData.fichier,
          userid: decodedToken?.jti
        };
        await createInterContract(dataToSend);
      } 
      setIsRefreshNeeded(true);
      notyf.success("Duplication de l'activité réussi");
      handleCloseModal();
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard");
      console.error(`Error at duplicate activity : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!userPopUp.current) return;
      if (!userPopUp || userPopUp.current.contains(target)) return;
      setShowUserList(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  const isFormValid = () => {
    const hasRequiredFields =
      activityData.title &&
      activityData.type &&
      activityData.startDate &&
      activityData.dueDate;

    const isProjectComplete =
      activityData.type !== "Projet" ||
      (activityData.projectTitle && activityData.phaseTitle);

    const isTransverseComplete =
      activityData.type !== "Transverse" || activityData.transverseType;

    const isIntercontractComplete =
      activityData.type !== "InterContract" || activityData.intercontractType;

    return (
      hasRequiredFields &&
      isProjectComplete &&
      isTransverseComplete &&
      isIntercontractComplete
    );
  };

  return (
    <Modal
      modalOpen={modalDuplicateOpen}
      setModalOpen={setModalDuplicateOpen}
      header={`Dupliquer: ${activity?.content?.title}`}
      heightSize="80vh"
      widthSize="medium"
    >
      <ModalBody>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative" ref={userPopUp}>
              <CustomInput
                type="text"
                label="Assigné à :"
                rounded="medium"
                className="text-sm"
                onChange={(e) => handleUserSearch(e.target.value)}
                onFocus={() => setShowUserList(true)}
                placeholder="Rechercher un utilisateur..."
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
            placeholder="Titre de l'activité"
          />
          
          <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
            <CustomInput
              label="Type"
              type="text"
              rounded="medium"
              className="text-sm"
              value={activityData.type}
              readOnly
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
              placeholder="Sélectionnez un statut"
            />
          </div>
          
          <div className={`w-full *:w-full flex-wrap md:flex-nowrap gap-2 ${
              activity.content.type === "Projet" ? "flex" : "hidden"
            }`}
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
              placeholder="Sélectionnez un projet"
            />
            <CustomSelect
              className={`${activityData?.projectTitle === "" ? "hidden" : ""}`}
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
              placeholder={activityData.projectTitle ? "Sélectionnez une phase" : "Sélectionnez d'abord un projet"}
            />
          </div>
          
          <div className={`w-full *:w-full flex-wrap md:flex-nowrap gap-2 ${
              activity.content.type === "Transverse" ? "flex" : "hidden"
            }`}
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
              placeholder="Sélectionnez un type"
            />
          </div>
          
          <div className={`w-full *:w-full flex-wrap md:flex-nowrap gap-2 ${
              activity.content.type === "InterContract" ? "flex" : "hidden"
            }`}
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
              placeholder="Sélectionnez un type"
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
                activityData?.dueDate || activityData?.endDate
                  ? (activityData.dueDate || activityData.endDate || '').includes('T') 
                    ? (activityData.dueDate || activityData.endDate || '').split('T')[0]
                    : (activityData.dueDate || activityData.endDate || '')
                  : ""
              }
              min={activityData?.startDate}
              onChange={(e) => {
                setActivityData({
                  ...activityData,
                  dueDate: e.target.value,
                  endDate: e.target.value
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Description
            </label>
            <QuillEditor
              value={activityData.description || ''}
              onChange={(value) => {
                setActivityData({
                  ...activityData,
                  description: value,
                });
              }}
              placeholder="Écrivez votre description ici..."
            />
          </div>

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
            placeholder="https://example.com"
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
          className="border text-xs p-2 rounded-md font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2"
          type="button"
          onClick={handleCloseModal}
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="button"
          disabled={!isFormValid() || isLoading}
          onClick={handleDuplicateActivity}
          className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${
            !isFormValid() || isLoading
              ? "cursor-not-allowed bg-gray-500"
              : "cursor-pointer bg-green-700 hover:opacity-85"
          }`}
        >
          {isLoading ? (
            <BeatLoader size={5} className="mr-2" color={"#fff"} />
          ) : null}
          Dupliquer
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default DuplicateActivity;