// import { useState, useEffect } from "react";
// import CardDetails from "../../components/card/CardDetails";
import ProjectLayout from "../../layout/ProjectLayout";
// import { getCountProject } from "../../services/Project";
// import { IDecodedToken } from "../../types/user";
// import { decodeToken } from "../../services/Function/TokenService";
// import CustomPieChart from "../../components/chart/CustomPieChart";

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
      <div className="grid place-items-center h-[50vh] font-bold text-2xl">
        <div className="flex flex-col justify-center items-center">
          <span>Bienvenue dans le G.M.P</span>
          <span className="text-base font-medium">Gestion et management de projet</span>
        </div>
      </div>
      {/* <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5 xl:grid-cols-5 ">
        <CardDetails title="Projet en cours" total={count?.projectOnGoing} dataPrev={'0'}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 1V5" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M19.4246 18.9246L16.5961 16.0962" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M22.5 11.5L18.5 11.5" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M12 18V22" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M7.40381 6.90381L4.57538 4.07538" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M5.5 11.5L1.5 11.5" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M7.40381 16.0962L4.57538 18.9246" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> </g></svg>
        </CardDetails>
        <CardDetails title="Projet Terminé" total={count?.projectFinished} dataPrev={'0'}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16.5163 8.93451L11.0597 14.7023L8.0959 11.8984" className="stroke-primaryGreen dark:stroke-white" strokeWidth="2"></path><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" className="stroke-primaryGreen dark:stroke-white" strokeWidth="2"></path></g></svg>
        </CardDetails>
        <CardDetails title="Projet en retard" total={count?.projectDelayed} dataPrev={'0'}>
          <svg width="30" height="30" viewBox="0 0 16 16" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g className="fill-primaryGreen dark:fill-white"> <path d="M1.5 8a6.5 6.5 0 016.744-6.496.75.75 0 10.055-1.499 8 8 0 107.036 11.193.75.75 0 00-1.375-.6 6.722 6.722 0 01-.22.453A6.5 6.5 0 011.5 8zM10.726 1.238a.75.75 0 011.013-.312c.177.094.35.194.518.3a.75.75 0 01-.799 1.27 6.512 6.512 0 00-.42-.244.75.75 0 01-.312-1.014zM13.74 3.508a.75.75 0 011.034.235c.106.168.206.34.3.518a.75.75 0 11-1.326.702 6.452 6.452 0 00-.243-.421.75.75 0 01.235-1.034zM15.217 6.979a.75.75 0 01.777.722 8.034 8.034 0 01.002.552.75.75 0 01-1.5-.047 6.713 6.713 0 000-.45.75.75 0 01.721-.777z"></path> <path d="M7.75 3a.75.75 0 01.75.75v3.786l2.085 1.043a.75.75 0 11-.67 1.342l-2.5-1.25A.75.75 0 017 8V3.75A.75.75 0 017.75 3z"></path> </g> </g></svg>
        </CardDetails>
        <CardDetails title="Activité en cours" total={count?.activityOnGoing} dataPrev={'0'}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 1V5" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M19.4246 18.9246L16.5961 16.0962" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M22.5 11.5L18.5 11.5" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M12 18V22" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M7.40381 6.90381L4.57538 4.07538" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M5.5 11.5L1.5 11.5" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> <path d="M7.40381 16.0962L4.57538 18.9246" className="stroke-primaryGreen dark:stroke-white" strokeWidth="1.7" strokeLinecap="round"></path> </g></svg>
        </CardDetails>
        <CardDetails title="Activité terminé" total={count?.activityFinished} dataPrev={'0'}>
          <svg className="fill-primaryGreen dark:fill-white" width="32" height="32" viewBox="0 0 16 16"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M7.93,8.24,5.26,5.58,4,6.85l3.94,3.94L16,2.7,14.74,1.43,13,3.17,11.2,5Zm3.27,4H2.8V3.8H11L12.75,2H1V14H13V7.13l-1.8,1.8Z"></path> </g> </g></svg>
        </CardDetails>
      </div>
      <div className="mx-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border flex justify-center border-stroke bg-white py-6 px-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <CustomPieChart data={generateChartData()} />
          Projet 2024
        </div>
        <div className="border flex justify-end border-stroke bg-white py-6 px-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <CustomPieChart data={generateActivityData()} />
          Activité cette semaine
        </div>
      </div> */}
    </ProjectLayout>
  );
};

export default Home;
