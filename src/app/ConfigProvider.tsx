import { PaletteMode } from "@mui/material";
import { useState, createContext, PropsWithChildren, useCallback, useContext } from "react";

type CreationMode = "ships" | "asteroids" | null;
const defaultConfiguration = {
  mode: "dark" as PaletteMode,
  toggleColorMode: () => {},
  creationMode: "ships" as CreationMode,
  changeCreationMode: (_: CreationMode) => {},
};

const ConfigurationContext = createContext(defaultConfiguration);

export const ConfigurationProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<PaletteMode>(defaultConfiguration.mode);
  const [creationMode, setCreationMode] = useState<CreationMode>(defaultConfiguration.creationMode);

  const toggleColorMode = useCallback(() => setMode((prev) => (prev === "dark" ? "light" : "dark")), []);
  const changeCreationMode = useCallback((mode: CreationMode) => setCreationMode(mode ? mode : null), []);

  return (
    <ConfigurationContext.Provider value={{ mode, toggleColorMode, creationMode, changeCreationMode }}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const config = useContext(ConfigurationContext);
  return config;
};
