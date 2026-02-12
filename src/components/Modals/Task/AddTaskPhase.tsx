import React, { useState, useEffect, useRef , useMemo} from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import ListUsers from "../../UIElements/ListUsers";
import { getPhaseById } from "../../../services/Project";
import { IPhase, IUserProject, ITaskAdd } from "../../../types/Project";
import { IDecodedToken } from "../../../types/user";
import { createTaskPhase } from "../../../services/Project";
import { decodeToken } from "../../../services/Function/TokenService";
import { v4 as uuid4 } from "uuid";
import { BeatLoader } from "react-spinners";
import DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';

import { Notyf } from "notyf";
import "notyf/notyf.min.css";

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

const AddTaskPhase = ({
  modalOpen,
  setModalOpen,
  setIsAddTaskFinished,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddTaskFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { phaseId, projectId } = useParams();
  const userPopUp = useRef<any>(null);
  const [phaseData, setPhaseData] = useState<IPhase>();
  const [isDropdownUserOpen, setDropDownUserOpen] = useState<boolean>(false);
  const [assignedPerson, setAssignedPerson] = useState<Array<IUserProject>>([]);
  const [taskData, setTaskData] = useState<ITaskAdd>({
    title: "",
    description: "",
    priority: "Moyen",
    startDate: undefined,
    dueDate: undefined,
    fichier:"",
    dailyEffort: 1,
    status: "Backlog",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();

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

  // close user pop up if click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!userPopUp.current) return;
      if (!userPopUp || userPopUp.current.contains(target)) return;
      setDropDownUserOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const fetchDataPhase = async () => {
    try {
      if (phaseId) {
        const data = await getPhaseById(phaseId);
        setPhaseData(data);
      }
    } catch (error) {
      console.error("error at fetch data phase: ", error);
    }
  };

  useEffect(() => {
    fetchDataPhase();
  }, []);

  const handleAddUser = (user: {
    userid: string | undefined;
    projectid: any;
    role: any;
    name: any;
  }) => {
    if (!assignedPerson.some((u) => u.userid === user.userid)) {
      const formatUser = {
        userid: user.userid,
        projectid: user.projectid,
        role: user.role,
        user: {
          name: user.name,
        },
      };
      setAssignedPerson((prev) => [...prev, formatUser]);
    }
  };

  const handleCreateTask = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!taskData.title || !taskData.startDate || assignedPerson.length === 0) {
        notyf.error("Please fill all required fields");
        setIsLoading(false);
        return;
      }
  
      const id = uuid4();
      const initiatorId = decodedToken?.jti;
      const initiatorName = decodedToken?.name;
      
      const formatuser = assignedPerson.map((u) => ({
        userid: u.userid,
        taskid: id,
        user: {
          name: u?.user?.name,
        },
      }));
  
      const dataToSend = {
        id,
        title: taskData.title,
        description: taskData.description || "", // Ensure description is never undefined
        phaseid: phaseId,
        projectid: projectId,
        priority: taskData.priority,
        startDate: new Date(taskData.startDate).toISOString(), // Convert to ISO string
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        fichier: taskData.fichier,
        listUsers: formatuser,
        dailyEffort: taskData.dailyEffort, // Changed to match state name
        status: taskData.status,
        initiatorId,
        initiatorName,
      };
  
      console.log("Sending data:", dataToSend); // For debugging
      
      await createTaskPhase(dataToSend);
      notyf.success("Création de la tâche réussie.");
      setIsAddTaskFinished(true);
      handleCloseModal();
    } catch (error) {
      notyf.error(
        "Une erreur s'est produite lors de la création de la tâche, veuillez réessayer plus tard."
      );
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      header="Ajouter une tâche"
      heightSize="80vh"
      widthSize="medium"
    >
      <ModalBody>
        <>
          <div className="space-y-2">
            <div className="font-semibold text-sm">
              Assigné à : <span className="text-red-500 ml-1 text-sm">*</span>
            </div>
            <div className="grid grid-cols-3 place-content-center place-items-stretch">
              <div className="flex  items-center">
                <div>
                  <ListUsers data={assignedPerson} type="show" />
                </div>
                <span
                  ref={userPopUp}
                  onClick={() => {
                    setDropDownUserOpen(!isDropdownUserOpen);
                  }}
                  className={`w-5 h-5 p-3 border flex rounded-full justify-center items-center cursor-pointer bg-zinc-200 dark:bg-boxdark  hover:bg-zinc-300 border-zinc-200 dark:hover:bg-boxdark2 dark:border-formStrokedark ${
                    assignedPerson.length > 0 ? "hidden" : ""
                  }`}
                >
                  +
                </span>
                <div
                  className={`absolute top-14  left-0 border dark:border-formStrokedark border-zinc-300 bg-white dark:bg-boxdark2 shadow-lg rounded-md z-50 transition-transform duration-300 ease-in-out ${
                    isDropdownUserOpen ? "scale-100" : "scale-0"
                  }`}
                  style={{ transformOrigin: "top left " }} // Définit l'origine de la transformation
                >
                  {isDropdownUserOpen && (
                    <div className="rounded-md">
                      {phaseData?.userProject
                        ?.filter(
                          (user) =>
                            !assignedPerson.some(
                              (u) => u.userid === user.userid
                            )
                        )
                        ?.map((user) => (
                          <div
                            key={user.userid}
                            className="p-2 first:rounded-t-md last:rounded-b-md hover:bg-zinc-100 dark:hover:bg-boxdark text-xs cursor-pointer"
                            onClick={() => {
                              handleAddUser(user);
                            }}
                          >
                            {user.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <CustomInput
              type="text"
              label="Titre"
              required={true}
              rounded="medium"
              className="text-sm"
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  title: e.target.value,
                });
              }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <CustomSelect
              label="Priorité"
              placeholder=""
              data={["Urgent", "Important", "Moyen", "Bas"]}
              value={taskData.priority}
              onValueChange={(e) => {
                setTaskData({
                  ...taskData,
                  priority: e,
                });
              }}
            />
            <CustomSelect
              label="Statut"
              placeholder=""
              data={["Backlog", "En cours", "Traité", "En pause", "Abandonné"]}
              value={taskData.status}
              onValueChange={(e) => {
                setTaskData({
                  ...taskData,
                  status: e,
                });
              }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <CustomInput
              type="date"
              required={true}
              label="Date de début"
              rounded="medium"
              className="text-sm"
              value={taskData?.startDate}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  startDate: e.target.value,
                });
              }}
            />
            <CustomInput
              type="date"
              label="Date d'échéance"
              className="text-sm"
              rounded="medium"
              value={taskData.dueDate}
              min={taskData?.startDate}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  dueDate: e.target.value,
                });
              }}
            />
          </div>
          <CustomInput
            type="text"
            inputMode="numeric"
            label="Heure consacrée"
            min={1}
            max={8}
            rounded="medium"
            className="text-sm"
            value={taskData?.dailyEffort}
            onChange={(e) => {
              let value = parseInt(e.target.value);
              if (value > 8) value = 8;
              if (value < 1) value = 1;
              setTaskData({
                ...taskData,
                dailyEffort: value,
              });
            }}
          />

         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <QuillEditor
              value={taskData.description}
              onChange={(value) => {
                setTaskData({
                  ...taskData,
                  description: value,
                });
              }}
              placeholder="Écrivez votre description ici..."
            />
          </div>
            {/* <CustomInput
              type="textarea"
              label="Description"
              placeholder="Tapez une description ou ajoutez des notes ici"
              rows={8}
              rounded="medium"
              className="text-sm"
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                });
              }}
            /> */}
             <div>
             <CustomInput
              type="text"
              label="Ajouter un lien"
              placeholder="Insérér votre lien ici"
              rounded="medium"
              className="text-sm"
              value={taskData?.fichier}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  fichier: e.target.value,
                });
              }}
            />
          </div>
        </>
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
          const hasTitle = taskData?.title?.trim() !== "";
          const hasStartDate =
            taskData?.startDate !== "" && taskData?.startDate !== undefined;
          const hasPersonAssigned = assignedPerson.length > 0;
          const isDisabled = hasTitle && hasStartDate && hasPersonAssigned;
          const buttonClassName = !isDisabled
            ? "cursor-not-allowed bg-graydark"
            : "cursor-pointer bg-green-700 hover:opacity-85";
          return (
            <button
              disabled={!isDisabled}
              type="button"
              onClick={handleCreateTask}
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

export default AddTaskPhase;
