# FoxDash - Business Management System

This is a Next.js application built with Firebase, ShadCN UI, and Genkit for AI features. It provides a comprehensive dashboard for managing clients, installments, users, and generating business reports.

## Getting Started

First, install the project dependencies. You will need [Node.js](https://nodejs.org/) installed on your system.

```bash
npm install
```

## Running the Development Servers

This project uses two separate development servers: one for the Next.js application and another for the Genkit AI flows. You'll need to run both in separate terminal windows.

**1. Run the Next.js App:**

```bash
npm run dev
```

This will start the main application, typically available at [http://localhost:9002](http://localhost:9002).

**2. Run the Genkit AI Server:**

To enable the AI-powered features like revenue forecasting and custom reports, run the Genkit development server:

```bash
npm run genkit:watch
```

This command watches for changes in your AI flow files and keeps the service running.

## Available Scripts

- **`npm run dev`**: Starts the Next.js development server with Turbopack.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts a production server.
- **`npm run lint`**: Runs the linter to check for code quality issues.
- **`npm run typecheck`**: Runs the TypeScript compiler to check for type errors.
- **`npm run genkit:dev`**: Starts the Genkit development server.
- **`npm run genkit:watch`**: Starts the Genkit development server in watch mode.
