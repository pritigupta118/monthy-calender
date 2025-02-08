import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';

// Type definitions for events and resources
interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
  resource: string;
  color: string;
}

interface Resource {
  id: string;
  name: string;
}

// Predefined colors for events
const eventColors = [
  'bg-red-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-pink-200',
  'bg-purple-200',
  'bg-indigo-200',
  'bg-cyan-200',
  'bg-orange-200',
  'bg-teal-200'
];

// Initial sample events
const initialEvents: Event[] = [
  {
    id: 1,
    title: 'Event 1',
    start: '2025-02-02 12:00',
    end: '2025-02-04 12:00',
    resource: 'Resource A',
    color: 'bg-red-200'
  },
  {
    id: 2,
    title: 'Event 2',
    start: '2025-02-11 09:00',
    end: '2025-02-14 15:00',
    resource: 'Resource C',
    color: 'bg-blue-200'
  }
];

// Initial resource list
const initialResources: Resource[] = [
  { id: 'a', name: 'Resource A' },
  { id: 'b', name: 'Resource B' },
  { id: 'c', name: 'Resource C' },
  { id: 'd', name: 'Resource D' },
  { id: 'e', name: 'Resource E' }
];

const Calendar: React.FC = () => {
   // State management with localStorage persistence
  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = localStorage.getItem('calendarDate');
    return savedDate ? new Date(savedDate) : new Date(2025, 1, 1);
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const savedResources = localStorage.getItem('calendarResources');
    return savedResources ? JSON.parse(savedResources) : initialResources;
  });

   // Drag state management
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ day: number; resource: string } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ day: number; resource: string } | null>(null);

  // UI state management
  const [showDeleteAlert, setShowDeleteAlert] = useState<{ show: boolean; eventId: number | null; eventTitle: string | null }>({
    show: false,
    eventId: null,
    eventTitle: null
  });
  const [newResourceName, setNewResourceName] = useState('');
  const [showResourceInput, setShowResourceInput] = useState(false);
  const [draggingEvent, setDraggingEvent] = useState<Event | null>(null);

    // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('calendarDate', currentDate.toISOString());
  }, [currentDate]);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('calendarResources', JSON.stringify(resources));
  }, [resources]);

   // Calendar utility functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

    // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

   // Event creation drag handlers
  const handleDragStart = (e: React.MouseEvent, day: number, resource: string) => {
     // Only start dragging if clicking directly on the resource cell
    if ((e.target as HTMLElement).classList.contains('resource-cell')) {
      setIsDragging(true);
      setDragStart({ day, resource });
      setDragEnd({ day, resource });
    }
  };

  const handleDragMove = (day: number, resource: string) => {
    if (isDragging) {
      setDragEnd({ day, resource });
    }
  };

  const handleDragEnd = () => {
    if (isDragging && dragStart && dragEnd) {
      const startDay = Math.min(dragStart.day, dragEnd.day);
      const endDay = Math.max(dragStart.day, dragEnd.day);
      
       // Create new event with calculated dates
      const newEvent: Event = {
        id: Date.now(),
        title: 'New Event',
        start: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')} 00:00`,
        end: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')} 23:59`,
        resource: dragStart.resource,
        color: eventColors[events.length % eventColors.length]
      };

      setEvents(prevEvents => [...prevEvents, newEvent]);
    }

     // Reset drag state
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

   // Event movement drag handlers
  const handleEventDragStart = (event: React.DragEvent, eventToMove: Event) => {
    event.stopPropagation();
    setDraggingEvent(eventToMove);
    event.dataTransfer.setData('text/plain', eventToMove.id.toString());
    event.dataTransfer.effectAllowed = 'move';
    
    const eventElement = event.currentTarget as HTMLElement;
    eventElement.classList.add('opacity-50');
  };

  const handleEventDragEnd = (event: React.DragEvent) => {
    setDraggingEvent(null);
    const eventElement = event.currentTarget as HTMLElement;
    eventElement.classList.remove('opacity-50');
  };

  const handleEventDrop = (event: React.DragEvent, resource: string, day: number) => {
    event.preventDefault();
    const eventId = parseInt(event.dataTransfer.getData('text/plain'));
    const draggedEvent = events.find(e => e.id === eventId);

    if (draggedEvent) {
      // Calculate new dates while preserving duration
      const startDate = new Date(draggedEvent.start);
      const endDate = new Date(draggedEvent.end);
      const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const newStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + duration);

      const updatedEvent = {
        ...draggedEvent,
        start: `${newStartDate.getFullYear()}-${String(newStartDate.getMonth() + 1).padStart(2, '0')}-${String(newStartDate.getDate()).padStart(2, '0')} ${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
        end: `${newEndDate.getFullYear()}-${String(newEndDate.getMonth() + 1).padStart(2, '0')}-${String(newEndDate.getDate()).padStart(2, '0')} ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
        resource
      };

      setEvents(events.map(e => (e.id === eventId ? updatedEvent : e)));
    }
  };

  // Event deletion handlers
  const handleDeleteEvent = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    const eventToDelete = events.find(event => event.id === eventId);
    if (eventToDelete) {
      setShowDeleteAlert({
        show: true,
        eventId,
        eventTitle: eventToDelete.title
      });
    }
  };

  const confirmDelete = () => {
    if (showDeleteAlert.eventId !== null) {
      setEvents(prevEvents => prevEvents.filter(e => e.id !== showDeleteAlert.eventId));
      setShowDeleteAlert({ show: false, eventId: null, eventTitle: null });
    }
  };

  const cancelDelete = () => {
    setShowDeleteAlert({ show: false, eventId: null, eventTitle: null });
  };

  // Resource management handlers
  const handleAddResource = () => {
    if (newResourceName.trim()) {
      const newResource: Resource = {
        id: `resource-${Date.now()}`,
        name: newResourceName.trim()
      };
      setResources([...resources, newResource]);
      setNewResourceName('');
      setShowResourceInput(false);
    }
  };

  const renderDayHeaders = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dayName = getDayName(date);
      days.push(
        <div
          key={i}
          className={`flex-none w-24 border-l border-gray-200 text-center ${
            isToday(i) ? 'bg-blue-50' : ''
          }`}
        >
          <div className="py-2">
            <div className={`text-sm font-medium ${isToday(i) ? 'text-blue-600' : ''}`}>
              {i} {dayName}
            </div>
          </div>
        </div>
      );
    }
    return days;
  };

  // Event positioning and styling
  const getEventStyle = (event: Event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const duration = endDay - startDay + 1;
    
    return {
      gridColumnStart: startDay,
      gridColumnEnd: `span ${duration}`,
      marginTop: '4px',
      marginBottom: '4px',
      position: 'absolute',
      left: `${(startDay - 1) * 96}px`,
      width: `${duration * 96 - 4}px`,
      zIndex: 10
    };
  };

  const renderResourceEvents = (resource: Resource) => {
    const resourceEvents = events.filter(event => event.resource === resource.name);
    return resourceEvents.map(event => (
      <div
        key={event.id}
        className={`${event.color} rounded px-2 py-1 text-sm cursor-move relative group transition-opacity duration-200`}
        style={getEventStyle(event) as React.CSSProperties}
        draggable
        onDragStart={(e) => handleEventDragStart(e, event)}
        onDragEnd={handleEventDragEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="truncate">
          {event.title}
          <div className="text-xs opacity-75">
            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button
            onClick={(e) => handleDeleteEvent(e, event.id)}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    ));
  };

  const renderDragSelection = () => {
    if (!isDragging || !dragStart || !dragEnd) return null;

    const startDay = Math.min(dragStart.day, dragEnd.day);
    const endDay = Math.max(dragStart.day, dragEnd.day);
    const duration = endDay - startDay + 1;

    return (
      <div
        className="absolute bg-blue-100 opacity-50 rounded"
        style={{
          left: `${(startDay - 1) * 96}px`,
          width: `${duration * 96 - 4}px`,
          top: '0',
          bottom: '0'
        }}
      />
    );
  };

  const renderDayColumns = (resource: Resource) => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          className={`resource-cell h-full border-l border-gray-200 ${
            draggingEvent ? 'bg-blue-50/20' : ''
          }`}
          style={{
            width: '96px',
            position: 'absolute',
            left: `${(i - 1) * 96}px`,
            top: 0,
            bottom: 0
          }}
          onMouseDown={(e) => handleDragStart(e, i, resource.name)}
          onMouseEnter={() => handleDragMove(i, resource.name)}
          onMouseUp={handleDragEnd}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => handleEventDrop(e, resource.name, i)}
        />
      );
    }
    return days;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
        {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
          onClick={handleToday}
        >
          Today
        </button>
      </div>

{/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="flex">
             {/* Resource Column */}
          <div className="flex-none w-40 border-r border-gray-200">
            <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
              <span className="font-medium">Resources</span>
              <button
                onClick={() => setShowResourceInput(true)}
                className="text-blue-600 hover:bg-blue-50 rounded p-1"
              >
                <Plus size={16} />
              </button>
            </div>
            {showResourceInput && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={newResourceName}
                  onChange={(e) => setNewResourceName(e.target.value)}
                  placeholder="Resource name"
                  className="w-full px-2 py-1 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddResource}
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowResourceInput(false)}
                    className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {resources.map(resource => (
              <div key={resource.id} className="h-20 border-b border-gray-200 px-4 py-2">
                <div className="font-medium">{resource.name}</div>
              </div>
            ))}
          </div>

 {/* Calendar Grid */}
          <div className="flex-1">
            <div className="flex border-b border-gray-200">
              {renderDayHeaders()}
            </div>

            <div className="relative">
              {resources.map(resource => (
                <div key={resource.id} className="h-20 border-b border-gray-200 relative">
                  <div style={{ position: 'relative', height: '100%', width: `${getDaysInMonth(currentDate) * 96}px` }}>
                    {renderDayColumns(resource)}
                    {renderResourceEvents(resource)}
                    {dragStart?.resource === resource.name && renderDragSelection()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

 {/* Delete Confirmation Modal */}
      {showDeleteAlert.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Event</h3>
            <p className="mb-4">
              Are you sure you want to delete "{showDeleteAlert.eventTitle}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;