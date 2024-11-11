import { useContext } from "react";
import AllActivityCalendar from "./CalendarView/AllActivityCalendar";
import AllActivityKanban from "./KanbanView/AllActivityKanban";
import { ViewContext } from "./Activity";

const AllActivity = () => {
  const { view } = useContext(ViewContext);

  return (
    <>{view === "table" ? <AllActivityKanban /> : <AllActivityCalendar />}</>
  );
};

export default AllActivity;
