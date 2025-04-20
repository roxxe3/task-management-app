import React from "react";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateTaskPositions } from "../services/taskService";

// Empty state component
const EmptyState = ({ searchQuery, onAddTask }) => {
  const { icon, title, message, showAdd } = searchQuery
    ? {
        icon: "fa-search",
        title: "No matching tasks",
        message: "Try adjusting your search terms",
        showAdd: false
      }
    : {
        icon: "fa-clipboard-check",
        title: "No tasks yet",
        message: "Add your first task to get started",
        showAdd: true
      };

  return (
    <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-8 text-center">
      <div className="w-32 h-32 mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-[#caff17] opacity-10 rounded-full animate-ping"></div>
        <div className="relative flex items-center justify-center w-full h-full">
          <i className={`fas ${icon} text-7xl text-gray-400`}></i>
        </div>
      </div>
      <h3 className="text-2xl font-medium text-white mb-3">{title}</h3>
      <p className="text-gray-400 mb-6 text-lg">{message}</p>
      {showAdd && (
        <button
          onClick={onAddTask}
          className="inline-flex items-center px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#caff17] focus:ring-offset-[#2d2d2d]"
          style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
        >
          <i className="fas fa-plus mr-2"></i>
          Add Your First Task
        </button>
      )}
    </div>
  );
};

const TaskList = ({ 
  filteredTasks, 
  toggleTaskCompletion, 
  handleDeleteTask, 
  searchQuery, 
  onReorderTasks, 
  categories, 
  onAddTask 
}) => {
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update frontend state immediately for responsiveness
    onReorderTasks(items);
    
    // Save new positions to backend
    try {
      const startIdx = Math.min(result.source.index, result.destination.index);
      const endIdx = Math.max(result.source.index, result.destination.index);
      
      const taskPositions = items
        .slice(startIdx, endIdx + 1)
        .map((task, idx) => ({
          id: task.id,
          position: startIdx + idx
        }));
      
      await updateTaskPositions(taskPositions);
    } catch (error) {
      console.error("Failed to save task positions:", error);
    }
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
        <EmptyState searchQuery={searchQuery} onAddTask={onAddTask} />
      )}
    </div>
  );
};

export default TaskList;