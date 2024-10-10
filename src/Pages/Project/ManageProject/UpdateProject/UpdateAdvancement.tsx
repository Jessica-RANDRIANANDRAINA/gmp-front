import ProjectLayout from "../../../../layout/ProjectLayout";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CustomSelect } from "../../../../components/UIElements";
import Breadcrumb from "../../../../components/BreadCrumbs/BreadCrumb";
import {
  getProjectById,
  updateAdvancementProject,
} from "../../../../services/Project";
import { BeatLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateAdvancement = () => {
  const { projectId } = useParams();
  const [advancement, setAdvancement] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      setAdvancement(project?.completionPercentage);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeAdvancement = async () => {
    setLoading(true);
    if (projectId) {
      try {
        await updateAdvancementProject(projectId, advancement);
        notyf.success("Modification réussi");
        navigate("/gmp/project/list");
      } catch (error) {
        notyf.error("Une erreur est survenue lors de la modification");
        console.error("Error while update advancement: ", error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <ProjectLayout>
      <div className="mx-2 p-4 md:mx-10">
        <Breadcrumb pageName="Avancement" />
        <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
          <div className="flex  justify-center items-center ">
            <div className="w-full p-8  flex justify-center items-center ">
              <svg
                viewBox="0 0 36 36"
                className="block m-0 w-49 h-49 stroke-primaryGreen"
              >
                <path
                  className="fill-none stroke-zinc-300  "
                  strokeWidth={3.8}
                  d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="fill-none"
                  strokeWidth={2.8}
                  strokeLinecap="square"
                  strokeDasharray={`${advancement}, 100`}
                  d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{
                    transition: "stroke-dasharray 0.8s ease-in-out",
                  }}
                />
                <text
                  x={`${
                    advancement === 0 ? "12" : advancement === 100 ? "6" : "9"
                  }`}
                  y="21"
                  fontSize={10}
                  className="percentage border text-center "
                >
                  {advancement}%
                </text>
              </svg>
            </div>
          </div>
          <div className=" md:flex md:justify-center md:items-end gap-2">
            <div className="flex justify-center">
              <CustomSelect
                className="w-72"
                label="Avancement"
                placeholder="0"
                data={["0%", "25%", "50%", "75%", "100%"]}
                //   value={`${projectData?.completionPercentage}%`}
                value={`${advancement}%`}
                onValueChange={(e) => {
                  console.log(e);
                  setAdvancement(parseInt(e.split("%")?.[0]));
                }}
              />
            </div>
            <div className="px-7 md:pd-0">
              <button
                onClick={handleChangeAdvancement}
                type="button"
                className={`max-h-10 md:w-fit gap-2 w-full  mt-2 py-2 px-5  text-center font-medium text-white  lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen `}
              >
                {loading ? (
                  <BeatLoader size={5} className="mr-1" color={"#fff"} />
                ) : null}
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default UpdateAdvancement;
