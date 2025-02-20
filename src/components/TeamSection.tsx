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

      <div className="space-y-4">
        {Object.entries(groupedUsers).map(
          ([role, users]) =>
            users.length > 0 && (
              <div key={role}>
                <div className="flex space-y-1 flex-wrap">
                  {users.map((userProject) => (
                    <div
                      key={userProject.user.id}
                      className="flex items-center mr-5 gap-3 p-2 rounded-lg shadow-sm border border-stroke dark:border-strokedark w-62.5 overflow-hidden"
                    >
                      <div className="border border-stroke p-2 dark:border-strokedark w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-800 font-bold ">
                        {getInitials(userProject.user.name)}
                      </div>

                      <div className="w-full">
                        <p className="text-xs overflow-hidden whitespace-nowrap ">
                          {truncateName(userProject.user.name)}
                        </p>

                        <span
                          className={`text-xs px-2 rounded-full ${roleColors[role]}`}
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
