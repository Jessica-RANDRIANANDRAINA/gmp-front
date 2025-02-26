import { useState, useEffect } from "react";
import ProjectLayout from "../../layout/ProjectLayout";
import { IActivityStat } from "../../types/Project";
// import { getCountProject } from "../../services/Project";
// import { IDecodedToken } from "../../types/user";
// import { decodeToken } from "../../services/Function/TokenService";
import CardDropDown from "../../components/card/CardDropDown";
import StackedColumn from "../../components/chart/StackedColumn";
import { getActivitiesStat } from "../../services/Project";

const Home = () => {
  const [statActivities, setStatActivities] = useState<IActivityStat>();
  // const [decodedToken, setDecodedToken] = useState<IDecodedToken>();

  useEffect(() => {
    fetchStatActivities();
  }, []);
  const fetchStatActivities = async () => {
    try {
      const stats = await getActivitiesStat();
      console.log(stats)
      setStatActivities(stats);
    } catch (error) {
      console.error(`Error at fetch stat activities: ${error}`);
    }
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
            title="Tâches"
            value={statActivities?.totalDailyEffortTask}
            primaryColor="rgb(34, 197, 94)"
            activity={statActivities?.task}
          />
          <CardDropDown
            title="Transverses"
            primaryColor="rgb(139, 92, 246)"
            value={statActivities?.totalDailyEffortTransverse}
            activity={statActivities?.transverse}
          />
          <CardDropDown
            title="Intercontrats"
            primaryColor="rgb(239, 68, 68)"
            value={statActivities?.totalDailyEffortIntercontract}
            activity={statActivities?.intercontract}
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
