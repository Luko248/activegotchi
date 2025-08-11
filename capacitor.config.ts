import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.activegotchi.app",
  appName: "ActiveGotchi",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#6366f1",
      showSpinner: false,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#6366f1",
    },
  },
};

export default config;
