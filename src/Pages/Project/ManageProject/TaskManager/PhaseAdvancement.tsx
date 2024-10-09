import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Modal,
  ModalBody,
  ModalFooter,
} from "../../../../components/Modals/Modal";
import { CustomInput } from "../../../../components/UIElements";

// Initial data
const initialData = {
  columns: {
    "column-1": {
      id: "column-1",
      title: "Backlog",
      taskIds: ["task-1", "task-2", "task-3"],
    },
    "column-2": {
      id: "column-2",
      title: "En cours",
      taskIds: ["task-4", "task-5"],
    },
    "column-3": {
      id: "column-3",
      title: "Traité",
      taskIds: ["task-6"],
    },
    "column-4": {
      id: "column-4",
      title: "En pause",
      taskIds: [],
    },
    "column-5": {
      id: "column-5",
      title: "Abandonné",
      taskIds: [],
    },
  },
  tasks: {
    "task-1": { id: "task-1", content: "Task 1" },
    "task-2": { id: "task-2", content: "Task 2" },
    "task-3": { id: "task-3", content: "Task 3" },
    "task-4": { id: "task-4", content: "Task 4" },
    "task-5": { id: "task-5", content: "Task 5" },
    "task-6": { id: "task-6", content: "Task 6" },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4", "column-5"],
};

const PhaseAdvancement = () => {
  const [data, setData] = useState<any>(initialData);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOnDragEnd = (result: { destination: any; source: any; draggableId: any; }) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data?.columns[source.droppableId];
    const endColumn = data?.columns[destination.droppableId];

    // Moving within the same column
    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      // Moving between columns
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStart = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, draggableId);

      const newEnd = {
        ...endColumn,
        taskIds: endTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newEnd.id]: newEnd,
        },
      });
    }
  };

  return (
    <div className="p-5 ">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div style={{ display: "flex" }}>
          {data.columnOrder.map((columnId: string) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId: string | number) => data.tasks[taskId]);

            return (
              <div className="w-full">
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      className="m-2 rounded-md w-full p-2 "
                      {...provided.droppableProps}
                    >
                      <h3 className="mb-3 text-sm">{column.title}</h3>
                      {tasks.map((task: any, index: any) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-1 text-xs rounded-md shadow-2 ${
                                snapshot.isDragging ? "bg-green-50 dark:bg-emerald-100" : "bg-white dark:bg-boxdark"
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                {columnId === "column-1" && (
                  <div
                    className="border ml-4 p-1 cursor-pointer border-slate-300 hover:bg-slate-100 dark:hover:bg-boxdark2 flex justify-center text-xs"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  >
                    <span>+ ajouter une tache</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>
      {modalOpen && (
        <Modal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          header="Ajouter une tache"
          heightSize="80vh"
          widthSize="medium"
        >
          <ModalBody>
            <>
              <div className="space-y-2">
                <div className="font-semibold text-xs">Assigné à:</div>
                <div>
                  <span className="w-5 h-5 p-3 border flex rounded-full justify-center items-center cursor-pointer bg-zinc-200 hover:bg-zinc-300 border-zinc-200">
                    +
                  </span>
                </div>
              </div>
              <div>
                <CustomInput type="text" label="Titre" />
              </div>
              <div>
                <CustomInput type="textarea" label="Description" />
              </div>
            </>
          </ModalBody>
          <ModalFooter>
            <button
              className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2 "
              type="button"
            >
              Annuler
            </button>
            <button className="border dark:border-boxdark text-xs p-2 rounded-md bg-green-700 hover:opacity-85 text-white font-semibold">
              Créer
            </button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default PhaseAdvancement;
