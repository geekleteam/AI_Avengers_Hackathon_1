# AI_Avengers_Hackathon_1

# Project Overview

This project is focused on creating a comprehensive Solution Mapper using AI to automatically generate an architecture board, complete with solutions and workflows. The main components of the project include:

1. **Interactive Architecture Canvas**: AI-assisted design for an architecture canvas.
2. **AI API Development**: Using LangChain to create Mermaid.js diagrams from user prompts while maintaining history.
3. **Backend Development**: Storing user history and preferences.
4. **Frontend Development**: Features include login, chat interface, history, and account settings.
5. **DevOps**: Deployment and CI/CD tasks.

## Project Video





## Team Information

We are a team of 5 participating in this hackathon, collectively known as the TIGER TEAM.

## User Profile

### Technology Expertise
- Fullstack development
- React.js, Next.js, Node.js
- GCP Cloud Run
- Vercel

### URLS
- Frontend: https://diagram-xi.vercel.app/
- Backend: https://fastapi-app-723gb5roxq-uc.a.run.app

## Technical Details

### Tools and Technologies

- React.js, Next.js for web development
- GCP Cloud Run for cloud services
- Vercel for deployment
- Trello for task management
- LangChain for AI API development
- Mermaid.js for diagram generation


### Backend Considerations
- Fast database we are using convex

## Running the AI Folder Locally

To run the AI folder locally, follow these steps:

1. Navigate to the AI directory:
    ```sh
    cd ai
    ```

2. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

3. Serve the LangChain API:
    ```sh
    langchain serve
    ```
   **Python Version:** 3.10

## Running the Frontend Folder Locally

To run the AI folder locally, follow these steps:

1. Navigate to the frontend directory:
    ```sh
    cd frontend\SolutionMapper
    ```

2. Install the required packages:
    ```sh
    yarn
    ```

3. Serve the LangChain API:
    ```sh
    yarn dev
    ```
### Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

```plaintext
KINDE_CLIENT_ID
KINDE_CLIENT_SECRET
KINDE_ISSUER_URL
KINDE_SITE_URL
KINDE_POST_LOGOUT_REDIRECT_URL
KINDE_POST_LOGIN_REDIRECT_URL
CONVEX_DEPLOYMENT
NEXT_PUBLIC_CONVEX_URL
