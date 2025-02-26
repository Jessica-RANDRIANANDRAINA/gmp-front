// import { useState, useEffect } from "react";
// import CardDetails from "../../components/card/CardDetails";
import ProjectLayout from "../../layout/ProjectLayout";
// import { getCountProject } from "../../services/Project";
// import { IDecodedToken } from "../../types/user";
// import { decodeToken } from "../../services/Function/TokenService";
// import CustomPieChart from "../../components/chart/CustomPieChart";
import CardDropDown from "../../components/card/CardDropDown";
import StackedColumn from "../../components/chart/StackedColumn";

const Home = () => {
  // const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  // const [count, setCount] = useState<{
  //   activityFinished: number;
  //   activityOnGoing: number;
  //   projectDelayed: number;
  //   projectFinished: number;
  //   projectOnGoing: number;
  //   projectArchived: number;
  //   taskActivityWeek: number;
  //   transverseWeek: number;
  //   interContractWeek: number;
  // }>({
  //   activityFinished: 0,
  //   activityOnGoing: 0,
  //   projectDelayed: 0,
  //   projectFinished: 0,
  //   projectOnGoing: 0,
  //   projectArchived: 0,
  //   taskActivityWeek: 0,
  //   transverseWeek: 0,
  //   interContractWeek: 0,
  // })

  // const generateChartData = () => {
  //   const data= [
  //     { name: "En cours", value: count.projectOnGoing },
  //     { name: "Terminé", value: count.projectFinished },
  //     { name: "En retard", value: count.projectDelayed },
  //     { name: "Archivé", value: count.projectArchived },
  //   ];

  //   const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  //   if (totalValue === 0) {
  //     // Remplace par des données fictives pour afficher un graphique
  //     return [
  //       { name: "Pas de projet", value: 1 },
  //     ];
  //   }
  //   return data
  // };

  // const generateActivityData = () => {
  //   const data = [
  //     { name: "activité projet", value: count.taskActivityWeek },
  //     { name: "transverse", value: count.transverseWeek },
  //     { name: "intercontrat", value: count.interContractWeek },
  //   ];

  //   const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  //   if (totalValue === 0) {
  //     // Remplace par des données fictives pour afficher un graphique
  //     return [
  //       { name: "Pas d'activité", value: 1 },
  //     ];
  //   }

  //   return data;
  // }

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
            title="Tâches"
            primaryColor="rgb(34, 197, 94)"
            activity={[
              { label: "GMP", value: "29" },
              { label: "Banjina", value: "4" },
              { label: "GMP", value: "29" },
              { label: "GMP", value: "29" },
              { label: "GMP", value: "29" },
              { label: "GMP", value: "29" },
              { label: "GMP", value: "29" },
            ]}
          />
          <CardDropDown
            title="Transverses"
            primaryColor="rgb(139, 92, 246)"
            activity={[
              { label: "GMP", value: "29" },
              { label: "GMP", value: "29" },
              { label: "GMP", value: "29" },
            ]}
          />
          <CardDropDown
            title="Intercontrats"
            primaryColor="rgb(239, 68, 68)"
            activity={[
              { label: "Veille technologique", value: "12" },
              { label: "Evenement d'entreprise", value: "8" },
            ]}
          />
        </div>
        <div className="border border-stroke dark:border-strokedark p-4 rounded-lg">
          <div className="font-sans font-semibold text-slate-800 dark:text-white">
            Activités
          </div>
          <StackedColumn />
        </div>
      </div>
    </ProjectLayout>
  );
};

export default Home;
