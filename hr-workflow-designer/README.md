# HR Workflow Designer

A visual workflow designer prototype built with **React** and **React Flow** for creating and testing HR workflows such as onboarding, leave approval, and document verification.

Built as a case study for **Tredence Analytics — AI Agents Engineering Team**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
cd hr-workflow-designer
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture

### Tech Stack
- **React 19** — UI framework
- **Vite 8** — Build tool & dev server
- **React Flow (v12)** — Drag-and-drop workflow canvas
- **Vanilla CSS** — Custom design system with CSS variables

### Folder Structure
```
src/
├── api/
│   └── mockApi.js             # Mock REST API layer
├── components/
│   ├── canvas/
│   │   ├── WorkflowCanvas.jsx # React Flow canvas wrapper
│   │   └── NodeSidebar.jsx    # Draggable node palette
│   ├── nodes/
│   │   ├── StartNode.jsx      # Start workflow entry point
│   │   ├── TaskNode.jsx       # Human task step
│   │   ├── ApprovalNode.jsx   # Manager approval step
│   │   ├── AutomatedNode.jsx  # System automated action
│   │   ├── EndNode.jsx        # Workflow completion
│   │   └── nodeTypes.js       # Node type registry
│   ├── forms/
│   │   ├── NodeFormPanel.jsx  # Context-aware form router
│   │   ├── StartForm.jsx      # Start node config
│   │   ├── TaskForm.jsx       # Task node config
│   │   ├── ApprovalForm.jsx   # Approval node config
│   │   ├── AutomatedForm.jsx  # Automated step config
│   │   └── EndForm.jsx        # End node config
│   └── sandbox/
│       └── SandboxPanel.jsx   # Workflow simulation panel
├── hooks/
│   ├── useWorkflow.js         # Workflow state management
│   └── useAutomations.js      # Mock API data hook
├── utils/
│   ├── validation.js          # Graph validation (cycles, connectivity)
│   └── serializer.js          # JSON serialization/deserialization
├── App.jsx                    # Main app shell
├── App.css                    # Component styles
├── index.css                  # Design system (CSS variables)
└── main.jsx                   # React entry point
```

### Design Decisions

1. **Separation of Concerns** — Canvas logic, node rendering, form editing, and API interaction are in separate directories. Each concern is independently testable and extendable.

2. **Custom Hooks** — `useWorkflow` manages all React Flow state (nodes, edges, selection) and exposes CRUD operations. `useAutomations` handles data fetching with loading states.

3. **Dynamic Form System** — `NodeFormPanel` uses a registry pattern to map node types to form components. Adding a new node type only requires creating a new form component and registering it.

4. **Mock API Layer** — `mockApi.js` simulates REST endpoints with realistic delays. The `simulateWorkflow` function performs BFS graph traversal to generate step-by-step execution logs.

5. **Graph Validation** — Uses DFS-based cycle detection (3-color algorithm) and BFS reachability analysis to validate workflow structure before simulation.

6. **CSS Design System** — Custom properties for colors, spacing, radii, and transitions. Dark theme with glassmorphism for a modern, premium feel.

---

## ✅ Features Completed

### Workflow Canvas
- [x] Drag-and-drop nodes from sidebar onto canvas
- [x] 5 custom node types (Start, Task, Approval, Automated, End)
- [x] Connect nodes with animated edges
- [x] Select and delete nodes/edges
- [x] Snap-to-grid for neat alignment
- [x] Mini-map with color-coded nodes
- [x] Zoom and pan controls

### Node Configuration Forms
- [x] Start Node — Title + dynamic key-value metadata
- [x] Task Node — Title (required), Description, Assignee, Due Date, custom fields
- [x] Approval Node — Title, Approver Role dropdown, Auto-approve threshold
- [x] Automated Step — Title, Action dropdown (from mock API), dynamic parameters
- [x] End Node — End message, Summary toggle
- [x] Real-time node updates on the canvas

### Mock API
- [x] `GET /automations` — Returns 5 automated actions with parameter definitions
- [x] `POST /simulate` — BFS-based workflow execution simulation

### Workflow Sandbox
- [x] Simulate tab — Run step-by-step execution with timeline UI
- [x] Validate tab — Check structure with detailed error messages + stats
- [x] Export/Import tab — Download/upload workflow as JSON

### Bonus Features
- [x] Export/Import workflow as JSON
- [x] Mini-map and zoom controls
- [x] Workflow statistics (node count, edge count, task count)

---

## 🕐 What I'd Add With More Time

- **Undo/Redo** — Command pattern stack for all canvas operations
- **Auto-layout** — Dagre.js for automatic node positioning
- **Workflow Templates** — Pre-built templates (onboarding, leave approval, etc.)
- **Validation Indicators** — Red borders on invalid nodes directly on the canvas
- **Node Version History** — Track changes to individual node configurations
- **Unit Tests** — Jest + Testing Library for forms, hooks, and validation
- **TypeScript** — Full type safety for node data interfaces
- **Micro-frontends** — Modular federation for independent deployment

---

## 📄 License

MIT
