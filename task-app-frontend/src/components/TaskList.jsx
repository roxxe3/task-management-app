import React from "react";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TaskList = ({ filteredTasks, toggleTaskCompletion, handleDeleteTask, priorityColors, searchQuery, onReorderTasks, categories }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderTasks(items);
  };

  return (
    <div className="space-y-4">
      {filteredTasks.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1
                        }}
                      >
                        <TaskItem
                          task={task}
                          toggleTaskCompletion={toggleTaskCompletion}
                          handleDeleteTask={handleDeleteTask}
                          priorityColors={priorityColors}
                          categories={categories}
                          onTaskUpdated={(updatedTask) => {
                            const newTasks = filteredTasks.map(t => 
                              t.id === updatedTask.id ? updatedTask : t
                            );
                            onReorderTasks(newTasks);
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <i className="fas fa-tasks text-6xl"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "No tasks match your search criteria."
              : "You don't have any tasks in this category yet."}
          </p>
          <button
            className="text-white px-4 py-2 rounded-lg transition-colors cursor-pointer !rounded-button whitespace-nowrap"
            style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;