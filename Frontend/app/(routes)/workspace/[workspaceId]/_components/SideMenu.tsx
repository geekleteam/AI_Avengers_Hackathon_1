"use client"

import React, { useState } from 'react';
import { BotMessageSquare, Plus, Layout, FileText, Save } from 'lucide-react'; // Assuming these are the icons you want to use
import Draggable from 'react-draggable'; // Importing the Draggable component
import Chat from './Chat';

function Sidebar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const handleChatClick = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <>
     {!isChatVisible &&  <div
        className="fixed bottom-0 right-3 z-50 mb-4 ml-4"
      >
         <button
            className="p-2 bg-blue-600 rounded -ml-0.5"
            onClick={handleChatClick}
          >
            <BotMessageSquare className="h-6 w-6 text-white" />
          </button>
      </div>}

      {isChatVisible && (
        <Draggable>
          <div
            className="fixed bottom-0 right-0 z-50 mb-4 mr-4 bg-white border  shadow-lg rounded-lg p-4"
            style={{ width: '24rem' }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Chat</h2>
              <button onClick={handleChatClick}>X</button>
            </div>
            <div className="mt-4 h-full">
              <Chat />
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
}

export default Sidebar;
