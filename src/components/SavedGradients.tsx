import React from "react";
import { Gradient } from "../shared/schema";
import { generateGradientCSS } from "../lib/gradient";
import { Button } from "./ui/button";

interface SavedGradientsProps {
  savedGradients: Gradient[];
  onLoad: (gradient: Gradient) => void;
  onDelete: (id: string | undefined) => void;
  onClearAll: () => void;
}

const SavedGradients = ({
  savedGradients,
  onLoad,
  onDelete,
  onClearAll
}: SavedGradientsProps) => {
  const handleLoad = (gradient: Gradient) => {
    onLoad(gradient);
  };

  if (savedGradients.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Saved Gradients</h3>
        <div className="text-center p-8 text-muted-foreground">
          <p>No saved gradients yet.</p>
          <p className="text-sm mt-2">Save a gradient to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Saved Gradients</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearAll}
          className="text-destructive hover:bg-destructive/10"
        >
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedGradients.map((gradient, index) => (
          <div 
            key={gradient.id || index}
            className="border rounded-lg overflow-hidden bg-card"
          >
            <div 
              className="h-24 w-full"
              style={{ background: generateGradientCSS(gradient) }}
            />
            
            <div className="p-3">
              <h4 className="font-medium text-sm truncate">
                {gradient.name || `Gradient ${index + 1}`}
              </h4>
              <div className="flex justify-between mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleLoad(gradient)}
                >
                  Load
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(gradient.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedGradients;