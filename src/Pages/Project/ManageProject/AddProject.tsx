import { useEffect, useState } from "react";
import {
  CustomInput,
  CustomSelect,
  MultiSelect,
} from "../../../components/UIElements";

const AddProject = ({
  setIsAddProject,
  setIsButtonAnimate,
}: {
  setIsAddProject: Function;
  setIsButtonAnimate: Function;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    priority: "",
    startDate: "",
    endDate: "",
    directionOwner: [""],
  });
  const [valueMulti, setValueMulti] = useState<any>();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div>
      {/* ===== LINK RETURN START ===== */}
      <div className={`w-full  mb-2 flex  items-center `}>
        <button
          onClick={() => {
            setIsAddProject(false);
            setIsButtonAnimate(true);
          }}
          className={`md:w-fit gap-2   w-full cursor-pointer mt-2 py-4 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90 md:ease-out md:duration-300 md:transform   ${
            isLoaded ? "md:translate-x-0 " : "md:translate-x-[60vw]"
          }`}
        >
          retour
        </button>
      </div>
      {/* ===== LINK RETURN END ===== */}
      {/* ===== BLOC ADD PROJECT START ===== */}
      <div className="bg-white  p-4 shadow-3 flex flex-col items-center rounded-md dark:border-strokedark dark:bg-boxdark min-h-fit md:min-h-fit md:h-[72vh] lg:h-[75vh]">
        <span className="font-bold tracking-widest text-lg   ">
          Ajouter un nouveau projet
        </span>
        {/* ===== FORM START ===== */}
        <div className="pt-2 md:w-1/2 space-y-2 ">
          <CustomInput
            label="Titre"
            type="text"
            rounded="medium"
            placeholder="Titre du projet"
            value={projectData?.title}
            required
            onChange={(e) => {
              setProjectData({
                ...projectData,
                title: e.target.value,
              });
            }}
          />
          <CustomInput
            label="Description"
            type="textarea"
            rounded="medium"
            placeholder="Description du projet"
            rows={5}
            cols={5}
            value={projectData?.description}
            onChange={(e) => {
              setProjectData({
                ...projectData,
                description: e.target.value,
              });
            }}
          />
          <div className="grid  md:grid-cols-2 gap-4">
            <CustomSelect
              label="Priorité"
              placeholder="Priorité"
              data={["Faible", "Moyen", "Urgent", "Critique"]}
              value={projectData.priority}
              onValueChange={(e) => {
                setProjectData({
                  ...projectData,
                  priority: e,
                });
              }}
            />
            <MultiSelect
              id="001"
              label={"Direction propriétaire"}
              placeholder="Direction propriétaire"
              value={projectData.directionOwner}
              setValueMulti={setValueMulti}
              rounded="large"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <CustomInput
              label="Date de début prévue du projet"
              type="date"
              rounded="medium"
              value={projectData.startDate}
              onChange={(e) => {
                setProjectData({
                  ...projectData,
                  startDate: e.target.value,
                });
              }}
              required
            />
            <CustomInput
              label="Date de fin prévue du projet"
              type="date"
              rounded="medium"
              value={projectData.endDate}
              onChange={(e) => {
                setProjectData({
                  ...projectData,
                  endDate: e.target.value,
                });
              }}
            />
          </div>
          <div className="flex justify-end ">
            <button className="md:w-fit gap-2   w-full cursor-pointer mt-2 py-4 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90">
              Suivant
            </button>
          </div>
        </div>
        {/* ===== FORM END ===== */}
      </div>
      {/* ===== BLOC ADD PROJECT END ===== */}
    </div>
  );
};

export default AddProject;
