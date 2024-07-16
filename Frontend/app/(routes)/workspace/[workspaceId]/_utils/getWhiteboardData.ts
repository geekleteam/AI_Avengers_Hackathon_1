import { DiagramType } from "@/app/_context/ChatContext";

export const getWhiteboardData = async (message: string, diagramType: DiagramType) => {
    // Simulate a network request
    return new Promise((resolve) => {
      setTimeout(() => {
        let mermaid_code = "sequenceDiagram\n    autonumber\n    participant User\n    participant UI as User Interface\n    participant Controller\n    participant Service\n    participant DB as Database\n\n    User->>UI: Clicks \"Create File\" Button\n    UI->>Controller: send createFile request\n    Controller->>Service: validateRequest()\n    Service->>DB: checkUserExistence()\n    DB-->>Service: return userExists\n    alt userExists\n        Service->>DB: insertFileRecord()\n        DB-->>Service: return fileCreated\n        Service-->>Controller: fileCreated\n        Controller-->>UI: show success message\n    else userNotExists\n        Service-->>Controller: showError(\"User does not exist\")\n        Controller-->>UI: show error message\n    end";
        resolve({ data: { mermaid_code, clarifying_questions: "" } });
      }, 1000);
    });
  };
  