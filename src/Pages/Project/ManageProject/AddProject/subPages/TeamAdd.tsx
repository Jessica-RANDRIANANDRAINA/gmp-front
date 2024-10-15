import { PuffLoader } from "react-spinners";
import { CutomInputUserSearch } from "../../../../../components/UIElements";
import { getInitials } from "../../../../../services/Function/UserFunctionService";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });
interface Iteam {
  id: string | undefined;
  name: string;
  email: string;
  role: string;
}

const TeamAdd = ({
  pageCreate,
  setPageCreate,
  userTeam,
  setUserTeam,
  setCreateProjectState,
  isCreateLoading,
}: {
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  setCreateProjectState: React.Dispatch<React.SetStateAction<boolean>>;
  pageCreate: number;
  userTeam: Iteam[];
  setUserTeam: React.Dispatch<React.SetStateAction<Array<Iteam>>>;
  isCreateLoading: boolean;
}) => {
  // REMOVE A USER FROM TEAM LIST
  const handleRemoveTeamList = (id: string | undefined) => {
    let filteredList = userTeam.filter((team) => team.id !== id);
    setUserTeam(filteredList);
  };

  return (
    <div
      className={`space-y-2  transition-all duration-1000 ease-in-out ${
        pageCreate === 4 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      }`}
    >
      <div className="space-y-4 grid md:max-h-125 md:min-h-150 ">
        <div>
          <span className="font-semibold tracking-wide underline">EQUIPE</span>
          <div className="space-y-2 ">
            {/* ===== PROJECT DIRECTOR START ===== */}
            <div>
              <div>Chef de projet</div>
              <div className="hide-scrollbar  ">
                {userTeam?.filter((team) => team.role === "director").length ===
                  0 && (
                  <CutomInputUserSearch
                    placeholder="Recherche"
                    label="Assigner"
                    userSelected={userTeam}
                    setUserSelected={setUserTeam}
                    role="director"
                  />
                )}
                <div className="flex gap-4 mt-2 flex-wrap">
                  {userTeam
                    ?.filter((team) => team.role === "director")
                    ?.map((team) => {
                      const initials = getInitials(team?.name);
                      return (
                        <div
                          key={team.id}
                          className="relative group -ml-2 first:ml-0 hover:z-50"
                          onClick={() => {
                            handleRemoveTeamList(team.id);
                          }}
                        >
                          <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                            {initials}
                          </p>
                          <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] left-1/2 transform -translate-x-1/2">
                            <p>{team?.name}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/* ===== PROJECT DIRECTOR END ===== */}
            {/* ===== PROJECT TEAM START ===== */}
            <div>
              <div>Membre</div>
              <div className="hide-scrollbar ">
                <CutomInputUserSearch
                  placeholder="Recherche"
                  label="Assigner"
                  userSelected={userTeam}
                  setUserSelected={setUserTeam}
                  role="member"
                />
                <div className="flex gap-4 mt-2 flex-wrap">
                  {userTeam
                    ?.filter((team) => team.role === "member")
                    ?.map((team) => {
                      const initials = getInitials(team?.name);
                      return (
                        <div
                          key={team.id}
                          className="relative group -ml-2 first:ml-0 hover:z-50"
                          onClick={() => {
                            handleRemoveTeamList(team.id);
                          }}
                        >
                          <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                            {initials}
                          </p>
                          <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] left-1/2 transform -translate-x-1/2">
                            <p>{team?.name}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/* ===== PROJECT TEAM END ===== */}
            {/* ===== PROJECT TEAM START ===== */}
            <div>
              <div>Observateur</div>
              <div className="hide-scrollbar ">
                <CutomInputUserSearch
                  placeholder="Recherche"
                  label="Assigner"
                  userSelected={userTeam}
                  setUserSelected={setUserTeam}
                  role="observator"
                />
                <div className="flex gap-4 mt-2 flex-wrap">
                  {userTeam
                    ?.filter((team) => team.role === "observator")
                    ?.map((team) => {
                      const initials = getInitials(team?.name);
                      return (
                        <div
                          key={team.id}
                          className="relative group -ml-2 first:ml-0 hover:z-50"
                          onClick={() => {
                            handleRemoveTeamList(team.id);
                          }}
                        >
                          <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                            {initials}
                          </p>
                          <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] left-1/2 transform -translate-x-1/2">
                            <p>{team?.name}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/* ===== PROJECT TEAM END ===== */}
          </div>
        </div>
        <div className="md:flex md:justify-end md:gap-3 grid">
          <button
            onClick={() => setPageCreate(3)}
            className="md:w-fit max-h-10 gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 xl:px-5 border border-zinc-300 rounded-lg  dark:bg-transparent dark:hover:bg-boxdark2"
          >
            Précédent
          </button>
          <button
            onClick={() => {
              if (userTeam.length > 0) {
                setCreateProjectState(true);
              } else {
                notyf.error(
                  "Un projet doit avoir au moins une personne assignée."
                );
              }
            }}
            className="md:w-fit flex justify-center items-center max-h-10 gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
          >
            {isCreateLoading && (
              <span>
                <PuffLoader size={20} className="" />
              </span>
            )}
            Créer le projet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamAdd;
