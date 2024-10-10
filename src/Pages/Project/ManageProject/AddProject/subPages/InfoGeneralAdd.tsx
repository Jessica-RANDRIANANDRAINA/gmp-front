import {
  CustomInput,
  CustomSelect,
  MultiSelect,
} from "../../../../../components/UIElements";
import { IProjectData } from "../../../../../types/Project";

const InfoGeneralAdd = ({
  setPageCreate,
  pageCreate,
  setProjectData,
  projectData,
  departments,
  setDirectionOwner,
}: {
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  pageCreate: number;
  setProjectData: React.Dispatch<React.SetStateAction<IProjectData>>;
  projectData: IProjectData;
  departments: string[];
  setDirectionOwner: Function;
}) => {
  return (
    <form
      className={`space-y-2 transition-all min-w-[50vw]  duration-1000 ease-in-out ${
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
        help="Bref description du projet"
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
          data={["Urgente", "Normale"]}
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
          setValueMulti={setDirectionOwner}
          rounded="large"
          required={true}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 ">
        <CustomInput
          label="Date début prévisionnelle"
          type="date"
          rounded="medium"
          value={projectData?.startDate}
          onChange={(e) => {
            setProjectData({
              ...projectData,
              startDate: e.target.value,
            });
          }}
          required
        />
        <div className="space-y-2">
          <CustomInput
            label="Date fin prévisionnelle"
            type="date"
            rounded="medium"
            help={`${projectData.startDate ? "" : "Remplir la date de début."}`}
            value={projectData?.endDate}
            onChange={(e) => {
              setProjectData({
                ...projectData,
                endDate: e.target.value,
              });
            }}
            min={projectData.startDate}
            disabled={projectData.startDate ? false : true}
          />
          <div
            className={`${
              projectData?.endDate ? "opacity-100" : "opacity-50 hidden"
            } transform duration-300`}
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
      <div className="flex justify-end ">
        <button
          // onClick={() => setPageCreate(2)}
          type="submit"
          className={`md:w-fit gap-2 w-full  mt-2 py-2 px-5  text-center font-medium text-white dark:font-semibold  lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen  `}
        >
          Suivant
        </button>
      </div>
    </form>
  );
};

export default InfoGeneralAdd;
