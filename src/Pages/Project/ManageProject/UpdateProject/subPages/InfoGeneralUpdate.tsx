import {
  CustomInput,
  CustomSelect,
  MultiSelect,
} from "../../../../../components/UIElements";
import { IProjectData } from "../../../../../types/Project";

const InfoGeneralUpdate = ({
  pageCreate,
  setPageCreate,
  projectData,
  setProjectData,
  departments,
  setDirectionOwner,
  projectDataToModif,
}: {
  pageCreate: number;
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  setProjectData: React.Dispatch<React.SetStateAction<IProjectData>>;
  projectData: IProjectData;
  departments: string[];
  setDirectionOwner: Function;
  projectDataToModif: any;
}) => {
  // Function to compare if data is previous
  const isPreviousDate = (date: string | number | Date | undefined) => {
    if (!date) return false;
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
  };

  return (
    <form
      className={`space-y-2 transition-all duration-300 ease-in-out ${
        pageCreate === 1 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if (form.reportValidity()) {
          setPageCreate(2);
        }
      }}
    >
        <CustomInput
          label="Titre"
          type="text"
          rounded="medium"
          help="Le titre du projet est obligatoire"
          placeholder="Titre du projet"
          value={projectData?.title?.slice(0, 1000)}
          maxLength={1000}
          required={true}
          onChange={(e) => {
            setProjectData({
              ...projectData,
              title: e.target.value.slice(0, 1000),
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
        value={projectData?.description?.slice(0, 3000)}
        onChange={(e) => {
          setProjectData({
            ...projectData,
            description: e.target.value?.slice(0, 3000),
          });
        }}
      />
      <div className="grid  md:grid-cols-3 gap-4">
        <CustomSelect
          label="Priorité"
          placeholder="Priorité"
          data={["Faible", "Moyenne", "Elevée"]}
          value={projectData.priority}
          onValueChange={(e) => {
            setProjectData({
              ...projectData,
              priority: e,
            });
          }}
        />
        <CustomSelect
          label="Criticité"
          placeholder="Criticité"
          data={["Moins urgente", "Urgente", "Très urgente"]}
          value={projectData.criticality}
          onValueChange={(e) => {
            setProjectData({
              ...projectData,
              criticality: e,
            });
          }}
        />
        <MultiSelect
          id="001"
          label={"Direction propriétaire"}
          placeholder="Choisir une direction"
          value={departments}
          initialValue={projectDataToModif?.beneficiary}
          setValueMulti={setDirectionOwner}
          rounded="large"
          required={true}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <CustomInput
          label="Date début prévisionnelle"
          type="date"
          rounded="medium"
          value={
            projectData?.startDate ? projectData.startDate?.split("T")[0] : ""
          }
          onChange={(e) => {
            setProjectData({
              ...projectData,
              startDate: e.target.value,
            });
          }}
          required
          disabled={isPreviousDate(projectData?.startDate)}
        />
        <div className="grid  gap-2">
          <CustomInput
            label="Date fin prévisionnelle"
            type="date"
            rounded="medium"
            value={
              projectData?.endDate ? projectData.endDate?.split("T")[0] : ""
            }
            help={
              projectData.isEndDateImmuable
                ? "Cette date est fixe"
                : projectData?.endDate
                ? "Tout changement de cette date devra être suivi de la raison"
                : undefined
            }
            onChange={(e) => {
              setProjectData({
                ...projectData,
                endDate: e.target.value,
              });
            }}
            min={
              projectData?.startDate ? projectData.startDate?.split("T")[0] : ""
            }
            disabled={
              (projectData.startDate ? false : true) ||
              projectData.isEndDateImmuable
            }
          />
          <div className="">
            <div
              className={`${
                projectData?.endDate?.split("T")[0] ===
                  projectDataToModif?.endDate?.split("T")[0] ||
                projectDataToModif?.endDate === null
                  ? "hidden"
                  : ""
              }
                  
                    `}
            >
              <CustomInput
                label="Motif de la modification"
                type="textarea"
                rounded="medium"
                value={projectData?.endDateChangeReason?.slice(0, 3000)}
                maxLength={3000}
                required={
                  !(
                    projectData?.endDate?.split("T")[0] ===
                      projectDataToModif?.endDate?.split("T")[0] ||
                    projectDataToModif?.endDate === null
                  )
                }
                onChange={(e) => {
                  setProjectData({
                    ...projectData,
                    endDateChangeReason: e.target.value.slice(0, 1000),
                  });
                }}
              />
            </div>
            <div
              className={`${
                projectData?.endDate ? "opacity-100" : "opacity-50 hidden"
              } transform duration-300
                  ${projectDataToModif?.isEndDateImmuable ? "hidden" : ""}
                  `}
            >
              <span className={`cursor-help relative  group`}>
                Cette date est-elle imuable ?
                <span className="absolute text-xs  font-thin hidden group-hover:flex max-w-59 min-w-59 bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999999 top-[-35px] left-1/2 transform -translate-x-1/2">
                  Si oui, Cette date sera impossible a modifier même en cas de
                  retard
                </span>
              </span>
              <span className="flex flex-row flex-wrap gap-2">
                <span className="space-x-2">
                  <input
                    value={"Oui"}
                    type="radio"
                    className="cursor-pointer"
                    name={"immuableEndDate"}
                    checked={projectData?.isEndDateImmuable}
                    onChange={() => {
                      setProjectData({
                        ...projectData,
                        isEndDateImmuable: true,
                      });
                    }}
                  />
                  <label>Oui</label>
                </span>
                <span className="space-x-2">
                  <input
                    value={"Non"}
                    className="cursor-pointer"
                    type="radio"
                    name={"immuableEndDate"}
                    onChange={() => {
                      setProjectData({
                        ...projectData,
                        isEndDateImmuable: false,
                      });
                    }}
                    checked={!projectData?.isEndDateImmuable}
                  />
                  <label>Non</label>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end ">
        <button
          // onClick={() => setPageCreate(2)}
          type="submit"
          className={`md:w-fit gap-2 w-full  mt-2 py-2 px-5  text-center font-medium text-white  lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen `}
        >
          Suivant
        </button>
      </div>
    </form>
  );
};

export default InfoGeneralUpdate;
