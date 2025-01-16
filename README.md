# G.M.P Frontend

**Gestion et Management de Projet**

This repository contains the frontend code for the GMP project.

## About GMP

GMP is a web application designed to help manage projects and activities for Ravinala personnel.

### Key Features

- **Budget Management**:  
  Manage project budgets, including their amounts, unique codes, and the department sources.

- **Resource Management**:  
  Track and organize all the materials required for a project, such as cameras, chairs, and other equipment.

- **Project Phases**:  
  Define and manage the phases of a project. Each project consists of one or multiple phases, which outline the project's progress.

- **Team Management**:  
  Assign roles and manage project teams, including:
  - Project Owners: Responsible for overseeing the project.
  - Team Members: Individuals tasked with executing the project.
  - Observers: Users who can monitor the project's progress.

### Authentication

Access to GMP requires Active Directory credentials. Use your Ravinala account in the format `your-matricule@ravinala-airports.aero` along with your Active Directory password to log in.

### Activity Tracking

With GMP, you can also manage individual activities, such as:

- **Intercontract**: Non-project-related activities or idle periods where no project work is performed.
- **Transverse Activities**: Tasks that may or may not be project-related, such as meetings, onboarding sessions, or training.

These features help track the time spent on various activities and ensure efficient management of resources and personnel.

## Table of Contents

- [About GMP](#about-gmp)
  - [Key Features](#key-features)
  - [Authentication](#authentication)
  - [Activity tracking](#activity-tracking)
- [Table of contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)

## Installation

To set up the project, follow these steps:

1. Install the required dependencies by running the following command

```bash
npm install
```

2. Copy the content of the `.env.example` file into a new file named `.env` and configure the link `VITE_API_ENDPOINT` to match your ip.

## Usage

To start the development server, run:

```bash
npm run dev
```

To build the project for production, run:

```bash
npm run build
```
