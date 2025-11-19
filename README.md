## Description

This is the frontend application for a Helpdesk Ticket Maintenance System, inspired by Jira. It provides a clean, structured UI/UX for users to manage support tickets with role-based access (L1: Helpdesk Agent, L2: Technical Support, L3: Advanced Support). Built with React, Vite, TypeScript, and Tailwind CSS, it integrates with the backend API for ticket creation, tracking, escalation, and resolution.

## Features

- **Role-Based Login**: Secure authentication with JWT, redirecting to role-specific dashboards.
- **Ticket Management**: Create, view, update, and escalate tickets.
- **Ticket List**: Filterable list by status, priority, and escalation level.
- **Ticket Details**: View description, history, logs, and current status.
- **Escalation**: Escalate tickets with notes, following L1 → L2 → L3 workflow.
- **File Uploads**: Support for attachments with drag-and-drop.
- **Responsive UI**: Clean, minimal design using Tailwind CSS and Radix UI components.
- **Dark/Light Theme**: Theme switching with next-themes.
- **Form Validation**: Zod-based validation with React Hook Form.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (Dialog, Dropdown, Tabs, etc.)
- **State Management**: TanStack React Query for API calls
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns, moment
- **File Handling**: React Dropzone
- **Other**: Axios for HTTP requests, Slate for rich text, Sonner for toasts

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd client
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables. Create a `.env` file in the root directory with the following:

   ```
   VITE_API_BASE_URL=<your-backend-api-url>
   ```

4. Ensure the backend server is running (refer to backend README).

## Usage

### Development

Run the development server with hot reloading:

```
npm run dev
```

The app will run on `http://localhost:5173` (default Vite port).

### Build for Production

Build the app:

```
npm run build
```

Preview the build:

```
npm run preview
```

### Linting

Check for linting issues:

```
npm run lint
```

### Example Credentials

For testing purposes, use the following example login credentials (ensure these users are seeded in the backend database):

- **L1 Helpdesk Agent**:

  - Email: l1@mail.com
  - Password: 12345678

- **L2 Technical Support**:

  - Email: l2@mail.com
  - Password: 12345678

- **L3 Advanced Support**:
  - Email: l3@mail.com
  - Password: 12345678

## Project Structure

```
client/
├── src/
│   ├── components/      # Reusable UI components (e.g., buttons, dialogs)
│   ├── pages/           # Page components (e.g., Login, TicketList, TicketDetail)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (e.g., API client, utils)
│   ├── types/           # TypeScript types
│   ├── styles/          # Global styles and Tailwind config
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
└── package.json
```
