# Wiki Teia V2

Wiki Teia V2 is a comprehensive web platform built with Next.js, Prisma, and NextAuth. It's designed to facilitate corporate training, knowledge sharing, and performance feedback through a structured system of courses, workshops, evaluations, and resource management.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Handling:** [date-fns](https://date-fns.org/) & [React Day Picker](http://react-day-picker.js.org/)
- **File Storage:** [Vercel Blob](https://vercel.com/storage/blob)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Project Structure

The project is organized as follows:

```
src/
├── app/                  # Next.js App Router: pages, layouts, actions, API routes
│   ├── actions/          # Server-side actions (form submissions, mutations)
│   ├── api/              # API route handlers
│   ├── biblioteca/       # Route group for "Biblioteca" section
│   ├── dashboard/        # Route group for "Dashboard" section
│   ├── devolutiva/       # Route group for "Devolutiva" section
│   ├── formacao/         # Route group for "Formacao" section
│   ├── gerenciamento/    # Route group for "Gerenciamento" section
│   ├── lib-manegement/   # Route group for "Lib Management" section
│   ├── login/            # Route group for "Login" section
│   └── providers/        # React context providers
├── components/           # Reusable UI components
│   ├── ui/               # Generic UI elements (Button, Card, etc.)
│   └── (feature-specific)/ # Components for specific features/pages
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and library configurations (Prisma, NextAuth)
├── middleware.ts         # Next.js request middleware
└── stores/               # Zustand state management stores
```

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm (or yarn/pnpm)
- Prisma CLI (`npm install -g prisma`)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd wiki-teiav2
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary environment variables.
    You will likely need:
    ```env
    # Prisma
    DATABASE_URL="your_database_connection_string" # e.g., "postgresql://user:password@host:port/database?schema=public"

    # NextAuth
    NEXTAUTH_URL="http://localhost:3000" # Change if your app runs on a different port/domain
    NEXTAUTH_SECRET="your_super_secret_key_here" # Generate a strong secret

    # Microsoft Azure Active Directory (for authentication)
    AZURE_AD_CLIENT_ID="your_azure_ad_client_id"
    AZURE_AD_CLIENT_SECRET="your_azure_ad_client_secret"
    AZURE_AD_TENANT_ID="your_azure_ad_tenant_id"

    # Vercel Blob Storage (for file uploads)
    BLOB_READ_WRITE_TOKEN="your_vercel_blob_read_write_token" # Get this from your Vercel project settings
    ```
    **Note:** Obtain the correct values for your specific setup. For `NEXTAUTH_SECRET`, you can generate one using `openssl rand -base64 32`.
    The Azure AD variables are required if you intend to use the Azure AD authentication provider.
    The `BLOB_READ_WRITE_TOKEN` is required for file upload functionality.

4.  **Run database migrations:**
    ```bash
    prisma migrate dev
    ```
    This will create the database schema based on `prisma/schema.prisma`. You might also need to seed the database if seed scripts are available.

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running at [http://localhost:3000](http://localhost:3000).

## Available Scripts

-   `npm run dev`: Starts the Next.js development server.
-   `npm run build`: Generates the Prisma client and builds the application for production.
-   `npm run start`: Starts the Next.js production server.
-   `npm run lint`: Lints the codebase using ESLint.

## Features

This platform offers a range of features to support learning and development, including:

-   **User Authentication:** Secure login via Microsoft Azure Active Directory.
-   **Dashboard:** Personalized dashboard for users to track progress and access content.
-   **Formação (Training/Education) Module:**
    -   Access diverse training materials (videos, PDFs, PPTX).
    -   Track completion progress of training modules and workshops.
-   **Devolutiva (Feedback/Evaluation) Module:**
    -   Submit assignments and materials for evaluation.
    -   Schedule and manage feedback sessions.
    -   Receive and provide ratings/reviews for submissions.
    -   Integration with Microsoft Teams for scheduling and conducting feedback meetings.
-   **Workshops:** Participate in and manage workshops.
-   **Biblioteca (Library):** Access a central repository of documents and resources.
-   **Gerenciamento (Management) Module (likely for administrators):**
    -   Manage users and their roles/permissions.
    -   Organize and manage training content, categories, and library resources.
-   **File Management:** Securely upload and store files using Vercel Blob storage.

## Contributing

Contributions are welcome! Please refer to the `CONTRIBUTING.md` file (to be created) for detailed guidelines on how to contribute to this project, including code style, commit message conventions, and pull request process.

If you have suggestions or want to report an issue, please use the GitHub Issues tracker.

## License

This project is licensed under the [**TODO: Specify License, e.g., MIT License, Apache 2.0, or state "All Rights Reserved"**]. Please see the `LICENSE` file (to be created) for more details.

---

*This README provides a general overview. More specific documentation may be available within relevant modules or a dedicated documentation site.*
