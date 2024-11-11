import { useContext } from "react";
import { ViewContext } from "./Activity";
import MyTaskCalendar from "./CalendarView/MyTaskCalendar";
import MyTaskKanban from "./KanbanView/MyTaskKanban";

const MyTask = () => {
  const { view } = useContext(ViewContext);

  return <>{view === "table" ? <MyTaskKanban /> : <MyTaskCalendar />}</>;
};

export default MyTask;
