import { PaletteMode } from "@mui/material";
import { useState, createContext, PropsWithChildren, useCallback, useContext } from "react";

type CreationMode = "ships" | "asteroids" | null;
const defaultConfiguration = {
  mode: "dark" as PaletteMode,
  toggleColorMode: () => {},
  isBlockEnabled: true,
  toggleBlock: () => {},
  creationMode: "ships" as CreationMode,
  changeCreationMode: (_: CreationMode) => {},
};

const ConfigurationContext = createContext(defaultConfiguration);

export const ConfigurationProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<PaletteMode>(defaultConfiguration.mode);
  const [creationMode, setCreationMode] = useState<CreationMode>(defaultConfiguration.creationMode);
  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(true);

  const toggleColorMode = useCallback(() => setMode((prev) => (prev === "dark" ? "light" : "dark")), []);
  const changeCreationMode = useCallback((mode: CreationMode) => setCreationMode(mode ? mode : null), []);
  const toggleBlock = useCallback(() => setIsBlockEnabled((prev) => !prev), []);

  return (
    <ConfigurationContext.Provider
      value={{ mode, toggleColorMode, creationMode, changeCreationMode, isBlockEnabled, toggleBlock }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const config = useContext(ConfigurationContext);
  return config;
};
