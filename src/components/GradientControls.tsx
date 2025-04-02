import React from 'react';
import { Gradient, ColorStop } from '../shared/schema';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Trash2, Plus } from 'lucide-react';
import { ColorPickerButton } from './ui/color-picker';

interface GradientControlsProps {
  gradient: Gradient;
  onAngleChange: (angle: number) => void;
  onColorStopChange: (index: number, colorStop: ColorStop) => void;
  onAddColorStop: () => void;
  onRemoveColorStop: (index: number) => void;
  onToggleUseAngle: (useAngle: boolean) => void;
}

export const GradientControls = ({
  gradient,
  onAngleChange,
  onColorStopChange,
  onAddColorStop,
  onRemoveColorStop,
  onToggleUseAngle
}: GradientControlsProps) => {
  // Sort color stops by location
  const sortedColorStops = [...gradient.colorStops].sort((a, b) => a.location - b.location);
  
  // Handle angle change
  const handleAngleChange = (values: number[]) => {
    if (values.length > 0) {
      onAngleChange(values[0]);
    }
  };
  
  // Handle color change
  const handleColorChange = (index: number, color: string) => {
    const colorStop = { ...gradient.colorStops[index], color };
    onColorStopChange(index, colorStop);
  };
  
  // Handle location change
  const handleLocationChange = (index: number, values: number[]) => {
    if (values.length > 0) {
      const colorStop = { ...gradient.colorStops[index], location: values[0] };
      onColorStopChange(index, colorStop);
    }
  };
  
  // Handle opacity change
  const handleOpacityChange = (index: number, values: number[]) => {
    if (values.length > 0) {
      const colorStop = { ...gradient.colorStops[index], opacity: values[0] };
      onColorStopChange(index, colorStop);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gradient Controls</h2>
      </div>
      
      {/* Angle Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="use-angle" className="font-medium">Use Angle</Label>
          <Switch
            id="use-angle"
            checked={gradient.useAngle}
            onCheckedChange={onToggleUseAngle}
          />
        </div>
        
        {gradient.useAngle && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="angle-slider" className="text-sm">Angle: {gradient.angle}°</Label>
            </div>
            <Slider
              id="angle-slider"
              min={0}
              max={360}
              step={1}
              value={[gradient.angle]}
              onValueChange={handleAngleChange}
            />
          </div>
        )}
      </div>
      
      {/* Color Stops Controls */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Color Stops</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddColorStop}
            disabled={gradient.colorStops.length >= 5}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Color
          </Button>
        </div>
        
        <div className="space-y-4">
          {sortedColorStops.map((colorStop, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ColorPickerButton 
                    color={colorStop.color} 
                    onChange={(color) => handleColorChange(index, color)} 
                  />
                  <span className="text-sm font-medium">Stop {index + 1}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveColorStop(index)}
                  disabled={gradient.colorStops.length <= 2}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Location Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label htmlFor={`location-${index}`}>Position</Label>
                  <span>{Math.round(colorStop.location * 100)}%</span>
                </div>
                <Slider
                  id={`location-${index}`}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[colorStop.location]}
                  onValueChange={(values) => handleLocationChange(index, values)}
                />
              </div>
              
              {/* Opacity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label htmlFor={`opacity-${index}`}>Opacity</Label>
                  <span>{Math.round(colorStop.opacity * 100)}%</span>
                </div>
                <Slider
                  id={`opacity-${index}`}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[colorStop.opacity]}
                  onValueChange={(values) => handleOpacityChange(index, values)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};