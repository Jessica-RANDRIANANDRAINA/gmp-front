import { Key } from "react";
import { getInitials } from "../../services/Function/UserFunctionService";
import { IUserProject } from "../../types/Project";

const ListUsers = ({ data, type }: { data: IUserProject[]; type?: string }) => {
  return (
    <>
      {type === "no-director" ? (
        <div className="flex">
          {data && data?.length <= 2
            ? data
                ?.filter((users) => {
                  return users?.role !== "director";
                })
                ?.map(
                  (user: {
                    [x: string]: any;
                    userid: Key | null | undefined;
                  }) => {
                    const initials = getInitials(user?.user?.name);
                    return (
                      <div
                        key={user?.userid}
                        className="relative group -ml-2 first:ml-0 hover:z-99 cursor-pointer "
                      >
                        <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                          {initials}
                        </p>
                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                          <p>{user?.user?.name}</p>
                        </div>
                      </div>
                    );
                  }
                )
            : data
                ?.slice(0, 3)
                ?.filter((users) => {
                  return users?.role !== "director";
                })
                ?.map(
                  (user: {
                    [x: string]: any;
                    userid: Key | null | undefined;
                  }) => {
                    const initials = getInitials(user?.user?.name);
                    return (
                      <div
                        key={user?.userid}
                        className="relative group -ml-2 first:ml-0 hover:z-50 cursor-pointer"
                      >
                        <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                          {initials}
                        </p>
                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                          <p>{user?.user?.name}</p>
                        </div>
                      </div>
                    );
                  }
                )}
          {data.length > 3 && (
            <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:border-transparent dark:text-white -ml-2 first:ml-0">
              +{data.length - 3}
            </p>
          )}
        </div>
      ) : type === "all" ? (
        <div className="flex">
          {data && data?.length <= 2
            ? data?.map(
                (user: {
                  [x: string]: any;
                  userid: Key | null | undefined;
                }) => {
                  const initials = getInitials(user?.user?.name);
                  return (
                    <div
                      key={user?.userid}
                      className="relative group -ml-2 first:ml-0 hover:z-99 cursor-pointer "
                    >
                      <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                        {initials}
                      </p>
                      <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                        <p>{user?.user?.name}</p>
                      </div>
                    </div>
                  );
                }
              )
            : data
                ?.slice(0, 3)

                ?.map(
                  (user: {
                    [x: string]: any;
                    userid: Key | null | undefined;
                  }) => {
                    const initials = getInitials(user?.user?.name);
                    return (
                      <div
                        key={user?.userid}
                        className="relative group -ml-2 first:ml-0 hover:z-50 cursor-pointer"
                      >
                        <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                          {initials}
                        </p>
                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                          <p>{user?.user?.name}</p>
                        </div>
                      </div>
                    );
                  }
                )}
          {data.length > 3 && (
            <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:border-transparent dark:text-white -ml-2 first:ml-0">
              +{data.length - 3}
            </p>
          )}
        </div>
      ) : type === "director" ? (
        <div className="flex">
          {data
            ?.filter((users) => {
              return users.role === "director";
            })
            ?.map(
              (user: { [x: string]: any; userid: Key | null | undefined }) => {
                const initials = getInitials(user?.user?.name);
                return (
                  <div
                    key={user?.userid}
                    className="relative group -ml-2 first:ml-0 hover:z-99 cursor-pointer "
                  >
                    <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                      {initials}
                    </p>
                    <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                      <p>{user?.user?.name}</p>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      ) : (
        <div className="flex">
          {data?.map(
            (user: { [x: string]: any; userid: Key | null | undefined }) => {
              const initials = getInitials(user?.user?.name);
              return (
                <div
                  key={user?.userid}
                  className="relative group hover:z-99 cursor-pointer "
                >
                  <p className="text-slate-50 border mr-1 last:mr-0 relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                    {initials}
                  </p>
                  <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/4">
                    <p>{user?.user?.name}</p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </>
  );
};

export default ListUsers;
