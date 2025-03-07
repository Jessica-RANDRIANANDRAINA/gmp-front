import { useState, useEffect, useCallback } from "react";
import ProjectLayout from "../../layout/ProjectLayout";
import { IActivityStat } from "../../types/Project";
import { decodeToken } from "../../services/Function/TokenService";
import CardDropDown from "../../components/card/CardDropDown";
import StackedColumn from "../../components/chart/StackedColumn";
import DonutCharts from "../../components/chart/DonutCharts";
import {
  getActivitiesStat,
  getActivitiesStatInAYear,
  getActivitiesPercentage,
  getProjectStat,
} from "../../services/Project";
import {
  CustomInput,
  CustomInputUserSpecifiedSearch,
} from "../../components/UIElements";
import { getMySubordinatesNameAndId } from "../../services/User";
import { formatDate } from "../../services/Function/DateServices";
import ProjectStatsCard from "../../components/card/ProjectStatsCard";


type TSubordinate = {
  id: string;
  name: string;
  email: string;
};
type Project = {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  title: string;
};
type StatsProjectData = {
  enCours: { count: number; projects: Project[] };
  archived: { count: number; projects: Project[] };
  standBy: { count: number; projects: Project[] };
  initiés: { count: number; projects: Project[] };
  enRetard: { count: number; projects: Project[] };
};

const Home = () => {
  const [statActivities, setStatActivities] = useState<IActivityStat>();
  const [chartData, setChartData] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [dataPercentage, setDataPercentage] = useState({
    Tasks: 0,
    Transverses: 0,
    Intercontrat: 0,
  });

  const [search, setSearch] = useState({
    ids: [] as string[],
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  const [selectedUserInput, setSelectedUserInput] = useState<TSubordinate[]>(
    []
  );
  const [subordinates, setSubordinates] = useState<TSubordinate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [statsProject, setStatsProject] = useState<StatsProjectData | null>(
    null
  );
  
  const categories = ["Projets", "Transverses", "Intercontrats"];

  // Transform API data for chart format
  const transformDataForChart = useCallback(
    (data: { month: number; type: string; totalEffort: number }[]) => {
      const categories = ["Projet", "Transverse", "Intercontrat"];
      const groupedData: Record<string, number[]> = {};

      // Initialize data structure
      categories.forEach((category) => {
        groupedData[category] = Array(12).fill(0);
      });

      // Fill with actual data
      data.forEach(({ month, type, totalEffort }) => {
        const index = month - 1;
        if (groupedData[type]) {
          groupedData[type][index] = totalEffort;
        }
      });

      // Return in format needed by chart component
      return categories.map((category) => ({
        name: category,
        data: groupedData[category],
      }));
    },
    []
  );

  // Initialize the component - only runs once
  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true);
      try {
        // Get token information
        const token = localStorage.getItem("_au_pr");
        if (!token) {
          console.error("No token found");
          return;
        }

        const decoded = decodeToken("pr");

        if (!decoded?.jti) {
          console.error("Invalid token: no JTI found");
          return;
        }

        // Fetch subordinates data
        const myId = decoded.jti;
        // const myId = "c894ab8a-7e91-41c9-8102-5eef8d8e99a0";
        const subData: TSubordinate[] = await getMySubordinatesNameAndId(myId);

        const me: TSubordinate = {
          id: decoded.jti,
          name: decoded.name || "Me",
          email: decoded.sub || "",
        };

        const allUsers = [...subData, me];
        setSubordinates(allUsers);

        // Set up initial search with all user IDs
        const allUserIds = allUsers.map((user) => user.id);
        setSearch((prev) => ({ ...prev, ids: allUserIds }));

        // Fetch initial data
        await fetchDashboardData(allUserIds);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeComponent();
    }
  }, [isInitialized]);

  // Main data fetching function - extracted to be reusable
  const fetchDashboardData = async (userIds: string[]) => {
    setIsLoading(true);
    try {
      // Fetch all required data in parallel
      const [stats, statsInAYear, activitiesPercentages, projectStat] =
        await Promise.all([
          getActivitiesStat(search.startDate, search.endDate, userIds),
          getActivitiesStatInAYear(search.startDate, search.endDate, userIds),
          getActivitiesPercentage(search.startDate, search.endDate, userIds),
          getProjectStat(search.startDate, search.endDate, userIds),
        ]);

      // Transform and update state
      setChartData(transformDataForChart(statsInAYear));
      setDataPercentage(activitiesPercentages);
      setStatActivities(stats);
      setStatsProject(projectStat);

      return true;
    } catch (error) {
      console.error(`Error fetching activity statistics:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a selected user
  const handleRemoveUserSelectedInput = useCallback(
    async (userId: string) => {
      const updatedUsers = selectedUserInput.filter(
        (user) => user.id !== userId
      );
      setSelectedUserInput(updatedUsers);

      // Determine which IDs to use
      const userIds =
        updatedUsers.length > 0
          ? updatedUsers.map((user) => user.id)
          : subordinates.map((user) => user.id);

      if (selectedUserInput.length === 1) {
        await fetchDashboardData(userIds);
      }
    },
    [selectedUserInput, subordinates]
  );

  // Reset all filters
  const handleResetFilters = useCallback(async () => {
    const allUserIds = subordinates.map((user) => user.id);

    setSelectedUserInput([]);
    setSearch({
      ids: allUserIds,
      startDate: undefined,
      endDate: undefined,
    });

    await fetchDashboardData(allUserIds);
  }, [subordinates]);

  // Handle search button click
  const handleSearch = useCallback(async () => {
    // Determine which IDs to use
    const userIds =
      selectedUserInput.length > 0
        ? selectedUserInput.map((user) => user.id)
        : subordinates.map((user) => user.id);

    if (
      search.startDate !== undefined ||
      search?.endDate !== undefined ||
      selectedUserInput.length > 0
    ) {
      await fetchDashboardData(userIds);
    }
  }, [selectedUserInput, subordinates, search]);

  // Get available subordinates (not already selected)
  const availableSubordinates = subordinates.filter(
    (sub) => !selectedUserInput.some((selected) => selected.id === sub.id)
  );

  // Prepare donut chart data
  const donutChartData = [
    dataPercentage.Tasks,
    dataPercentage.Transverses,
    dataPercentage.Intercontrat,
  ];

  // Determine if filters should be shown
  const hasActiveFilters =
    search.startDate !== undefined ||
    search.endDate !== undefined ||
    selectedUserInput.length > 0;

  return (
    <ProjectLayout>
      <div className="mx-2 py-4 md:mx-10 space-y-10">
        {/* Header */}
        <div className="mb-2">
          <h1 className="font-semibold text-lg">Dashboard</h1>
          <p className="text-sm text-zinc-600">Bonjour, Bienvenue sur GMP</p>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-5">
            {subordinates.length > 1 && (
              <div>
                <CustomInputUserSpecifiedSearch
                  label="Collaborateur"
                  rounded="medium"
                  placeholder="Nom"
                  user={availableSubordinates}
                  userSelected={selectedUserInput}
                  setUserSelected={setSelectedUserInput}
                />
              </div>
            )}

            <CustomInput
              type="date"
              value={search.startDate || ""}
              label="Du"
              rounded="medium"
              onChange={(e) =>
                setSearch((prev) => ({
                  ...prev,
                  startDate: e.target.value || undefined,
                }))
              }
            />

            <CustomInput
              type="date"
              value={search.endDate || ""}
              label="Au"
              rounded="medium"
              onChange={(e) =>
                setSearch((prev) => ({
                  ...prev,
                  endDate: e.target.value || undefined,
                }))
              }
            />

            <div className="flex items-end gap-2 mb-0.5">
              {hasActiveFilters && (
                <div className="pb-2">
                  <button
                    onClick={handleResetFilters}
                    className="flex justify-center whitespace-nowrap text-sm gap-1 h-fit"
                    disabled={isLoading}
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
              )}

              <button
                type="button"
                onClick={handleSearch}
                disabled={isLoading}
                className="px-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Chargement..." : "Rechercher"}
              </button>
            </div>
          </div>

          {/* Selected users chips */}
          {selectedUserInput.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mt-2">
              {selectedUserInput.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center text-sm border rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 transition hover:shadow-md"
                >
                  <span className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300 font-medium">
                    {user.name}
                  </span>
                  <button
                    className="flex items-center justify-center px-3 py-2 text-red-500 dark:text-red-400 hover:text-white dark:hover:text-white hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    onClick={() => handleRemoveUserSelectedInput(user.id)}
                    disabled={isLoading}
                    aria-label={`Remove ${user.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loading state for the entire dashboard */}
        {!isInitialized && isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg font-medium mb-2">
              Chargement du dashboard...
            </p>
            <p className="text-sm text-gray-500">
              Veuillez patienter pendant l'initialisation des données
            </p>
          </div>
        ) : (
          <>
            {/* Activity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <CardDropDown
                title="Projet"
                value={statActivities?.totalDailyEffortTask || 0}
                primaryColor="rgb(34, 197, 94)"
                activity={statActivities?.task || []}
                startDate={search.startDate}
                endDate={search.endDate}
              />
              <CardDropDown
                title="Transverse"
                primaryColor="rgb(139, 92, 246)"
                value={statActivities?.totalDailyEffortTransverse || 0}
                activity={statActivities?.transverse || []}
                startDate={search.startDate}
                endDate={search.endDate}
              />
              <CardDropDown
                title="Intercontrat"
                primaryColor="rgb(239, 68, 68)"
                value={statActivities?.totalDailyEffortIntercontract || 0}
                activity={statActivities?.intercontract || []}
                startDate={search.startDate}
                endDate={search.endDate}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="border col-span-2 border-stroke dark:border-strokedark p-4 rounded-lg">
                <h2 className="font-sans font-semibold text-slate-800 dark:text-white mb-4">
                  Activités traitées
                </h2>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <p>Chargement des données...</p>
                  </div>
                ) : (
                  <StackedColumn data={chartData} />
                )}
              </div>
              <div className="border col-span-1 flex flex-col justify-center items-center border-stroke dark:border-strokedark p-4 rounded-lg">
                <h2 className="font-sans font-semibold text-slate-800 dark:text-white mb-4 self-start">
                  Répartition des activités du{" "}
                  <span
                    className={`${
                      search.startDate === undefined &&
                      search.endDate === undefined
                        ? ""
                        : "hidden"
                    }`}
                  >
                    mois de{" "}
                    {new Date()
                      .toLocaleString("fr-FR", { month: "long" })
                      .charAt(0)
                      .toUpperCase() +
                      new Date()
                        .toLocaleString("fr-FR", { month: "long" })
                        .slice(1)}
                  </span>
                  <span>
                    {search.startDate && search.endDate
                      ? `${formatDate(search.startDate)} au ${formatDate(
                          search.endDate
                        )}`
                      : formatDate(search.startDate ?? "", false, false) ||
                        formatDate(search.endDate ?? "", false, false)}
                  </span>
                </h2>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <p>Chargement des données...</p>
                  </div>
                ) : (
                  <DonutCharts labels={categories} values={donutChartData} />
                )}
              </div>
            </div>
          </>
        )}
        <div className="space-y-7">
          <ProjectStatsCard
            category={{
              title: "En cours",
              count: statsProject?.enCours.count,
              projects: statsProject?.enCours.projects,
            }}
          />
          <ProjectStatsCard
            category={{
              title: "Initié",
              count: statsProject?.initiés.count,
              projects: statsProject?.initiés.projects,
            }}
          />
          <ProjectStatsCard
            category={{
              title: "En retard",
              count: statsProject?.enRetard.count,
              projects: statsProject?.enRetard.projects,
            }}
          />
          <ProjectStatsCard
            category={{
              title: "Archivés",
              count: statsProject?.archived.count,
              projects: statsProject?.archived.projects,
            }}
          />
          <ProjectStatsCard
            category={{
              title: "Stand by",
              count: statsProject?.standBy.count,
              projects: statsProject?.standBy.projects,
            }}
          />
        </div>
      </div>
    </ProjectLayout>
  );
};

export default Home;
