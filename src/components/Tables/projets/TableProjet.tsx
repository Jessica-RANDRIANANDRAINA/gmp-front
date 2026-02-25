import { useEffect, useMemo, useState } from "react";
import {
  CustomInput,
  CustomSelect,
  CustomInputUserSpecifiedSearch,
  PointSelect, // CustomSelectChoice,
} from "../../UIElements";
import { Calendar, LayoutDashboard, Table } from "lucide-react";

import { formatDate } from "../../../services/Function/DateServices";

import Pagination from "../Pagination";
import ListUsers from "../../UIElements/ListUsers";
import { getAllMyHabilitation } from "../../../services/Function/UserFunctionService";
import { IProjectData } from "../../../types/Project";
import { IMyHabilitation } from "../../../types/Habilitation";
import { SyncLoader } from "react-spinners";
import PerPageInput from "../../UIElements/Input/PerPageInput";
import { IDecodedToken } from "../../../types/user";
import { decodeToken } from "../../../services/Function/TokenService";
import GanttChart from "../../chart/GanttChart";
import { Link } from "react-router-dom";
import { getAllChefsProjet } from "../../../services/Project/ProjectServices";

// Mapping des états anglais → français
const projectStates: Record<string, string> = {
  "Not Started": "Pas commencé",
  "In Progress": "En cours",
  Completed: "Terminé",
  Archived: "Archivé",
  "Stand by": "Stand by",
};

// const calculateProjectCompletion = (phases: any[], projectStateFr: string, fallback: number = 0) => {
//   // si projet Stand by → ne pas calculer
//   if (projectStateFr === "Stand by") return fallback;

//   const activePhases = (phases || []).filter((p) => p?.status !== "Stand by");

//   if (activePhases.length === 0) return fallback;

//   const totalWeight = activePhases.reduce((s, p) => s + (p.weight ?? 0), 0);
//   if (totalWeight === 0) return fallback;

//   const sum = activePhases.reduce((s, p) => {
//     const w = p.weight ?? 0;
//     const prog = p.progress ?? 0;
//     return s + (w * prog);
//   }, 0);

//   // si la somme des weights = 100 → sum/100, sinon normaliser
//   const result = totalWeight === 100 ? (sum / 100) : (sum / totalWeight);

//   return Math.round(result);
// };

// Fonction utilitaire
const getFrenchState = (state?: string | null) => {
  if (!state) return "Pas commencé";
  return projectStates[state] || state;
};

const TableProjet = ({
  data,
  setProjectToModif,
  setIdProjectForDetails,
  totalProjectCount,
  search,
  availableUser,
  selectedUserInput,
  setSelecteduserInput,
  setSearch,
  setProjectsToDelete,
  setShowModalDelete,
  setGoToDetails,
  setGoToHistoric,
  setProjectsSelected,
  setGoToAdvancement,
  setGoToTask,
  setIsSearchButtonClicked,
}: {
  data: Array<any> | null;
  totalProjectCount: number;
  setProjectToModif: Function;
  setIdProjectForDetails: Function;
  search: {
    title: string;
    member: string;
    director: string;
    priority: string;
    criticity: string;
    completionPercentage: string;
    state: string;
    startDate: string | undefined;
    endDate: string | undefined;
  };
  availableUser: Array<{ id: string; name: string; email: string }>;
  selectedUserInput: Array<{ id: string; name: string; email: string }>;
  setSelecteduserInput: React.Dispatch<React.SetStateAction<any>>;
  setProjectsToDelete: React.Dispatch<React.SetStateAction<Array<string>>>;
  setProjectsSelected: React.Dispatch<React.SetStateAction<Array<string>>>;
  setShowModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToHistoric: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToAdvancement: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToTask: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSearchButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setSearch: React.Dispatch<
    React.SetStateAction<{
      title: string;
      member: string;
      director: string;
      priority: string;
      criticity: string;
      completionPercentage: string;
      state: string;
      startDate: string | undefined;
      endDate: string | undefined;
    }>
  >;
}) => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);
  const [dataSorted, setDataSorted] = useState({
    title: 0,
    codeProjet: 0,
    startDate: 0,
    endDate: 0,
    completionPercentage: 0,
    state: 0,
    priority: 0,
    criticality: 0,
  });
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [projectSelected, setProjectSelected] = useState<string[]>([]);
  const [myHabilitation, setMyHabilitation] = useState<IMyHabilitation>();
  const [viewMode, setViewMode] = useState<"table" | "gantt" | "card">("table");
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(
    null,
  );
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [applyFilter, setApplyFilter] = useState(false);
  const [allDirectors, setAllDirectors] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isLateOnly, setIsLateOnly] = useState(false);

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

  // const [statusSelectedOptions, setStatusSelectedOptions] = useState<string[]>(
  //   []
  // );
  // const [resetStatusSelectedOptions, setResetStatusSelectedOptions] =
  //   useState(false);
  // const handleStatusChange = (selected: string[]) => {
  //   setStatusSelectedOptions(selected);
  // };

  // const userConnected = decodeToken("pr");

  const getHab = async () => {
    const hab = await getAllMyHabilitation();
    setMyHabilitation(hab);
  };

  useEffect(() => {
    getHab();
  }, []);

  // useEffect(()=>{
  //   console.log("**************")
  //   console.log(statusSelectedOptions)
  //   console.log("**************")
  // }, [statusSelectedOptions])

  //   const computedData = useMemo(() => {
  //   if (!data) return [];

  //   return data.map((p: any) => {
  //     const stateFr = getFrenchState(p.state);

  //     return {
  //       ...p,
  //       completionPercentage: calculateProjectCompletion(
  //         p.listPhases || [],
  //         stateFr,
  //         p.completionPercentage
  //       ),
  //     };
  //   });
  // }, [data]);

  // const computedData = useMemo(() => {
  //   if (!data) return [];

  //   return data.map((project: any) => {
  //     const projectStateFr = getFrenchState(project.state);

  //     const computedCompletion = calculateProjectCompletion(
  //       project.listPhases || [],
  //       projectStateFr,
  //       project.completionPercentage ?? 0
  //     );

  //     return {
  //       ...project,
  //       completionPercentage: computedCompletion,
  //     };
  //   });
  // }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    // 🔹 Tant que "Rechercher" n’est pas cliqué → pas de filtre
    if (!applyFilter) return data;

    return data.filter((project) => {
      /* =======================
       TITRE
    ======================= */
      if (
        search.title &&
        !project.title.toLowerCase().includes(search.title.toLowerCase())
      ) {
        return false;
      }

      /* =======================
       CHEF DE PROJET
    ======================= */
      if (search.director) {
        const hasDirector = project.listUsers?.some(
          (u: any) => u.role === "director" && u.userid === search.director,
        );
        if (!hasDirector) return false;
      }

      /* =======================
       PRIORITÉ
    ======================= */
      if (search.priority !== "Tous" && project.priority !== search.priority) {
        return false;
      }

      /* =======================
       CRITICITÉ
    ======================= */
      if (
        search.criticity !== "Tous" &&
        project.criticality !== search.criticity
      ) {
        return false;
      }

      /* =======================
      STATUT DU PROJET
    ======================= */
      if (search.state !== "Tous") {
        const projectStateFr = getFrenchState(project.state);

        if (projectStateFr !== search.state) {
          return false;
        }
      }

      /* =======================
       AVANCEMENT (match exact)
       - Exclut les projets sans `completionPercentage`
    ======================= */
      if (search.completionPercentage !== "Tous") {
        const target = Number(search.completionPercentage);
        const projValue = project.completionPercentage;

        // si la valeur du projet est indéfinie ou non numérique → exclure
        if (projValue === undefined || projValue === null) return false;

        // match strict (==) — l'utilisateur a demandé un filtre exact
        if (Number(projValue) !== target) {
          return false;
        }
      }

      /* =======================
       MEMBRE
    ======================= */
      if (selectedUserInput.length > 0) {
        const hasMember = project.listUsers?.some((u: any) =>
          selectedUserInput.some((selected) => selected.id === u.userid),
        );
        if (!hasMember) return false;
      }

      /* =======================
       DATE DÉBUT
    ======================= */
      // if (search.startDate) {
      //   if (new Date(project.startDate) < new Date(search.startDate)) {
      //     return false;
      //   }
      // }

      /* =======================
       DATE FIN
    ======================= */
      // if (search.endDate && project.endDate) {
      //   if (new Date(project.endDate) > new Date(search.endDate)) {
      //     return false;
      //   }
      // }
      // Cas 1: Les deux dates sont renseignées
      if (search.startDate && search.endDate) {
        // Vérifier que le projet a les deux dates
        if (!project.startDate || !project.endDate) {
          return false;
        }

        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        const filterStart = new Date(search.startDate);
        const filterEnd = new Date(search.endDate);

        // Normaliser à minuit pour ignorer l'heure
        projectStart.setHours(0, 0, 0, 0);
        projectEnd.setHours(0, 0, 0, 0);
        filterStart.setHours(0, 0, 0, 0);
        filterEnd.setHours(0, 0, 0, 0);

        // Le projet doit être DANS l'intervalle [filterStart, filterEnd]
        const isAfterStart = projectStart >= filterStart;
        const isBeforeEnd = projectEnd <= filterEnd;

        if (!isAfterStart || !isBeforeEnd) {
          return false;
        }
      }
      // Cas 2: Seulement la date de début
      else if (search.startDate) {
        if (!project.startDate) {
          return false;
        }

        const projectStart = new Date(project.startDate);
        const filterStart = new Date(search.startDate);

        projectStart.setHours(0, 0, 0, 0);
        filterStart.setHours(0, 0, 0, 0);

        if (projectStart < filterStart) {
          return false;
        }
      }
      // Cas 3: Seulement la date de fin
      else if (search.endDate) {
        if (!project.endDate) {
          return false;
        }

        const projectEnd = new Date(project.endDate);
        const filterEnd = new Date(search.endDate);

        projectEnd.setHours(0, 0, 0, 0);
        filterEnd.setHours(0, 0, 0, 0);

        if (projectEnd > filterEnd) {
          return false;
        }
      }

      /* =======================
    PROJET EN RETARD
  ======================= */
      if (isLateOnly) {
        const today = new Date();

        if (
          !project.endDate ||
          new Date(project.endDate) >= today ||
          project.completionPercentage === 100
        ) {
          return false;
        }
      }
      return true;
    });
  }, [data, applyFilter, search, selectedUserInput, isLateOnly]);

  const filteredProjectCount = useMemo(() => {
    return filteredData.length;
  }, [filteredData]);

  const sortedData: IProjectData[] = filteredData
    .slice()
    .sort((a: IProjectData, b: IProjectData) => {
      // sort by code projet
      if (dataSorted.codeProjet === 1) {
        return a.codeProjet?.localeCompare(b.codeProjet ?? "") || 0;
      } else if (dataSorted.codeProjet === 2) {
        return b.codeProjet?.localeCompare(a.codeProjet ?? "") || 0;
      }
      // sort by title
      if (dataSorted.title === 1) {
        return a.title.localeCompare(b.title);
      } else if (dataSorted.title === 2) {
        return b.title.localeCompare(a.title);
      }

      // sort by start date
      if (dataSorted.startDate === 1) {
        return a.startDate?.localeCompare(b.startDate ?? "") || 0;
      } else if (dataSorted.startDate === 2) {
        return b.startDate?.localeCompare(a.startDate ?? "") || 0;
      }

      //sort by end date
      if (dataSorted.endDate === 1) {
        if (a.endDate === null) return 1;
        if (b.endDate === null) return -1;
        return a.endDate?.localeCompare(b.endDate ?? "") || 0;
      } else if (dataSorted.endDate === 2) {
        if (a.endDate === null) return 1;
        if (b.endDate === null) return -1;
        return b.endDate?.localeCompare(a.endDate ?? "") || 0;
      }

      // sort by completion percentage
      if (dataSorted.completionPercentage === 1) {
        if (a.completionPercentage === undefined) return 1;
        if (b.completionPercentage === undefined) return -1;
        return a.completionPercentage - b.completionPercentage;
      } else if (dataSorted.completionPercentage === 2) {
        if (a.completionPercentage === undefined) return 1;
        if (b.completionPercentage === undefined) return -1;
        return b.completionPercentage - a.completionPercentage;
      }

      // sort by priority
      const priorityOrder: { [key: string]: number } = {
        Faible: 1,
        Moyenne: 2,
        Elevée: 3,
      };
      if (dataSorted.priority === 1) {
        const priorityA = priorityOrder[a.priority] ?? 0;
        const priorityB = priorityOrder[b.priority] ?? 0;
        return priorityA - priorityB;
      } else if (dataSorted.priority === 2) {
        const priorityA = priorityOrder[a.priority] ?? 0;
        const priorityB = priorityOrder[b.priority] ?? 0;
        return priorityB - priorityA;
      }

      // sort by criticality
      const criticalityOrder: { [key: string]: number } = {
        Normale: 1,
        Urgente: 2,
      };
      if (dataSorted.criticality === 1) {
        const criticalityA = criticalityOrder[a.criticality] ?? 0;
        const criticalityB = criticalityOrder[b.criticality] ?? 0;
        return criticalityA - criticalityB;
      } else if (dataSorted.criticality === 2) {
        const criticalityA = criticalityOrder[a.criticality] ?? 0;
        const criticalityB = criticalityOrder[b.criticality] ?? 0;
        return criticalityB - criticalityA;
      }

      // =======================
      // SORT BY STATE (STATUT)
      // =======================
      const stateOrder: Record<string, number> = {
        "Pas commencé": 1,
        "En cours": 2,
        "Stand by": 3,
        Terminé: 4,
        Archivé: 5,
      };

      if (dataSorted.state === 1 || dataSorted.state === 2) {
        const stateA = stateOrder[getFrenchState(a.state)] ?? 0;
        const stateB = stateOrder[getFrenchState(b.state)] ?? 0;

        return dataSorted.state === 1 ? stateA - stateB : stateB - stateA;
      }

      return 0;
    });

  const project = useMemo(() => {
    return data?.flatMap((pr: any) => [
      {
        id: pr.id,
        text: pr.title,
        start_date: new Date(pr.startDate),
        end_date:
          pr.endDate === null ? new Date(pr.startDate) : new Date(pr.endDate),
        progress: pr.completionPercentage / 100,
        type: "project",
      },
      // Ajouter les phases comme des objets séparés avec un champ 'parent'
      ...pr.listPhases.map((phase: any) => ({
        id: phase.id,
        text: phase.phase1, //phase name
        start_date:
          phase.startDate === null
            ? new Date(pr.startDate)
            : new Date(phase.startDate),
        end_date:
          phase.endDate === null
            ? new Date(phase.startDate)
            : new Date(phase.endDate),
        parent: pr.id, // Lier la phase au projet parent
        progress: (phase.completionPercentage ?? 0) / 100,
        type: "phase",
      })),
    ]);
  }, [data]);

  // --- New: explicit filtered -> paginated flow
  const filteredProjects = useMemo(() => {
    // `sortedData` is already produced from `filteredData` (keeps sorting),
    // so reuse it here as the canonical "filtered + sorted" list.
    return sortedData;
  }, [sortedData]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (actualPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;

    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, actualPage, entriesPerPage]);

  useEffect(() => {
    if (JSON.stringify(project) !== JSON.stringify(tasks)) {
      const projects = project?.filter((item) => !item.parent);
      const phases = project?.filter((item) => item.parent);
      const sortedPhases = phases?.sort((a, b) => a.start_date - b.start_date);
      // const sortedP = project?.sort((a, b)=>a.start_date-b.start_date)
      const sortedP = [...(projects || []), ...(sortedPhases || [])];
      setTasks(sortedP || []);
    }
  }, [project]);

  // DELETE FILTER
  const handleDeleteFilter = () => {
    setSearch({
      ...search,
      title: "",
      director: "",
      priority: "Tous",
      criticity: "Tous",
      completionPercentage: "Tous",
      state: "Tous",
      startDate: "",
      endDate: "",
    });

    // setStatusSelectedOptions([]);
    // setResetStatusSelectedOptions(true);
    // setTimeout(() => setResetStatusSelectedOptions(false), 0);

    setSelecteduserInput([]);
    setApplyFilter(false);
    setIsSearchButtonClicked(true);
    setIsLateOnly(false);
  };

  // TO GET THE NUMBER OF PAGE DEPENDING OF THE ENTRIES PER PAGE
  const getPageNumber = (dataLength: number) => {
    return Math.ceil(dataLength / entriesPerPage);
  };

  const indexInPaginationRange = (index: number) => {
    let end = actualPage * entriesPerPage;
    let start = end - entriesPerPage;
    return index >= start && index < end;
  };

  // useEffect(() => {
  //   const newPageNumbers = getPageNumber(totalProjectCount);
  //   setPageNumbers(newPageNumbers);

  //   // Si la page actuelle est au-delà du nombre de pages disponibles, revenir à la dernière page
  //   if (actualPage > newPageNumbers && newPageNumbers > 0) {
  //     setActualPage(newPageNumbers);
  //   } else if (newPageNumbers === 0) {
  //     setActualPage(1); // Si pas de données, revenir à la page 1
  //   }
  // }, [entriesPerPage, totalProjectCount, actualPage]);
  useEffect(() => {
    const newPageNumbers = Math.ceil(
      (filteredProjects?.length ?? 0) / entriesPerPage,
    );
    setPageNumbers(newPageNumbers || 1);
    if (actualPage > newPageNumbers && newPageNumbers > 0) {
      setActualPage(newPageNumbers);
    }
  }, [filteredProjects, entriesPerPage, actualPage]);

  useEffect(() => {
    setActualPage(1);
    setProjectSelected([]);
    setIsAllSelected(false);
  }, [search]);

  // useEffect(() => {
  //   setPage((prev) => ({
  //     ...prev,
  //     pageNumber: actualPage,
  //   }));
  // }, [actualPage]);

  // Fonction pour changer de page avec validation
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pageNumbers) return;

    // Vérifiez s'il y a des données filtrées pour cette page
    const startIndex = (newPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const hasDataForPage = filteredData.slice(startIndex, endIndex).length > 0;

    if (!hasDataForPage && newPage > 1) {
      // Si pas de données sur cette page, chercher la dernière page avec des données
      let lastPageWithData = newPage - 1;
      while (lastPageWithData > 1) {
        const startIdx = (lastPageWithData - 1) * entriesPerPage;
        const endIdx = startIdx + entriesPerPage;
        if (filteredData.slice(startIdx, endIdx).length > 0) {
          break;
        }
        lastPageWithData--;
      }
      setActualPage(lastPageWithData);
    } else {
      setActualPage(newPage);
    }
  };

  const handleSelectAllProject = () => {
    if (data) {
      if (projectSelected.length < data.length) {
        setProjectSelected([]);
        data.map((p) => setProjectSelected((prev) => [...prev, p.id]));
        setIsAllSelected(true);
      } else {
        setProjectSelected([]);
        setIsAllSelected(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSearchButtonClicked(true);
    }
  };

  const handleRemoveUserSelectedInput = (userId: string) => {
    const updatedSelectedUsers = selectedUserInput.filter(
      (user) => user.id !== userId,
    );
    setSelecteduserInput(updatedSelectedUsers);
    setApplyFilter(false);
  };

  // Récupérez tous les chefs au chargement du composant
  useEffect(() => {
    const fetchAllDirectors = async () => {
      try {
        const chefs = await getAllChefsProjet();
        setAllDirectors(chefs);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des chefs de projet:",
          error,
        );
      }
    };

    fetchAllDirectors();
  }, []);

  // Utilisez allDirectors au lieu de directorsFromProjects
  const directorNameToId = useMemo(() => {
    const map = new Map<string, string>();
    allDirectors.forEach((d) => map.set(d.name, d.id));
    return map;
  }, [allDirectors]);

  const selectedDirector = useMemo(() => {
    if (!search.director) return null;
    return allDirectors.find((d) => d.id === search.director) || null;
  }, [search.director, allDirectors]);

  const handleSetSelectedUserInput = (
    value: React.SetStateAction<
      Array<{ id: string; name: string; email: string }>
    >,
  ) => {
    setSelecteduserInput(value);
    setApplyFilter(false);
  };

  return (
    <div className="bg-white  min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
      {/* ===== FILTER START ===== */}
      <div className="flex gap-3 m-5 flex-wrap justify-between items-center">
        <div
          onKeyDown={handleKeyDown}
          className="
            grid 
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-4 w-full
          "
        >
          <CustomInput
            type="text"
            value={search.title}
            label="Titre"
            placeholder="Rechercher"
            rounded="medium"
            onChange={(e) => {
              setSearch({ ...search, title: e.target.value });
              setApplyFilter(false); // <-- add this
            }}
          />

          {/* <CustomSelectChoice
            label="Statut"
            options={[
              "En cours",
              "En retard",
              "Terminé",
              "Stand by",
              "Archivé",
            ]}
            onChange={handleStatusChange}
            rounded="medium"
            resetToAll={resetStatusSelectedOptions}
          /> */}

          {/* <CustomSelect
            label="Statut"
            data={["Tous", "Pas commencé", "En cours", "Términé", "Stand by"]}
            value={search.state}
            onValueChange={(e) => {
              setSearch({
                ...search,
                state: e,
              });
            }}
          /> */}

          <CustomSelect
            label="Priorité"
            data={["Tous", "Elevée", "Moyenne", "Faible"]}
            value={search.priority}
            onValueChange={(e) => {
              setSearch({ ...search, priority: e });
              setApplyFilter(false); // <-- add this
            }}
          />
          <CustomSelect
            label="Criticité"
            data={["Tous", "Urgente", "Normale"]}
            value={search.criticity}
            onValueChange={(e) => {
              setSearch({ ...search, criticity: e });
              setApplyFilter(false); // <-- add this
            }}
          />

          <CustomSelect
            label="Statut"
            data={[
              "Tous",
              "Pas commencé",
              "En cours",
              "Terminé",
              "Stand by",
              "Archivé",
            ]}
            value={search.state}
            onValueChange={(value) => {
              setSearch((prev) => ({ ...prev, state: value }));
              setApplyFilter(false); // <-- add this
            }}
          />

          {/* <CustomSelect
            label="Avancement"
            data={["Tous", "0", "25", "50", "75", "100"]}
            value={search.completionPercentage}
            onValueChange={(e) => {
              setSearch({ ...search, completionPercentage: e });
              setApplyFilter(false); // <-- add this
            }}
          /> */}
          <CustomInputUserSpecifiedSearch
            label="Membre"
            rounded="medium"
            placeholder="Rechercher"
            user={availableUser}
            userSelected={selectedUserInput}
            setUserSelected={handleSetSelectedUserInput} // <-- use wrapper
          />

          <CustomSelect
            label="Chef de projet"
            data={[
              "Tous",
              ...allDirectors
                .map((d) => d.name)
                .sort((a, b) => a.localeCompare(b)), // Tri alphabétique
            ]}
            value={
              search.director
                ? (allDirectors.find((d) => d.id === search.director)?.name ??
                  "Tous")
                : "Tous"
            }
            onValueChange={(selectedName) => {
              if (selectedName === "Tous") {
                setSearch((prev) => ({ ...prev, director: "" }));
              } else {
                const id = directorNameToId.get(selectedName) ?? "";
                setSearch((prev) => ({ ...prev, director: id }));
              }
              setApplyFilter(false); // <-- add this
            }}
          />

          <CustomInput
            type="date"
            value={search.startDate}
            label="Date début"
            rounded="medium"
            onChange={(e) => {
              setSearch({
                ...search,
                startDate: e.target.value,
              });
              setApplyFilter(false);
            }}
          />
          <CustomInput
            type="date"
            value={search.endDate}
            label="Date de fin"
            rounded="medium"
            onChange={(e) => {
              setSearch({
                ...search,
                endDate: e.target.value,
              });
              setApplyFilter(false);
            }}
          />
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="lateProject"
              checked={isLateOnly}
              onChange={(e) => {
                setIsLateOnly(e.target.checked);
                setApplyFilter(false);
              }}
              className="w-4 h-4 accent-red-600 cursor-pointer"
            />
            <label
              htmlFor="lateProject"
              className="text-sm font-medium text-red-600 cursor-pointer"
            >
              En retard
            </label>
          </div>

          <div className="flex items-end gap-2 mx-3">
            <div className="pb-2">
              <button
                onClick={handleDeleteFilter}
                className="flex justify-center whitespace-nowrap text-sm gap-1 h-fit "
              >
                Effacer les filtres
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#00AE5D"
                >
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setApplyFilter(true); //déclenche le filtrage
                  setIsSearchButtonClicked(true);
                }}
                className=" px-2 cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  "
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {selectedUserInput.length > 0 &&
            selectedUserInput?.map((user) => (
              <div key={user.id}>
                <div className="flex mt-2.5 justify-between items-center text-sm border   rounded-md shadow-sm  bg-gray-100 dark:bg-gray-800 transition hover:shadow-md">
                  <span className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300 font-medium">
                    {user?.name}
                  </span>
                  <button
                    className="flex items-center justify-center px-3 py-2 text-red-500 dark:text-red-400 hover:text-white dark:hover:text-whiten hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => handleRemoveUserSelectedInput(user.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

          {/* ===== CHEF DE PROJET SÉLECTIONNÉ ===== */}
          {selectedDirector && (
            <div>
              <div className="flex mt-2.5 justify-between items-center text-sm border rounded-md shadow-sm bg-blue-100 dark:bg-blue-900 transition hover:shadow-md">
                <span className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-blue-800 dark:text-blue-200 font-medium">
                  {selectedDirector.name}
                </span>
                <button
                  className="flex items-center justify-center px-3 py-2 text-red-500 hover:text-white hover:bg-red-500 transition rounded-r-md focus:outline-none"
                  onClick={() => {
                    setSearch((prev) => ({ ...prev, director: "" }));
                    setApplyFilter(false);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ===== FILTER END ===== */}
      <div className="flex gap-4 pl-4">
        {/* TABLE */}
        <button
          onClick={() => setViewMode("table")}
          className={`flex items-center px-4 py-2 rounded-lg transition
      ${
        viewMode === "table"
          ? "bg-primaryGreen dark:bg-darkgreen"
          : "bg-slate-600 hover:bg-slate-700"
      }
    `}
        >
          <Table className="text-white" size={20} />
        </button>

        {/* GANTT */}
        <button
          onClick={() => setViewMode("gantt")}
          className={`flex items-center px-4 py-2 rounded-lg transition
      ${
        viewMode === "gantt"
          ? "bg-primaryGreen dark:bg-darkgreen"
          : "bg-slate-600 hover:bg-slate-700"
      }
    `}
        >
          <Calendar className="text-white" size={20} />
        </button>

        {/* CARD */}
        <button
          onClick={() => setViewMode("card")}
          className={`flex items-center px-4 py-2 rounded-lg transition
      ${
        viewMode === "card"
          ? "bg-primaryGreen dark:bg-darkgreen"
          : "bg-slate-600 hover:bg-slate-700"
      }
    `}
        >
          {/* icône grille */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
          </svg>
        </button>
      </div>

      {/* =====PAGINATE AND TITLE START===== */}
      <div
        className={`pb-4 items-center flex justify-between px-3 transition-opacity ${
          isAllSelected || projectSelected.length > 0
            ? "opacity-0"
            : "opacity-100"
        }`}
      >
        <button
          disabled={actualPage === 1}
          className="rotate-180"
          onClick={() => handlePageChange(actualPage - 1)}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              className={` ${
                actualPage === 1 ? "stroke-slate-400" : "stroke-black"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="text-xl text-center text-title font-semibold dark:text-whiten">
          Liste de tous les projets
          {/* Désactivé - Affichage du compteur non nécessaire
          <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            {filteredProjectCount} / {data?.length ?? 0} projets
          </span>*/}
        </div>

        <button
          disabled={actualPage === pageNumbers}
          onClick={() =>
            setActualPage((prev) => Math.min(prev + 1, pageNumbers))
          }
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              className={` ${
                actualPage === pageNumbers ? "stroke-slate-400" : "stroke-black"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {/* =====PAGINATE AND TITLE END===== */}
      {/* ===== BULK START ===== */}
      {projectSelected.length !== 1 && (
        <div
          className={` mt-[-60px] border-primaryGreen border dark:border-formStrokedark  bg-white dark:bg-boxdark z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
            projectSelected.length > 0
              ? "scale-y-100 opacity-100"
              : "scale-y-0 opacity-0"
          }`}
        >
          {projectSelected.length !== 1 && (
            <div>
              {projectSelected.length === 1
                ? "1 élément sélectionné"
                : `${projectSelected.length} éléments sélectionnés`}
            </div>
          )}

          <div>
            {/* debut */}
            {projectSelected.length > 1 ? (
              <button
                onClick={() => {
                  setProjectsToDelete(projectSelected);
                  setShowModalDelete(true);
                }}
                className="mb-1 mt-1 min-w-20 w-full text-sm py-2.5 px-3 md:h-10 border flex items-center justify-between border-stroke dark:border-formStrokedark rounded-lg  text-left text-black "
              >
                Archiver
              </button>
            ) : (
              <CustomSelect
                data={
                  projectSelected.length > 1
                    ? ["Archiver"].filter((action) => {
                        if (
                          myHabilitation?.project.delete === false &&
                          action === "Archiver"
                        ) {
                          return false;
                        }
                        return true;
                      })
                    : []
                }
                className={`mb-2 ${projectSelected.length < 2 ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Actions"
                disabled={projectSelected.length < 1}
                onValueChange={(e) => {
                  if (e.includes("Modifier")) {
                    setProjectToModif(projectSelected);
                  } else if (e.includes("Archiver")) {
                    setProjectsToDelete(projectSelected);
                    setShowModalDelete(true);
                  } else if (e.includes("Détails")) {
                    setProjectsSelected(projectSelected);
                    setGoToDetails(true);
                  } else if (e.includes("Historique")) {
                    setProjectsSelected(projectSelected);
                    setGoToHistoric(true);
                  }
                  //  else if (e.includes("Avancement")) {
                  //   setProjectsSelected(projectSelected);
                  //   setGoToAdvancement(true);
                  // }
                  else if (e.includes("Gérer")) {
                    setProjectsSelected(projectSelected);
                    setGoToTask(true);
                  }
                }}
              />
            )}
          </div>

          {/* fin */}
        </div>
      )}
      {/* ===== BULK END ===== */}
      {/* =====TABLE START===== */}
      {viewMode === "table" && (
        <div className="max-w-full mb-4 overflow-x-auto ">
          <table className="w-full text-sm hidden md:table table-auto">
            {/* ===== TABLE HEAD START ===== */}
            <thead className="pt-5 rounded-t-xl bg-primaryGreen dark:bg-darkgreen">
              <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
                <th className="pl-2">
                  <button
                    onClick={handleSelectAllProject}
                    className="cursor-pointer border w-5 h-5"
                  >
                    <svg
                      width="18"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${
                        projectSelected.length === data?.length
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      <path
                        d="M4 12.6111L8.92308 17.5L20 6.5"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </th>

                {/* Code Projet */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Code Projet</span>
                    <button
                      className="transform transition-transform duration-200"
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          title: 0,
                          startDate: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          priority: 0,
                          codeProjet:
                            dataSorted.codeProjet < 2
                              ? dataSorted.codeProjet + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        viewBox="0 0 425 425"
                      >
                        <g>
                          <polygon
                            className={`${
                              (dataSorted.codeProjet ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.codeProjet ?? 0) === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5"
                          />
                          <polygon
                            className={`${
                              (dataSorted.codeProjet ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.codeProjet ?? 0) === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>

                {/* Titre */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Titre</span>
                    <button
                      className="transform transition-transform duration-200"
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          startDate: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          priority: 0,
                          title:
                            dataSorted.title < 2 ? dataSorted.title + 1 : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        viewBox="0 0 425 425"
                      >
                        <g>
                          <polygon
                            className={`${
                              (dataSorted.title ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.title ?? 0) === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5"
                          />
                          <polygon
                            className={`${
                              (dataSorted.title ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.title ?? 0) === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>

                {/* Priorité */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Priorité</span>
                    <button
                      className="transform transition-transform duration-200"
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          startDate: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          title: 0,
                          priority:
                            dataSorted.priority < 2
                              ? dataSorted.priority + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        viewBox="0 0 425 425"
                      >
                        <g>
                          <polygon
                            className={`${
                              (dataSorted.priority ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.priority ?? 0) === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5"
                          />
                          <polygon
                            className={`${
                              (dataSorted.priority ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.priority ?? 0) === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>

                {/* Criticité */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Criticité</span>
                    <button
                      className="transform transition-transform duration-200"
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          startDate: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          priority: 0,
                          title: 0,
                          criticality:
                            dataSorted.criticality < 2
                              ? dataSorted.criticality + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        viewBox="0 0 425 425"
                      >
                        <g>
                          <polygon
                            className={`${
                              (dataSorted.criticality ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.criticality ?? 0) === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5"
                          />
                          <polygon
                            className={`${
                              (dataSorted.criticality ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.criticality ?? 0) === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>

                {/* Statut */}
                <th className="py-4 px-4 font-bold text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Statut</span>
                    <button
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          title: 0,
                          codeProjet: 0,
                          startDate: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          priority: 0,
                          criticality: 0,
                          state:
                            dataSorted.state < 2 ? dataSorted.state + 1 : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        viewBox="0 0 425 425"
                      >
                        <polygon
                          className={`${
                            (dataSorted.state ?? 0) === 0
                              ? "fill-white"
                              : (dataSorted.state ?? 0) === 1
                                ? "fill-black"
                                : "fill-primaryGreen dark:fill-darkgreen"
                          }`}
                          points="212.5,0 19.371,192.5 405.629,192.5"
                        />
                        <polygon
                          className={`${
                            (dataSorted.state ?? 0) === 0
                              ? "fill-white"
                              : (dataSorted.state ?? 0) === 1
                                ? "fill-primaryGreen dark:fill-darkgreen"
                                : "fill-black"
                          }`}
                          points="212.5,425 405.629,232.5 19.371,232.5"
                        />
                      </svg>
                    </button>
                  </div>
                </th>

                {/* CDP */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center">
                    <span>CDP</span>
                  </div>
                </th>

                {/* Équipes */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center">
                    <span>Équipes</span>
                  </div>
                </th>

                {/* Date début */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Date début</span>
                    <button
                      className="transform transition-transform duration-200"
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          title: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          priority: 0,
                          startDate:
                            dataSorted.startDate < 2
                              ? dataSorted.startDate + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        viewBox="0 0 425 425"
                      >
                        <g>
                          <polygon
                            className={`${
                              (dataSorted.startDate ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.startDate ?? 0) === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5"
                          />
                          <polygon
                            className={`${
                              (dataSorted.startDate ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.startDate ?? 0) === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>

                {/* Date de fin */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Date de fin</span>
                    <button
                      className="transform transition-transform duration-200"
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          title: 0,
                          startDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          priority: 0,
                          endDate:
                            dataSorted.endDate < 2 ? dataSorted.endDate + 1 : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        viewBox="0 0 425 425"
                      >
                        <g>
                          <polygon
                            className={`${
                              (dataSorted.endDate ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.endDate ?? 0) === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5"
                          />
                          <polygon
                            className={`${
                              (dataSorted.endDate ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.endDate ?? 0) === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>

                {/* Avancement */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Avancement</span>
                    <button
                      className="transform transition-transform duration-200"
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          title: 0,
                          startDate: 0,
                          endDate: 0,
                          criticality: 0,
                          priority: 0,
                          completionPercentage:
                            dataSorted.completionPercentage < 2
                              ? dataSorted.completionPercentage + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        viewBox="0 0 425 425"
                      >
                        <g>
                          <polygon
                            className={`${
                              (dataSorted.completionPercentage ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.completionPercentage ?? 0) === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                            }`}
                            points="212.5,0 19.371,192.5 405.629,192.5"
                          />
                          <polygon
                            className={`${
                              (dataSorted.completionPercentage ?? 0) === 0
                                ? "fill-white"
                                : (dataSorted.completionPercentage ?? 0) === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                            }`}
                            points="212.5,425 405.629,232.5 19.371,232.5"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>

                {/* Actions */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            {/* ===== TABLE HEAD END ===== */}
            {/* ===== TABLE BODY START ===== */}
            <tbody>
              {!data ? (
                <tr>
                  <td colSpan={9} className="py-9 content-center">
                    <div className="flex justify-center items-center">
                      <SyncLoader size={18} color={"teal"} />
                    </div>
                  </td>
                </tr>
              ) : data?.length === 0 ? (
                <tr className="hover:bg-whiten dark:hover:bg-boxdark2">
                  <td colSpan={9} className="py-9 content-center ">
                    <div className="flex justify-center items-center">
                      Pas de projet
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProjects?.map((project) => {
                  const dateStart = project?.startDate
                    ? formatDate(project.startDate)
                    : "--";

                  const dateEnd = project?.endDate
                    ? formatDate(project.endDate)
                    : "--";

                  const today = new Date();

                  const dateEndCheck = project?.endDate
                    ? new Date(project.endDate)
                    : null;

                  const isDateEndPassed =
                    dateEndCheck !== null &&
                    dateEndCheck < today &&
                    project?.completionPercentage !== 100 &&
                    dateEnd !== "--";

                  return (
                    <tr
                      key={project?.id}
                      className={`  ${
                        isDateEndPassed
                          ? "bg-red-100 hover:bg-red-50 dark:bg-red-300 dark:hover:bg-red-200  "
                          : "hover:bg-whiten dark:hover:bg-boxdark2"
                      }`}
                    >
                      <td className="pl-2 border-b border-[#eee]">
                        <button
                          className="cursor-pointer border w-5 h-5"
                          onClick={() => {
                            setProjectSelected((prev) => {
                              if (prev?.includes(project.id)) {
                                return prev.filter((id) => id !== project.id);
                              } else {
                                return [...prev, project.id];
                              }
                            });
                          }}
                        >
                          <svg
                            width="18"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`${
                              projectSelected.includes(project.id)
                                ? "visible"
                                : "invisible"
                            }`}
                          >
                            <path
                              d="M4 12.6111L8.92308 17.5L20 6.5"
                              className="stroke-black-2 dark:stroke-whiten"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className="border-b max-w-90 min-w-50 border-[#eee] pl-9 py-5 dark:border-strokedark cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className="text-black text-justify  dark:text-white font-bold "
                        >
                          {project?.codeProjet}
                        </Link>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-3 dark:border-strokedark cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className="text-black dark:text-white font-semibold leading-tight line-clamp-3"
                          title={project.title} // Shows full title on hover
                        >
                          {project.title}
                        </Link>
                      </td>
                      {/*<td className="border-b border-[#eee] px-4 py-3 dark:border-strokedark cursor-pointer">
                         <p className="text-black text-justify  dark:text-white font-bold ">
                            {project?.title}
                            {/* {project?.title.length > 40
                            ? `${project?.title?.slice(0, 40)}...`
                            : project?.title} */}
                      {/* </p> */}
                      {/* <Link
                        to={`/gmp/project/details/${project.id}/details`}
                        className="text-black dark:text-white font-semibold leading-tight whitespace-normal"
                      >
                        {project.title}
                      </Link> */}
                      {/* <p className="text-black dark:text-white font-semibold leading-tight whitespace-normal">
                            {project?.title}
                          </p> 
                      </td>*/}
                      {/* <td
                          className="border-b max-w-90 min-w-50 border-[#eee] pl-9  py-5 dark:border-strokedark cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <p className="text-black text-justify  dark:text-white font-bold "> */}
                      {/* {project?.state} */}
                      {/* {project?.title.length > 40
                            ? `${project?.title?.slice(0, 40)}...`
                            : project?.title} */}
                      {/* </p>
                        </td> */}
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className={`  font-semibold rounded-md  text-center py-1 px-2 text-xs  w-fit
                            ${
                              project?.priority === "Moyenne"
                                ? "bg-amber-100 border text-amber-600 border-amber-300 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700 "
                                : project?.priority === "Faible"
                                  ? "bg-cyan-100 border text-cyan-600 border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700 "
                                  : project?.priority === "Elevée"
                                    ? "bg-red-100 border text-red-600 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700 "
                                    : ""
                            }
                            `}
                        >
                          {project?.priority}
                        </Link>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className={` font-semibold rounded-md whitespace-nowrap text-center py-1 px-2 text-xs  w-fit
                            ${
                              project?.criticality === "Urgente"
                                ? "bg-amber-100 border text-amber-600 border-amber-300 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700"
                                : "bg-cyan-100 border text-cyan-600 border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700 "
                            }
                            `}
                        >
                          {project?.criticality}
                        </Link>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className={`font-semibold rounded-md whitespace-nowrap text-center py-1 px-2 text-xs w-fit
                              ${
                                getFrenchState(project?.state) ===
                                "Pas commencé"
                                  ? "bg-cyan-100 text-cyan-600 border border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300"
                                  : getFrenchState(project?.state) ===
                                      "En cours"
                                    ? "bg-amber-100 text-amber-600 border border-amber-300 dark:bg-amber-900 dark:text-amber-300"
                                    : getFrenchState(project?.state) ===
                                        "Terminé"
                                      ? "bg-green-100 text-green-600 border border-green-300 dark:bg-green-900 dark:text-green-300"
                                      : getFrenchState(project?.state) ===
                                          "Stand by"
                                        ? "bg-orange-100 text-orange-600 border border-orange-300 dark:bg-orange-900 dark:text-orange-300"
                                        : "bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-300"
                              }
                            `}
                        >
                          {getFrenchState(project?.state)}
                        </Link>
                      </td>

                      {/* <td
                          className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer"
                          onClick={() => setIdProjectForDetails(project.id)}
                        >
                          <p
                            className={`
                              font-semibold rounded-md whitespace-nowrap text-center py-1 px-2 text-xs w-fit
                              ${
                                getFrenchState(project?.state) === "Pas commencé"
                                  ? "bg-cyan-100 text-cyan-600 border border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700"
                                : getFrenchState(project?.state) === "En cours"
                                  ? "bg-amber-100 text-amber-600 border border-amber-300 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700"
                                : getFrenchState(project?.state) === "Terminé"
                                  ? "bg-green-100 text-green-600 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                                : getFrenchState(project?.state) === "Stand by"
                                  ? "bg-red-100 text-red-600 border border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                                : "bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                              }
                            `}
                          >
                            {getFrenchState(project?.state)}
                          </p>
                        </td> */}
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        {(() => {
                          const director = project?.listUsers?.find(
                            (u: any) => u.role === "director",
                          );

                          if (!director) {
                            return (
                              <span className="text-xs italic text-slate-400">
                                Non défini
                              </span>
                            );
                          }

                          return (
                            <Link
                              to={`/gmp/project/details/${project.id}/details`}
                              className="flex flex-col gap-1"
                            >
                              {/* ===== DÉPARTEMENT ===== */}
                              {director.user?.department && (
                                <span
                                  className="
                                      w-fit
                                      px-2 py-0.5
                                      text-[10px] font-medium
                                      rounded-full
                                      bg-blue-100 text-blue-700
                                      border border-blue-200
                                      dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700
                                    "
                                >
                                  {typeof director.user.department === "string"
                                    ? director.user.department
                                    : director.user.department.name}
                                </span>
                              )}
                              {/* ===== NOM COMPLET ===== */}
                              <span className="text-sm font-semibold text-slate-800 dark:text-white">
                                {director.user?.name?.split("(")?.[0]}
                              </span>
                            </Link>
                          );
                        })()}
                      </td>

                      <td className="border-b  gap-1 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className="flex flex-wrap gap-2"
                        >
                          <ListUsers
                            data={project?.listUsers}
                            type="no-director"
                          />
                        </Link>
                      </td>
                      <td className="border-b    border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className="text-black  pr-4 dark:text-white"
                        >
                          {dateStart}
                        </Link>
                      </td>
                      <td className="border-b  border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className="text-black flex  pr-4 gap-1 dark:text-white"
                        >
                          {isDateEndPassed ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 64 64"
                              aria-hidden="true"
                              preserveAspectRatio="xMidYMid meet"
                              fill="#000000"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <g fill="#ff002f">
                                  {" "}
                                  <path d="M23 42.4H13L9 2h18z"> </path>{" "}
                                  <ellipse cx="18" cy="54.4" rx="7.7" ry="7.6">
                                    {" "}
                                  </ellipse>{" "}
                                  <path d="M51 42.4H41L37 2h18z"> </path>{" "}
                                  <ellipse cx="46" cy="54.4" rx="7.7" ry="7.6">
                                    {" "}
                                  </ellipse>{" "}
                                </g>{" "}
                              </g>
                            </svg>
                          ) : null}

                          {dateEnd}
                        </Link>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        <Link
                          to={`/gmp/project/details/${project.id}/details`}
                          className="flex items-center justify-center"
                        >
                          {project?.state === "Stand by" ? (
                            // Cercle spécial "Stand by"
                            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[length:14px_14px] bg-[repeating-linear-gradient(45deg,#FFCD59_0,#FFCD59_3px,transparent_3px,transparent_5px)]">
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black dark:text-white dark:bg-black/40 rounded-full">
                                {project?.state}
                              </span>
                            </div>
                          ) : (
                            // Cercle de progression normal
                            <div className="relative w-16 h-16">
                              <svg className="w-16 h-16 -rotate-90">
                                {/* cercle de fond */}
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="#e5e7eb" // gris clair
                                  strokeWidth="6"
                                  fill="none"
                                />
                                {/* cercle de progression */}
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke={
                                    project?.completionPercentage === 0
                                      ? "#ef4444" // rouge
                                      : project?.completionPercentage === 25
                                        ? "#f97316" // orange
                                        : project?.completionPercentage === 50
                                          ? "#eab308" // jaune
                                          : project?.completionPercentage === 75
                                            ? "#84cc16" // vert clair
                                            : "#22c55e" // vert
                                  }
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={2 * Math.PI * 28}
                                  strokeDashoffset={
                                    (1 -
                                      (project?.completionPercentage ?? 0) /
                                        100) *
                                    (2 * Math.PI * 28)
                                  }
                                  strokeLinecap="round"
                                />
                              </svg>
                              {/* texte au centre */}
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black dark:text-white">
                                {project?.completionPercentage}%
                              </span>
                            </div>
                          )}
                        </Link>
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                        <div>
                          <PointSelect
                            data={[
                              "Modifier",
                              //"Avancement",
                              "Gérer",
                              "Historique",
                              "Archiver",
                            ].filter((action) => {
                              if (
                                myHabilitation?.project.delete === false &&
                                action === "Archiver"
                              ) {
                                return false;
                              }
                              if (
                                myHabilitation?.project.update === false &&
                                action === "Modifier"
                              ) {
                                return false;
                              }
                              // only chef de project can change avancement
                              // if (action === "Avancement") {
                              //   const selectedProject = data?.find(
                              //     (p) => p.id === project.id,
                              //   );
                              //   const isDirector =
                              //     selectedProject?.listUsers.some(
                              //       (userObj: {
                              //         userid: string | undefined;
                              //         role: string;
                              //       }) =>
                              //         userObj.userid === decodedToken?.jti &&
                              //         userObj.role === "director",
                              //     );
                              //   return isDirector;
                              // }
                              return true;
                            })}
                            className="w-13"
                            placeholder=""
                            onClick={() => {
                              setProjectSelected([project.id]);
                            }}
                            onValueChange={(e) => {
                              if (e.includes("Modifier")) {
                                setProjectToModif([project.id]);
                              } else if (e.includes("Archiver")) {
                                setProjectsToDelete([project.id]);
                                setShowModalDelete(true);
                              } else if (e.includes("Historique")) {
                                setProjectsSelected([project.id]);
                                setGoToHistoric(true);
                              }
                              // else if (e.includes("Avancement")) {
                              //   setProjectsSelected([project.id]);
                              //   setGoToAdvancement(true);
                              // }
                              else if (e.includes("Gérer")) {
                                setProjectsSelected([project.id]);
                                setGoToTask(true);
                              }
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* ===== TABLE BODY END ===== */}
          </table>

          {/* Mobile view */}
          <div className="block md:hidden">
            {paginatedProjects?.map((project) => {
              const dateStart = project?.startDate
                ? formatDate(project.startDate)
                : "--";

              const dateEnd = project?.endDate
                ? formatDate(project.endDate)
                : "--";

              const today = new Date();

              const dateEndCheck = project?.endDate
                ? new Date(project.endDate)
                : null;

              const isDateEndPassed =
                dateEndCheck !== null &&
                dateEndCheck < today &&
                project?.completionPercentage !== 100 &&
                dateEnd !== "--";

              return (
                <div
                  key={project?.id}
                  className={` *:grid *:grid-cols-2  shadow-lg rounded-lg mb-4 p-4 border border-zinc-200 dark:border-black ${
                    isDateEndPassed
                      ? "bg-red-100 dark:bg-red-200 text-black"
                      : "bg-white dark:bg-boxdark"
                  }`}
                >
                  <div className="">
                    <button
                      className="relative  cursor-pointer border w-5 h-5"
                      onClick={() => {
                        setProjectSelected((prev) => {
                          if (prev?.includes(project.id)) {
                            return prev.filter((id) => id !== project.id);
                          } else {
                            return [...prev, project.id];
                          }
                        });
                      }}
                    >
                      <svg
                        width="18"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${
                          projectSelected.includes(project.id)
                            ? "visible"
                            : "invisible"
                        }`}
                      >
                        <path
                          d="M4 12.6111L8.92308 17.5L20 6.5"
                          className="stroke-black-2 dark:stroke-whiten"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Titre :{" "}
                    </span>
                    <span className="text-gray-800">
                      <p
                        className="text-black dark:text-white font-bold cursor-pointer"
                        onClick={() => {
                          setIdProjectForDetails(project.id);
                        }}
                      >
                        {project?.title.length > 30
                          ? `${project?.title?.slice(0, 30)}...`
                          : project?.title}
                      </p>
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Priorité :{" "}
                    </span>
                    <span className="text-gray-800">{project?.priority}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Criticité :{" "}
                    </span>
                    <span className="text-gray-800">
                      {project?.criticality}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Statut :{" "}
                    </span>
                    <span className="text-gray-800">
                      {getFrenchState(project?.state)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      CDP :{" "}
                    </span>
                    <span className="text-gray-800">
                      <ListUsers data={project?.listUsers} type="director" />
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Équipe :{" "}
                    </span>
                    <span className="text-gray-800">
                      <ListUsers data={project?.listUsers} type="no-director" />
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Date début :{" "}
                    </span>
                    <span className="text-gray-800">{dateStart}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Date fin :{" "}
                    </span>
                    <span className=" flex gap-1 text-gray-800">
                      {isDateEndPassed ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 64 64"
                          aria-hidden="true"
                          preserveAspectRatio="xMidYMid meet"
                          fill="#000000"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <g fill="#ff002f">
                              {" "}
                              <path d="M23 42.4H13L9 2h18z"> </path>{" "}
                              <ellipse cx="18" cy="54.4" rx="7.7" ry="7.6">
                                {" "}
                              </ellipse>{" "}
                              <path d="M51 42.4H41L37 2h18z"> </path>{" "}
                              <ellipse cx="46" cy="54.4" rx="7.7" ry="7.6">
                                {" "}
                              </ellipse>{" "}
                            </g>{" "}
                          </g>
                        </svg>
                      ) : null}
                      {dateEnd}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Avancement :{" "}
                    </span>
                    <div className="w-full bg-zinc-100 rounded-full dark:bg-strokedark h-6 relative">
                      <div
                        className="bg-primaryGreen h-6 rounded-full"
                        style={{
                          width: `${project?.completionPercentage}%`,
                        }}
                      ></div>
                      <span className="absolute inset-0 flex justify-center items-center text-black dark:text-white text-xs font-semibold">
                        {project?.completionPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "gantt" && <GanttChart tasks={tasks} />}

      {viewMode === "card" && (
        <div
          className="
      grid gap-6 p-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    "
        >
          {paginatedProjects.map((project) => {
            const director = project?.listUsers?.find(
              (u: any) => u.role === "director",
            );

            const members =
              project?.listUsers?.filter((u: any) => u.role !== "director") ||
              [];

            const dateEndCheck = project?.endDate
              ? new Date(project.endDate)
              : null;

            const isLate =
              dateEndCheck !== null &&
              dateEndCheck < new Date() &&
              project?.completionPercentage !== 100;

            return (
              <div
                key={project.id}
                onClick={() =>
                  setIdProjectForDetails(project.id) || setGoToDetails(true)
                }
                className={`
            cursor-pointer rounded-xl border p-4 shadow-md transition
            hover:shadow-lg
            ${
              isLate
                ? "bg-red-100 border-red-300"
                : "bg-white border-zinc-200 dark:bg-boxdark dark:border-strokedark"
            }
          `}
              >
                {/* ================= HEADER ================= */}
                {/* ================= HEADER ================= */}
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-gray-600">
                    {project.codeProjet}
                  </span>

                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()} // empêche la redirection
                  >
                    {/* STATUT */}
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-md mr-2
                  ${
                    getFrenchState(project.state) === "En cours"
                      ? "bg-amber-100 text-amber-600 border border-amber-300"
                      : getFrenchState(project.state) === "Terminé"
                        ? "bg-green-100 text-green-600 border border-green-300"
                        : getFrenchState(project.state) === "Stand by"
                          ? "bg-orange-100 text-orange-600 border border-orange-300"
                          : "bg-cyan-100 text-cyan-600 border border-cyan-300"
                  }
                `}
                    >
                      {getFrenchState(project.state)}
                    </span>

                    {/* BOUTON ⋮ */}
                    <button
                      onClick={() =>
                        setOpenMenuProjectId(
                          openMenuProjectId === project.id ? null : project.id,
                        )
                      }
                      className="inline-flex items-center p-1 rounded hover:bg-zinc-200"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="12" cy="5" r="2" fill="currentColor" />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                        <circle cx="12" cy="19" r="2" fill="currentColor" />
                      </svg>
                    </button>

                    {/* MENU ACTION → visible UNIQUEMENT si ⋮ cliqué */}
                    {openMenuProjectId === project.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-20">
                        <button
                          onClick={() => {
                            setProjectsToDelete([project.id]);
                            setShowModalDelete(true);
                            setOpenMenuProjectId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Archiver
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= TITLE + PROGRESS ================= */}
                <div className="flex justify-between items-center gap-3">
                  <h3 className="font-semibold text-sm text-black dark:text-white line-clamp-2">
                    {project.title}
                  </h3>

                  <div className="relative w-14 h-14 mt-3 shrink-0">
                    <svg className="w-14 h-14 -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#e5e7eb"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke={
                          (project.completionPercentage ?? 0 >= 75)
                            ? "#22c55e"
                            : (project.completionPercentage ?? 0 >= 50)
                              ? "#eab308"
                              : "#f97316"
                        }
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 24}
                        strokeDashoffset={
                          (1 - (project.completionPercentage ?? 0) / 100) *
                          (2 * Math.PI * 24)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {project.completionPercentage}%
                    </span>
                  </div>
                </div>

                {/* ================= PRIORITÉ / CRITICITÉ ================= */}
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-md
                ${
                  project.priority === "Moyenne"
                    ? "bg-amber-100 text-amber-600 border border-amber-300"
                    : project.priority === "Faible"
                      ? "bg-cyan-100 text-cyan-600 border border-cyan-300"
                      : "bg-red-100 text-red-600 border border-red-300"
                }
              `}
                  >
                    {project.priority}
                  </span>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-md
                ${
                  project.criticality === "Urgente"
                    ? "bg-amber-100 text-amber-600 border border-amber-300"
                    : "bg-cyan-100 text-cyan-600 border border-cyan-300"
                }
              `}
                  >
                    {project.criticality}
                  </span>
                </div>
                {/* ================= CHEF DE PROJET ================= */}
                <div className="mt-3 text-sm flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-black dark:text-white">
                    {director?.user?.name?.split("(")[0] || "Non défini"}
                  </p>

                  {director?.user?.department && (
                    <span
                      className="
                px-2 py-0.5
                text-xs font-medium
                rounded-full
                bg-blue-100 text-blue-700
                dark:bg-blue-900 dark:text-blue-200
                whitespace-nowrap
              "
                    >
                      {typeof director.user.department === "string"
                        ? director.user.department
                        : director.user.department.name}
                    </span>
                  )}
                </div>

                {/* ================= MEMBRES ================= */}
                <div className="flex items-center mt-2 relative">
                  {/* ===== MEMBRES AFFICHÉS (MAX 3) ===== */}
                  {members.slice(0, 3).map((m: any, idx: number) => {
                    const initials = m.user?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2);

                    const isObserver = m.role === "observer";

                    return (
                      <div
                        key={m.userid}
                        className="relative group"
                        style={{ marginLeft: idx === 0 ? 0 : -8 }}
                      >
                        {/* AVATAR */}
                        <div
                          className={`
            w-8 h-8 rounded-full
            flex items-center justify-center
            text-xs font-bold text-white
            border-2 border-white
            cursor-pointer
            ${isObserver ? "bg-yellow-500" : "bg-emerald-600"}
          `}
                        >
                          {initials}
                        </div>

                        {/* TOOLTIP */}
                        <div
                          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            hidden group-hover:flex
            flex-col items-center gap-1
            bg-white text-black
            text-xs px-3 py-2
            rounded-md shadow-xl
            
            whitespace-nowrap
            z-50
          "
                        >
                          {/* NOM */}
                          <span className="font-semibold text-gray-900">
                            {m.user?.name}
                          </span>

                          {/* TAG ROLE */}
                          {/* <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
              ${
                isObserver
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  : "bg-blue-100 text-blue-700 border border-blue-300"
              }
            `}
          >
            {isObserver ? "Observateur" : "Membre"}
          </span> */}

                          {/* FLÈCHE */}
                          <div
                            className="
              absolute top-full
              w-2 h-2
              bg-white
              border-r border-b border-gray-200
              rotate-45
            "
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* ===== +X AUTRES MEMBRES ===== */}
                  {members.length > 3 && (
                    <div className="relative group" style={{ marginLeft: -8 }}>
                      {/* AVATAR +X */}
                      <div
                        className="
          w-8 h-8 rounded-full
          bg-emerald-600 text-white
          flex items-center justify-center
          text-xs font-bold
          border-2 border-white
          cursor-pointer
        "
                      >
                        +{members.length - 3}
                      </div>

                      {/* TOOLTIP DES AUTRES */}
                      <div
                        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          hidden group-hover:flex
          flex-col gap-2
          bg-white text-black
          text-xs px-3 py-2
          rounded-md shadow-xl
          border border-gray-200
          whitespace-nowrap
          z-50
        "
                      >
                        {members.slice(3).map((m: any) => {
                          //const isObserver = m.role === "observer";

                          return (
                            <div
                              key={m.userid}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="font-medium text-gray-900">
                                {m.user?.name}
                              </span>

                              {/* <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                  ${
                    isObserver
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-blue-100 text-blue-700 border border-blue-300"
                  }
                `}
              >
                {isObserver ? "Observateur" : "Membre"}
              </span> */}
                            </div>
                          );
                        })}

                        {/* FLÈCHE */}
                        <div
                          className="
            absolute top-full left-1/2 -translate-x-1/2
            w-2 h-2
            bg-white
            border-r border-b border-gray-200
            rotate-45
          "
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ================= DATES ================= */}
                <div className="mt-3 flex justify-between text-xs text-gray-600">
                  <span>
                    Début :{" "}
                    {project.startDate ? formatDate(project.startDate) : "--"}
                  </span>
                  <span className={isLate ? "text-red-600 font-semibold" : ""}>
                    {isLate && " !! "}
                    Fin : {project.endDate ? formatDate(project.endDate) : "--"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====PAGINATE START===== */}
      <div className="flex flex-col flex-wrap md:flex-row justify-end px-4 items-center">
        {/* <PerPageInput
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          setPage={setPage}
        /> */}
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm">Afficher</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setActualPage(1);
            }}
            className="border rounded px-2 py-1 text-sm dark:bg-boxdark dark:border-strokedark"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm">entrées</span>
        </div>
        <Pagination
          actualPage={actualPage}
          setActualPage={setActualPage}
          pageNumbers={pageNumbers}
        />
      </div>
      {/* =====PAGINATE END===== */}
      {/* =====TABLE END===== */}
    </div>
  );
};

export default TableProjet;
