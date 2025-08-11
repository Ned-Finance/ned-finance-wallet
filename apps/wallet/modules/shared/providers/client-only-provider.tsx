import React, { useEffect, useState } from "react";
import { View } from "react-native";

interface ClientOnlyProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ClientOnlyProvider: React.FC<ClientOnlyProviderProps> = ({
  children,
  fallback = <View className="flex-1 bg-ned-background" />,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
