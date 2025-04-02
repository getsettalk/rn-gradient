import React, { useState } from "react";
import { Gradient, ColorStop } from "../shared/schema";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { ColorPicker } from "./ui/color-picker";
import { Trash2, Plus } from "lucide-react";

interface GradientControlsProps {
  gradient: Gradient;
  onAngleChange: (angle: number) => void;
  onColorStopChange: (index: number, colorStop: ColorStop) => void;
  onAddColorStop: () => void;
  onRemoveColorStop: (index: number) => void;
  onToggleUseAngle: (useAngle: boolean) => void;
}

const GradientControls = ({
  gradient,
  onAngleChange,
  onColorStopChange,
  onAddColorStop,
  onRemoveColorStop,
  onToggleUseAngle,
}: GradientControlsProps) => {
  const [activeColorPicker, setActiveColorPicker] = useState<number | null>(null);
  
  // Handle angle change
  const handleAngleChange = (values: number[]) => {
    onAngleChange(values[0]);
  };
  
  // Handle color change
  const handleColorChange = (index: number, color: string) => {
    const newColorStop = { ...gradient.colorStops[index], color };
    onColorStopChange(index, newColorStop);
  };
  
  // Handle position change
  const handlePositionChange = (index: number, values: number[]) => {
    const newColorStop = { ...gradient.colorStops[index], position: values[0] / 100 };
    onColorStopChange(index, newColorStop);
  };
  
  // Toggle color picker
  const toggleColorPicker = (index: number) => {
    if (activeColorPicker === index) {
      setActiveColorPicker(null);
    } else {
      setActiveColorPicker(index);
    }
  };
  
  // Sort color stops by position
  const sortedColorStops = [...gradient.colorStops].sort((a, b) => a.position - b.position);
  
  return (
    <div className="space-y-8 bg-card p-6 rounded-lg border">
      <h2 className="text-lg font-semibold">Gradient Controls</h2>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="useAngle">Use Angle</Label>
          <Switch 
            id="useAngle"
            checked={gradient.useAngle}
            onCheckedChange={onToggleUseAngle}
          />
        </div>
        
        {gradient.useAngle && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="angle">Angle: {gradient.angle}°</Label>
            </div>
            <Slider
              id="angle"
              min={0}
              max={360}
              step={1}
              value={[gradient.angle]}
              onValueChange={handleAngleChange}
            />
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium">Color Stops</h3>
          {gradient.colorStops.length < 5 && (
            <Button 
              onClick={onAddColorStop} 
              size="sm" 
              variant="outline"
              title="Add new color stop"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {sortedColorStops.map((colorStop, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded border cursor-pointer"
                    style={{ backgroundColor: colorStop.color }}
                    onClick={() => toggleColorPicker(index)}
                  />
                  {activeColorPicker === index && (
                    <ColorPicker
                      color={colorStop.color}
                      onChange={(color) => handleColorChange(index, color)}
                      onClose={() => setActiveColorPicker(null)}
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <Label className="mb-1 block">
                    Position: {Math.round(colorStop.position * 100)}%
                  </Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[colorStop.position * 100]}
                    onValueChange={(values) => handlePositionChange(index, values)}
                  />
                </div>
                
                {gradient.colorStops.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onRemoveColorStop(index)}
                    title="Remove color stop"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradientControls;