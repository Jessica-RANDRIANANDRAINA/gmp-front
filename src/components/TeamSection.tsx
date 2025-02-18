import React from "react";
import { IUserProject } from "../types/Project";
import { getInitials } from "../services/Function/UserFunctionService";

const TeamSection: React.FC<{ listUsers?: IUserProject[] }> = ({
  listUsers = [],
}) => {
  const roleColors: Record<string, string> = {
    "Chef de projet":
      "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700",
    Membre:
      "bg-cyan-100 text-cyan-600 border-cyan-300  dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700",
    Observateur:
      "bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700",
  };
  const groupedUsers: Record<string, IUserProject[]> = {
    "Chef de projet":
      listUsers?.filter((user) => user.role === "director") || [],
    Membre: listUsers?.filter((user) => user.role === "member") || [],
    Observateur: listUsers?.filter((user) => user.role === "observator") || [],
  };
  return (
    <div>
      <div className="text-base">
        <u>
          <span className="uppercase">É</span>quipe
        </u>{" "}
        :
      </div>

      <div className="space-y-4">
        {Object.entries(groupedUsers).map(
          ([role, users]) =>
            users.length > 0 && (
              <div key={role}>
                {/* <h2 className="text-lg font-semibold capitalize mb-2">
                  {role === "cpd"
                    ? "Chef de projet"
                    : role === "member"
                    ? "Membres"
                    : "Observateurs"}
                </h2> */}

                <div className="flex space-y-1 flex-wrap">
                  {users.map((userProject) => (
                    <div
                      key={userProject.user.id}
                      className="flex items-center mr-5 gap-3 p-2 rounded-lg shadow-sm "
                    >
                      {/* <img
                        src={
                          userProject.user.profilePicture ||
                          "/default-avatar.png"
                        }
                        alt={userProject.user.name}
                        className="w-12 h-12 rounded-full object-cover border"
                      /> */}
                      <div className="border border-stroke dark:border-strokedark w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-gray-800 font-bold text-lg">
                        {getInitials(userProject.user.name)}
                      </div>

                      <div >
                        <p className="text-sm font-medium">
                          {userProject.user.name}
                        </p>
                        <span
                          className={`  text-xs px-2 py-1 rounded-full ${roleColors[role]}`}
                        >
                          {role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default TeamSection;
