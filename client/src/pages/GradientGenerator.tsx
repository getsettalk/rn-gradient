import { useState, useEffect } from "react";
import GradientPreview from "@/components/GradientPreview";
import GradientControls from "@/components/GradientControls";
import GradientCodeOutput from "@/components/GradientCodeOutput";
import SavedGradients from "@/components/SavedGradients";
import { Gradient, ColorStop } from "@shared/schema";
import { generateRandomGradient } from "@/lib/gradient";
import { nanoid } from "nanoid";

const GradientGenerator = () => {
  const [currentGradient, setCurrentGradient] = useState<Gradient>({
    angle: 120,
    colorStops: [
      { color: "#6366F1", position: 0 },
      { color: "#EC4899", position: 100 }
    ],
    useAngle: false
  });

  const [codeFormat, setCodeFormat] = useState<"reactNative" | "css">("reactNative");
  const [colorFormat, setColorFormat] = useState<"hex" | "rgba">("hex");
  const [includeLocations, setIncludeLocations] = useState(false);
  const [savedGradients, setSavedGradients] = useState<Gradient[]>([]);

  // Load saved gradients from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedGradients");
    if (saved) {
      try {
        setSavedGradients(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved gradients:", error);
      }
    }
  }, []);

  // Save gradients to localStorage when updated
  useEffect(() => {
    localStorage.setItem("savedGradients", JSON.stringify(savedGradients));
  }, [savedGradients]);

  const handleAngleChange = (angle: number) => {
    setCurrentGradient({
      ...currentGradient,
      angle
    });
  };

  const handleColorStopChange = (index: number, colorStop: ColorStop) => {
    const newColorStops = [...currentGradient.colorStops];
    newColorStops[index] = colorStop;
    setCurrentGradient({
      ...currentGradient,
      colorStops: newColorStops
    });
  };

  const handleAddColorStop = () => {
    // Calculate position for new color stop (midpoint between last two)
    const positions = currentGradient.colorStops.map(stop => stop.position);
    const maxPosition = Math.max(...positions);
    const minPosition = Math.min(...positions);
    const midPosition = Math.round((maxPosition + minPosition) / 2);
    
    // Use a color that's a mix of the existing colors
    const newColor = "#8B5CF6"; // Default to purple
    
    setCurrentGradient({
      ...currentGradient,
      colorStops: [
        ...currentGradient.colorStops,
        { color: newColor, position: midPosition }
      ].sort((a, b) => a.position - b.position)
    });
  };

  const handleRemoveColorStop = (index: number) => {
    if (currentGradient.colorStops.length <= 2) {
      return; // Don't remove if only 2 colors are left
    }

    const newColorStops = currentGradient.colorStops.filter((_, i) => i !== index);
    setCurrentGradient({
      ...currentGradient,
      colorStops: newColorStops
    });
  };

  const handleRandomize = () => {
    setCurrentGradient(generateRandomGradient());
  };

  const handleSaveGradient = () => {
    const newGradient = {
      ...currentGradient,
      id: nanoid()
    };
    
    setSavedGradients(prev => [newGradient, ...prev]);
  };

  const handleLoadGradient = (gradient: Gradient) => {
    setCurrentGradient(gradient);
  };

  const handleDeleteGradient = (id: string | undefined) => {
    if (!id) return;
    setSavedGradients(prev => prev.filter(g => g.id !== id));
  };

  const handleClearAllGradients = () => {
    setSavedGradients([]);
  };

  const handleToggleUseAngle = (useAngle: boolean) => {
    setCurrentGradient({
      ...currentGradient,
      useAngle
    });
  };

  return (
    <div className="min-h-screen pb-8 font-sans bg-background text-foreground">
      <header className="p-6 text-center">
        <h1 className="text-3xl font-semibold mb-2">React Native Gradient Generator</h1>
        <p className="text-muted-foreground">Create, customize, and export beautiful linear gradients for your React Native apps</p>
      </header>

      <main className="container mx-auto px-4 max-w-6xl">
        <GradientPreview 
          gradient={currentGradient}
          onRandomize={handleRandomize}
          onSave={handleSaveGradient}
          codeFormat={codeFormat}
        />

        <div className="grid md:grid-cols-2 gap-8">
          <GradientControls
            gradient={currentGradient}
            onAngleChange={handleAngleChange}
            onColorStopChange={handleColorStopChange}
            onAddColorStop={handleAddColorStop}
            onRemoveColorStop={handleRemoveColorStop}
          />
          
          <GradientCodeOutput
            gradient={currentGradient}
            codeFormat={codeFormat}
            setCodeFormat={setCodeFormat}
            colorFormat={colorFormat}
            setColorFormat={setColorFormat}
            includeLocations={includeLocations}
            setIncludeLocations={setIncludeLocations}
            onToggleUseAngle={handleToggleUseAngle}
          />
        </div>

        <SavedGradients
          savedGradients={savedGradients}
          onLoad={handleLoadGradient}
          onDelete={handleDeleteGradient}
          onClearAll={handleClearAllGradients}
        />
      </main>
    </div>
  );
};

export default GradientGenerator;
