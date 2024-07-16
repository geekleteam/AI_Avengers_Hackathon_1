import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

interface Conversation {
  conversationId: string;
  conversationName: string;
  messages: [string, string][];
  whiteboardData: string;
  diagramType: string;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
}

interface Workspace {
  _id: string;
  name: string;
  teamId: string;
  userId: string;
  archive: boolean;
  conversations: Conversation[];
  createdOn: string;
  updatedOn: string;
}

interface WorkspaceContextProps {
  workspace: Workspace | null;
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
  editWorkspace: (updatedWorkspace: Workspace) => void;
  addConversation: (conversation: Conversation) => void;
  editConversation: (conversation: Conversation) => void;
  deleteConversation: (conversationId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const WorkspaceProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  const editWorkspace = (updatedWorkspace: Workspace) => {
    setWorkspace(updatedWorkspace);
  };

  const addConversation = (conversation: Conversation) => {
    if (workspace) {
      setWorkspace({
        ...workspace,
        conversations: [...workspace.conversations, conversation],
      });
    }
  };

  const editConversation = (conversation: Conversation) => {
    if (workspace) {
      setWorkspace({
        ...workspace,
        conversations: workspace.conversations.map((conv) =>
          conv.conversationId === conversation.conversationId ? conversation : conv
        ),
      });
    }
  };

  const deleteConversation = (conversationId: string) => {
    if (workspace) {
      setWorkspace({
        ...workspace,
        conversations: workspace.conversations.filter(
          (conv) => conv.conversationId !== conversationId
        ),
      });
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{ workspace, setWorkspace, editWorkspace, addConversation, editConversation, deleteConversation }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
