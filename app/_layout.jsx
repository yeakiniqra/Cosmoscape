import { StatusBar } from "expo-status-bar";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Colors } from "../constants/Colors";
import merge from "deepmerge";
import { useTheme } from "../hooks/useTheme";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { Slot, useSegments, useRouter,Stack } from "expo-router";
import { useEffect } from "react";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Redirect to /signin if not authenticated
    if (typeof isAuthenticated === "undefined") return;

    const inApp = segments[0] === "(app)";
    if (isAuthenticated && !inApp) {
      // Redirect to /app
      router.replace("/Home");
    } else if (isAuthenticated === false) {
      // Redirect to /signin
      router.replace("/Signin");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  const { colorScheme } = useTheme();

  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <AuthContextProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={paperTheme}>
          <MainLayout />
          <Stack>
            <Stack.Screen name="index" />
          </Stack>
        </ThemeProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </PaperProvider>
    </AuthContextProvider>
  );
}
