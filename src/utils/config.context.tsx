import { useState, createContext, PropsWithChildren, useCallback, useContext } from "react";

const defaultConfiguration = {
  isCreateEnabled: true,
  toggleCreationMode: () => {},
};

export const ConfigurationContext = createContext(defaultConfiguration);

export const ConfigurationProvider = ({ children }: PropsWithChildren) => {
  const [isCreateEnabled, setIsCreateEnabled] = useState(defaultConfiguration.isCreateEnabled);

  const toggleCreationMode = useCallback(() => setIsCreateEnabled((prev) => !prev), []);

  return (
    <ConfigurationContext.Provider value={{ isCreateEnabled, toggleCreationMode }}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const config = useContext(ConfigurationContext);
  return config;
};
