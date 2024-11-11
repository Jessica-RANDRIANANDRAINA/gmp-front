import { useContext } from "react";
import { ViewContext } from "./Activity";
import TransverseKanban from "./KanbanView/TransverseKanban";
import TransverseCalendar from "./CalendarView/TransverseCalendar";

const Transverse = () => {
  const { view } = useContext(ViewContext);

  return (
    <>{view === "table" ? <TransverseKanban /> : <TransverseCalendar />}</>
  );
};

export default Transverse;
