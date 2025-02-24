# wa-coding-exercise

# Walker Advertising Coding Exercise

This project is a proof-of-concept (POC) lead management system for Walker Advertising, designed to demonstrate a subset of my technical skills. It connects attorneys with consumers needing legal services through a REST API built with ASP.NET Core (C#) and a dashboard UI developed with Angular. Key skills showcased include backend API development, frontend UI design, unit testing, and containerization with Docker.

## Skills Showcased
- **Backend Development**: Built a RESTful API with ASP.NET Core 8, including Swagger for documentation.
- **Frontend Development**: Created a responsive Angular 19 dashboard with form validation and modals.
- **Unit Testing**: 
  - Wrote 29 unit tests for the backend using xUnit and FluentAssertions, with coverage reporting.
  - Developed 29 unit tests for the frontend using Jasmine and Karma, ensuring robust component testing.
- **Containerization**: Implemented Docker support with multi-service orchestration via Docker Compose.

## Table of Contents
- [Functional Specification](#functional-specification)
  - [Overview](#overview)
  - [API Details](#api-details)
    - [How to Use and Test the API](#how-to-use-and-test-the-api)
    - [Docker Deployment](#docker-deployment)
- [User Guide for the UI Dashboard](#user-guide-for-the-ui-dashboard)
  - [Overview](#overview-1)
  - [Local Setup](#local-setup)
  - [Features](#features)
  - [How to Use the Dashboard](#how-to-use-the-dashboard)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running the Project](#running-the-project)
  - [Local Development](#local-development)
  - [Docker Compose](#docker-compose)

## Functional Specification

### Overview
- **Backend**: A RESTful API with Swagger documentation, accepting and managing leads.
- **Frontend**: An Angular dashboard to view and interact with leads.
- **Technologies**: C# (ASP.NET Core 8.0), Angular 19
- **Storage**: In-memory collection (no persistent database for this POC).
- **Out of Scope**: Actual email/text sending (simulated with console logs).
- **Docker Support**: Includes Docker Compose for containerized deployment.

### API Details
- **Base URL**: `http://localhost:5270/api/leads` (default local development URL)
- **Swagger UI**: Access detailed endpoint documentation at `http://localhost:5270/swagger` when the API is running.
- **Endpoints**:
  - `POST /api/leads`: Create a new lead (webhook endpoint).
  - `GET /api/leads`: Retrieve all leads.
  - `GET /api/leads/{id}`: Retrieve a specific lead by ID.
  - `POST /api/leads/{id}/notifications`: Send a simulated notification to a lead.
- **Validation**: Enforces numeric-only 10-digit phone numbers, 5-digit zip codes, and valid email formats (if provided).

#### How to Use and Test the API
1. **Local Setup**:
   - Navigate to `/walkeradvertisingapi`.
   - Run `dotnet restore` then `dotnet run` in the `WalkerAdvertisingApi` directory.
   - API runs on `http://localhost:5270`.

2. **Explore with Swagger**:
   - Open `http://localhost:5270/swagger` in your browser.
   - Use the interactive UI to:
     - Send a `POST /api/leads` request (e.g., `{"name":"Jane Doe","phoneNumber":"5551234567","zipCode":"90210","hasCommunicationPermission":true,"email":"jane@example.com"}`).
     - Fetch leads with `GET /api/leads`.
     - Test notifications with `POST /api/leads/{id}/notifications`.

4. **Back-End Unit Tests & Coverage**:
   - The `/walkeradvertisingapi` folder includes a test project with 29 unit tests, showcasing my ability to write robust tests using xUnit and FluentAssertions.
   - Run `dotnet test` in `/walkeradvertisingapi/WalkerAdvertisingApi.Tests` to execute them.
   - Run 'dotnet test WalkerAdvertisingApi.Tests/WalkerAdvertisingApi.Tests.csproj /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura /p:CoverletOutput=../coverage/' to generate a test report. 

#### Docker Deployment
1. **Prerequisites**: Docker and Docker Compose installed.
2. **Run Docker Compose**:
   - From the project root (where `docker-compose.yml` resides):
     ```
     docker-compose up --build
     ```
   - This demonstrates my skill in containerizing applications, building and running backend (port `5270`) and frontend (port `80`) containers.
3. **Access the UI**:
   - Open `http://localhost` in your browser to see the dashboard.
   - API is available at `http://localhost:5270` (e.g., Swagger at `http://localhost:5270/swagger`).
4. **Stop Containers**:
   - Run `docker-compose down` to stop and remove containers.

---

## User Guide for the UI Dashboard

### Overview
The Angular dashboard displays leads from the API and supports viewing details and adding new leads, highlighting my frontend development skills with Angular.

### Local Setup
1. Navigate to `/walker-advertising-frontend`.
2. Run `npm install` then `ng serve`.
3. Open `http://localhost:4200` in your browser (ensure the backend is running at `http://localhost:5270`).

### Features

#### Lead List
- **URL**: `/leads` (or `http://localhost/leads` with Docker)
- **Description**: Shows a paginated table of leads.
- **Columns**: Name, Phone Number (10-digit), Zip Code (5-digit), Consent Status, Email (if provided).
- **Actions**:
  - Click a row to view details in a modal.
  - Search by name using the search bar.
  - Navigate pages with pagination controls.

#### Lead Details Modal
- **Trigger**: Click a lead row.
- **Content**: Displays Name, Phone Number, Zip Code, Email, Communication Permission, and Creation Date.
- **Actions**: Close via the "Close" button.

#### Add Lead Modal
- **Trigger**: Click "Add New Lead" button (if implemented).
- **Content**: Form with fields:
  - Name (required)
  - Phone Number (required, 10 digits only)
  - Zip Code (required, 5 digits only)
  - Email (optional, must be valid if provided, e.g., "user@example.com")
  - Communication Permission (checkbox)
- **Actions**: Submit to add lead or Cancel.
- **Validation**: Numeric-only phone/zip, email format; button disabled until valid, showcasing input validation skills.

#### Send Message Modal
- **Trigger**: Click "Send Message" from the lead list (if implemented).
- **Content**: 
  - Dropdown for message type (Text or Email).
  - Recipient field (readonly, shows phone or email based on type).
  - Textarea for message (max 200 characters).
- **Actions**: 
  - Submit to send a simulated message; a success pop-up (e.g., toast) appears, but no actual communication is sent (logged to backend console).
  - Cancel to close the modal.
- **Validation**: Requires consent; email option disabled if no email is provided.

### How to Use the Dashboard
1. **View Leads**:
   - Go to `http://localhost` (Docker) or `http://localhost:4200/leads` (local).
   - Browse leads, use search (e.g., "Jane"), or paginate.
   - Click a lead to see details.

2. **Add a Lead**:
   - Open the "Add New Lead" modal (if available).
   - Enter valid data (e.g., Phone: "5551234567", Zip: "90210").
   - Submit; verify the lead appears in the list.

3. **Send a Message**:
   - From the lead list, click "Send Message" (if available).
   - Select "Text" or "Email", enter a message (e.g., "Test message").
   - Submit; observe a success pop-up message (e.g., "Message Sent"), confirming the action (no real communication occurs; check backend console for log).

4. **Test Validation**:
   - Enter letters in Phone Number or Zip Code (should be blocked).
   - Use an invalid email (e.g., "abc") to see validation feedback.
   - Try sending a message without consent to see restrictions.


---

## Project Structure
- **/walkeradvertisingapi**: ASP.NET Core API
  - `WalkerAdvertisingApi.csproj`: API project file
  - `WalkerAdvertisingApi.Tests/`: Test project with 17 unit tests
  - `Controllers/LeadsController.cs`: API endpoints
  - `Models/`: Data models
  - `Services/`: Business logic
- **/walker-advertising-frontend**: Angular Dashboard
  - `src/app/components/`: Components (e.g., `lead-list`, `lead-modal`)
  - `src/app/services/lead.service.ts`: API communication
  - `src/app/models/lead.ts`: Lead interface
- **docker-compose.yml**: Docker Compose configuration

## Prerequisites
- **Backend**: .NET Core 8, Visual Studio/Code
- **Frontend**: Node 20, Angular CLI 19
- **Docker**: Docker Desktop or Docker CLI with Compose
- **Test Coverage**: `coverlet.msbuild` (for .NET tests)

## Running the Project

### Local Development
1. **Backend**: `cd walkeradvertisingapi && dotnet run`
2. **Frontend**: `cd walker-advertising-frontend && npm install && ng serve`

### Docker Compose
1. From the project root:
   ```
   docker-compose up --build
