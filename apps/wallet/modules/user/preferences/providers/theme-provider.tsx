import { Theme } from "@/modules/shared/types/ui/themes";
import themes from "@/modules/shared/utils/ui/themes";
import { usePreferencesStore } from "@/modules/user/preferences/store/preferences-store";
import { createContext, useContext } from "react";
import { View } from "react-native";

interface ThemeContextType {
  theme: Theme;
  themeVars: any;
  updateTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  console.log("🎨 ThemeProvider starting...");

  const theme = usePreferencesStore((state) => state.theme) as Theme;
  const updateTheme = usePreferencesStore((state) => state.updateTheme);

  // Load theme variables from themes.ts
  const themeVars = themes[theme];

  console.log("🎨 Theme loaded:", theme);
  console.log("🎨 Theme vars:", themeVars);

  return (
    <ThemeContext.Provider value={{ theme, themeVars, updateTheme }}>
      <View
        style={themeVars}
        className="flex-1 bg-ned-background">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
