// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { Modal, ModalBody, ModalFooter } from "../Modal";
// import { CustomInput, CustomSelect } from "../../UIElements";
// import { BeatLoader } from "react-spinners";
// import { IActivityAdd, IUserProject } from "../../../types/Project";
// import { 
//   createInterContract,
//   createTransverse,
//   getProjectByUserId,
//   createTaskPhase,
// } from "../../../services/Project";
// import { v4 as uuid4 } from "uuid";
// import { intercontractType, transverseType } from "../../../constants/Activity";
// import { Notyf } from "notyf";
// import "notyf/notyf.min.css";
// import { IMyHabilitation } from "../../../types/Habilitation";
// import { IDecodedToken } from "../../../types/user";
// import { decodeToken } from "../../../services/Function/TokenService";
// import { getAllUsers } from "../../../services/User";
// import { getInitials } from "../../../services/Function/UserFunctionService";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import dayjs from "dayjs";
// import DOMPurify from 'dompurify';
// const notyf = new Notyf({ 
//   position: { x: "center", y: "top" },
//   duration: 3000
// });

// const formats = [
//   "header",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "image",
// ];

// const QuillEditor = ({
//   value,
//   onChange,
//   placeholder = "",
// }: {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }) => {
//   const quillRef = useRef<ReactQuill>(null);

// const imageHandler = () => {
//   const input = document.createElement('input');
//   input.setAttribute('type', 'file');
//   input.setAttribute('accept', 'image/*');
//   input.click();

//   input.onchange = async () => {
//     if (!input.files) return;
//     const file = input.files[0];

//     if (file.size > 2 * 1024 * 1024) {
//       notyf.error("L'image ne doit pas dépasser 2MB");
//       return;
//     }

//     try {
//       notyf.success("Upload de l'image en cours...");
     
//       const formData = new FormData();
//       formData.append('file', file);
//       const endPoint = import.meta.env.VITE_API_ENDPOINT;

//       const response = await fetch(`${endPoint}/api/Task/upload`, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Échec de l'upload");
//       }

//       const data = await response.json();
     
//       if (!data.url) {
//         throw new Error("URL de l'image manquante dans la réponse");
//       }

//       const quill = quillRef.current?.getEditor();
//       if (!quill) {
//         throw new Error("Éditeur Quill non disponible");
//       }

//       const range = quill.getSelection(true);
//       const imageUrl = data.url.startsWith('http') ? data.url : `${endPoint}${data.url}`;

//       // Solution avec dangerouslyPasteHTML (recommandée)
//       const sanitizedHtml = DOMPurify.sanitize(
//         `<img src="${imageUrl}" style="max-width: 500px; height: 500px;" alt="uploaded image">`
//       );
//       quill.clipboard.dangerouslyPasteHTML(range?.index || 0, sanitizedHtml);
     
//       quill.setSelection((range?.index || 0) + 1, 0);
     
//       notyf.success("Image ajoutée avec succès");
//     } catch (error: unknown) {
//       console.error("Erreur lors de l'upload de l'image:", error);
//       let errorMessage = "Échec de l'upload de l'image";
//       if (error instanceof Error) {
//         errorMessage += `: ${error.message}`;
//       }
//       notyf.error(errorMessage);
//     }
//   };
// };

//   const modules = useMemo(() => ({
//     toolbar: {
//       container: [
//         [{ header: [1, 2, false] }],
//         ["bold", "italic", "underline", "strike", "blockquote"],
//         [
//           { list: "ordered" },
//           { list: "bullet" },
//           { indent: "-1" },
//           { indent: "+1" },
//         ],
//         ["link", "image"],
//         ["clean"],
//       ],
//       handlers: {
//         image: imageHandler
//       }
//     },
//     clipboard: {
//       matchVisual: false,
//     },
    
//   }), []);

//   return (
//     <div className="text-editor dark:text-white">
//       <ReactQuill
//         ref={quillRef}
//         theme="snow"
//         value={value}
//         onChange={onChange}
//         modules={modules}
//         formats={formats}
//         placeholder={placeholder}
//         className="dark:bg-boxdark dark:border-formStrokedark"
//       />
//     </div>
//   );
// };

// const AddActivity = ({
//   modalOpen,
//   setModalOpen,
//   setIsActivityFinished,
//   myHabilitation,
// }: {
//   modalOpen: boolean;
//   myHabilitation?: IMyHabilitation;
//   setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   setIsActivityFinished: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   const { userid } = useParams();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
//   const userPopUp = useRef<any>(null);
//   const [isDropdownUserOpen, setIsDropDownUserOpen] = useState<boolean>(false);
//   const [usersList, setUsersList] = useState<Array<any>>([]);
//   const [filteredUsers, setFilteredUsers] = useState<Array<any>>([]);
//   const [assignedPerson, setAssignedPerson] = useState<Array<IUserProject>>([]);
//   const [searchUserInput, setSearchUserInput] = useState<string>("");
//   const [activityData, setActivityData] = useState<IActivityAdd>({
//     title: "",
//     description: "",
//     type: "",
//     status: "Backlog",
//     dailyEffort: 1,
//     optionalEffort:undefined,
//     startDate: "",
//     dueDate: "",
//     endDate: "",
//     fichier: "",
//     projectTitle: "",
//     phaseTitle: "",
//     projectId: "",
//     phaseId: "",
//     transverseType: "",
//     intercontractType: "",
//     fileName: "",
//     fileContent: undefined,
//   });

//   const [projectTitle, setProjectTitle] = useState<Array<string>>([]);
//   const [phaseTitle, setPhaseTitle] = useState<Array<string>>([]);
//   const [projectData, setProjectData] = useState<any>();
 

//   useEffect(() => {
//     const token = localStorage.getItem("_au_pr");
//     if (token) {
//       try {
//         const decoded = decodeToken("pr");
//         setDecodedToken(decoded);
        
//         if (decoded?.jti && decoded?.name) {
//           setAssignedPerson([{
//             userid: decoded.jti,
//             projectid: "",
//             role: "collaborator",
//             user: {
//               name: decoded.name
//             },
//           }]);
//           setSearchUserInput(decoded.name);
//         }
//       } catch (error) {
//         console.error(`Invalid token ${error}`);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const users = await getAllUsers();
//         setUsersList(users);
//         setFilteredUsers(users);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         notyf.error("Erreur lors du chargement des utilisateurs");
//       }
//     };
    
//     fetchUsers();
//   }, []);

//   const handleUserSearch = (searchTerm: string) => {
//     if (searchTerm === "") {
//       setFilteredUsers(usersList);
//       setIsDropDownUserOpen(false);
//     } else {
//       const filtered = usersList.filter(user => 
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//       setIsDropDownUserOpen(true);
//     }
//   };

//   const handleAddUser = (user: {
//     id: string;
//     name: string;
//     email: string;
//   }) => {
//     if (!assignedPerson.some(u => u.userid === user.id)) {
//       const formatUser = {
//         userid: user.id,
//         projectid: activityData.projectId,
//         role: "collaborator",
//         user: {
//           name: user.name,
//           email: user.email
//         },
//       };
//       setAssignedPerson(prev => [...prev, formatUser]);
//       setSearchUserInput("");
//       setIsDropDownUserOpen(false);
//     } else {
//       notyf.error("Cet utilisateur est déjà assigné");
//     }
//   };

// const handleRemoveUser = (userId: string) => {
//   if (userId === decodedToken?.jti) {
//     // Confirmation avant de se retirer
   
//       setAssignedPerson(prev => prev.filter(user => user.userid !== userId));
    
//     return;
//   }
//   setAssignedPerson(prev => prev.filter(user => user.userid !== userId));
// };

//   const fetchProjectData = async () => {
//     try {
//       if (userid) {
//         const projectName: string[] = [];
//         const data = await getProjectByUserId(userid);
//         data.map((pr: { title: string }) => {
//           projectName.push(pr.title);
//         });

//         setProjectTitle(projectName);
//         setProjectData(data);
//       }
//     } catch (error) {
//       console.error(`Error at fetch project data : ${error}`);
//       notyf.error("Erreur lors du chargement des projets");
//     }
//   };

//   useEffect(() => {
//     const project = projectData?.filter(
//       (pr: { title: string }) => pr?.title === activityData.projectTitle
//     );
//     const listPhase = project?.[0]?.listPhases;

//     const arrayPhaseTitle: Array<string> = [];
//     listPhase?.map((lp: { phase1: string; status: string }) => {
//       if (lp.status !== "Terminé") {
//         arrayPhaseTitle.push(lp?.phase1);
//       }
//     });

//     setActivityData({
//       ...activityData,
//       projectId: project?.[0]?.id,
//     });

//     if (activityData.phaseTitle !== "") {
//       const phase = listPhase?.filter(
//         (lp: { phase1: string }) => lp.phase1 === activityData.phaseTitle
//       );
//       setActivityData({
//         ...activityData,
//         phaseId: phase?.[0]?.id,
//       });
//     }

//     setPhaseTitle(arrayPhaseTitle);
//   }, [activityData.projectTitle, activityData.phaseTitle]);

//   useEffect(() => {
//     fetchProjectData();
//   }, []);

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setActivityData({
//       title: "",
//       description: "",
//       type: "",
//       status: "Backlog",
//       dailyEffort: 1,
//       optionalEffort:undefined,
//       startDate: "",
//       dueDate: "",
//       endDate: "",
//       fichier: "",
//       projectTitle: "",
//       phaseTitle: "",
//       projectId: "",
//       phaseId: "",
//       transverseType: "",
//       intercontractType: "",
//       fileName: "",
//       fileContent: undefined,
//     });
//     setAssignedPerson([]);
//     if (decodedToken?.jti && decodedToken?.name) {
//       setAssignedPerson([{
//         userid: decodedToken.jti,
//         projectid: "",
//         role: "collaborator",
//         user: {
//           name: decodedToken.name,
//         },
//       }]);
//       setSearchUserInput(decodedToken.name);
//     }
//   };

//    //
// //   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //   if (!e.target.files || e.target.files.length === 0) return;

// //   const file = e.target.files[0];
  
// //   // Vérification de la taille
// //   if (file.size > 5 * 1024 * 1024) {
// //     notyf.error("Le fichier ne doit pas dépasser 5MB");
// //     return;
// //   }

// //   // Vérification des types de fichiers
// //   const allowedTypes = [
// //     'application/pdf',
// //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
// //     'image/jpeg',
// //     'image/png'
// //   ];
  
// //   if (!allowedTypes.includes(file.type)) {
// //     notyf.error("Type de fichier non supporté");
// //     return;
// //   }

// //   try {
// //     notyf.success("Upload du fichier en cours...");
    
// //     const formData = new FormData();
// //     formData.append('file', file);
    
// //     const endPoint = import.meta.env.VITE_API_ENDPOINT;
// //     const response = await fetch(`${endPoint}/api/Task/upload`, {
// //       method: 'POST',
// //       body: formData,
// //       headers: {
// //         'Authorization': `Bearer ${localStorage.getItem('access_token')}`
// //       }
// //     });

// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.message || "Erreur lors de l'upload");
// //     }

// //     const data = await response.json();
    
// //     setActivityData({
// //       ...activityData,
// //       fileName: file.name,
// //       fichier: data.url // Assurez-vous que l'API retourne bien une URL
// //     });
    
// //     notyf.success("Fichier uploadé avec succès");
// //   } catch (error: unknown) {
// //     console.error("Erreur lors de l'upload:", error);
// //     let errorMessage = "Échec de l'upload";
// //     if (error instanceof Error) {
// //       errorMessage += `: ${error.message}`;
// //     }
// //     notyf.error(errorMessage);
// //   }
// // };
//   //

//   useEffect(() => {
//     const clickHandler = ({ target }: MouseEvent) => {
//       if (!userPopUp.current) return;
//       if (!userPopUp || userPopUp.current.contains(target)) return;
//       setIsDropDownUserOpen(false);
//     };
//     document.addEventListener("click", clickHandler);
//     return () => document.removeEventListener("click", clickHandler);
//   }, []);

//   const processDescription = (html: string): string => {
//     const sanitized = DOMPurify.sanitize(html, {
//       ADD_TAGS: ['img'],
//       ADD_ATTR: ['src', 'alt', 'style', 'width', 'height'],
//       ALLOW_DATA_ATTR: false
//     });
//     return sanitized;
//   };

 
//   // const handleRemoveFile = () => {
//   //   setActivityData({
//   //     ...activityData,
//   //     fileName: "",
//   //     fileContent: undefined,
//   //     fichier: ""
//   //   });
//   // };

//   const validateForm = () => {
//     if (!activityData.title) {
//       notyf.error("Le titre est requis");
//       return false;
//     }

//     if (!activityData.type) {
//       notyf.error("Le type d'activité est requis");
//       return false;
//     }

//     if (!activityData.startDate) {
//       notyf.error("La date de début est requise");
//       return false;
//     }

//     if (!activityData.dueDate) {
//       notyf.error("La date de fin est requise");
//       return false;
//     }

//     const startDate = dayjs(activityData.startDate);
//     const dueDate = dayjs(activityData.dueDate);

//     if (dueDate.isBefore(startDate)) {
//       notyf.error("La date de fin doit être après la date de début");
//       return false;
//     }

//     if (activityData.type === "Projet") {
//       if (!activityData.projectTitle) {
//         notyf.error("Le projet est requis");
//         return false;
//       }

//       if (!activityData.phaseTitle) {
//         notyf.error("La phase est requise");
//         return false;
//       }
//     } else if (activityData.type === "Transverse") {
//       if (!activityData.transverseType) {
//         notyf.error("Le type de transverse est requis");
//         return false;
//       }
//     } else if (activityData.type === "Intercontract") {
//       if (!activityData.intercontractType) {
//         notyf.error("Le type d'intercontrat est requis");
//         return false;
//       }
//     }

//     if (assignedPerson.length === 0) {
//     notyf.error("Au moins une personne doit être assignée à l'activité");
//     return false;
//   }

//     return true;
//   };

//   const handleCreateActivity = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       //Utilise le temps réel s'il existe, sinon le temps normal
//        // Conversion sécurisée en heures (avec valeur par défaut)
//     // const effortInDays = activityData.optionalEffort ?? activityData.dailyEffort;
//     // const finalEffortInHours = Math.max(0.5, effortInDays as number) * 8; // Garantit au moins 0.5 jour (4h)
//       // Upload du fichier s'il existe
//       let fileUrl = activityData.fichier;
//       if (activityData.fileContent) {
//         try {
//           const formData = new FormData();
//           formData.append('file', activityData.fileContent);
          
//           const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/Task/upload`, {
//             method: 'POST',
//             body: formData,
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('access_token')}`
//             }
//           });

//           if (!response.ok) {
//             throw new Error('Échec de l\'upload du fichier');
//           }

//           const result = await response.json();
//           fileUrl = result.url;
//         } catch (error) {
//           console.error('Erreur lors de l\'upload:', error);
//           notyf.error("Échec de l'upload du fichier joint");
//           return;
//         }
//       }

//       const id = uuid4();
//       const initiatorId = decodedToken?.jti;
//       const initiatorName = decodedToken?.name;

//       if (!initiatorId || !initiatorName) {
//         throw new Error("User information is missing");
//       }

//       const processedDescription = processDescription(activityData.description);

//       if (activityData.type === "Projet") {
//         const formatUser = assignedPerson.length > 0 
//           ? assignedPerson.map(user => ({
//               userid: user.userid,
//               taskid: id,
//             }))
//           : [{
//               userid: userid,
//               taskid: id,
//             }];

//         const dataToSend = {
//           id,
//           title: activityData.title,
//           description: processedDescription,
//           phaseid: activityData.phaseId,
//           projectid: activityData.projectId,
//           priority: "Moyen",
//           startDate: new Date(activityData.startDate|| "").toISOString(),
//           dueDate: new Date(activityData.dueDate|| "").toISOString(),
//           fichier: fileUrl || "",
//           //dailyEffort: finalEffortInHours,
//           dailyEffort: activityData.dailyEffort || 1,
//           status: activityData.status || "Backlog",
//           listUsers: formatUser,
//           initiatorId,
//           initiatorName,
//         };

//         await createTaskPhase(dataToSend);
//       } else if (activityData.type === "Transverse") {
//         const dataToSend = {
//           id,
//           dailyEffort: activityData.dailyEffort || 1,
//           description: processedDescription,
//           startDate: new Date(activityData.startDate || "").toISOString(),
//           endDate: new Date(activityData.dueDate || "" ).toISOString(),
//           status: activityData.status || "Backlog",
//           title: activityData.title,
//           type: activityData.transverseType,
//           userid: userid,
//           fichier: fileUrl || "",
//         };

//         await createTransverse(dataToSend);
//       } else if (activityData.type === "Intercontract") {
//         const dataToSend = {
//           id,
//           dailyEffort: activityData.dailyEffort || 1,
//           description: processedDescription,
//           startDate: new Date(activityData.startDate|| "").toISOString(),
//           endDate: new Date(activityData.dueDate|| "").toISOString(),
//           status: activityData.status || "Backlog",
//           title: activityData.title,
//           type: activityData.intercontractType,
//           userid: userid,
//           fichier: fileUrl || "",
//         };

//         await createInterContract(dataToSend);
//       }
      
//       notyf.success("Activité créée avec succès");
//       setIsActivityFinished(true);
//       handleCloseModal();
//     } catch (error: any) {
//       console.error("Error creating activity:", error);
      
//       let errorMessage = "Une erreur s'est produite lors de la création";
//       if (error.response) {
//         errorMessage = error.response.data?.message || errorMessage;
//         if (error.response.data?.errors) {
//           errorMessage += ": " + JSON.stringify(error.response.data.errors);
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }

//       notyf.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isFormValid = () => {
//     const hasRequiredFields =
//       activityData.title &&
//       activityData.type &&
//       activityData.startDate &&
//       activityData.dueDate;

//     const isProjectComplete =
//       activityData.type !== "Projet" ||
//       (activityData.projectTitle && activityData.phaseTitle);

//     const isTransverseComplete =
//       activityData.type !== "Transverse" || activityData.transverseType;

//     const isIntercontractComplete =
//       activityData.type !== "Intercontract" || activityData.intercontractType;

//     return (
//       hasRequiredFields &&
//       isProjectComplete &&
//       isTransverseComplete &&
//       isIntercontractComplete
//     );
//   };

//   return (
//     <Modal
//       modalOpen={modalOpen}
//       setModalOpen={setModalOpen}
//       header="Ajouter une activité"
//       heightSize="80vh"
//       widthSize="medium"
//     >
//       <ModalBody>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <div className="relative" ref={userPopUp}>
//               <CustomInput
//                 type="text"
//                 label="Assigné à : "
//                 rounded="medium"
//                 className="text-sm"
//                 value={searchUserInput}
//                 onChange={(e) => {
//                   setSearchUserInput(e.target.value);
//                   handleUserSearch(e.target.value);
//                 }}
//                 onFocus={() => setIsDropDownUserOpen(true)}
//                 placeholder="Rechercher un utilisateur..."
//               />
              
//               {isDropdownUserOpen && filteredUsers.length > 0 && (
//                 <div className="absolute z-10 mt-1 w-full bg-white dark:bg-boxdark border dark:border-formStrokedark rounded-md shadow-lg max-h-60 overflow-y-auto">
//                   {filteredUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-boxdark2 cursor-pointer"
//                       onClick={() => handleAddUser(user)}
//                     >
//                       <div className="w-8 h-8 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2">
//                         {getInitials(user.name)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">{user.name}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
                      
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             <div className="flex flex-wrap gap-2">
//               {assignedPerson.map((user) => (
//                 <div 
//                   key={user.userid} 
//                   className="flex items-center bg-gray-100 dark:bg-boxdark rounded-full px-3 py-1"
//                 >
//                   <div className="w-6 h-6 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2 text-xs">
//                     {getInitials(user.user?.name)}
//                   </div>
//                   <span className="text-sm mr-2">{user.user?.name}</span>
//                   {/* {user.userid !== decodedToken?.jti && (
//                     <button 
//                       onClick={() => handleRemoveUser(user.userid!)}
//                       className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                     >
//                       ×
//                     </button>
//                   )} */}
//                   <button 
//                     onClick={() => handleRemoveUser(user.userid!)}
//                     className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <CustomInput
//             required
//             type="text"
//             label="Titre"
//             rounded="medium"
//             className="text-sm"
//             value={activityData.title}
//             onChange={(e) => {
//               setActivityData({
//                 ...activityData,
//                 title: e.target.value,
//               });
//             }}
//             placeholder="Titre de l'activité"
//           />
          
//           <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
//             <CustomSelect
//               required
//               label="Type"
//               data={[
//                 "Projet",
//                 ...(myHabilitation?.transverse.create ? ["Transverse"] : []),
//                 ...(myHabilitation?.intercontract.create
//                   ? ["Intercontract"]
//                   : []),
//               ]}
//               value={activityData.type}
//               onValueChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   type: e,
//                   transverseType: "",
//                   intercontractType: "",
//                 });
//               }}
//               placeholder="Sélectionnez un type"
//             />        
//             <CustomSelect
//               label="Statut"
//               data={[
//                 "Backlog",
//                 "En cours",
//                 "Traité",
//                 "En pause",
//                 "Abandonné",
//               ]}
//               value={activityData.status}
//               onValueChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   status: e,
//                 });
//               }}
//               placeholder="Sélectionnez un statut"
//             />
//           </div>
          
//           <div className={`w-full *:w-full flex-wrap md:flex-nowrap gap-2 ${
//               activityData.type === "Projet" ? "flex" : "hidden"
//             }`}
//           >
//             <CustomSelect
//               required={activityData.type === "Projet"}
//               label="Titre du projet"
//               data={projectTitle}
//               value={activityData.projectTitle}
//               onValueChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   projectTitle: e,
//                   phaseTitle: "",
//                 });
//               }}
//               placeholder="Sélectionnez un projet"
//             />
//             <CustomSelect
//               required={activityData.type === "Projet"}
//               disabled={!activityData.projectTitle}
//               label="Titre de la phase"
//               data={phaseTitle}
//               value={activityData.phaseTitle}
//               onValueChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   phaseTitle: e,
//                 });
//               }}
//               placeholder={activityData.projectTitle ? "Sélectionnez une phase" : "Sélectionnez d'abord un projet"}
//             />
//           </div>
          
//           <div className={`w-full *:w-full flex-wrap md:flex-nowrap gap-2 ${
//               activityData.type === "Transverse" ? "flex" : "hidden"
//             }`}
//           >
//             <CustomSelect
//               required={activityData.type === "Transverse"}
//               label="Type de transverse"
//               data={transverseType}
//               value={activityData.transverseType}
//               onValueChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   transverseType: e,
//                 });
//               }}
//               placeholder="Sélectionnez un type"
//             />
//           </div>
          
//           <div className={`w-full *:w-full flex-wrap md:flex-nowrap gap-2 ${
//               activityData.type === "Intercontract" ? "flex" : "hidden"
//             }`}
//           >
//             <CustomSelect
//               required={activityData.type === "Intercontract"}
//               label="Type d'intercontrat"
//               data={intercontractType}
//               value={activityData.intercontractType}
//               onValueChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   intercontractType: e,
//                 });
//               }}
//               placeholder="Sélectionnez un type"
//             />
//           </div>
          
//           <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
//             <CustomInput
//               required
//               type="date"
//               label="Date de début"
//               rounded="medium"
//               className="text-sm"
//               value={activityData.startDate}
//               onChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   startDate: e.target.value,
//                 });
//               }}
//             />
            
//             <CustomInput
//               required
//               type="date"
//               label="Date de fin"
//               rounded="medium"
//               className="text-sm"
//               min={activityData.startDate}
//               value={activityData.dueDate}
//               onChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   dueDate: e.target.value,
//                 });
//               }}
//             />
//           </div>
//           {/* <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
//               <CustomInput
//                 type="number"
//                 min={0.5}
//                 max={30}
//                 step={0.5}
//                 label="Temps à consacré (jours)"
//                 rounded="medium"
//                 className="text-sm"
//                 value={activityData.dailyEffort}
//                 onChange={(e) => {
//                   let value = parseFloat(e.target.value);
//                   if (isNaN(value)) value = 0.5;
//                   if (value > 30) value = 30;
//                   if (value < 0.5) value = 0.5;
//                   setActivityData({
//                     ...activityData,
//                     dailyEffort: value,
//                   });
//                 }}
//                 placeholder="0.5"
//               />
//               <CustomInput
//                 type="number"
//                 min={0.5}
//                 max={30}
//                 step={0.5}
//                 label="Temps réel (jours)"
//                 rounded="medium"
//                 className="text-sm"
//                 value={activityData.optionalEffort || ''}
//                 onChange={(e) => {
//                   const value = e.target.value ? parseFloat(e.target.value) : undefined;
//                   setActivityData({
//                     ...activityData,
//                     optionalEffort: value,
//                   });
//                 }}
//                 placeholder="Optionnel"
//               />
//           </div> */}
//           <CustomInput
//             type="text"
//             inputMode="numeric"
//             min={1}
//             max={8}
//             label="Temps à consacré (heures)"
//             rounded="medium"
//             className="text-sm"
//             value={activityData.dailyEffort}
//             onChange={(e) => {
//               let value = parseInt(e.target.value);
//               if (isNaN(value)) value = 1;
//               if (value > 8) value = 8;
//               if (value < 1) value = 1;
//               setActivityData({
//                 ...activityData,
//                 dailyEffort: value,
//               });
//             }}
//           />
          
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Description
//             </label>
//             <QuillEditor
//               value={activityData.description}
//               onChange={(value) => {
//                 setActivityData({
//                   ...activityData,
//                   description: value,
//                 });
//               }}
//               placeholder="Écrivez votre description ici..."
//             />
//           </div>

//           {/* <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Fichier joint
//             </label>
//             <div className="flex items-center">
//               <input
//                 type="file"
//                 id="file-upload"
//                 className="hidden"
//                 onChange={handleFileUpload}
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="cursor-pointer bg-gray-100 dark:bg-boxdark hover:bg-gray-200 dark:hover:bg-boxdark2 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md border border-gray-300 dark:border-formStrokedark text-sm"
//               >
//                 Choisir un fichier
//               </label>
//               {activityData.fileName && (
//                 <div className="ml-3 flex items-center">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {activityData.fileName}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={handleRemoveFile}
//                     className="ml-2 text-red-500 hover:text-red-700"
//                   >
//                     ×
//                   </button>
//                 </div>
//               )}
//             </div>
//             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//               Formats acceptés : PDF, DOCX, XLSX, JPG, PNG (max 5MB)
//             </p>
//           </div> */}
          
//           {/* {!activityData.fileName && ( */}
//             <CustomInput
//               type="text"
//               label="Ajouter un lien"
//               rounded="medium"
//               className="text-sm"
//               value={activityData.fichier}
//               onChange={(e) => {
//                 setActivityData({
//                   ...activityData,
//                   fichier: e.target.value,
//                 });
//               }}
//               placeholder="https://example.com"
//             />
//           {/* )} */}

         
//         </div>
//       </ModalBody>
      
//       <ModalFooter>
//         <button
//           className="border text-xs p-2 rounded-md font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2"
//           type="button"
//           onClick={handleCloseModal}
//           disabled={isLoading}
//         >
//           Annuler
//         </button>

//         <button
//           disabled={!isFormValid() || isLoading}
//           type="button"
//           onClick={handleCreateActivity}
//           className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${
//             !isFormValid() || isLoading
//               ? "cursor-not-allowed bg-gray-500"
//               : "cursor-pointer bg-green-700 hover:opacity-85"
//           }`}
//         >
//           {isLoading ? (
//             <BeatLoader size={5} className="mr-2" color={"#fff"} />
//           ) : null}
//           Créer
//         </button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default AddActivity;

import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { getAllUsers } from "../../../services/User";
import { getInitials } from "../../../services/Function/UserFunctionService";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from "dayjs";
import DOMPurify from 'dompurify';
const notyf = new Notyf({ 
  position: { x: "center", y: "top" },
  duration: 3000
});

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

      // Solution avec dangerouslyPasteHTML (recommandée)
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
  const [assignedPerson, setAssignedPerson] = useState<Array<IUserProject>>([]);
  const [searchUserInput, setSearchUserInput] = useState<string>("");
  const [activityData, setActivityData] = useState<IActivityAdd>({
    title: "",
    description: "",
    type: "",
    status: "Backlog",
    dailyEffort: 1,
    optionalEffort:undefined,
    startDate: "",
    dueDate: "",
    endDate: "",
    fichier: "",
    projectTitle: "",
    phaseTitle: "",
    projectId: "",
    phaseId: "",
    transverseType: "",
    intercontractType: "",
    fileName: "",
    fileContent: undefined,
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
        
        if (decoded?.jti && decoded?.name) {
          setAssignedPerson([{
            userid: decoded.jti,
            projectid: "",
            role: "collaborator",
            user: {
              name: decoded.name
            },
          }]);
          setSearchUserInput(decoded.name);
        }
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
      setSearchUserInput("");
      setIsDropDownUserOpen(false);
    } else {
      notyf.error("Cet utilisateur est déjà assigné");
    }
  };

const handleRemoveUser = (userId: string) => {
  if (userId === decodedToken?.jti) {
    // Confirmation avant de se retirer
   
      setAssignedPerson(prev => prev.filter(user => user.userid !== userId));
    
    return;
  }
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
      notyf.error("Erreur lors du chargement des projets");
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
    setActivityData({
      title: "",
      description: "",
      type: "",
      status: "Backlog",
      dailyEffort: 1,
      optionalEffort:undefined,
      startDate: "",
      dueDate: "",
      endDate: "",
      fichier: "",
      projectTitle: "",
      phaseTitle: "",
      projectId: "",
      phaseId: "",
      transverseType: "",
      intercontractType: "",
      fileName: "",
      fileContent: undefined,
    });
    setAssignedPerson([]);
    if (decodedToken?.jti && decodedToken?.name) {
      setAssignedPerson([{
        userid: decodedToken.jti,
        projectid: "",
        role: "collaborator",
        user: {
          name: decodedToken.name,
        },
      }]);
      setSearchUserInput(decodedToken.name);
    }
  };

   //
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (!e.target.files || e.target.files.length === 0) return;

//   const file = e.target.files[0];
  
//   // Vérification de la taille
//   if (file.size > 5 * 1024 * 1024) {
//     notyf.error("Le fichier ne doit pas dépasser 5MB");
//     return;
//   }

//   // Vérification des types de fichiers
//   const allowedTypes = [
//     'application/pdf',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'image/jpeg',
//     'image/png'
//   ];
  
//   if (!allowedTypes.includes(file.type)) {
//     notyf.error("Type de fichier non supporté");
//     return;
//   }

//   try {
//     notyf.success("Upload du fichier en cours...");
    
//     const formData = new FormData();
//     formData.append('file', file);
    
//     const endPoint = import.meta.env.VITE_API_ENDPOINT;
//     const response = await fetch(`${endPoint}/api/Task/upload`, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('access_token')}`
//       }
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Erreur lors de l'upload");
//     }

//     const data = await response.json();
    
//     setActivityData({
//       ...activityData,
//       fileName: file.name,
//       fichier: data.url // Assurez-vous que l'API retourne bien une URL
//     });
    
//     notyf.success("Fichier uploadé avec succès");
//   } catch (error: unknown) {
//     console.error("Erreur lors de l'upload:", error);
//     let errorMessage = "Échec de l'upload";
//     if (error instanceof Error) {
//       errorMessage += `: ${error.message}`;
//     }
//     notyf.error(errorMessage);
//   }
// };
  //

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!userPopUp.current) return;
      if (!userPopUp || userPopUp.current.contains(target)) return;
      setIsDropDownUserOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  const processDescription = (html: string): string => {
    const sanitized = DOMPurify.sanitize(html, {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['src', 'alt', 'style', 'width', 'height'],
      ALLOW_DATA_ATTR: false
    });
    return sanitized;
  };

 
  // const handleRemoveFile = () => {
  //   setActivityData({
  //     ...activityData,
  //     fileName: "",
  //     fileContent: undefined,
  //     fichier: ""
  //   });
  // };

  const validateForm = () => {
    if (!activityData.title) {
      notyf.error("Le titre est requis");
      return false;
    }

    if (!activityData.type) {
      notyf.error("Le type d'activité est requis");
      return false;
    }

    if (!activityData.startDate) {
      notyf.error("La date de début est requise");
      return false;
    }

    if (!activityData.dueDate) {
      notyf.error("La date de fin est requise");
      return false;
    }

    const startDate = dayjs(activityData.startDate);
    const dueDate = dayjs(activityData.dueDate);

    if (dueDate.isBefore(startDate)) {
      notyf.error("La date de fin doit être après la date de début");
      return false;
    }

    if (activityData.type === "Projet") {
      if (!activityData.projectTitle) {
        notyf.error("Le projet est requis");
        return false;
      }

      if (!activityData.phaseTitle) {
        notyf.error("La phase est requise");
        return false;
      }
    } else if (activityData.type === "Transverse") {
      if (!activityData.transverseType) {
        notyf.error("Le type de transverse est requis");
        return false;
      }
    } else if (activityData.type === "Intercontract") {
      if (!activityData.intercontractType) {
        notyf.error("Le type d'intercontrat est requis");
        return false;
      }
    }

    if (assignedPerson.length === 0) {
    notyf.error("Au moins une personne doit être assignée à l'activité");
    return false;
  }

    return true;
  };

  const handleCreateActivity = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      //Utilise le temps réel s'il existe, sinon le temps normal
       // Conversion sécurisée en heures (avec valeur par défaut)
    // const effortInDays = activityData.optionalEffort ?? activityData.dailyEffort;
    // const finalEffortInHours = Math.max(0.5, effortInDays as number) * 8; // Garantit au moins 0.5 jour (4h)
      // Upload du fichier s'il existe
      let fileUrl = activityData.fichier;
      if (activityData.fileContent) {
        try {
          const formData = new FormData();
          formData.append('file', activityData.fileContent);
          
          const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/Task/upload`, {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          });

          if (!response.ok) {
            throw new Error('Échec de l\'upload du fichier');
          }

          const result = await response.json();
          fileUrl = result.url;
        } catch (error) {
          console.error('Erreur lors de l\'upload:', error);
          notyf.error("Échec de l'upload du fichier joint");
          return;
        }
      }

      const id = uuid4();
      const initiatorId = decodedToken?.jti;
      const initiatorName = decodedToken?.name;

      if (!initiatorId || !initiatorName) {
        throw new Error("User information is missing");
      }

      const processedDescription = processDescription(activityData.description);

      if (activityData.type === "Projet") {
        const formatUser = assignedPerson.length > 0 
          ? assignedPerson.map(user => ({
              userid: user.userid,
              taskid: id,
            }))
          : [{
              userid: userid,
              taskid: id,
            }];

        const dataToSend = {
          id,
          title: activityData.title,
          description: processedDescription,
          phaseid: activityData.phaseId,
          projectid: activityData.projectId,
          priority: "Moyen",
          startDate: new Date(activityData.startDate|| "").toISOString(),
          dueDate: new Date(activityData.dueDate|| "").toISOString(),
          fichier: fileUrl || "",
          //dailyEffort: finalEffortInHours,
          dailyEffort: activityData.dailyEffort || 1,
          status: activityData.status || "Backlog",
          listUsers: formatUser,
          initiatorId,
          initiatorName,
        };

        await createTaskPhase(dataToSend);
      } else if (activityData.type === "Transverse") {
        const dataToSend = {
          id,
          dailyEffort: activityData.dailyEffort || 1,
          description: processedDescription,
          startDate: new Date(activityData.startDate || "").toISOString(),
          endDate: new Date(activityData.dueDate || "" ).toISOString(),
          status: activityData.status || "Backlog",
          title: activityData.title,
          type: activityData.transverseType,
          userid: userid,
          fichier: fileUrl || "",
        };

        await createTransverse(dataToSend);
      } else if (activityData.type === "Intercontract") {
        const dataToSend = {
          id,
          dailyEffort: activityData.dailyEffort || 1,
          description: processedDescription,
          startDate: new Date(activityData.startDate|| "").toISOString(),
          endDate: new Date(activityData.dueDate|| "").toISOString(),
          status: activityData.status || "Backlog",
          title: activityData.title,
          type: activityData.intercontractType,
          userid: userid,
          fichier: fileUrl || "",
        };

        await createInterContract(dataToSend);
      }
      
      notyf.success("Activité créée avec succès");
      setIsActivityFinished(true);
      handleCloseModal();
    } catch (error: any) {
      console.error("Error creating activity:", error);
      
      let errorMessage = "Une erreur s'est produite lors de la création";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        if (error.response.data?.errors) {
          errorMessage += ": " + JSON.stringify(error.response.data.errors);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      notyf.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
      activityData.type !== "Intercontract" || activityData.intercontractType;

    return (
      hasRequiredFields &&
      isProjectComplete &&
      isTransverseComplete &&
      isIntercontractComplete
    );
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
          <div className="space-y-2">
            <div className="relative" ref={userPopUp}>
              <CustomInput
                type="text"
                label="Assigné à : "
                rounded="medium"
                className="text-sm"
                value={searchUserInput}
                onChange={(e) => {
                  setSearchUserInput(e.target.value);
                  handleUserSearch(e.target.value);
                }}
                onFocus={() => setIsDropDownUserOpen(true)}
                placeholder="Rechercher un utilisateur..."
              />
              
              {isDropdownUserOpen && filteredUsers.length > 0 && (
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
                  {/* {user.userid !== decodedToken?.jti && (
                    <button 
                      onClick={() => handleRemoveUser(user.userid!)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ×
                    </button>
                  )} */}
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
            required
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
            <CustomSelect
              required
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
                  transverseType: "",
                  intercontractType: "",
                });
              }}
              placeholder="Sélectionnez un type"
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
              activityData.type === "Projet" ? "flex" : "hidden"
            }`}
          >
          <CustomSelect
            required={activityData.type === "Projet"}
            label="Titre du projet"
            data={[...projectTitle].sort((a, b) => a.localeCompare(b))} // Tri alphabétique
            value={activityData.projectTitle}
            onValueChange={(e) => {
              setActivityData({
                ...activityData,
                projectTitle: e,
                phaseTitle: "",
              });
            }}
            placeholder="Sélectionnez un projet"
          />
            <CustomSelect
              required={activityData.type === "Projet"}
              disabled={!activityData.projectTitle}
              label="Titre de la phase"
              data={phaseTitle}
              value={activityData.phaseTitle}
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
              activityData.type === "Transverse" ? "flex" : "hidden"
            }`}
          >
            <CustomSelect
              required={activityData.type === "Transverse"}
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
              activityData.type === "Intercontract" ? "flex" : "hidden"
            }`}
          >
            <CustomSelect
              required={activityData.type === "Intercontract"}
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
              required
              type="date"
              label="Date de début"
              rounded="medium"
              className="text-sm"
              value={activityData.startDate}
              onChange={(e) => {
                setActivityData({
                  ...activityData,
                  startDate: e.target.value,
                });
              }}
            />
            
            <CustomInput
              required
              type="date"
              label="Date de fin"
              rounded="medium"
              className="text-sm"
              min={activityData.startDate}
              value={activityData.dueDate}
              onChange={(e) => {
                setActivityData({
                  ...activityData,
                  dueDate: e.target.value,
                });
              }}
            />
          </div>
          {/* <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
              <CustomInput
                type="number"
                min={0.5}
                max={30}
                step={0.5}
                label="Temps à consacré (jours)"
                rounded="medium"
                className="text-sm"
                value={activityData.dailyEffort}
                onChange={(e) => {
                  let value = parseFloat(e.target.value);
                  if (isNaN(value)) value = 0.5;
                  if (value > 30) value = 30;
                  if (value < 0.5) value = 0.5;
                  setActivityData({
                    ...activityData,
                    dailyEffort: value,
                  });
                }}
                placeholder="0.5"
              />
              <CustomInput
                type="number"
                min={0.5}
                max={30}
                step={0.5}
                label="Temps réel (jours)"
                rounded="medium"
                className="text-sm"
                value={activityData.optionalEffort || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  setActivityData({
                    ...activityData,
                    optionalEffort: value,
                  });
                }}
                placeholder="Optionnel"
              />
          </div> */}
          <CustomInput
            type="text"
            inputMode="numeric"
            min={1}
            max={8}
            label="Temps à consacré (heures)"
            rounded="medium"
            className="text-sm"
            value={activityData.dailyEffort}
            onChange={(e) => {
              let value = parseInt(e.target.value);
              if (isNaN(value)) value = 1;
              if (value > 8) value = 8;
              if (value < 1) value = 1;
              setActivityData({
                ...activityData,
                dailyEffort: value,
              });
            }}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <QuillEditor
              value={activityData.description}
              onChange={(value) => {
                setActivityData({
                  ...activityData,
                  description: value,
                });
              }}
              placeholder="Écrivez votre description ici..."
            />
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fichier joint
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-gray-100 dark:bg-boxdark hover:bg-gray-200 dark:hover:bg-boxdark2 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md border border-gray-300 dark:border-formStrokedark text-sm"
              >
                Choisir un fichier
              </label>
              {activityData.fileName && (
                <div className="ml-3 flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {activityData.fileName}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Formats acceptés : PDF, DOCX, XLSX, JPG, PNG (max 5MB)
            </p>
          </div> */}
          
          {/* {!activityData.fileName && ( */}
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
          {/* )} */}

         
        </div>
      </ModalBody>
      
      <ModalFooter>
        <button
          className="border text-xs p-2 rounded-md font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2"
          type="button"
          onClick={handleCloseModal}
          disabled={isLoading}
        >
          Annuler
        </button>

        <button
          disabled={!isFormValid() || isLoading}
          type="button"
          onClick={handleCreateActivity}
          className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${
            !isFormValid() || isLoading
              ? "cursor-not-allowed bg-gray-500"
              : "cursor-pointer bg-green-700 hover:opacity-85"
          }`}
        >
          {isLoading ? (
            <BeatLoader size={5} className="mr-2" color={"#fff"} />
          ) : null}
          Créer
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default AddActivity;