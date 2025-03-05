import React, { useEffect, useRef } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { gantt } from "dhtmlx-gantt";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  text: string;
  start_date: string;
  end_date?: string;
  duration?: number;
}
interface GanttChartProps {
  tasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const ganttRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (ganttRef.current) {
      gantt.init(ganttRef.current);
      gantt.config.date_format = "%d-%m-%Y";

      gantt.config.subtask = true;
      gantt.config.drag_resize = true; // Modifier la durée
      gantt.config.drag_move = true; // Déplacer les tâches
      gantt.config.drag_progress = false; // Modifier la progression
      gantt.config.details_on_dblclick = false;
      gantt.config.drag_links = false;

      // gantt.attachEvent("onTaskDblClick", (id) => {
      //   navigate(`/gmp/project/details/${id}/details`);
      //   return false;
      // });

      gantt.config.columns = [
        { name: "text", label: "Projet", width: "*", tree: true },
        { name: "start_date", label: "Début", align: "center" },
        {
          name: "duration",
          label: "Durée (jours)",
          align: "center",
          template: function (task) {
            return (task.duration && task.duration <= 0) ||
              (task.end_date &&
                task.start_date &&
                new Date(task.start_date).getTime() ===
                  new Date(task.end_date).getTime())
              ? "non défini"
              : task.duration;
          },
        },
      ];
      gantt.locale = {
        date: {
          month_full: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          month_short: [
            "Jan",
            "Fév",
            "Mar",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Août",
            "Sep",
            "Oct",
            "Nov",
            "Déc",
          ],
          day_full: [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
          ],
          day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        },

        labels: {
          new_task: "Nouvelle tâche",
          icon_save: "Sauvegarder",
          icon_cancel: "Annuler",
          icon_edit: "Modifier",
          icon_delete: "Supprimer",
          confirm_closing: "Vos modifications seront perdues, continuer ?",
          confirm_deleting: "Voulez-vous vraiment supprimer cette tâche ?",
          section_description: "Description",
          section_time: "Période",
          column_text: "Nom de la tâche",
          column_start_date: "Début",
          column_duration: "Durée",
          icon_details: "",
          section_type: "",
          section_deadline: "",
          section_baselines: "",
          column_wbs: "",
          column_add: "",
          link: "",
          confirm_link_deleting: "",
          link_start: "",
          link_end: "",
          type_task: "",
          type_project: "",
          type_milestone: "",
          minutes: "",
          hours: "",
          days: "",
          weeks: "",
          months: "",
          years: "",
          message_ok: "",
          message_cancel: "",
          section_constraint: "",
          constraint_type: "",
          constraint_date: "",
          asap: "",
          alap: "",
          snet: "",
          snlt: "",
          fnet: "",
          fnlt: "",
          mso: "",
          mfo: "",
          resources_filter_placeholder: "",
          resources_filter_label: "",
        },
      };

      gantt.clearAll();
      gantt.parse({
        data: tasks,
      });
    }
  }, [tasks]);

  const goToToday = () => {
    gantt.showDate(new Date());
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={goToToday}
        className="mb-2 ml-4 px-4 py-2  text-white  transition border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
      >
        Aller à aujourd'hui
      </button>
      <div
        ref={ganttRef}
        className="h-[500px] md:h-[700px] w-full rounded-lg"
      />
    </div>
  );
};

export default GanttChart;
