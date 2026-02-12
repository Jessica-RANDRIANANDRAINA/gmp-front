import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getInitials, getThreeInitials } from "../../../services/Function/UserFunctionService";
import { IUserProject } from "../../../types/Project";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { fetchComments, postComment } from "../../../services/Project/Comment";
import { decodeToken } from "../../../services/Function/TokenService";


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

// ===============================
// 💬 SECTION COMMENTAIRE AVEC MENTIONS @ (liste positionnée sous chaque input)
// ===============================

type CommentItem = {
  id: string;
  content: string;
  createdAt: string;
  parentCommentId?: string | null;
  user?: { name?: string; email?: string };
  replies?: CommentItem[];
};

const CommentSection = ({
  activityData,
  projectUsers,
}: {
  activityData: IActivityAdd;
  projectUsers: any[];
}) => {
  // state
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [draftMain, setDraftMain] = useState("");
  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});
  const [replyOpenFor, setReplyOpenFor] = useState<string | null>(null);

  // mentions
  const [usersList, setUsersList] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  const [mentionContext, setMentionContext] = useState<{ where: "main" | "reply"; commentId?: string }>({ where: "main" });

  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [, setIsLoadingUsers] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const mainInputRef = useRef<HTMLInputElement>(null);

  // current user
  const decodedToken = decodeToken("pr") || decodeToken("ad");
  const currentUser = {
    id: decodedToken?.jti || localStorage.getItem("userid") || "me",
    name: decodedToken?.name || "Moi",
    email: decodedToken?.sub || "",
  };

  // utils
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
  const mapTypeToApi = (type?: string) => {
    switch (type) {
      case "Projet":
        return "task";
      case "InterContract":
        return "intercontract";
      case "Transverse":
        return "transverse";
      default:
        return "task";
    }
  };

  // build tree from flat list
  const buildCommentTree = (flat: CommentItem[]): CommentItem[] => {
    const byId: Record<string, CommentItem> = {};
    const roots: CommentItem[] = [];
    flat.forEach((c) => (byId[c.id] = { ...c, replies: [] }));
    flat.forEach((c) => {
      if (c.parentCommentId && byId[c.parentCommentId]) byId[c.parentCommentId].replies!.push(byId[c.id]);
      else roots.push(byId[c.id]);
    });
    // tri: parent récents -> anciens, et enfants récents -> anciens
    const sortDesc = (arr: CommentItem[]) => {
      arr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      arr.forEach((n) => n.replies && sortDesc(n.replies));
    };
    sortDesc(roots);
    return roots;
  };

  // load comments
  const loadComments = async () => {
    if (!activityData?.id || !activityData?.type) return;
    setIsLoadingComments(true);
    try {
      const apiType = mapTypeToApi(activityData.type);
      const data: any[] = await fetchComments(activityData.id!, apiType);
      setComments(buildCommentTree(Array.isArray(data) ? (data as CommentItem[]) : []));
    } catch {
      notyf.error("Erreur lors du chargement des commentaires");
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    loadComments();
    setReplyOpenFor(null);
    setDraftReplies({});
    (async () => {
      try {
        const us = await getAllUsers();
        setAllUsers(us || []);
      } catch {
        console.warn("⚠️ Impossible de charger tous les utilisateurs");
      }
    })();
  }, [activityData?.id]);

  // mentions helpers
  const ensureUsersLoaded = async () => {
    if (usersList.length > 0) return;
    setIsLoadingUsers(true);
    try {
      const us = await getAllUsers();
      setUsersList(us || []);
    } catch {
      notyf.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoadingUsers(false);
    }
  };
  const computeMentionQuery = (text: string) => {
    const m = text.match(/@([^@\s]*)$/);
    return m ? m[1] ?? "" : null;
  };
  const filterUsersByPrefix = (prefix: string) => {
    const p = prefix.trim().toLowerCase();
    const base = usersList.length ? usersList : projectUsers;
    if (!p) return base.slice();
    return base.filter((u: any) => (u.name || "").toLowerCase().startsWith(p));
  };

  // mentions handlers
  const onChangeMain = async (value: string) => {
    setDraftMain(value);
    const q = computeMentionQuery(value);
    if (q !== null) {
      await ensureUsersLoaded();
      setFilteredUsers(filterUsersByPrefix(q.toLowerCase()));
      setMentionContext({ where: "main" });
      setShowUserList(true);
    } else setShowUserList(false);
  };
  const onChangeReply = async (commentId: string, value: string) => {
    setDraftReplies((s) => ({ ...s, [commentId]: value }));
    const q = computeMentionQuery(value);
    if (q !== null) {
      await ensureUsersLoaded();
      setFilteredUsers(filterUsersByPrefix(q.toLowerCase()));
      setMentionContext({ where: "reply", commentId });
      setShowUserList(true);
    } else setShowUserList(false);
  };
  const onPickUser = (user: any) => {
    if (mentionContext.where === "main") {
      setDraftMain((prev) => prev.replace(/@[^@\s]*$/, `@${user.name} `));
    } else if (mentionContext.where === "reply" && mentionContext.commentId) {
      const prev = draftReplies[mentionContext.commentId] || "";
      setDraftReplies((s) => ({ ...s, [mentionContext.commentId!]: prev.replace(/@[^@\s]*$/, `@${user.name} `) }));
    }
    setShowUserList(false);
  };

  // close mention popover if clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest(".mention-list") && !el.closest(".mention-input")) setShowUserList(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);


  // submit new parent
  const submitMain = async () => {
    const content = draftMain.trim();
    if (!content) return notyf.error("Le commentaire est vide.");
    try {
      const t = mapTypeToApi(activityData.type);
      await postComment({
        userId: currentUser.id,
        content,
        parentCommentId: null,
        taskId: t === "task" ? activityData.id : undefined,
        intercontractId: t === "intercontract" ? activityData.id : undefined,
        transverseId: t === "transverse" ? activityData.id : undefined,
      });
      setDraftMain("");
      await loadComments();
      notyf.success("Commentaire ajouté !");
    } catch {
      notyf.error("Erreur lors de l’ajout du commentaire");
    }
  };

  // submit reply (optimistic insert under parent)
  const submitReply = async (commentId: string) => {
    const content = (draftReplies[commentId] || "").trim();
    if (!content) return notyf.error("La réponse est vide.");

    try {
      // 1) requête API
      const t = mapTypeToApi(activityData.type);
      const created = await postComment({
        userId: currentUser.id,
        content,
        parentCommentId: commentId,
        taskId: t === "task" ? activityData.id : undefined,
        intercontractId: t === "intercontract" ? activityData.id : undefined,
        transverseId: t === "transverse" ? activityData.id : undefined,
      });

      // 2) construit un objet minimal pour insérer tout de suite
      const newReply: CommentItem = {
        id: created?.id || Math.random().toString(36).slice(2),
        content,
        createdAt: created?.createdAt || new Date().toISOString(),
        parentCommentId: commentId,
        user: { name: created?.user?.name || currentUser.name, email: created?.user?.email || currentUser.email },
        replies: [],
      };

      // 3) insertion **immédiate sous le parent** (sans recréer un nouveau bloc)
      setComments((prev) => {
        const clone = JSON.parse(JSON.stringify(prev)) as CommentItem[];
        const attach = (nodes: CommentItem[]): boolean => {
          for (const n of nodes) {
            if (n.id === commentId) {
              n.replies = n.replies || [];
              n.replies.push(newReply);
              return true;
            }
            if (n.replies && n.replies.length && attach(n.replies)) return true;
          }
          return false;
        };
        attach(clone);
        return clone;
      });

      // 4) reset UI
      setDraftReplies((s) => ({ ...s, [commentId]: "" }));
      setReplyOpenFor(null);
      notyf.success("Réponse ajoutée !");

      // 5) sync propre (optionnel)
      // await loadComments();
    } catch {
      notyf.error("Erreur lors de l’ajout de la réponse");
    }
  };
    // --- fonctions de résolution du nom ---
  const resolveUserName = (comment: any): string => {
    if (!comment) return "Utilisateur";

    if (comment.user?.name) return comment.user.name;
    if (comment.userName) return comment.userName;

    const uid = (comment.userId || comment.userid || "").toLowerCase();

    const inProject = projectUsers.find(
      (u) => (u.userid || u.id || "").toLowerCase() === uid
    );
    if (inProject?.name) return inProject.name;

    const inAll = allUsers.find(
      (u) => (u.id || u.userid || "").toLowerCase() === uid
    );
    if (inAll?.name) return inAll.name;

    return "Utilisateur";
  };
  
const getInitialsForComment = (comment: any): string => {
  const name = resolveUserName(comment);
  if (!name) return "?";

  // Supprimer les parenthèses et tout ce qu'elles contiennent (ex: "(DSI)")
  const cleanName = name.replace(/\(.*?\)/g, "").trim();

  // Séparer en mots
  const parts = cleanName.split(" ").filter(Boolean);

  // Si 3 mots ou plus → 3 initiales
  if (parts.length >= 3) {
    return (
      parts[0][0].toUpperCase() +
      parts[1][0].toUpperCase() +
      parts[2][0].toUpperCase()
    );
  }

  // Si 2 mots → 2 initiales
  if (parts.length === 2) {
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  }

  // Si 1 mot → 1 initiale
  return parts[0][0].toUpperCase();
};


  // render
  return (
    <div className="border-t mt-4 pt-4 bg-gray-50 dark:bg-boxdark rounded-lg p-3">
      <h3 className="font-semibold text-sm mb-2">Commentaires</h3>

      {isLoadingComments ? (
        <p className="text-xs text-gray-400">Chargement...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400"></p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="mb-4">
            {/* PARENT */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-secondaryGreen text-white flex items-center justify-center text-[10px] font-semibold">
                {getInitialsForComment(c)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800"> {resolveUserName(c)}</span>
                  <span className="text-[11px] text-gray-500">{formatDateTime(c.createdAt)}</span>
                </div>
                <p
                  className="text-sm text-gray-800 mt-1"
                  dangerouslySetInnerHTML={{
                    __html: (c.content || "").replace(/@(\w+)/g, '<span class="text-blue-600 font-semibold">@$1</span>'),
                  }}
                />
              </div>
            </div>

            {/* REPLIES */}
            {Array.isArray(c.replies) && c.replies.length > 0 && (
              <div className="ml-7 mt-2 border-gray-300 pl-4 space-y-2">
                {c.replies.map((r) => (
                  <div key={r.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-semibold">
                      {getInitialsForComment(r)}
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-boxdark2 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{resolveUserName(r)}</span>
                        <span className="text-[10px] text-gray-400">{formatDateTime(r.createdAt)}</span>
                      </div>
                      <p
                        className="text-xs text-gray-700 dark:text-gray-300 leading-snug"
                        dangerouslySetInnerHTML={{
                          __html: (r.content || "").replace(/@(\w+)/g, '<span class="text-blue-600 font-semibold">@$1</span>'),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* INPUT DE RÉPONSE — placé **juste sous le parent** */}
            {replyOpenFor === c.id ? (
              <div className="relative mt-2 ml-10 flex items-start justify-end gap-2">
                <textarea
  className="mention-input w-full min-h-[36px] max-h-[150px] border bg-transparent py-2.5 px-3 text-sm text-black dark:text-gray outline-none focus:border-green-700 dark:border dark:border-formStrokedark dark:focus:border-green-700 rounded-md border-stroke resize-none overflow-y-auto"
  placeholder="Votre réponse... (tapez @ pour mentionner)"
  value={draftReplies[c.id] || ""}
  onChange={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    onChangeReply(c.id, e.target.value);
  }}
/>


                {/* Liste des @mentions collée à l'input courant */}
                {showUserList && mentionContext.where === "reply" && mentionContext.commentId === c.id && filteredUsers.length > 0 && (
                  <div className="mention-list absolute left-0 right-0 top-[100%] mt-1 w-full max-h-56 overflow-y-auto bg-white dark:bg-boxdark border dark:border-gray-700 rounded-md shadow-lg z-50">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-boxdark2 cursor-pointer"
                        onClick={() => onPickUser(u)}
                      >
                        <div className="w-7 h-7 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2 text-xs">
                          {getThreeInitials(u.name || "")}
                        </div>
                        <span className="text-sm">{u.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => setReplyOpenFor(null)} className="border text-xs px-3 py-2 rounded-md bg-gray-200 dark:bg-boxdark2 hover:bg-gray-300 self-start">
                  Annuler
                </button>
                <button
                  onClick={() => submitReply(c.id)}
                  className="border text-xs px-3 py-2 rounded-md text-white font-semibold cursor-pointer bg-green-700 hover:opacity-85 self-start"
                >
                  Envoyer
                </button>
              </div>
            ) : (
              <button
                   onClick={() => {
                  setReplyOpenFor(c.id);
                  // ✅ Préremplit avec le nom du commentateur parent
                  setDraftReplies((s) => ({
                    ...s,
                    [c.id]: `@${resolveUserName(c)} `,
                  }));
                }}
                  className="text-xs text-green-600 hover:underline mt-2 ml-10"
                >
                  Répondre
                </button>
            )}
          </div>
        ))
      )}

      {/* NOUVEAU COMMENTAIRE */}
      <div className="relative flex items-start justify-end gap-2 mt-2">
   <textarea
  ref={mainInputRef as any}
  placeholder="Ajouter un commentaire... (Utilisez @ pour mentionner un membre)"
  className="mention-input w-full min-h-[40px] max-h-[200px] border bg-transparent py-3 px-3 text-sm text-black dark:text-gray outline-none focus:border-green-700 dark:border dark:border-formStrokedark dark:focus:border-green-700 rounded-md border-stroke resize-none overflow-y-auto"
  value={draftMain}
  onChange={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    onChangeMain(e.target.value);
  }}
/>


        {showUserList && mentionContext.where === "main" && filteredUsers.length > 0 && (
          <div className="mention-list absolute left-0 right-0 top-[100%] mt-1 w-full max-h-56 overflow-y-auto bg-white dark:bg-boxdark border dark:border-gray-700 rounded-md shadow-lg z-50">
            {filteredUsers.map((u) => (
              <div key={u.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-boxdark2 cursor-pointer" onClick={() => onPickUser(u)}>
                <div className="w-7 h-7 rounded-full bg-secondaryGreen flex items-center justify-center text-white mr-2 text-xs">
                  {getThreeInitials(u.name || "")}
                </div>
                <span className="text-sm">{u.name}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={submitMain} className="border flex justify-center items-center dark:border-boxdark text-xs px-3 py-2 rounded-md text-white font-semibold cursor-pointer bg-green-700 hover:opacity-85">
          Publier
        </button>
      </div>
    </div>
  );
};


const UpdateActivity = ({
  
  activity,
  setModalUpdateOpen,
  setIsRefreshNeeded
}: {
  
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
    dueDate: activity?.content?.dueDate || activity?.content?.endDate,
    endDate: activity?.content?.endDate || activity?.content?.dueDate,
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
  const navigate = useNavigate();
  const userPopUp = useRef<any>(null);

  // Fetch all users
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
      notyf.error("Erreur lors du chargement des projets");
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

  const processDescription = (html: string): string => {
    const sanitized = DOMPurify.sanitize(html, {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['src', 'alt', 'style', 'width', 'height'],
      ALLOW_DATA_ATTR: false
    });
    return sanitized;
  };

  const handleUpdateActivity = async () => {
    setIsLoading(true);
    try {
      // ✅ Version corrigée : garantit un format ISO complet compatible .NET
const cleanDate = (date: string | null | undefined): string | undefined => {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString(); // Exemple : "2025-10-21T00:00:00.000Z"
};


      
      const processedDescription = processDescription(activityData.description || '');
      const decoded = decodeToken("pr") || decodeToken("ad");
const userId = decoded?.jti || localStorage.getItem("userid");

      if (activityData?.type === "Transverse") {
       const dataToSend = {
  title: activityData.title,
  startDate: cleanDate(activityData.startDate),
  endDate: cleanDate(activityData.dueDate ?? activityData.endDate ?? undefined),
  dailyEffort: activityData.dailyEffort,
  type: activityData.transverseType,
  description: processedDescription,
  status: activityData.status,
  fichier: activityData?.fichier,
  userid: userId,
};

        if (activityData.id) {
          console.log("📤 Payload envoyé au backend (Transverse):", dataToSend);
          await updateTransverse(activityData.id, dataToSend);
        }
      } else if (activityData?.type === "InterContract") {
       const dataToSend = {
        title: activityData.title,
        startDate: cleanDate(activityData.startDate),
        endDate: cleanDate(activityData.dueDate ?? activityData.endDate ?? undefined),
        dailyEffort: activityData.dailyEffort,
        type: activityData.intercontractType,
        description: processedDescription,
        status: activityData.status,
        fichier: activityData?.fichier,
        userid: userId,
      };


        if (activityData.id) {
          console.log("📤 Payload envoyé au backend (Intercontrat):", dataToSend);
          await updateIntercontract(activityData.id, dataToSend);
        }
      } else {
        const formatUser = assignedPerson.map(user => ({
          userid: user.userid,
          taskid: activityData.id,
        }));
        
        const dataToSend = {
          startDate: activityData?.startDate,
          dueDate: activityData?.dueDate || activityData?.endDate,
          description: processedDescription,
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
      navigate(`/gmp/activity/${userid}`);
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard");
      console.error(`Error at update activity : ${error}`);
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
    <>
    
        <div className="space-y-4">
          <div className="flex justify-center">
  <span className="font-bold text-zinc-700 dark:text-zinc-200 text-xl md:text-2xl">
    Modifier la tâche
  </span>
</div>
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
      <div className="flex justify-end p-2">
  <button
    className="border text-xs p-3 rounded-md font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2"
    type="button"
    onClick={handleCloseModal}
    disabled={isLoading}
  >
    Annuler
  </button>

  <button
    type="button"
    disabled={!isFormValid() || isLoading}
    onClick={handleUpdateActivity}
    className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${
      !isFormValid() || isLoading
        ? "cursor-not-allowed bg-green-500"
        : "cursor-pointer bg-green-700 hover:opacity-85"
    }`}
  >
    {isLoading ? (
      <BeatLoader size={5} className="mr-2" color={"#fff"} />
    ) : null}
    Valider
  </button>
</div>

     
     <CommentSection
        activityData={activityData}
        projectUsers={assignedPerson
          .filter((u) => !!u.userid)
          .map((u) => ({
            id: u.userid as string,
            name: (u.user?.name as string) || "",
          }))}
      />

   
    </>
  );
};


export default UpdateActivity;