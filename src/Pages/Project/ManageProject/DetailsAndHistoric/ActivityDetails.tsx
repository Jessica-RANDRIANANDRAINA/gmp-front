import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../../../../services/Function/DateServices";
import { getTaskDetails, getTransverseDetails, getIntercontractDetails } from "../../../../services/Project";
// import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import ListUsers from "../../../../components/UIElements/ListUsers";
import DOMPurify from 'dompurify';
//const notyf = new Notyf({ position: { x: "center", y: "top" } });

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    id: string;
  };
}

interface ActivityDetails {
  id: string;
  title: string;
  description?: string;
  status: string;
  startDate: string;
  dueDate?: string;
  endDate?: string;
  fichier?: string;
  dailyEffort?: number;
  type: string;
  subType?: string;
  projectId?: string;
  phaseId?: string;
  priority?: string;
  user?: Array<{
    user: { name: string };
    userid: string;
  }>;
  comments?: Comment[];
}

const normalizeActivity = (activity: any, type: string): ActivityDetails => {
  const base = {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    status: activity.status,
    startDate: activity.startDate,
    fichier: activity.fichier,
    dailyEffort: activity.dailyEffort,
    type: type,
    subType: activity.subType,
    projectId: activity.projectId,
    phaseId: activity.phaseId,
    priority: activity.priority, // Certains types peuvent utiliser 'importance' au lieu de 'priority'
    user: activity.user,
    comments: activity.comments,
    dueDate: activity.dueDate,
    endDate: activity.endDate
  };

  // Gestion des dates de fin différentes selon le type
  switch(type) {
    case 'Projet':
      return { ...base, dueDate: activity.dueDate };
    case 'Transverse':
    case 'Intercontract':
      return { ...base, endDate: activity.endDate };
    default:
      return base;
  }
};

const ActivityDetails = () => {
  const { activityId, activityType } = useParams();
  const navigate = useNavigate();
  const [activityDetails, setActivityDetails] = useState<ActivityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const [newComment, setNewComment] = useState("");
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        let response;
        switch (activityType) {
          case 'intercontract':
            response = await getIntercontractDetails(activityId!);
            break;
          case 'transverse':
            response = await getTransverseDetails(activityId!);
            break;
          case 'projet':
            response = await getTaskDetails(activityId!);
            break;
          default:
            throw new Error('Type d\'activité non reconnu');
        }
        console.log("Réponse API brute:", response); 
        const normalizedActivity = normalizeActivity(response, activityType!);
        setActivityDetails(normalizedActivity);
      } catch (err) {
        setError('Erreur lors du chargement des détails de l\'activité');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [activityType, activityId]);

  useEffect(() => {
    if (activityDetails) {
      const endDate = activityDetails.dueDate || activityDetails.endDate;
      if (endDate) {
        const isLate = new Date(endDate) < new Date() && activityDetails.status !== "Traité";
        setIsLate(isLate);
      }
    }
  }, [activityDetails]);

  // const handleAddComment = () => {
  //   if (!newComment.trim()) return;

  //   const mockUser = {
  //     name: "Utilisateur Actuel",
  //     id: "current-user-id"
  //   };

  //   const newCommentObj: Comment = {
  //     id: Date.now().toString(),
  //     content: newComment,
  //     createdAt: new Date().toISOString(),
  //     user: mockUser
  //   };

  //   setActivityDetails((prev: ActivityDetails | null) => ({
  //     ...prev!,
  //     comments: [...(prev?.comments || []), newCommentObj]
  //   }));

  //   setNewComment("");
  //   notyf.success("Commentaire ajouté");
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryGreen"></div>
      </div>
    );
  }

  if (!activityDetails) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-red-500">Activité non trouvée</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primaryGreen text-white rounded-md"
        >
          Retour
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primaryGreen text-white rounded-md"
        >
          Retour
        </button>
      </div>
    );
  }

  const startDate = formatDate(activityDetails.startDate);
  const endDate = activityDetails.dueDate 
    ? formatDate(activityDetails.dueDate) 
    : activityDetails.endDate 
      ? formatDate(activityDetails.endDate) 
      : "Non définie";

  // Function to check if the fichier URL is an image
  const isImageUrl = (url: string) => {
    return /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url);
  };
<style>{`
  .quill-content img {
    width: 10px;
    height: auto;
    display: block;
    margin: 1rem 0;
  }
  
  .quill-content {
    width: 100%;
    line-height: 1.6;
    font-size: 1rem;
  }
  
  .quill-content p {
    margin-bottom: 1rem;
    white-space: normal;
    word-wrap: break-word;
  }
`}</style>
  return (
    
    <div className="p-4 md:px-8 lg:px-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-primaryGreen hover:text-green-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Retour
      </button>

      <div className="bg-white dark:bg-boxdark rounded-lg shadow-md p-6">
        <div className="text-center mb-4">DU : {new Date().toLocaleString()}</div>
        <h1 className="font-bold text-zinc-400 text-xl md:text-2xl mb-4">
          INFORMATION GENERALE
        </h1>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold dark:text-white">{activityDetails.title}</h1>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            activityDetails.status === "Backlog" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
            activityDetails.status === "En cours" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
            activityDetails.status === "Traité" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
            activityDetails.status === "En pause" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" :
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}>
            Status actuel: {activityDetails.status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Détails</h2>
            <div className="space-y-2">
             <p className="dark:text-gray-300">
               <span className="font-medium">Type:</span>{" "}
               <span className={`border rounded w-fit px-1 cursor-default ${
                 activityDetails.type === "projet"
                   ? "bg-green-100 text-green-600 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                   : activityDetails.type === "transverse"
                   ? "bg-purple-100 text-purple-600 border-purple-300 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700"
                   : "bg-red-100 text-red-600 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
               }`}>
                 {activityDetails.type.charAt(0).toUpperCase() + activityDetails.type.slice(1)}
               </span>
             </p>

              {activityDetails.subType && (
                <p className="dark:text-gray-300">
                  <span className="font-medium">Sous-type:</span> {activityDetails.subType}
                </p>
              )}
              <p className="dark:text-gray-300">
                <span className="font-medium">Effort quotidien:</span> <span className="">{activityDetails.dailyEffort || 0}h</span>
              </p>
                {activityDetails.type !== 'transverse' && activityDetails.type !== 'intercontract' && (
                  <p className="dark:text-gray-300">
                    <span className="font-medium">Priorité:</span>
                    <span className={`ml-1 ${activityDetails.priority === "Élevé" ? "text-red-500" : ""}`}>
                      {activityDetails.priority || "Non définie"}
                    </span>
                  </p>
                )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Dates</h2>
            <div className="space-y-2">
              <p className="dark:text-gray-300">
                <span className="font-medium">Début:</span> {startDate}
              </p>
              <p className="dark:text-gray-300">
                <span className="font-medium">Fin:</span> {endDate}
              </p>
              {isLate && (
                <p className="text-red-500 font-medium">
                  !! Cette activité est en retard
                </p>
              )}
            </div>
          </div>
        </div>

        {activityDetails.description && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2 dark:text-white">Description</h2>
    <div 
      className="dark:text-gray-300"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activityDetails.description) }}
    />
  </div>
)}

        {activityDetails.fichier && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Fichier joint</h2>
            {isImageUrl(activityDetails.fichier) ? (
              <img 
                src={activityDetails.fichier} 
                alt="Fichier joint" 
                className="max-w-full h-auto rounded-md shadow-sm mt-2" 
              />
            ) : (
              <a
                href={activityDetails.fichier}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                🔗: {activityDetails.fichier}
              </a>
            )}
          </div>
        )}

        {activityDetails.user && activityDetails.user.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Assigné à</h2>
            <ListUsers 
              data={activityDetails.user} 
              type="multiple" 
            />
          </div>
        )}

        {/* <div className="border-t pt-6 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Commentaires</h2>

          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-green-600 transition"
            >
              Ajouter un commentaire
            </button>
          </div>

          <div className="space-y-4">
            {activityDetails.comments && activityDetails.comments.length > 0 ? (
              activityDetails.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b pb-4 dark:border-gray-700 last:border-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <ListUsers
                        data={[{
                          user: { name: comment.user.name },
                          userid: comment.user.id
                        }]}
                        type="single"
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(comment.createdAt, true)}
                    </p>
                  </div>
                  <p className="dark:text-gray-300 whitespace-pre-line">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Aucun commentaire pour le moment</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ActivityDetails;