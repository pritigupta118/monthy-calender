# Monthly Calender

A modern, interactive resource calendar built with React and TypeScript. This application allows users to manage and schedule events across different resources with an intuitive drag-and-drop interface.

## Features

- 📅 Interactive calendar view with resource management
- 🎨 Color-coded events for better visualization
- 🖱️ Drag-and-drop functionality for event creation and management
- 💾 Local storage persistence for events and resources
- 📱 Responsive design for various screen sizes
- 🎯 Resource-based event organization
- 🔄 Event duration visualization
- ⚡ Real-time updates

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Vite (for build tooling)

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd monthly-calendar
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

## Usage

### Creating Events
- Click and drag across dates in a resource row to create a new event
- The event will be automatically assigned a unique color

### Moving Events
- Drag and drop events horizontally to change their dates
- Events can be moved between different resources

### Managing Resources
- Click the '+' button in the resources column to add a new resource
- Each resource has its own timeline for better organization

### Deleting Events
- Hover over an event and click the 'X' icon to delete it
- A confirmation dialog will appear before deletion

## Local Storage

The application automatically saves:
- All events
- Resource configurations
- Current calendar view state

Data persists across page refreshes and browser sessions.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
  ├── components/
  │   └── Calendar.tsx    # Main calendar component
  ├── App.tsx            # Root application component
  ├── main.tsx          # Application entry point
  └── index.css         # Global styles
```

## Assignment Reflections

### Three Key Learnings

1. **Complex State Management**: Learned how to effectively manage multiple interconnected states in a React application, particularly for drag-and-drop operations where multiple pieces of state need to be coordinated simultaneously.

2. **Date Manipulation**: Gained deeper understanding of JavaScript Date object manipulation, especially when dealing with calendar-specific operations like calculating event durations and handling date ranges.

3. **Performance Optimization**: Learned the importance of optimizing render cycles and state updates in a complex UI, particularly when dealing with drag operations and frequent updates.

### Most Challenging Aspect

The most challenging part was implementing the drag-and-drop functionality for both creating and moving events. This required careful coordination of multiple event handlers and state updates while ensuring a smooth user experience. Specifically:
- Managing the interaction between event creation drag and event movement drag
- Ensuring accurate positioning of events across different date ranges
- Handling edge cases like dragging across month boundaries

### Future Improvements

Given more time, these improvements would enhance the application:

1. **Advanced Features**:
   - Recurring events support
   - Multi-resource event spanning
   - Custom event colors and categories
   - Timeline zooming capabilities

2. **Performance Optimizations**:
   - Virtual scrolling for large datasets
   - Optimized rendering for many simultaneous events
   - Debounced state updates for smoother interactions

3. **User Experience**:
   - Keyboard shortcuts for common actions
   - Undo/redo functionality
   - More customizable view options (week, day views)
   - Better mobile responsiveness


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.