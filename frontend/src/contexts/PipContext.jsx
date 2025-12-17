import { createContext, useContext, useState } from 'react';

const PipContext = createContext();

export const usePip = () => {
  const context = useContext(PipContext);
  if (!context) {
    throw new Error('usePip must be used within PipProvider');
  }
  return context;
};

export const PipProvider = ({ children }) => {
  const [isPipActive, setIsPipActive] = useState(false);
  const [pipVideoUrl, setPipVideoUrl] = useState(null);
  const [pipAnimeInfo, setPipAnimeInfo] = useState(null);

  const activatePip = (videoUrl, animeInfo) => {
    setPipVideoUrl(videoUrl);
    setPipAnimeInfo(animeInfo);
    setIsPipActive(true);
  };

  const deactivatePip = () => {
    setIsPipActive(false);
    setPipVideoUrl(null);
    setPipAnimeInfo(null);
  };

  return (
    <PipContext.Provider
      value={{
        isPipActive,
        pipVideoUrl,
        pipAnimeInfo,
        activatePip,
        deactivatePip,
      }}
    >
      {children}
    </PipContext.Provider>
  );
};
