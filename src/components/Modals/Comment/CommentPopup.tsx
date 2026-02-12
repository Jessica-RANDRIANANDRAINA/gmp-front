// import { useEffect, useRef, useState } from "react";
// import { getInitials } from "../../../services/Function/UserFunctionService";
// import { Notyf } from "notyf";
// import "notyf/notyf.min.css";
// import { BeatLoader } from "react-spinners";
// import { fetchComments, postComment } from "../../../services/Project/Comment";

// const notyf = new Notyf({ position: { x: "center", y: "top" } });

// interface CommentPopupProps {
//   activityId: string;
//   type: "Task" | "Intercontract" | "Transverse";
//   currentUserId: string;
//   projectUsers: Array<{ id: string; name: string; email?: string }>;
//   onClose: () => void;
// }

// export default function CommentPopup({
//   activityId,
//   type,
//   currentUserId,
//   projectUsers,
//   onClose,
// }: CommentPopupProps) {
//   const [comments, setComments] = useState<any[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [replyTo, setReplyTo] = useState<string | null>(null);
//   const [replyContent, setReplyContent] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Mentions
//   const [showMentionList, setShowMentionList] = useState(false);
//   const [filteredUsers, setFilteredUsers] = useState(projectUsers);
//   const [mentionStartIndex, setMentionStartIndex] = useState(-1);

//   const commentRef = useRef<HTMLInputElement>(null);
//   const replyRefs = useRef<{ [key: string]: HTMLInputElement }>({});

//   // === Charger les commentaires ===
//   const loadComments = async () => {
//     setIsLoading(true);
//     try {
//       const data = await fetchComments(activityId, type);
//       setComments(data);
//     } catch (err) {
//       console.error(err);
//       notyf.error("Erreur lors du chargement des commentaires");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadComments();
//   }, [activityId]);

//   // === Détection des mentions ===
//   const handleMention = (value: string, isReply = false, commentId?: string) => {
//     const atIndex = value.lastIndexOf("@");
//     if (atIndex !== -1) {
//       const search = value.substring(atIndex + 1).toLowerCase();
//       if (search.length > 0) {
//         const filtered = projectUsers.filter((u) =>
//           u.name.toLowerCase().startsWith(search)
//         );
//         setFilteredUsers(filtered);
//         setShowMentionList(true);
//         setMentionStartIndex(atIndex);
//       }
//     } else setShowMentionList(false);

//     isReply ? setReplyContent(value) : setNewComment(value);
//   };

//   const handleSelectMention = (user: any, isReply = false) => {
//     const current = isReply ? replyContent : newComment;
//     const before = current.substring(0, mentionStartIndex);
//     const newText = before + `@${user.name} `;
//     isReply ? setReplyContent(newText) : setNewComment(newText);
//     setShowMentionList(false);
//   };

//   // === Ajouter un commentaire ===
//   const handleAddComment = async (parentCommentId?: string) => {
//     const content = parentCommentId ? replyContent : newComment;
//     if (!content.trim()) return notyf.error("Commentaire vide");

//     try {
//       const payload = {
//         userId: currentUserId,
//         content,
//         parentCommentId: parentCommentId || null,
//         taskId: type === "Task" ? activityId : undefined,
//         intercontractId: type === "Intercontract" ? activityId : undefined,
//         transverseId: type === "Transverse" ? activityId : undefined,
//       };
//       await postComment(payload);
//       notyf.success("Commentaire publié !");
//       setNewComment("");
//       setReplyContent("");
//       setReplyTo(null);
//       loadComments();
//     } catch {
//       notyf.error("Erreur lors de l’envoi du commentaire");
//     }
//   };

//   const renderComment = (c: any) => (
//     <div key={c.id} className="border rounded-md p-2 mb-2 dark:border-boxdark2">
//       <div className="flex items-center gap-2 mb-1">
//         <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">
//           {getInitials(c.user?.name || "U")}
//         </div>
//         <span className="text-sm font-medium">{c.user?.name || "Utilisateur"}</span>
//       </div>
//       <p
//         className="text-sm text-gray-800 dark:text-gray-300"
//         dangerouslySetInnerHTML={{
//           __html: c.content.replace(
//             /@(\w+)/g,
//             '<span class="mention bg-blue-100 text-blue-800 px-1 rounded text-xs font-medium">@$1</span>'
//           ),
//         }}
//       />
//       {/* Réponses */}
//       {c.replies && c.replies.length > 0 && (
//         <div className="ml-6 mt-2 space-y-2">
//           {c.replies.map((r: any) => (
//             <div key={r.id} className="text-xs text-gray-700 dark:text-gray-400 border-l-2 border-gray-300 pl-2">
//               {r.content}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Bouton répondre */}
//       {replyTo === c.id ? (
//         <div className="mt-2 ml-6">
//           <input
//             ref={(el) => (replyRefs.current[c.id] = el!)}
//             type="text"
//             value={replyContent}
//             onChange={(e) => handleMention(e.target.value, true, c.id)}
//             className="border rounded-md px-2 py-1 text-sm w-full"
//             placeholder="Répondre..."
//           />
//           {showMentionList && (
//             <div className="absolute bg-white border shadow-md rounded-md mt-1 w-48 z-50">
//               {filteredUsers.map((u) => (
//                 <div
//                   key={u.id}
//                   className="p-1 px-2 hover:bg-gray-100 cursor-pointer text-sm"
//                   onClick={() => handleSelectMention(u, true)}
//                 >
//                   @{u.name}
//                 </div>
//               ))}
//             </div>
//           )}
//           <div className="flex gap-2 mt-1">
//             <button
//               className="bg-green-600 text-white text-xs px-2 py-1 rounded"
//               onClick={() => handleAddComment(c.id)}
//             >
//               Répondre
//             </button>
//             <button
//               className="text-xs text-gray-500"
//               onClick={() => {
//                 setReplyTo(null);
//                 setReplyContent("");
//               }}
//             >
//               Annuler
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button
//           className="text-xs text-blue-600 mt-1 ml-6 hover:underline"
//           onClick={() => setReplyTo(c.id)}
//         >
//           Répondre
//         </button>
//       )}
//     </div>
//   );

//   return (
//     <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/40 z-50">
//       <div className="bg-white dark:bg-boxdark w-[600px] rounded-lg p-4 shadow-lg relative">
//         <button
//           className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
//           onClick={onClose}
//         >
//           ✕
//         </button>
//         <h3 className="font-semibold text-lg mb-3">Commentaires</h3>

//         {isLoading ? (
//           <div className="flex justify-center py-4">
//             <BeatLoader color="#16a34a" />
//           </div>
//         ) : comments.length === 0 ? (
//           <p className="text-sm text-gray-500">Aucun commentaire pour l’instant.</p>
//         ) : (
//           comments.map((c) => renderComment(c))
//         )}

//         <div className="border-t mt-3 pt-3">
//           <input
//             ref={commentRef}
//             type="text"
//             value={newComment}
//             onChange={(e) => handleMention(e.target.value)}
//             className="border rounded-md w-full px-2 py-1 text-sm"
//             placeholder="Écrire un commentaire..."
//           />
//           {showMentionList && (
//             <div className="absolute bg-white border shadow-md rounded-md mt-1 w-48 z-50">
//               {filteredUsers.map((u) => (
//                 <div
//                   key={u.id}
//                   className="p-1 px-2 hover:bg-gray-100 cursor-pointer text-sm"
//                   onClick={() => handleSelectMention(u)}
//                 >
//                   @{u.name}
//                 </div>
//               ))}
//             </div>
//           )}
//           <button
//             onClick={() => handleAddComment()}
//             className="bg-green-600 hover:bg-green-700 text-white text-xs rounded px-3 py-1 mt-2"
//           >
//             Publier
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
