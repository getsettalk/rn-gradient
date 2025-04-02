import React, { useState, useEffect } from "react";
import { Gradient, ColorStop } from "../shared/schema";
import { generateRandomGradient, saveGradientToLocalStorage, getSavedGradientsFromLocalStorage, deleteGradientFromLocalStorage, deleteAllGradientsFromLocalStorage } from "../lib/gradient";
import GradientPreview from "../components/GradientPreview";
import GradientControls from "../components/GradientControls";
import GradientCodeOutput from "../components/GradientCodeOutput";
import SavedGradients from "../components/SavedGradients";
import { useToast } from "../hooks/use-toast";

const GradientGenerator = () => {
  // Initialize with a random gradient or load from storage
  const [gradient, setGradient] = useState<Gradient>(() => {
    return generateRandomGradient();
  });
  
  // Output format options
  const [codeFormat, setCodeFormat] = useState<"css" | "reactNative">("css");
  const [colorFormat, setColorFormat] = useState<"hex" | "rgba">("hex");
  const [includeLocations, setIncludeLocations] = useState<boolean>(true);
  
  // Saved gradients
  const [savedGradients, setSavedGradients] = useState<Gradient[]>([]);
  
  const { toast } = useToast();
  
  // Load saved gradients on component mount
  useEffect(() => {
    setSavedGradients(getSavedGradientsFromLocalStorage());
  }, []);
  
  // Handle angle change
  const handleAngleChange = (angle: number) => {
    setGradient((prev) => ({ ...prev, angle }));
  };
  
  // Handle toggling angle usage
  const handleToggleUseAngle = (useAngle: boolean) => {
    setGradient((prev) => ({ ...prev, useAngle }));
  };
  
  // Handle color stop change
  const handleColorStopChange = (index: number, colorStop: ColorStop) => {
    const newColorStops = [...gradient.colorStops];
    newColorStops[index] = colorStop;
    setGradient((prev) => ({ ...prev, colorStops: newColorStops }));
  };
  
  // Add a new color stop
  const handleAddColorStop = () => {
    if (gradient.colorStops.length >= 5) return; // Maximum 5 color stops
    
    // Find a good position for the new color stop
    const positions = gradient.colorStops.map(stop => stop.position);
    const lastPosition = Math.max(...positions);
    const firstPosition = Math.min(...positions);
    
    let newPosition;
    if (lastPosition < 1) {
      newPosition = Math.min(1, lastPosition + 0.25);
    } else if (firstPosition > 0) {
      newPosition = Math.max(0, firstPosition - 0.25);
    } else {
      // Find the largest gap
      positions.sort((a, b) => a - b);
      let maxGap = 0;
      let gapPosition = 0.5;
      
      for (let i = 0; i < positions.length - 1; i++) {
        const gap = positions[i + 1] - positions[i];
        if (gap > maxGap) {
          maxGap = gap;
          gapPosition = positions[i] + gap / 2;
        }
      }
      
      newPosition = gapPosition;
    }
    
    const newColorStop: ColorStop = {
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      position: newPosition,
    };
    
    const newColorStops = [...gradient.colorStops, newColorStop];
    setGradient((prev) => ({ ...prev, colorStops: newColorStops }));
  };
  
  // Remove a color stop
  const handleRemoveColorStop = (index: number) => {
    if (gradient.colorStops.length <= 2) return; // Minimum 2 color stops
    
    const newColorStops = gradient.colorStops.filter((_, i) => i !== index);
    setGradient((prev) => ({ ...prev, colorStops: newColorStops }));
  };
  
  // Handle randomize
  const handleRandomize = () => {
    setGradient(generateRandomGradient());
    toast("Generated a random gradient", { type: "success" });
  };
  
  // Save current gradient
  const handleSaveGradient = () => {
    // Ensure the gradient has a name
    if (!gradient.name || gradient.name.trim() === "") {
      const defaultName = `Gradient ${new Date().toLocaleString()}`;
      setGradient((prev) => ({ ...prev, name: defaultName }));
      saveGradientToLocalStorage({ ...gradient, name: defaultName });
    } else {
      saveGradientToLocalStorage(gradient);
    }
    
    setSavedGradients(getSavedGradientsFromLocalStorage());
    toast("Gradient saved successfully", { type: "success" });
  };
  
  // Load a saved gradient
  const handleLoadGradient = (gradient: Gradient) => {
    setGradient(gradient);
    toast("Gradient loaded", { type: "success" });
  };
  
  // Delete a saved gradient
  const handleDeleteGradient = (id: string | undefined) => {
    if (id) {
      deleteGradientFromLocalStorage(id);
      setSavedGradients(getSavedGradientsFromLocalStorage());
      toast("Gradient deleted", { type: "success" });
    }
  };
  
  // Clear all saved gradients
  const handleClearAllGradients = () => {
    deleteAllGradientsFromLocalStorage();
    setSavedGradients([]);
    toast("All gradients cleared", { type: "success" });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Gradient Generator
        </h1>
        <p className="text-muted-foreground">
          Create, customize, and export beautiful CSS and React Native gradients
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <GradientPreview 
            gradient={gradient} 
            onRandomize={handleRandomize} 
            onSave={handleSaveGradient}
            codeFormat={codeFormat}
          />
          
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
        </div>
        
        <div className="space-y-6">
          <GradientControls
            gradient={gradient}
            onAngleChange={handleAngleChange}
            onColorStopChange={handleColorStopChange}
            onAddColorStop={handleAddColorStop}
            onRemoveColorStop={handleRemoveColorStop}
            onToggleUseAngle={handleToggleUseAngle}
          />
          
          <SavedGradients
            savedGradients={savedGradients}
            onLoad={handleLoadGradient}
            onDelete={handleDeleteGradient}
            onClearAll={handleClearAllGradients}
          />
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;