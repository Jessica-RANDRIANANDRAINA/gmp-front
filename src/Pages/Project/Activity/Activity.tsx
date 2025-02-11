import { useState, useEffect, createContext } from "react";
import { useParams } from "react-router-dom";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { SketchPicker } from "react-color";
// component
import {
  CustomInput,
  CustomInputUserSpecifiedSearch,
  CustomSelectChoice,
} from "../../../components/UIElements";
// pages component
import ProjectLayout from "../../../layout/ProjectLayout";
import AllActivityKanban from "./KanbanView/AllActivityKanban";
import AllActivityCalendar from "./CalendarView/AllActivityCalendar";
// types
import { IDecodedToken } from "../../../types/user";
import { IMyHabilitation } from "../../../types/Habilitation";
// services
import { decodeToken } from "../../../services/Function/TokenService";
import { getMySubordinatesNameAndId } from "../../../services/User";
import { getAllMyHabilitation } from "../../../services/Function/UserFunctionService";

export const SignalRContext = createContext<HubConnection | null>(null);

// context for viex calendar and view table
export const ViewContext = createContext({
  view: "table",
  setView: (_view: string) => {},
});

type TSubordinate = {
  id: string;
  name: string;
  email: string;
};

const Activity = () => {
  const { userid } = useParams();
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [activityView, setActivityView] = useState<string>(
    localStorage.getItem("activity_view") || "table"
  );
  const [subordinates, setSubordinates] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);

  const [selectedUserInput, setSelecteduserInput] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [search, setSearch] = useState<{
    ids: (string | undefined)[];
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    ids: [""],
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [statusSelectedOptions, setStatusSelectedOptions] = useState<string[]>(
    []
  );
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const [resetCustomSelectChoice, setResetCustomSelectChoice] =
    useState<boolean>(false);
  const [resetStatusSelectedOptions, setResetStatusSelectedOptions] =
    useState<boolean>(false);

  const [colors, setColors] = useState<Record<string, string>>({});
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isAddActivity, setIsAddActivity] = useState<boolean>(false);
  const [myHabilitation, setMyHabilitation] = useState<IMyHabilitation>();

  const getMyHabilitation = async () => {
    const hab = await getAllMyHabilitation();
    setMyHabilitation(hab);
  };

  useEffect(() => {
    getMyHabilitation();
  }, []);

  const availableSubordinate = subordinates.filter(
    (sub) => !selectedUserInput.some((selected) => selected.id === sub.id)
  );

  const generateColor = (index: number) => {
    const hue = (index * 137.5) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const getColorMap = () => {
    const colorMap: Record<string, string> = {};

    selectedUserInput.forEach((user, index) => {
      colorMap[user.id] = colors[user.id] || generateColor(index);
    });

    return colorMap;
  };

  const resetColorMap = () => {
    setColors({});
    setSelecteduserInput([]);
  };

  const handleColorChange = (userId: string, color: string) => {
    setColors((prev) => ({
      ...prev,
      [userId]: color,
    }));
  };

  const handleSearchClicked = () => {
    const subIds = selectedUserInput?.map((user) => user.id);
    // const myId = [decodedToken?.jti];
    var Ids = [];
    if (subIds.length > 0) {
      Ids = subIds;
    } else {
      Ids = subordinates?.map((user) => user.id);
    }
    setSearch({
      ...search,
      ids: Ids,
    });
    setSearchClicked(true);
  };

  const fetchSubordinates = async () => {
    try {
      if (userid && decodedToken) {
        const myId = decodedToken?.jti ?? "";

        const data: TSubordinate[] = await getMySubordinatesNameAndId(myId);

        const transformedArray = data?.map(({ id, name, email }) => ({
          id,
          name,
          email,
        }));
        const me = {
          id: decodedToken?.jti ?? "",
          name: decodedToken?.name ?? "",
          email: decodedToken?.sub ?? "",
        };
        const subordinatesAndMe = [...transformedArray, me];

        setSubordinates(subordinatesAndMe);
      }
    } catch (error) {
      console.error(`Error at fetch subordinates :${error}`);
    }
  };

  useEffect(() => {
    fetchSubordinates();
  }, [decodedToken]);
  useEffect(() => {
    handleDeleteFilter();
  }, []);

  const handleViewChange = (view: string) => {
    setActivityView(view);
    localStorage.setItem("activity_view", view);
  };

  // remove a selected user
  const handleRemoveUserSelectedInput = (userId: string) => {
    const updatedSelectedUsers = selectedUserInput.filter(
      (user) => user.id !== userId
    );
    setSelecteduserInput(updatedSelectedUsers);
  };

  // clear filter
  const handleDeleteFilter = () => {
    const Ids = subordinates?.map((user) => user?.id);
    setSearch({
      ...search,
      ids: Ids,
      startDate: undefined,
      endDate: undefined,
    });

    setResetCustomSelectChoice(true);
    setResetStatusSelectedOptions(true);

    setSelectedOptions(["Projet", "Transverse", "Intercontract"]);
    setSelecteduserInput([]);
    setStatusSelectedOptions([
      "Backlog",
      "En cours",
      "Traité",
      "En pause",
      "Abandonné",
    ]);

    resetColorMap();
    setSearchClicked(true);

    setTimeout(() => {
      setResetCustomSelectChoice(false);
      setResetStatusSelectedOptions(false);
    }, 0);
  };

  useEffect(() => {
    const token = localStorage.getItem("_au_pr");
    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Invalid token ${error}`);
      }
    }

    // create and start connection to signalR
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_ENDPOINT}/activityHub`)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => setConnection(newConnection))
      .catch((error) =>
        console.error("Connection activity hub failed: ", error)
      );

    // clean connection
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  return (
    <ViewContext.Provider
      value={{ view: activityView, setView: handleViewChange }}
    >
      <SignalRContext.Provider value={connection}>
        <ProjectLayout>
          <div>
            <div className="bg-white dark:bg-boxdark pt-4 pb-3 px-10 shadow-sm">
              <div className="flex gap-2">
                <div
                  onClick={() => handleViewChange("table")}
                  className={`flex gap-1 text-xs py-1 items-center font-semibold cursor-pointer rounded ${
                    activityView === "table"
                      ? "bg-green-50 text-green-700 dark:bg-green-100"
                      : ""
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    className={` ${activityView === "table" ? "hidden" : ""}`}
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path d="M13.5 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h11zm-11-1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-11z"></path>{" "}
                      <path d="M6.5 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm-4 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm8 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3z"></path>{" "}
                    </g>
                  </svg>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`fill-green-700 ${
                      activityView === "table" ? "" : "hidden"
                    }`}
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path d="M2.5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-11zm5 2h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm-5 1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm9-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"></path>{" "}
                    </g>
                  </svg>
                  <span>Tableau</span>
                </div>
                <div
                  onClick={() => handleViewChange("calendar")}
                  className={`flex gap-1 text-xs px-1 items-center font-semibold cursor-pointer rounded ${
                    activityView === "calendar"
                      ? "bg-green-50 text-green-700 dark:bg-green-100"
                      : ""
                  }`}
                >
                  <svg
                    className={`${activityView === "calendar" ? "hidden" : ""}`}
                    width="20"
                    height="20"
                    viewBox="-1 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <title>calendar</title>{" "}
                      <desc>Created with Sketch Beta.</desc> <defs> </defs>{" "}
                      <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        {" "}
                        <g
                          id="Icon-Set"
                          transform="translate(-309.000000, -359.000000)"
                          fill="#000000"
                        >
                          {" "}
                          <path
                            d="M323,383 L325,383 L325,385 L323,385 L323,383 Z M323,387 L325,387 C326.104,387 327,386.104 327,385 L327,383 C327,381.896 326.104,381 325,381 L323,381 C321.896,381 321,381.896 321,383 L321,385 C321,386.104 321.896,387 323,387 L323,387 Z M315,383 L317,383 L317,385 L315,385 L315,383 Z M315,387 L317,387 C318.104,387 319,386.104 319,385 L319,383 C319,381.896 318.104,381 317,381 L315,381 C313.896,381 313,381.896 313,383 L313,385 C313,386.104 313.896,387 315,387 L315,387 Z M323,375 L325,375 L325,377 L323,377 L323,375 Z M323,379 L325,379 C326.104,379 327,378.104 327,377 L327,375 C327,373.896 326.104,373 325,373 L323,373 C321.896,373 321,373.896 321,375 L321,377 C321,378.104 321.896,379 323,379 L323,379 Z M315,375 L317,375 L317,377 L315,377 L315,375 Z M315,379 L317,379 C318.104,379 319,378.104 319,377 L319,375 C319,373.896 318.104,373 317,373 L315,373 C313.896,373 313,373.896 313,375 L313,377 C313,378.104 313.896,379 315,379 L315,379 Z M337,367 L311,367 L311,365 C311,363.896 311.896,363 313,363 L317,363 L317,364 C317,364.553 317.447,365 318,365 C318.553,365 319,364.553 319,364 L319,363 L329,363 L329,364 C329,364.553 329.447,365 330,365 C330.553,365 331,364.553 331,364 L331,363 L335,363 C336.104,363 337,363.896 337,365 L337,367 L337,367 Z M337,387 C337,388.104 336.104,389 335,389 L313,389 C311.896,389 311,388.104 311,387 L311,369 L337,369 L337,387 L337,387 Z M335,361 L331,361 L331,360 C331,359.448 330.553,359 330,359 C329.447,359 329,359.448 329,360 L329,361 L319,361 L319,360 C319,359.448 318.553,359 318,359 C317.447,359 317,359.448 317,360 L317,361 L313,361 C310.791,361 309,362.791 309,365 L309,387 C309,389.209 310.791,391 313,391 L335,391 C337.209,391 339,389.209 339,387 L339,365 C339,362.791 337.209,361 335,361 L335,361 Z M331,375 L333,375 L333,377 L331,377 L331,375 Z M331,379 L333,379 C334.104,379 335,378.104 335,377 L335,375 C335,373.896 334.104,373 333,373 L331,373 C329.896,373 329,373.896 329,375 L329,377 C329,378.104 329.896,379 331,379 L331,379 Z M331,383 L333,383 L333,385 L331,385 L331,383 Z M331,387 L333,387 C334.104,387 335,386.104 335,385 L335,383 C335,381.896 334.104,381 333,381 L331,381 C329.896,381 329,381.896 329,383 L329,385 C329,386.104 329.896,387 331,387 L331,387 Z"
                            id="calendar"
                          >
                            {" "}
                          </path>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                  <svg
                    className={`${activityView === "calendar" ? "" : "hidden"}`}
                    width="20"
                    height="20"
                    viewBox="-1 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        {" "}
                        <g
                          id="Icon-Set-Filled"
                          transform="translate(-311.000000, -361.000000)"
                          className="fill-green-700"
                        >
                          {" "}
                          <path
                            d="M325,379 L327,379 L327,377 L325,377 L325,379 Z M325,387 L327,387 L327,385 L325,385 L325,387 Z M333,379 L335,379 L335,377 L333,377 L333,379 Z M333,387 L335,387 L335,385 L333,385 L333,387 Z M317,387 L319,387 L319,385 L317,385 L317,387 Z M339,369 L313,369 L313,367 C313,365.896 313.896,365 315,365 L319,365 L319,366 C319,366.553 319.447,367 320,367 C320.553,367 321,366.553 321,366 L321,365 L331,365 L331,366 C331,366.553 331.447,367 332,367 C332.553,367 333,366.553 333,366 L333,365 L337,365 C338.104,365 339,365.896 339,367 L339,369 L339,369 Z M337,379 C337,380.104 336.104,381 335,381 L333,381 C331.896,381 331,380.104 331,379 L331,377 C331,375.896 331.896,375 333,375 L335,375 C336.104,375 337,375.896 337,377 L337,379 L337,379 Z M337,387 C337,388.104 336.104,389 335,389 L333,389 C331.896,389 331,388.104 331,387 L331,385 C331,383.896 331.896,383 333,383 L335,383 C336.104,383 337,383.896 337,385 L337,387 L337,387 Z M329,379 C329,380.104 328.104,381 327,381 L325,381 C323.896,381 323,380.104 323,379 L323,377 C323,375.896 323.896,375 325,375 L327,375 C328.104,375 329,375.896 329,377 L329,379 L329,379 Z M329,387 C329,388.104 328.104,389 327,389 L325,389 C323.896,389 323,388.104 323,387 L323,385 C323,383.896 323.896,383 325,383 L327,383 C328.104,383 329,383.896 329,385 L329,387 L329,387 Z M321,379 C321,380.104 320.104,381 319,381 L317,381 C315.896,381 315,380.104 315,379 L315,377 C315,375.896 315.896,375 317,375 L319,375 C320.104,375 321,375.896 321,377 L321,379 L321,379 Z M321,387 C321,388.104 320.104,389 319,389 L317,389 C315.896,389 315,388.104 315,387 L315,385 C315,383.896 315.896,383 317,383 L319,383 C320.104,383 321,383.896 321,385 L321,387 L321,387 Z M337,363 L333,363 L333,362 C333,361.448 332.553,361 332,361 C331.447,361 331,361.448 331,362 L331,363 L321,363 L321,362 C321,361.448 320.553,361 320,361 C319.447,361 319,361.448 319,362 L319,363 L315,363 C312.791,363 311,364.791 311,367 L311,389 C311,391.209 312.791,393 315,393 L337,393 C339.209,393 341,391.209 341,389 L341,367 C341,364.791 339.209,363 337,363 L337,363 Z M317,379 L319,379 L319,377 L317,377 L317,379 Z"
                            id="calendar"
                          >
                            {" "}
                          </path>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                  <span>Calendrier</span>
                </div>
              </div>

              {/* FILTER BEGIN */}
              <div className="grid place-content-center grid-cols-1  md:grid-cols-6 lg:grid-cols-8  gap-5 mt-3">
                <CustomSelectChoice
                  label="Type d'activité"
                  options={["Projet", "Transverse", "Intercontract"]}
                  onChange={(selected) => setSelectedOptions(selected)}
                  rounded="medium"
                  resetToAll={resetCustomSelectChoice}
                />
                <CustomSelectChoice
                  label="Statut"
                  options={[
                    "Backlog",
                    "En cours",
                    "Traité",
                    "En pause",
                    "Abandonné",
                  ]}
                  onChange={(selected) => setStatusSelectedOptions(selected)}
                  rounded="medium"
                  resetToAll={resetStatusSelectedOptions}
                />
                <div className={`${subordinates.length > 0 ? "" : "hidden"}`}>
                  <CustomInputUserSpecifiedSearch
                    label="Collaborateur"
                    rounded="medium"
                    placeholder="Nom"
                    user={availableSubordinate}
                    userSelected={selectedUserInput}
                    setUserSelected={setSelecteduserInput}
                  />
                </div>

                <CustomInput
                  type="date"
                  value={search.startDate || ""}
                  label="Du"
                  rounded="medium"
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      startDate: e.target.value,
                    });
                  }}
                />
                <CustomInput
                  type="date"
                  value={search.endDate || ""}
                  label="Au"
                  rounded="medium"
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      endDate: e.target.value,
                    });
                  }}
                />
                <div className="flex items-end gap-2  mb-0.5 ">
                  <div
                    className={`pb-2 ${
                      search?.startDate !== undefined ||
                      search?.endDate !== undefined ||
                      selectedOptions.length !== 3 ||
                      statusSelectedOptions.length !== 5 ||
                      selectedUserInput.length > 0
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <button
                      onClick={handleDeleteFilter}
                      className="flex justify-center whitespace-nowrap text-sm gap-1 h-fit "
                    >
                      Effacer les filtres
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#00AE5D"
                      >
                        <path
                          d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="">
                    <button
                      type="button"
                      onClick={handleSearchClicked}
                      className=" px-2 cursor-pointer py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  "
                    >
                      Rechercher
                    </button>
                  </div>
                </div>
                <div></div>
                <div className="flex items-end  text-sm mb-0.5 justify-center">
                  <span
                    onClick={() => {
                      setIsAddActivity(true);
                    }}
                    className="px-2 cursor-pointer py-2 lg:px-3 xl:px-2  text-center font-medium whitespace-nowrap text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform "
                  >
                    + Ajouter une activité
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {selectedUserInput.length > 0 &&
                  selectedUserInput?.map((user, index) => (
                    <div key={user.id}>
                      <div
                        style={{
                          borderColor: colors[user?.id] || generateColor(index),
                        }}
                        className="flex mt-2.5 justify-between items-center text-sm border   rounded-md shadow-sm  bg-gray-100 dark:bg-gray-800 transition hover:shadow-md"
                        onClick={() => setActiveUserId(user?.id)}
                      >
                        <span className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300 font-medium">
                          {user?.name}
                        </span>
                        <button
                          className="flex items-center justify-center px-3 py-2 text-red-500 dark:text-red-400 hover:text-white dark:hover:text-whiten hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          onClick={() => handleRemoveUserSelectedInput(user.id)}
                        >
                          ✕
                        </button>
                      </div>
                      {activeUserId === user.id && (
                        <div className="absolute z-10">
                          <SketchPicker
                            color={colors[user.id] || "#000"}
                            onChangeComplete={(color) =>
                              handleColorChange(user.id, color.hex)
                            }
                          />
                          <button
                            className="mt-2 bg-primaryGreen text-white px-3 py-1 rounded"
                            onClick={() => setActiveUserId(null)} // Close picker
                          >
                            Valider
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              {/* FILTER END */}
            </div>
            <div className="px-5">
              {activityView === "table" ? (
                <AllActivityKanban
                  selectedOptions={selectedOptions}
                  search={search}
                  setSearchClicked={setSearchClicked}
                  searchClicked={searchClicked}
                  colors={getColorMap()}
                  isAddActivity={isAddActivity}
                  setIsAddActivity={setIsAddActivity}
                  subordinates={subordinates}
                  statusSelectedOptions={statusSelectedOptions}
                  myHabilitation={myHabilitation}
                />
              ) : (
                <AllActivityCalendar
                  selectedOptions={selectedOptions}
                  search={search}
                  setSearchClicked={setSearchClicked}
                  searchClicked={searchClicked}
                  colors={getColorMap()}
                  isAddActivity={isAddActivity}
                  setIsAddActivity={setIsAddActivity}
                  subordinates={subordinates}
                  statusSelectedOptions={statusSelectedOptions}
                  myHabilitation={myHabilitation}
                />
              )}
            </div>
          </div>
        </ProjectLayout>
      </SignalRContext.Provider>
    </ViewContext.Provider>
  );
};

export default Activity;
