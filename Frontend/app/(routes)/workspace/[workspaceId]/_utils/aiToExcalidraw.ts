import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import axios from "axios";

export interface AIPayload {
  diagram_type: string;
  details: string;
  project_id: string;
  conversation_id: string;
  user_id: string;
}

export default async function aiToExcalidraw(payload: AIPayload) {
  if (payload === null) {
    console.log('Payload is null, skipping Axios call.');
    return;
  }
  console.log("Starting aiToExcalidraw call");  // Debug log
  try {
    console.log("Making API request...");  // Debug log
    const response = await axios.post('https://fastapi-app-723gb5roxq-uc.a.run.app/graph', payload);
    console.log("API response received:", response.data);  // Debug log

    const { mermaid_code, clarifying_question, diagram_type, details, timestamp } = response.data;

    if (mermaid_code) {
      console.log("Mermaid data received");
      try {
        const { elements } = await parseMermaidToExcalidraw(mermaid_code);
        const excalidrawElements = convertToExcalidrawElements(elements);
        console.log("Mermaid data parsed successfully");
        return { excalidrawElements, mermaid_code, diagram_type, details, timestamp };
      } catch (error) {
        console.error("Error parsing mermaid code:", error);
        return { error: "Failed to parse mermaid code", mermaid_code, diagram_type, details, timestamp };
      }
    } else if (clarifying_question) {
      console.log("Clarifying question received");
      return { clarifying_question, diagram_type, details, timestamp };
    } else {
      console.log("No mermaid code or clarifying question in response");
      return { error: "No mermaid code or clarifying question in response" };
    }
  } catch (e) {
    console.error("Error in aiToExcalidraw:", e);
        //@ts-ignore
    if (e?.response) {
          //@ts-ignore
      console.error("Error response:", e.response.data);
          //@ts-ignore
      console.error("Error status:", e.response.status);

    }
    throw new Error('Failed to fetch data.');
  }
}