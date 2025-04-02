import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Gradient, ColorStop } from '../shared/schema';
import { generateRandomGradient, getSavedGradientsFromLocalStorage, saveGradientToLocalStorage, deleteGradientFromLocalStorage, deleteAllGradientsFromLocalStorage } from '../lib/gradient';
import { GradientControls } from '../components/GradientControls';
import { GradientCodeOutput } from '../components/GradientCodeOutput';
import { SavedGradients } from '../components/SavedGradients';
import GradientPreview from '../components/GradientPreview';
import { useToast } from '../hooks/use-toast';
import { ThemeToggle } from '../components/ThemeToggle';

export default function GradientGenerator() {
  // State for the current working gradient
  const [gradient, setGradient] = useState<Gradient>(() => {
    return {
      id: nanoid(),
      name: "New Gradient",
      colorStops: [
        { color: "#FF5F6D", location: 0, opacity: 1 },
        { color: "#FFC371", location: 1, opacity: 1 }
      ],
      angle: 90,
      useAngle: true
    };
  });
  
  // State for saved gradients
  const [savedGradients, setSavedGradients] = useState<Gradient[]>([]);
  
  // State for code output options
  const [codeFormat, setCodeFormat] = useState<"reactNative" | "css">("css");
  const [colorFormat, setColorFormat] = useState<"hex" | "rgba">("hex");
  const [includeLocations, setIncludeLocations] = useState(true);
  
  // Toast notifications
  const { toast } = useToast();
  
  // Load saved gradients from localStorage on mount
  useEffect(() => {
    const loadedGradients = getSavedGradientsFromLocalStorage();
    setSavedGradients(loadedGradients);
  }, []);
  
  // Angle change handler
  const handleAngleChange = (angle: number) => {
    setGradient(prev => ({ ...prev, angle }));
  };
  
  // Toggle useAngle handler
  const handleToggleUseAngle = (useAngle: boolean) => {
    setGradient(prev => ({ ...prev, useAngle }));
  };
  
  // Color stop change handler
  const handleColorStopChange = (index: number, colorStop: ColorStop) => {
    setGradient(prev => {
      const updatedStops = [...prev.colorStops];
      updatedStops[index] = colorStop;
      return { ...prev, colorStops: updatedStops };
    });
  };
  
  // Add color stop handler
  const handleAddColorStop = () => {
    if (gradient.colorStops.length >= 5) {
      toast("Maximum of 5 color stops allowed", { type: "warning" });
      return;
    }
    
    // Calculate a location between existing stops
    const lastStopLocation = gradient.colorStops.length > 0 
      ? gradient.colorStops[gradient.colorStops.length - 1].location
      : 0;
    const firstStopLocation = gradient.colorStops.length > 0 
      ? gradient.colorStops[0].location
      : 1;
    
    // New stop in the middle or at a reasonable location
    const newLocation = gradient.colorStops.length > 1
      ? (lastStopLocation + firstStopLocation) / 2
      : gradient.colorStops.length === 1
        ? 1
        : 0.5;
    
    const newColorStop: ColorStop = {
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      location: newLocation,
      opacity: 1
    };
    
    setGradient(prev => ({
      ...prev,
      colorStops: [...prev.colorStops, newColorStop].sort((a, b) => a.location - b.location)
    }));
    
    toast("Added new color stop", { type: "success" });
  };
  
  // Remove color stop handler
  const handleRemoveColorStop = (index: number) => {
    if (gradient.colorStops.length <= 2) {
      toast("At least two color stops are required", { type: "warning" });
      return;
    }
    
    setGradient(prev => {
      const updatedStops = [...prev.colorStops];
      updatedStops.splice(index, 1);
      return { ...prev, colorStops: updatedStops };
    });
    
    toast("Removed color stop", { type: "success" });
  };
  
  // Randomize gradient handler
  const handleRandomize = () => {
    const randomGradient = generateRandomGradient();
    setGradient(randomGradient);
    toast("Generated random gradient", { type: "success" });
  };
  
  // Save gradient handler
  const handleSaveGradient = () => {
    // Create a copy with a new ID to save
    const savedGradient = saveGradientToLocalStorage({
      ...gradient,
      id: nanoid(), // Generate a new ID to allow saving the same gradient multiple times
      name: gradient.name || `Gradient ${savedGradients.length + 1}`
    });
    
    if (savedGradient) {
      setSavedGradients(prev => [...prev, savedGradient]);
      toast("Gradient saved successfully", { type: "success" });
    } else {
      toast("Failed to save gradient", { type: "error" });
    }
  };
  
  // Load gradient handler
  const handleLoadGradient = (gradient: Gradient) => {
    setGradient(gradient);
    toast("Gradient loaded", { type: "success" });
  };
  
  // Delete gradient handler
  const handleDeleteGradient = (id: string | undefined) => {
    if (!id) return;
    
    deleteGradientFromLocalStorage(id);
    setSavedGradients(prev => prev.filter(g => g.id !== id));
    toast("Gradient deleted", { type: "success" });
  };
  
  // Clear all gradients handler
  const handleClearAllGradients = () => {
    deleteAllGradientsFromLocalStorage();
    setSavedGradients([]);
    toast("All gradients cleared", { type: "success" });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Gradient Generator
            </h1>
          </div>
          
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-8">
            <GradientControls 
              gradient={gradient} 
              onAngleChange={handleAngleChange}
              onColorStopChange={handleColorStopChange}
              onAddColorStop={handleAddColorStop}
              onRemoveColorStop={handleRemoveColorStop}
              onToggleUseAngle={handleToggleUseAngle}
            />
          </div>
          
          {/* Right Column: Preview and Code */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preview */}
            <GradientPreview 
              gradient={gradient}
              onRandomize={handleRandomize}
              onSave={handleSaveGradient}
              codeFormat={codeFormat}
            />
            
            {/* Code Output */}
            <GradientCodeOutput
              gradient={gradient}
              codeFormat={codeFormat}
              setCodeFormat={setCodeFormat}
              colorFormat={colorFormat}
              setColorFormat={setColorFormat}
              includeLocations={includeLocations}
              setIncludeLocations={setIncludeLocations}
              onToggleUseAngle={handleToggleUseAngle}
            />
            
            {/* Saved Gradients */}
            <SavedGradients
              savedGradients={savedGradients}
              onLoad={handleLoadGradient}
              onDelete={handleDeleteGradient}
              onClearAll={handleClearAllGradients}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Gradient Generator - A tool for creating beautiful gradients for your projects</p>
        </div>
      </footer>
    </div>
  );
}