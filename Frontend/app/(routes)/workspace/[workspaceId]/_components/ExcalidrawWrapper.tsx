"use client"

import React, { useState, useEffect } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

const ExcalidrawWrapper = ({ sceneElements }: any) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }

    if (!sceneElements || sceneElements.length === 0) {
      excalidrawAPI.resetScene();
      return;
    }

    excalidrawAPI.updateScene({
      elements: sceneElements,
      appState: {}
    });
    excalidrawAPI.scrollToContent(sceneElements, {
      fitToContent: true,
    });
  }, [sceneElements, excalidrawAPI]);

  return (
    <Excalidraw
      initialData={{
        elements: sceneElements,
        appState: {
          viewBackgroundColor: "#fafafa",
          currentItemFontFamily: 1,
        },
      }}
      excalidrawAPI={setExcalidrawAPI}
      UIOptions={{
        canvasActions: {
          saveToActiveFile: false,
          loadScene: false,
          export: false,
          toggleTheme: false
        }
      }}
      viewModeEnabled={false}
      zenModeEnabled={false}
      gridModeEnabled={false}
    >
      <MainMenu>
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.DefaultItems.SaveAsImage />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
      <WelcomeScreen>
        <WelcomeScreen.Hints.MenuHint />
        <WelcomeScreen.Hints.ToolbarHint />
        <WelcomeScreen.Center>
          <WelcomeScreen.Center.MenuItemHelp />
        </WelcomeScreen.Center>
      </WelcomeScreen>
    </Excalidraw>
  );
};

export default ExcalidrawWrapper;
