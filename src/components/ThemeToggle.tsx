import React, { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { setTheme, Theme } from "../lib/utils";
import { Button } from "./ui/button";

const ThemeToggle: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant={currentTheme === "light" ? "default" : "ghost"}
        size="icon"
        onClick={() => handleThemeChange("light")}
        title="Light mode"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Light mode</span>
      </Button>
      <Button
        variant={currentTheme === "dark" ? "default" : "ghost"}
        size="icon"
        onClick={() => handleThemeChange("dark")}
        title="Dark mode"
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Dark mode</span>
      </Button>
      <Button
        variant={currentTheme === "system" ? "default" : "ghost"}
        size="icon"
        onClick={() => handleThemeChange("system")}
        title="System theme"
      >
        <Laptop className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">System theme</span>
      </Button>
    </div>
  );
};

export default ThemeToggle;