import { useState, useEffect } from "react";
import ProjectLayout from "../../layout/ProjectLayout";
import { IActivityStat } from "../../types/Project";
// import { getCountProject } from "../../services/Project";
// import { IDecodedToken } from "../../types/user";
// import { decodeToken } from "../../services/Function/TokenService";
import CardDropDown from "../../components/card/CardDropDown";
import StackedColumn from "../../components/chart/StackedColumn";
import DonutCharts from "../../components/chart/DonutCharts";
import {
  getActivitiesStat,
  getActivitiesStatInAYear,
  getActivitiesPercentage,
} from "../../services/Project";

const Home = () => {
  const [statActivities, setStatActivities] = useState<IActivityStat>();
  // const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [chartData, setChartData] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [dataPercentage, setDataPercentage] = useState<{
    Tasks: number;
    Transverses: number;
    Intercontrat: number;
  }>();

  // const chartData = [
  //   {
  //     name: "Tâche projet",
  //     data: [80, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  //   },
  //   {
  //     name: "Transverse",
  //     data: [8, 100, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115],
  //   },
  //   {
  //     name: "Intercontrat",
  //     data: [90, 18, 28, 38, 48, 58, 13, 78, 88, 98, 108, 30],
  //   },
  // ];
  const categories = ["Projets", "Transverses", "Intercontrats"];
  // const stats = [43, 23, 34];

  useEffect(() => {
    fetchStatActivities();
  }, []);
  const fetchStatActivities = async () => {
    try {
      const stats = await getActivitiesStat();
      const statsInAYear = await getActivitiesStatInAYear();
      const transformedDataForStacked = transformDataForChart(statsInAYear);
      const activitiesPercentages = await getActivitiesPercentage(
        undefined,
        undefined,
        ["4a71606b-673d-4ea9-bddc-3121a1313539"]
      );
      setDataPercentage(activitiesPercentages);

      setChartData(transformedDataForStacked);

      setStatActivities(stats);
    } catch (error) {
      console.error(`Error at fetch stat activities: ${error}`);
    }
  };

  const donutChartData = [
    dataPercentage?.Tasks || 0,
    dataPercentage?.Transverses || 0,
    dataPercentage?.Intercontrat || 0,
  ];

  const transformDataForChart = (
    data: { month: number; type: string; totalEffort: number }[]
  ) => {
    // const months = Array.from({ length: 12 }, (_, i) => i + 1); // Mois de 1 à 12
    const categories = ["Projet", "Transverse", "Intercontrat"];

    // Initialiser un objet pour stocker les efforts par mois et par catégorie
    const groupedData: { [key: string]: number[] } = {
      Projet: Array(12).fill(0),
      Transverse: Array(12).fill(0),
      Intercontrat: Array(12).fill(0),
    };

    // Remplir l'objet avec les valeurs des efforts
    data.forEach(({ month, type, totalEffort }) => {
      const index = month - 1; // Ajuster car les tableaux commencent à 0
      if (groupedData[type]) {
        groupedData[type][index] = totalEffort;
      }
    });

    // Transformer en format attendu par StackedColumn
    return categories.map((category) => ({
      name: category,
      data: groupedData[category],
    }));
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("_au_pr");

  //   if (token) {
  //     try {
  //       const decoded = decodeToken("pr");
  //       setDecodedToken(decoded);
  //     } catch (error) {
  //       console.error(`Invalid token ${error}`);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   getCount()
  // }, [decodedToken])

  // const getCount = async () => {
  //   const countProject = await getCountProject(decodedToken?.jti)
  //   setCount(countProject)
  // }
  return (
    <ProjectLayout>
      <div className="mx-2 py-4 md:mx-10 space-y-10">
        <div className="mb-2">
          <p className="font-semibold text-lg ">Dashboard</p>
          <p className=" text-sm text-zinc-600 ">Bonjour, Bienvenue sur GMP</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CardDropDown
            title="Projet"
            value={statActivities?.totalDailyEffortTask}
            primaryColor="rgb(34, 197, 94)"
            activity={statActivities?.task}
          />
          <CardDropDown
            title="Transverse"
            primaryColor="rgb(139, 92, 246)"
            value={statActivities?.totalDailyEffortTransverse}
            activity={statActivities?.transverse}
          />
          <CardDropDown
            title="Intercontrat"
            primaryColor="rgb(239, 68, 68)"
            value={statActivities?.totalDailyEffortIntercontract}
            activity={statActivities?.intercontract}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border col-span-2 border-stroke dark:border-strokedark p-4 rounded-lg">
            <div className="font-sans font-semibold text-slate-800 dark:text-white">
              Activités traité
            </div>
            <div className="">
              <StackedColumn data={chartData} />
            </div>
          </div>
          <div className="border col-span-1 flex justify-center items-center border-stroke dark:border-strokedark p-4 rounded-lg">
            <DonutCharts labels={categories} values={donutChartData} />
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default Home;
