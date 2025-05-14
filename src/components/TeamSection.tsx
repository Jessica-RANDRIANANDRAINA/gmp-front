import React from "react";
import { IUserProject } from "../types/Project";
import { getThreeInitials } from "../services/Function/UserFunctionService";

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

  const equipeColors : Record<string, string> = {
    "Chef de projet":
    "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300  dark:border-green-700",
    Membre:
      "bg-cyan-100 text-cyan-600 border-cyan-300  dark:bg-cyan-900 dark:text-cyan-300  dark:border-cyan-700",
    Observateur:
      "bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700",
  }

  const groupedUsers: Record<string, IUserProject[]> = {
    "Chef de projet": listUsers.filter((user) => user.role === "director"),
    Membre: listUsers.filter((user) => user.role === "member"),
    Observateur: listUsers.filter((user) => user.role === "observator"),
  };

  const truncateName = (name: string, maxNameLength = 19) => {
    const parenthesisIndex = name.lastIndexOf("(");

    const namePart = name.slice(0, parenthesisIndex).trim();
    const parenthesisPart = name.slice(parenthesisIndex).trim();

    const truncatedName =
      namePart.length > maxNameLength
        ? `${namePart.slice(0, maxNameLength)}...`
        : namePart;

    return `${truncatedName} ${parenthesisPart}`;
  };

  return (
    <div>
      <div className="text-base">Équipe :</div>

      <div className="flex gap-2">
        {Object.entries(groupedUsers).map(
          ([role, users]) =>
            users.length > 0 && (
              <div key={role}>
                <div className="flex gap-4 nowrap">
                  {users.map((userProject) => (
                    <div
                      key={userProject.user.id}
                      className="relative group -ml-2 first:ml-0 hover:z-50"
                    >
                      <div className={`cursor-pointer border relative ${equipeColors[role]}font-bold p-1 w-8 h-8 flex justify-center items-center text-xs rounded-full`}>
                        {getThreeInitials(userProject.user.name)}

                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] left-1/2 transform -translate-x-1/2">
                        <p>
                          {truncateName(userProject.user.name)}
                        </p>

                        <span
                          className={`text-xs px-2 rounded-full ${roleColors[role]}`}
                        >
                          {role}
                        </span>
                      </div>
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
