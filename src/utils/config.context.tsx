import { createContext, useCallback, useContext, useState } from "react";

const ConfigurationContext = createContext({
  animated: true,
  toggleAnimation: () => {},
});

export const useConfiguration = () => {
  const config = useContext(ConfigurationContext);
  return config;
};

export const ConfigurationProvider = ({ children }: React.PropsWithChildren) => {
  const [animated, setAnimated] = useState(false);
  const toggleAnimation = useCallback(() => {
    setAnimated((prev) => !prev);
  }, []);

  return (
    <ConfigurationContext.Provider value={{ animated, toggleAnimation }}>{children}</ConfigurationContext.Provider>
  );
};
