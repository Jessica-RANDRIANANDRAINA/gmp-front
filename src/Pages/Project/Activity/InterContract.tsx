import { useContext } from "react";
import IntercontractKanban from "./KanbanView/IntercontractKanban";
import IntercontractCalendar from "./CalendarView/IntercontractCalendar";
import { ViewContext } from "./Activity";

const InterContract = () => {
  const { view } = useContext(ViewContext);

  return (
    <>
      {view === "table" ? <IntercontractKanban /> : <IntercontractCalendar />}
    </>
  );
};

export default InterContract;
