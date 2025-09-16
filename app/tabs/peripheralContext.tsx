import React, { createContext, useContext, useState } from 'react';

type PeripheralContextType = {
  peripheralId: string | null;
  setPeripheralId: (id: string | null) => void;
};

const PeripheralContext = createContext<PeripheralContextType | undefined>(undefined);

export const PeripheralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [peripheralId, setPeripheralId] = useState<string | null>(null);
  return (
    <PeripheralContext.Provider value={{ peripheralId, setPeripheralId }}>
      {children}
    </PeripheralContext.Provider>
  );
};

export const usePeripheralContext = () => {
  const ctx = useContext(PeripheralContext);
  if (!ctx) throw new Error('usePeripheralContext must be used within PeripheralProvider');
  return ctx;
};
