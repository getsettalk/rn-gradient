import React from 'react';
import { Trash2, Trash, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Gradient } from '../shared/schema';
import { generateGradientCSS } from '../lib/gradient';

interface SavedGradientsProps {
  savedGradients: Gradient[];
  onLoad: (gradient: Gradient) => void;
  onDelete: (id: string | undefined) => void;
  onClearAll: () => void;
}

export const SavedGradients = ({
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
      <div className="p-6 text-center border border-dashed rounded-md bg-muted/50">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No saved gradients</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your saved gradients will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Saved Gradients</h3>
        {savedGradients.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearAll}
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {savedGradients.map((gradient) => (
          <div 
            key={gradient.id} 
            className="relative group border rounded-md overflow-hidden"
          >
            {/* Gradient preview */}
            <div 
              className="h-24 cursor-pointer"
              style={{ background: generateGradientCSS(gradient) }}
              onClick={() => handleLoad(gradient)}
              title="Click to load this gradient"
            />
            
            {/* Info bar */}
            <div className="p-2 bg-card border-t flex justify-between items-center">
              <div className="overflow-hidden">
                <h4 className="text-sm font-medium truncate">
                  {gradient.name || "Unnamed Gradient"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {gradient.colorStops.length} colors
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(gradient.id)}
                title="Delete gradient"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};