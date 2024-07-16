import axios from "axios";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";

export const fetchAndConvertDiagram = async () => {
  try {
    const response = await axios.post('http://localhost:8000/graph', {
      diagram_type: "Flowchart",
      details: "greeting card",
      project_id: "12345",
      conversation_id: "67890",
      user_id: "user_01"
    });

    const mermaidCode = response.data.mermaid_code;
    console.log("Fetched Mermaid Code:", mermaidCode);
    return await convertMermaidToExcalidrawfn(mermaidCode);
  } catch (error) {
    console.error("Error fetching diagram:", error);
    return { elements: [], appState: {} };
  }
};

const convertMermaidToExcalidrawfn = async (mermaidCode: string) => {
  try {
    console.log("Converting Mermaid Code:", mermaidCode);
    const { elements, files } = await parseMermaidToExcalidraw(mermaidCode);
    console.log("Converted Elements:", elements);
    return {
      elements,
      appState: {
        viewBackgroundColor: "#FFFFFF",
      },
    };
  } catch (error) {
    console.error("Error converting Mermaid to Excalidraw:", error);
    console.log("Mermaid Code causing error:", mermaidCode);
    return { elements: [], appState: {} };
  }
};