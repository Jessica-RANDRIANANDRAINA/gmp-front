import React, { useState, useEffect, useRef, useMemo } from "react";
import { CustomInput, CustomSelect } from "../../UIElements";
import { IPhase, ITaskAdd, IUserTask } from "../../../types/Project";
import { BeatLoader } from "react-spinners";
import { getInitials, getThreeInitials } from "../../../services/Function/UserFunctionService";
import { updateTaskProject } from "../../../services/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { fetchComments, postComment } from "../../../services/Project/Comment";
import { decodeToken } from "../../../services/Function/TokenService";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../../services/User";

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

/* =========================================================
   🧩 Composant QuillEditor
========================================================= */
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

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
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
        formData.append("file", file);

        const endPoint = import.meta.env.VITE_API_ENDPOINT;
        const response = await fetch(`${endPoint}/api/Task/upload`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Échec de l'upload");
        }

        const data = await response.json();
        if (!data.url) throw new Error("URL de l'image manquante dans la réponse");

        const quill = quillRef.current?.getEditor();
        if (!quill) throw new Error("Éditeur Quill non disponible");

        const range = quill.getSelection(true);
        const imageUrl = data.url.startsWith("http")
          ? data.url
          : `${endPoint}${data.url}`;

        const sanitizedHtml = DOMPurify.sanitize(
          `<img src="${imageUrl}" style="max-width: 500px; height: 500px;" alt="uploaded image" />`
        );

        quill.clipboard.dangerouslyPasteHTML(range?.index || 0, sanitizedHtml);
        quill.setSelection((range?.index || 0) + 1, 0);
        notyf.success("Image ajoutée avec succès");
      } catch (error: unknown) {
        console.error("Erreur lors de l'upload:", error);
        let errorMessage = "Échec de l'upload de l'image";
        if (error instanceof Error) errorMessage += ` : ${error.message}`;
        notyf.error(errorMessage);
      }
    };
  };

  const modules = useMemo(
    () => ({
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
        handlers: { image: imageHandler },
      },
      clipboard: { matchVisual: false },
    }),
    []
  );

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

/* =========================================================
   💬 Composant CommentSection
========================================================= */
const CommentSection = ({
  taskId,
  projectUsers,
}: {
  taskId?: string;
  projectUsers: any[];
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showMentionList, setShowMentionList] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const decodedToken = decodeToken("pr") || decodeToken("ad");
  const currentUser = {
    id: decodedToken?.jti || localStorage.getItem("userid") || "me",
    name: decodedToken?.name || "Moi",
    email: decodedToken?.sub || "",
  };

  const loadComments = async () => {
    if (!taskId) return;
    setIsLoading(true);
    try {
      const data = await fetchComments(taskId, "task");
      setComments(data);
     

    } catch {
      notyf.error("Erreur lors du chargement des commentaires");
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
    loadComments();
    (async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users || []);
      } catch {
        console.warn("⚠️ Impossible de charger les utilisateurs globaux");
      }
    })();
  }, [taskId]);
  
   useEffect(() => {
  if (comments.length > 0) {
    console.log("🧠 Commentaires chargés :", comments);
    console.log("👥 Utilisateurs projet :", projectUsers);
  }
}, [comments]);

  useEffect(() => {
    if (taskId) loadComments();
  }, [taskId]);

  const handleInputChange = (value: string, isReply = false) => {
    const atIndex = value.lastIndexOf("@");
    if (atIndex !== -1) {
      const term = value.substring(atIndex + 1).toLowerCase();
      const filtered =
        term.length > 0
          ? projectUsers.filter((u) => u.name.toLowerCase().startsWith(term))
          : projectUsers;
      setFilteredUsers(filtered);
      setShowMentionList(true);
    } else setShowMentionList(false);

    isReply ? setReplyContent(value) : setNewComment(value);
  };

  const handleSelectMention = (user: any, isReply = false) => {
    const current = isReply ? replyContent : newComment;
    const newText = current.replace(/@[^ ]*$/, `@${user.name} `);
    isReply ? setReplyContent(newText) : setNewComment(newText);
    setShowMentionList(false);
  };

  const handleAddComment = async (parentId?: string) => {
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return notyf.error("Le commentaire est vide.");

    try {
      await postComment({
        userId: currentUser.id,
        content,
        taskId,
        parentCommentId: parentId || null,
      });
      setNewComment("");
      setReplyContent("");
      setReplyTo(null);
      notyf.success("Commentaire ajouté !");
      loadComments();
    } catch {
      notyf.error("Erreur lors de l'ajout du commentaire");
    }
  };

 const normalizeToUTC = (d: string) => (d?.endsWith("Z") ? d : `${d}Z`);
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(normalizeToUTC(dateStr));
    return date.toLocaleString("fr-FR", {
      timeZone: "Indian/Antananarivo",
      dateStyle: "short",
      timeStyle: "short",
    });
  };

 const resolveUserName = (comment: any): string => {
    if (!comment) return "Utilisateur";

    // 1️⃣ Si le backend fournit déjà le nom
    if (comment.user?.name) return comment.user.name;
    if (comment.userName) return comment.userName;

    const commentUserId = (comment.userId || comment.userid || "").toLowerCase();

    // 2️⃣ Chercher dans projectUsers
    const inProject = projectUsers.find(
      (u) => (u.userid || u.id || "").toLowerCase() === commentUserId
    );
    if (inProject?.name) return inProject.name;

    // 3️⃣ Chercher dans allUsers
    const inAll = allUsers.find(
      (u) => (u.id || u.userid || "").toLowerCase() === commentUserId
    );
    if (inAll?.name) return inAll.name;

    // 4️⃣ Fallback
    return "Utilisateur";
  };

  return (
    <div className="border-t mt-4 pt-4 bg-gray-50 dark:bg-boxdark rounded-lg p-3">
      <h3 className="font-semibold text-sm mb-2">Commentaires</h3>

      {isLoading ? (
        <p className="text-xs text-gray-400">Chargement...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400"></p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="mb-3 pb-2">
            
           <div className="flex items-start gap-3 mb-1">
      {/* Avatar vert */}
      <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-semibold">
       {getThreeInitials(resolveUserName(c))}

      </div>

      {/* Contenu principal */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-800">
            <span className="text-sm font-semibold text-gray-800">
  {resolveUserName(c)}
</span>

          </span>
          <span className="text-[11px] text-gray-500">
            {formatDateTime(c.createdAt)}
          </span>
        </div>
        <p
          className="text-sm text-gray-800 mt-1"
          dangerouslySetInnerHTML={{
            __html: c.content.replace(
              /@(\w+)/g,
              '<span class="text-blue-600 font-semibold">@$1</span>'
            ),
          }}
        />

        <button
          onClick={() => {
                    setReplyTo(c.id);
                    // ✅ Préremplit avec le nom du commentateur parent
                    setReplyContent(`@${resolveUserName(c)} `);
                  }}
          className="text-xs text-green-500 hover:underline mt-1"
        >
          Répondre
        </button>
      </div>
    </div>

        {c.replies?.length > 0 && (
      <div className="ml-8 mt-2 border-l-2 border-gray-300 pl-3 space-y-2">
        {c.replies.map((r: any) => (
          <div key={r.id} className="flex items-start gap-3 bg-gray-50 rounded-md p-2">
            {/* Avatar bleu */}
            <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-semibold">
             {getThreeInitials(resolveUserName(r))}

            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-800">
                 <span className="text-xs font-semibold text-gray-800">
 {resolveUserName(r)}
</span>

                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDateTime(r.createdAt)}
                </span>
              </div>
              <p
                className="text-xs text-gray-700 mt-1"
                dangerouslySetInnerHTML={{
                  __html: r.content.replace(
                    /@(\w+)/g,
                    '<span class="text-blue-600 font-semibold">@$1</span>'
                  ),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    )}

            {replyTo === c.id && (
              <div className="mt-2 ml-4 flex items-start justify-end gap-2 relative">
                <textarea
  className="mention-input w-full min-h-[36px] max-h-[180px] border bg-transparent py-2.5 px-3 text-sm text-black dark:text-gray outline-none focus:border-green-700 dark:border dark:border-formStrokedark dark:focus:border-green-700 rounded-md border-stroke resize-none overflow-y-auto"
  placeholder="Votre réponse..."
  value={replyContent}
  onChange={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    handleInputChange(e.target.value, true);
  }}
/>


                {showMentionList && (
                  <div className="absolute left-0 top-[110%] bg-white border rounded-md shadow-lg mt-1 w-74 z-50">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-boxdark2 cursor-pointer"
                        onClick={() => handleSelectMention(u, true)}
                      >
                        <div className="w-7 h-7 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2 text-xs">
                                          {getThreeInitials(u.name || "")}
                                        </div>
                        <span className="text-sm">{u.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReplyTo(null)}
                    className="border text-xs px-3 py-2 rounded-md bg-gray-200 dark:bg-boxdark2 hover:bg-gray-300 self-start"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleAddComment(c.id)}
                    className="border text-xs px-3 py-2 rounded-md text-white font-semibold cursor-pointer bg-green-700 hover:opacity-85 self-start"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Champ principal */}
      <div className="relative flex items-start justify-end gap-2 mt-3">
        <textarea
  ref={useRef<HTMLTextAreaElement>(null)}
  placeholder="Écrire un commentaire..."
  className="mention-input w-full min-h-[40px] max-h-[200px] border bg-transparent py-2.5 px-3 text-sm text-black dark:text-gray outline-none focus:border-green-700 dark:border dark:border-formStrokedark dark:focus:border-green-700 rounded-md border-stroke resize-none overflow-y-auto"
  value={newComment}
  onChange={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    handleInputChange(e.target.value);
  }}
/>


        {showMentionList && (
          <div className="absolute left-0 top-[100%] bg-white  rounded-md shadow-lg mt-1 w-74 z-50">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-boxdark2 cursor-pointer"
                onClick={() => handleSelectMention(u)}
              >
                 <div className="w-7 h-7 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2 text-xs">
                                  {getThreeInitials(u.name || "")}
                                </div>
               <span className="text-sm">{u.name}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => handleAddComment()}
          className="border flex-shrink-0 h-fit dark:border-boxdark text-xs px-3 py-2 rounded-md text-white font-semibold cursor-pointer bg-green-700 hover:opacity-85 self-start"
        >
          Publier
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   🧱 Composant principal : UpdateTask
========================================================= */
const UpdateTask = ({
  task,
  phaseData,
  projectId,
  phaseId,
  setModalUpdateOpen,
  setIsRefreshTaskNeeded,
}: {
  task: any;
  phaseData: IPhase | null;
  projectId?: string;
  phaseId?: string;
  setModalUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshTaskNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [taskData, setTaskData] = useState<ITaskAdd>({
    id: "",
    title: "",
    description: "",
    priority: "Moyen",
    startDate: undefined,
    dueDate: undefined,
    fichier: "",
    dailyEffort: 1,
    status: "Backlog",
  });
  const userPopUp = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assignedPerson, setAssignedPerson] = useState<Array<IUserTask>>([]);
  const [isDropdownUserOpen, setDropDownUserOpen] = useState<boolean>(false);
  const navigate = useNavigate(); // ✅ ajouté ici

  // On récupère les IDs nécessaires

  // close user pop up if click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!userPopUp.current) return;
      if (userPopUp.current.contains(target)) return;
      setDropDownUserOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    if (task?.content) {
      setTaskData({
        id: task?.content.id,
        title: task?.content?.title || "",
        description: task?.content?.description || "",
        priority: task?.content?.priority || "Moyen",
        startDate: task?.content?.startDate || undefined,
        dueDate: task?.content?.dueDate || undefined,
        fichier: task?.content?.fichier || "",
        dailyEffort: task?.content?.dailyEffort,
        status: task?.content?.status,
      });

      setAssignedPerson(task.content.userTasks);
    }
  }, [task]);

  const handleCloseModal = () => {
    setModalUpdateOpen(false);
  };

 const handleUpdateTask = async () => {
  setIsLoading(true);
  try {
    const formatUser = assignedPerson?.map((u) => ({
      userid: u.userid,
      taskid: u.taskid,
      user: { name: u.name },
    }));

    const formatDate = (dateString: string | undefined) => {
      if (!dateString) return undefined;
      const date = new Date(dateString);
      if (!dateString.endsWith("Z")) {
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      }
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    };

    const dataToSend = {
      priority: taskData?.priority,
      startDate: formatDate(taskData?.startDate),
      dueDate: formatDate(
        taskData?.dueDate === "" ? undefined : taskData?.dueDate
      ),
      fichier: taskData.fichier,
      description: taskData?.description,
      listUsers: formatUser,
      dailyEffort: taskData?.dailyEffort,
      title: taskData?.title,
      status: taskData?.status,
    };

    const taskId = task.content.id;
    await updateTaskProject(taskId, dataToSend);

    setIsRefreshTaskNeeded(true);
    notyf.success("✅ Tâche mise à jour avec succès");

    // ✅ Redirection vers la page des tâches du projet
    if (projectId && phaseId) {
      navigate(`/gmp/project/task/${projectId}/${phaseId}`);
    }

    handleCloseModal();
  } catch (error) {
    notyf.error(
      "Veuillez remplir tous les champs correctement. Si l'erreur persiste, contactez l'administrateur."
    );
    console.error(`Error at update task:${error}`);
  } finally {
    setIsLoading(false);
  }
};


  const handleAddUser = (user: {
    userid: string;
    projectid: any;
    role: any;
    name: any;
  }) => {
    if (!assignedPerson.some((u) => u.userid === user.userid)) {
      const formatUser = {
        userid: user.userid,
        taskid: task.content.id,
        projectid: "",
        name: user.name,
      };
      setAssignedPerson((prev) => [...prev, formatUser]);
    }
  };

  const handleRemoveUser = (userid: string) => {
    let filteredList = assignedPerson.filter((user) => user.userid !== userid);
    setAssignedPerson(filteredList);
  };
  return (
    <>
        <div className="space-y-5">
          <div className="flex justify-center">
  <span className="font-bold text-zinc-700 dark:text-zinc-200 text-xl md:text-2xl">
    Modifier la tâche
  </span>
</div>

          <div className="space-y-2">
            <div className="font-semibold text-sm">
              Assigné à : <span className="text-red-500 ml-1 text-sm">*</span>
            </div>
            <div className="">
              <div className="flex items-center gap-2">
                <div className="space-y-2 w-full  ">
                  <div className="flex flex-wrap w-full gap-1">
                    {assignedPerson?.map((user) => {
                      const initials = getInitials(
                        user?.name ? user?.name : ""
                      );
                      return (
                        <div
                          key={user?.userid}
                          className="relative group  first:ml-0 hover:z-99 cursor-pointer "
                          onClick={() => {
                            handleRemoveUser(user?.userid);
                          }}
                        >
                          <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                            {initials}
                          </p>
                          <div className="absolute  whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999999 top-[-35px] ">
                            <p>{user?.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    ref={userPopUp}
                    onClick={() => {
                      setDropDownUserOpen(!isDropdownUserOpen);
                    }}
                    className={`w-5 h-5 p-3 border flex rounded-full justify-center items-center cursor-pointer bg-zinc-200 dark:bg-boxdark  hover:bg-zinc-300 border-zinc-200 dark:hover:bg-boxdark2 dark:border-formStrokedark ${
                      assignedPerson.length > 0 ? "hidden" : ""
                    }`}
                  >
                    +
                  </div>
                </div>
                <div
                  className={`absolute top-14 max-h-100 overflow-auto left-0 border dark:border-formStrokedark border-zinc-300 bg-white dark:bg-boxdark2 shadow-lg rounded-md z-50 transition-transform duration-300 ease-in-out ${
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
              required={true}
              type="text"
              label="Titre"
              rounded="medium"
              className="text-sm"
              value={taskData.title}
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
              required
              type="date"
              label="Date de début"
              rounded="medium"
              className="text-sm"
              value={
                taskData?.startDate ? taskData?.startDate?.split("T")?.[0] : ""
              }
              onChange={(e) => {
                const newStartDate = e.target.value;
                if (
                  taskData?.dueDate &&
                  new Date(newStartDate) > new Date(taskData.dueDate)
                ) {
                  setTaskData({
                    ...taskData,
                    startDate: newStartDate,
                    dueDate: newStartDate,
                  });
                } else {
                  setTaskData({
                    ...taskData,
                    startDate: newStartDate,
                  });
                }
              }}
            />
            <CustomInput
              required
              type="date"
              label="Date d'échéance"
              className="text-sm"
              rounded="medium"
              value={
                taskData?.dueDate ? taskData?.dueDate?.split("T")?.[0] : ""
              }
              min={
                taskData?.startDate
                  ? taskData?.startDate?.split("T")[0]
                  : taskData?.startDate
              }
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
              value={taskData?.description}
              onChange={(value) => {
                setTaskData({
                  ...taskData,
                  description: value,
                });
              }}
              placeholder="Écrivez votre description ici..."
            />
          </div>
          <div>
            {/* <CustomInput
              type="textarea"
              label="Description"
              placeholder="Tapez une description ou ajoutez des notes ici"
              rows={8}
              rounded="medium"
              className="text-sm"
              value={taskData?.description}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                });
              }}
            /> */}
             <CustomInput
              type="text"
              label="Ajouter un lien"
              placeholder="Insérer votre lien ici"
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
        </div>
      
        <div
          className={`${phaseData?.status === "Terminé" ? "hidden" : "flex justify-end p-2"}`}
        >
          <button
            className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2 "
            type="button"
            onClick={handleCloseModal}
          >
            Annuler
          </button>
          {(() => {
            const hasStartDate =
              taskData?.startDate !== "" && taskData?.startDate !== undefined;
            const hasPersonAssigned = assignedPerson.length > 0;
            const isDisabled = hasStartDate && hasPersonAssigned;
            const buttonClassName = !isDisabled
              ? "cursor-not-allowed bg-graydark"
              : "cursor-pointer bg-green-700 hover:opacity-85";

            return (
              <button
                disabled={!isDisabled}
                type="button"
                onClick={handleUpdateTask}
                className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${buttonClassName}`}
              >
                {isLoading ? (
                  <BeatLoader size={5} className="mr-2" color={"#fff"} />
                ) : null}
                Sauvegarder
              </button>
            );
          })()}
        </div>
     
      <CommentSection
        taskId={task?.content?.id}
        projectUsers={phaseData?.userProject || []}
      />
   
    </>
  );
};

export default UpdateTask;
