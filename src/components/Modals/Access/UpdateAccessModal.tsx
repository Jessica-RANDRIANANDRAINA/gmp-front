import { useEffect, useRef, useState } from "react";
import { CustomInput, Checkbox } from "../../UIElements";
// import { v4 as uuid4 } from "uuid";
import { updateHabilitation } from "../../../services/User";
import { BeatLoader } from "react-spinners";

const UpdateAccessModal = ({
  setIsModalOpen,
  habilitationToModifData,
  setHabilitationToModifData,
  habilitationId,
}: {
  habilitationToModifData: any;
  setIsModalOpen: Function;
  setHabilitationToModifData: Function;
  habilitationId: string;
}) => {
  // const [access, setAccess] = useState<string[]>([]);
  const trigger = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [labelError, setLabelError] = useState("");
  const [accessLabel, setAccessLabel] = useState(
    habilitationToModifData?.label ?? ""
  );
  const [adminAccess, setAdminAccess] = useState({
    id: "",
    modifyHierarchy: 0,
    createHabilitation: 0,
    updateHabilitation: 0,
    deleteHabilitation: 0,
    restoreHierarchy: 0,
  });
  const [projectAccess, setProjectAccess] = useState({
    id: "",
    create: 0,
    update: 0,
    delete: 0,
    assign: 0,
  });
  const [transverseAccess, setTransverseAccess] = useState({
    id: "",
    create: 0,
    update: 0,
    delete: 0,
  });

  const [interContractAccess, setInterContractAccess] = useState({
    id: "",
    create: 0,
    update: 0,
    delete: 0,
  });

  useEffect(() => {
    if (habilitationToModifData) {
      console.log(
        habilitationToModifData?.habilitationAdmins?.[0]?.createHabilitation
      );
      setAccessLabel(habilitationToModifData?.label);
      setAdminAccess({
        ...adminAccess,
        createHabilitation: 1,
      });
    }
  }, [habilitationToModifData]);

  const handleModif = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setLabelError("");
    // const id = uuid4();
    if (accessLabel.trim() === "") {
      setLabelError("Veuiller remplir ce champ");
      return;
    }
    // const adminId = uuid4();
    // const projectId = uuid4();
    // const transverseId = uuid4();
    // const intercontractId = uuid4();
    const habilitationData = {
      label: accessLabel.trim(),
      habilitationAdmins: [{ ...adminAccess }],
      habilitationProjects: [{ ...projectAccess }],
      habilitationTransverses: [{ ...transverseAccess }],
      habilitationIntercontracts: [{ ...interContractAccess }],
    };

    try {
      updateHabilitation(habilitationData, habilitationId);
    } catch (error) {
      console.error(`error at impl create habilitation: ${error}`);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setHabilitationToModifData([]);
    }
    return;
  };

  const handleCheckBoxChange = (
    category: string,
    key: string,
    value: number
  ) => {
    switch (category) {
      case "admin":
        setAdminAccess((prev) => ({ ...prev, [key]: value }));
        break;
      case "project":
        setProjectAccess((prev) => ({ ...prev, [key]: value }));
        break;
      case "transverse":
        setTransverseAccess((prev) => ({ ...prev, [key]: value }));
        break;
      case "interContract":
        setInterContractAccess((prev) => ({ ...prev, [key]: value }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed  inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className={
          "bg-white dark:bg-[#24303F] max-h-[80%] overflow-auto hide-scrollbar rounded-md w-5/6 md:w-1/3 "
        }
      >
        {/* =====HEADER START===== */}
        <header
          className={
            "fixed flex rounded-t-md shadow-md z-99 bg-white dark:bg-[#24303F] w-5/6 md:w-1/3 justify-between  p-2 h-12"
          }
        >
          <div className={"font-bold flex justify-center  w-full items-center"}>
            Modifier cet accès
          </div>
          <div
            className={"cursor-pointer"}
            onClick={() => {
              setIsModalOpen(false);
              setHabilitationToModifData([]);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </header>
        {/* =====HEADER END===== */}
        {/* ===== BODY START ===== */}
        <div className="p-5 mt-10">
          <form onSubmit={handleModif}>
            <CustomInput
              required
              label="Nom de l'accès"
              type="text"
              rounded="medium"
              className="mb-2"
              value={accessLabel ?? ""}
              onChange={(e) => {
                setAccessLabel(e.target.value);
                setLabelError("");
              }}
              error={labelError}
            />
            <div className="mb-4 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Admin
              </label>
              <div className="pl-3">
                <Checkbox
                  label="Modifier la hiérarchie"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.modifyHierarchy
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "modifyHierarchy", 1)
                      : handleCheckBoxChange("admin", "modifyHierarchy", 0)
                  }
                />
                <Checkbox
                  label="Créer un nouvel accès"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.createHabilitation
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "createHabilitation", 1)
                      : handleCheckBoxChange("admin", "createHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Modifier un accès"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.updateHabilitation
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "updateHabilitation", 1)
                      : handleCheckBoxChange("admin", "updateHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Supprimer un accès"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.deleteHabilitation
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "deleteHabilitation", 1)
                      : handleCheckBoxChange("admin", "deleteHabilitation", 0)
                  }
                />
                <Checkbox
                  label="Restorer la hiérarchie à la valeur d'Active directory"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.restoreHierarchy
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "restoreHierarchy", 1)
                      : handleCheckBoxChange("admin", "restoreHierarchy", 0)
                  }
                />
              </div>
            </div>
            <div className="mb-4 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Projet
              </label>
              <div className="pl-3">
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]?.create
                  }
                  label="Créer un nouveau projet"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "create", 1)
                      : handleCheckBoxChange("project", "create", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]?.update
                  }
                  label="Modifier un projet"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "update", 1)
                      : handleCheckBoxChange("project", "update", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]?.delete
                  }
                  label="Supprimer un projet"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "delete", 1)
                      : handleCheckBoxChange("project", "delete", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]?.assign
                  }
                  label="Assigner un projet"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "assign", 1)
                      : handleCheckBoxChange("project", "assign", 0)
                  }
                />
              </div>
            </div>
            <div className="mb-4 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Transverse
              </label>
              <div className="pl-3">
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationTransverses?.[0]
                      ?.create
                  }
                  label="Créer un nouveau transverse"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("transverse", "create", 1)
                      : handleCheckBoxChange("transverse", "create", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationTransverses?.[0]
                      ?.update
                  }
                  label="Modifier un transverse"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("transverse", "update", 1)
                      : handleCheckBoxChange("transverse", "update", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationTransverses?.[0]
                      ?.delete
                  }
                  label="Supprimer un transverse"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("transverse", "delete", 1)
                      : handleCheckBoxChange("transverse", "delete", 0)
                  }
                />
              </div>
            </div>
            <div className="mb-4 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Inter-contrat
              </label>
              <div className="pl-3">
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationIntercontracts?.[0]
                      ?.create
                  }
                  label="Créer un nouveau Inter-contrat"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("interContract", "create", 1)
                      : handleCheckBoxChange("interContract", "create", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationIntercontracts?.[0]
                      ?.update
                  }
                  label="Modifier un Inter-contrat"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("interContract", "update", 1)
                      : handleCheckBoxChange("interContract", "update", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationIntercontracts?.[0]
                      ?.delete
                  }
                  label="Supprimer un Inter-contrat"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("interContract", "delete", 1)
                      : handleCheckBoxChange("interContract", "delete", 0)
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer mt-2 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
            >
              {isLoading ? (
                <BeatLoader size={8} className="mr-2" color={"#fff"} />
              ) : null}
              Modifier
            </button>
          </form>
        </div>
        {/* ===== BODY START ===== */}
      </div>
    </div>
  );
};

export default UpdateAccessModal;
