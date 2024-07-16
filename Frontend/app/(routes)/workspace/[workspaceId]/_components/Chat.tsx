
'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '@/app/_context/ChatContext';
import aiToExcalidraw, { AIPayload } from '../_utils/aiToExcalidraw';
import { ArrowBigDown, Rocket } from 'lucide-react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const DIAGRAM_TYPES = [
  "Flowchart", "Sequence Diagram", "Class Diagram", "State Diagram",
  "ER Diagram", "User Journey Diagram", "Requirement Diagram"
];
//@ts-nocheck

function Chat() {
  const { messages, setMessages, setWhiteBoardData, clarifyingQuestions, setClarifyingQuestions } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [contextData, setContextData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const {user} = useKindeBrowserClient();
  const [workspaceId, setWorkspaceId] = useState(null);

  useEffect(() => {
    const match = window.location.href.match(/workspace\/([^\/]+)/);
     //@ts-ignore
    if (match) setWorkspaceId(match[1]);
  }, []);

  useEffect(() => {
     //@ts-ignore
     if (selectedDiagram) textareaRef.current?.focus();
  }, [selectedDiagram]);

  useEffect(() => {
    if (clarifyingQuestions.length > 0 && currentQuestionIndex < clarifyingQuestions.length) {
      handleAddMessage(clarifyingQuestions[currentQuestionIndex], "chat");
    }
  }, [clarifyingQuestions, currentQuestionIndex]);

  useEffect(() => {
    //@ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
      //@ts-ignore

  const handleAddMessage = (content, sender) => {
        //@ts-ignore

    setMessages(prev => [...prev, [sender, content]]);
  };
    //@ts-ignore
  const handleDiagramSelection = (type) => {
    setSelectedDiagram(type);
  };
    //@ts-ignore

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
  
    setIsLoading(true);
    console.log("Submitting form...");
  
    const payload = {
      diagram_type: selectedDiagram,
      details: inputValue,
      project_id: workspaceId,
      conversation_id: new Date().toISOString(),
      user_id: user?.id || "guest"
    };
  
    console.log("Payload:", payload);
  
    handleAddMessage(inputValue, "user");
    setInputValue('');
    try {
      console.log("Calling aiToExcalidraw...");
          //@ts-ignore
      const result = await aiToExcalidraw(payload);
      console.log("API Response:", result);
  
      if (result?.excalidrawElements) {
        setWhiteBoardData(result.excalidrawElements);
        console.log("WhiteBoardData set");
      }
     if (result?.clarifying_question) {
      // Handle single clarifying question
      const questions = [result.clarifying_question];
      setClarifyingQuestions(questions);
      setCurrentQuestionIndex(0);
      setContextData([]);
      console.log("Single clarifying question set:", questions);
    }
    console.log("SETTING DATA");
    } catch (error) {
      console.error("API call failed:", error);
      handleAddMessage("An error occurred. Please try again.", "chat");
      
      // Additional error logging
          //@ts-ignore

      if (error?.response) {
            //@ts-ignore

        console.error("Error response data:", error.response.data);
            //@ts-ignore

        console.error("Error response status:", error.response.status);
            //@ts-ignore

        console.error("Error response headers:", error.response.headers);
            //@ts-ignore

      } else if (error?.request) {
            //@ts-ignore

        console.error("No response received:", error.request);
      } else {
            //@ts-ignore

        console.error("Error message:", error.message);
      }
    } finally {
      setIsLoading(false);
      setInputValue('');
      console.log("Form submission completed");
    }
  };
    //@ts-ignore
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetSelection = () => {
    setSelectedDiagram(null);
    setMessages([]);
    setClarifyingQuestions([]);
    setCurrentQuestionIndex(0);
    setContextData([]);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 transition-all duration-500 ease-in-out">
      {!selectedDiagram ? (
        <>
          <div className="text-lg mb-4">What type of a diagram do you want to build?</div>
          <div className="grid grid-cols-2 gap-2">
            {DIAGRAM_TYPES.map(type => (
              <button key={type} onClick={() => handleDiagramSelection(type)} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                {type}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-4 flex-shrink-0">
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-black">
              Let's build a {selectedDiagram} 
            </div>
            <ArrowBigDown className="ml-2 text-blue-500 cursor-pointer" onClick={resetSelection} />
          </div>
          <div className="flex-grow overflow-auto max-h-[28rem] custom-scrollbar">
            <div className="mt-4">
              {messages.map((message, index) => (
                <div key={index} className={`my-2 ${message[0] === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block px-4 py-2 rounded-lg ${message[0] === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                    {message[1]}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="pt-4 flex-shrink-0">
            <form onSubmit={handleSubmit} className="w-full">
              <textarea
                placeholder="Tell me more about your project..."
                className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-500 ease-in-out"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={3}
                ref={textareaRef}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="w-full mt-2 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (
                  <>
                    <Rocket className="mr-2" />
                    Send
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;