import React, { useEffect, useRef, useState } from "react";
import { CustomInput, Checkbox } from "../../UIElements";
// import { v4 as uuid4 } from "uuid";
import { updateHabilitation } from "../../../services/User";
import { BeatLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateAccessModal = ({
  setIsModalOpen,
  habilitationToModifData,
  setHabilitationToModifData,
  habilitationId,
  setIsUpdateFinished,
}: {
  habilitationToModifData: any;
  setIsModalOpen: Function;
  setHabilitationToModifData: Function;
  habilitationId: string;
  setIsUpdateFinished: React.Dispatch<React.SetStateAction<boolean>>;
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
    actualizeUserData: 0,
    assignAccess: 0,
  });
  const [projectAccess, setProjectAccess] = useState({
    id: "",
    assign: 0,
    create: 0,
    update: 0,
    updateMySubordinatesProject: 0,
    updateAllProject: 0,
    delete: 0,
    deleteMySubordinatesProject: 0,
    deleteAllProject: 0,
    watchMyProject: 0,
    watchMySubordinatesProject: 0,
    watchAllProject: 0,
    manage: 0,
    manageMySubordinatesProject: 0,
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
    console.log(habilitationToModifData);
  }, [habilitationToModifData]);

  useEffect(() => {
    if (habilitationToModifData) {
      setAccessLabel(habilitationToModifData?.label);
      setAdminAccess({
        ...adminAccess,
        modifyHierarchy:
          habilitationToModifData?.habilitationAdmins?.[0]?.modifyHierarchy,
        createHabilitation:
          habilitationToModifData?.habilitationAdmins?.[0]?.createHabilitation,
        updateHabilitation:
          habilitationToModifData?.habilitationAdmins?.[0]?.updateHabilitation,
        deleteHabilitation:
          habilitationToModifData?.habilitationAdmins?.[0]?.deleteHabilitation,
        restoreHierarchy:
          habilitationToModifData?.habilitationAdmins?.[0]?.restoreHierarchy,
        actualizeUserData:
          habilitationToModifData?.habilitationAdmins?.[0]?.actualizeUserData,
        assignAccess:
          habilitationToModifData?.habilitationAdmins?.[0]?.assignAccess,
      });
      setProjectAccess({
        ...projectAccess,
        assign: habilitationToModifData?.habilitationProjects?.[0]?.assign,

        create: habilitationToModifData?.habilitationProjects?.[0]?.create,

        update: habilitationToModifData?.habilitationProjects?.[0]?.update,

        updateMySubordinatesProject:
          habilitationToModifData?.habilitationProjects?.[0]
            ?.updateMySubordinatesProject,

        updateAllProject:
          habilitationToModifData?.habilitationProjects?.[0]?.updateAllProject,

        delete: habilitationToModifData?.habilitationProjects?.[0]?.delete,

        deleteMySubordinatesProject:
          habilitationToModifData?.habilitationProjects?.[0]
            ?.deleteMySubordinatesProject,

        deleteAllProject:
          habilitationToModifData?.habilitationProjects?.[0]?.deleteAllProject,

        watchMyProject:
          habilitationToModifData?.habilitationProjects?.[0]?.watchMyProject,

        watchMySubordinatesProject:
          habilitationToModifData?.habilitationProjects?.[0]
            ?.watchMySubordinatesProject,

        watchAllProject:
          habilitationToModifData?.habilitationProjects?.[0]?.watchAllProject,

        manage: habilitationToModifData?.habilitationProjects?.[0]?.manage,

        manageMySubordinatesProject:
          habilitationToModifData?.habilitationProjects?.[0]
            ?.manageMySubordinatesProject,
      });
      setTransverseAccess({
        ...transverseAccess,
        create: habilitationToModifData?.habilitationTransverses?.[0]?.create,
        delete: habilitationToModifData?.habilitationTransverses?.[0]?.delete,
        update: habilitationToModifData?.habilitationTransverses?.[0]?.update,
      });
      setInterContractAccess({
        ...interContractAccess,
        create:
          habilitationToModifData?.habilitationIntercontracts?.[0]?.create,
        delete:
          habilitationToModifData?.habilitationIntercontracts?.[0]?.delete,
        update:
          habilitationToModifData?.habilitationIntercontracts?.[0]?.update,
      });
    }
  }, [habilitationToModifData]);

  const handleModif = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setLabelError("");
    // const id = uuid4();
    if (accessLabel.trim() === "") {
      setLabelError("Veuiller remplir ce champ");
      setIsLoading(false);
      return;
    }

    const habilitationData = {
      label: accessLabel.trim(),
      habilitationAdmins: [{ ...adminAccess }],
      habilitationProjects: [{ ...projectAccess }],
      habilitationTransverses: [{ ...transverseAccess }],
      habilitationIntercontracts: [{ ...interContractAccess }],
    };
    console.log(habilitationData);

    try {
      await updateHabilitation(habilitationData, habilitationId);
      notyf.success("Modification réuissie");
      setIsUpdateFinished(true);
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
    // const value = isChe
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
    <div className="fixed text-sm inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className={
          "bg-white dark:bg-[#24303F] max-h-[80%] overflow-auto hide-scrollbar rounded-md w-11/12 md:w-1/3 "
        }
      >
        {/* =====HEADER START===== */}
        <header
          className={
            "fixed flex rounded-t-md shadow-md z-99 bg-white dark:bg-[#24303F] w-11/12 md:w-1/3 justify-between  p-2 h-12"
          }
        >
          <div className={"font-bold text-center text-base w-full"}>
            Modifier ce rôle
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
            <div className="mb-4 pb-2 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Admin
              </label>
              <div className="pl-3 space-y-1">
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
                <Checkbox
                  label="Actualiser les valeurs des utilisateurs"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.actualizeUserData
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "actualizeUserData", 1)
                      : handleCheckBoxChange("admin", "actualizeUserData", 0)
                  }
                />
                <Checkbox
                  label="Assigner des accès aux utilisateurs"
                  active={
                    habilitationToModifData?.habilitationAdmins?.[0]
                      ?.assignAccess
                  }
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("admin", "assignAccess", 1)
                      : handleCheckBoxChange("admin", "assignAccess", 0)
                  }
                />
              </div>
            </div>
            <div className="mb-4 pb-2 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Projet
              </label>
              <div className="pl-3 space-y-1">
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]
                      ?.watchMyProject
                  }
                  label="Voir mes projets"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "watchMyProject", 1)
                      : handleCheckBoxChange("project", "watchMyProject", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]
                      ?.watchMySubordinatesProject
                  }
                  label="Voir les projets de mes subordonné(e)s"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange(
                          "project",
                          "watchMySubordinatesProject",
                          1
                        )
                      : handleCheckBoxChange(
                          "project",
                          "watchMySubordinatesProject",
                          0
                        )
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]
                      ?.watchAllProject
                  }
                  label="Voir tous les projets"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "watchAllProject", 1)
                      : handleCheckBoxChange("project", "watchAllProject", 0)
                  }
                />
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
                  label="Modifier mes projets"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "update", 1)
                      : handleCheckBoxChange("project", "update", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]
                      ?.updateMySubordinatesProject
                  }
                  label="Modifier les projets de mes subordonné(e)s"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange(
                          "project",
                          "updateMySubordinatesProject",
                          1
                        )
                      : handleCheckBoxChange(
                          "project",
                          "updateMySubordinatesProject",
                          0
                        )
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]
                      ?.updateAllProject
                  }
                  label="Modifier tous les projets"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "updateAllProject", 1)
                      : handleCheckBoxChange("project", "updateAllProject", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]?.manage
                  }
                  label="Gérer mes projets"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "manage", 1)
                      : handleCheckBoxChange("project", "manage", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]
                      ?.manageMySubordinatesProject
                  }
                  label="Gérer les projets de mes subordonné(e)s"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange(
                          "project",
                          "manageMySubordinatesProject",
                          1
                        )
                      : handleCheckBoxChange(
                          "project",
                          "manageMySubordinatesProject",
                          0
                        )
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]?.delete
                  }
                  label="Archiver mes projets"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "delete", 1)
                      : handleCheckBoxChange("project", "delete", 0)
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]
                      ?.deleteMySubordinatesProject
                  }
                  label="Archiver les projets de mes subordonné(e)s"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange(
                          "project",
                          "deleteMySubordinatesProject",
                          1
                        )
                      : handleCheckBoxChange(
                          "project",
                          "deleteMySubordinatesProject",
                          0
                        )
                  }
                />
                <Checkbox
                  active={
                    habilitationToModifData?.habilitationProjects?.[0]
                      ?.deleteAllProject
                  }
                  label="Archiver tous les projets"
                  onStateCheckChange={(isChecked) =>
                    isChecked
                      ? handleCheckBoxChange("project", "deleteAllProject", 1)
                      : handleCheckBoxChange("project", "deleteAllProject", 0)
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
            <div className="mb-4 pb-2 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Transverse
              </label>
              <div className="pl-3 space-y-1">
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
            <div className="mb-4 pb-2 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Inter-contrat
              </label>
              <div className="pl-3 space-y-1">
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
              className="w-full cursor-pointer py-2 flex justify-center items-center text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
            >
              {isLoading ? <BeatLoader size={8} color={"#fff"} /> : null}
              Enregistrer les modifications
            </button>
          </form>
        </div>
        {/* ===== BODY START ===== */}
      </div>
    </div>
  );
};

export default UpdateAccessModal;
