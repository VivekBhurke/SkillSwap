import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { SkillDiscovery } from "./components/SkillDiscovery";
import { CreditsWallet } from "./components/CreditsWallet";
import { Profile } from "./components/Profile";
import { Messages } from "./components/Messages";
import { Notifications } from "./components/Notifications";
import { Settings } from "./components/Settings";
import { Toaster } from "./components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { currentPage, isLoading } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <LandingPage />;
      case "dashboard":
        return <Dashboard />;
      case "discover":
        return <SkillDiscovery />;
      case "wallet":
        return <CreditsWallet />;
      case "profile":
        return <Profile />;
      case "messages":
        return <Messages />;
      case "notifications":
        return <Notifications />;
      case "settings":
        return <Settings />;
      default:
        return <LandingPage />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-eco-subtle flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="w-16 h-16 gradient-eco rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-glow"
          >
            <span className="text-white font-bold text-2xl">
              SS
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold bg-gradient-to-r from-eco-green-600 to-eco-teal-600 bg-clip-text text-transparent mb-2"
          >
            SkillSwap
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground animate-pulse"
          >
            Loading your skill exchange platform...
          </motion.p>

          {/* Loading Progress */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-32 h-1 bg-eco-green-200 rounded-full mx-auto mt-4 overflow-hidden"
          >
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-1/3 gradient-eco rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-neutral-50 via-background to-eco-green-50/30">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative"
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-eco-green-500/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-eco-teal-500/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-eco-blue-500/5 rounded-full blur-xl"
        />
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}