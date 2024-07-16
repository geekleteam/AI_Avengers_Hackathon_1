import React, { createContext, useState, ReactNode, useContext } from 'react';

export type DiagramType = "graph TD" | "sequenceDiagram" | "classDiagram" | "stateDiagram" | "gantt" | "pie" | "erDiagram" | "journey";

type ChatContextType = {
  mermaidString: string | null;
  setMermaidString: (data: string | null) => void;
  messages: string[][];
  setMessages: (messages: string[][]) => void;
  diagramType: DiagramType;
  setDiagramType: (type: DiagramType) => void;
  whiteBoardData: any[];
  setWhiteBoardData: (elements: any[]) => void;
  clarifyingQuestions: string[];
  setClarifyingQuestions: (elements: string[]) => void;
};

const ChatContext = createContext<ChatContextType>({
  mermaidString: null,
  setMermaidString: () => {},
  messages: [],
  setMessages: () => {},
  diagramType: "sequenceDiagram",
  setDiagramType: () => {},
  whiteBoardData: [],
  setWhiteBoardData: () => {},
  clarifyingQuestions: [],
  setClarifyingQuestions: () => {}
});

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [mermaidString, setMermaidString] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[][]>([]);
  const [diagramType, setDiagramType] = useState<DiagramType>("sequenceDiagram");
  const [whiteBoardData, setWhiteBoardData] = useState<any[]>([]);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);

  setClarifyingQuestions

  const logSetWhiteBoardData = (elements: any[]) => {
    console.log('Setting whiteBoardData:', elements);
    setWhiteBoardData(elements);
  };

  return (
    <ChatContext.Provider value={{ 
        mermaidString, 
        setMermaidString, 
        messages, 
        setMessages, 
        diagramType, 
        setDiagramType, 
        whiteBoardData, 
        setWhiteBoardData: logSetWhiteBoardData,
        clarifyingQuestions,
        setClarifyingQuestions }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
  