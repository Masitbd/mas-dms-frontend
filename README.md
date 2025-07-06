# MAS Pharmacy Frontend

This is the frontend for the MAS Pharmacy Management System, a comprehensive solution for managing pharmacy operations. This application is built with Next.js, Redux, and rsuite.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Deployment](#deployment)

## Features

- **User Management:** Add, edit, and manage user accounts.
- **Medicine Category Management:** Organize and categorize medicines.
- **Authentication:** Secure login and registration functionality using NextAuth.js.
- **Responsive UI:** The application is designed to work on various screen sizes.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/mas-pharmacy-frontend.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd mas-pharmacy-frontend
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **UI Library:** [rsuite](https://rsuitejs.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Yup](https://github.com/jquense/yup) & [Zod](https://zod.dev/)
- **API Communication:** [Axios](https://axios-http.com/)
- **Icons:** [Font Awesome](https://fontawesome.com/), [Heroicons](https://heroicons.com/), [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Project Structure

The project follows a standard Next.js `src` directory structure.

- `src/app`: Contains the application's pages and layouts.
- `src/components`: Reusable components used throughout the application.
- `src/redux`: Redux store, slices, and API definitions.
- `src/lib`: Utility functions and custom hooks.
- `src/helpers`: Helper functions for various tasks.
- `src/enums`: Enum definitions.
- `public`: Static assets like images and fonts.

## Authentication

Authentication is handled by NextAuth.js. The configuration can be found in `src/app/api/auth/[...nextauth]`. The `middleware.ts` file protects routes and handles redirection based on user authentication status.

## Deployment

The application is ready to be deployed on any platform that supports Next.js, such as Vercel or Netlify.