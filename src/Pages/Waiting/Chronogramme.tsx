import ProjectLayout from "../../layout/ProjectLayout";
import gantt from "../../assets/gantt.png";

const Chronogramme = () => {
  return (
    <ProjectLayout>
      <div className="grid place-items-center h-[50vh] font-bold text-2xl relative">
        Planning
        <div className="relative">
          <img src={gantt} alt="gantt image" />
          <div className="absolute top-70 right-0 bg-red-500 text-white px-4 py-2 transform rotate-45 origin-top-right mt-4 mr-4">
            Page en cours de construction
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default Chronogramme;
