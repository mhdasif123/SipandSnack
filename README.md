# Sip & Snack - Employee Ordering System

This is a simple, modern web application built with Next.js that allows employees to order tea and snacks. It features a separate admin dashboard for managing employees, menu items, and viewing order history.

## ✨ Features

-   **Employee Ordering**: A clean, user-friendly form for employees to place their daily tea and snack orders. The total order cost is calculated automatically.
-   **Daily Order Limit**: Employees can only place one order per day.
-   **Admin Dashboard**: A secure area for administrators to manage the application.
    -   **Order Tracking**: View all employee orders with daily, weekly, and monthly filters.
    -   **Employee Management**: Add, edit, and delete employee records.
    -   **Menu Management**: Full CRUD (Create, Read, Update, Delete) functionality for tea and snack items.
    -   **Report Generation**: Generate and export order reports in PDF or CSV format for a selected date range.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20 or later recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To run the application in development mode, execute the following command:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

-   The main ordering page is at `/`.
-   The admin login page is at `/login`.

## ☁️ Hosting on Firebase

This application is pre-configured for deployment on **Firebase App Hosting**.

To deploy your application:

1.  **Create a Firebase Project**: If you don't have one already, go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable App Hosting**: Within your new Firebase project, navigate to the App Hosting section and create a new backend.
3.  **Connect your GitHub Repository**: Follow the on-screen instructions to connect your GitHub account and select this repository.
4.  **Deploy**: Firebase App Hosting will automatically build and deploy your application. Subsequent pushes to your main branch will trigger new deployments automatically.

Firebase requires a billing account on file (even for the free tier) for identity verification and to handle any usage that goes beyond the free limits. You will **not** be charged as long as your usage stays within the generous free tier.
