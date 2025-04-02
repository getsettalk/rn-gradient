import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { Gradient, ColorStop } from "@shared/schema";
import { 
  ArrowUp, ArrowRight, ArrowDown, ArrowLeft, 
  ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft,
  MoveHorizontal, Plus, X
} from "lucide-react";

interface GradientControlsProps {
  gradient: Gradient;
  onAngleChange: (angle: number) => void;
  onColorStopChange: (index: number, colorStop: ColorStop) => void;
  onAddColorStop: () => void;
  onRemoveColorStop: (index: number) => void;
}

const directionConfig = [
  { icon: ArrowUpLeft, direction: "top-left", angle: 315 },
  { icon: ArrowUp, direction: "top", angle: 0 },
  { icon: ArrowUpRight, direction: "top-right", angle: 45 },
  { icon: ArrowLeft, direction: "left", angle: 270 },
  { icon: MoveHorizontal, direction: "center", angle: -1 }, // -1 means don't change angle
  { icon: ArrowRight, direction: "right", angle: 90 },
  { icon: ArrowDownLeft, direction: "bottom-left", angle: 225 },
  { icon: ArrowDown, direction: "bottom", angle: 180 },
  { icon: ArrowDownRight, direction: "bottom-right", angle: 135 }
];

const GradientControls = ({ 
  gradient, 
  onAngleChange, 
  onColorStopChange, 
  onAddColorStop, 
  onRemoveColorStop 
}: GradientControlsProps) => {
  const [activeDirection, setActiveDirection] = useState<string>("center");
  const [colorPickerOpen, setColorPickerOpen] = useState<number | null>(null);

  const handleDirectionClick = (direction: string, angle: number) => {
    setActiveDirection(direction);
    if (angle !== -1) {
      onAngleChange(angle);
    }
  };

  const handleColorChange = (index: number, color: string) => {
    onColorStopChange(index, {
      ...gradient.colorStops[index],
      color
    });
  };

  const handlePositionChange = (index: number, position: number) => {
    onColorStopChange(index, {
      ...gradient.colorStops[index],
      position
    });
  };

  const handleColorInputChange = (index: number, value: string) => {
    // Validate if it's a valid hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      handleColorChange(index, value);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Gradient Settings</h2>
        
        {/* Direction/Angle Controls */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3 text-muted-foreground">Direction</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {directionConfig.map(({ icon: Icon, direction, angle }) => (
              <Button 
                key={direction}
                variant="outline"
                className={`py-2 ${activeDirection === direction ? 'bg-primary/20 border-primary/50' : ''}`}
                onClick={() => handleDirectionClick(direction, angle)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
          
          <h3 className="text-md font-medium mb-3 text-muted-foreground">Angle: {gradient.angle}°</h3>
          <div className="flex items-center">
            <Slider 
              value={[gradient.angle]} 
              min={0} 
              max={360} 
              step={1}
              onValueChange={(value) => onAngleChange(value[0])}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Color Stops */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium text-muted-foreground">Color Stops</h3>
            <Button 
              variant="ghost" 
              onClick={onAddColorStop} 
              className="text-primary hover:text-primary/80 text-sm h-8 px-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Color
            </Button>
          </div>
          
          <div className="space-y-3">
            {gradient.colorStops.map((colorStop, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-md border cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: colorStop.color }}
                    onClick={() => setColorPickerOpen(colorPickerOpen === index ? null : index)}
                  />
                  
                  {colorPickerOpen === index && (
                    <div className="absolute z-10 mt-2">
                      <ColorPicker 
                        color={colorStop.color}
                        onChange={(color) => handleColorChange(index, color)}
                        onClose={() => setColorPickerOpen(null)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <Input 
                    type="text" 
                    value={colorStop.color} 
                    onChange={(e) => handleColorInputChange(index, e.target.value)}
                    className="w-full bg-background"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={colorStop.position} 
                    min={0} 
                    max={100} 
                    onChange={(e) => handlePositionChange(index, parseInt(e.target.value, 10))}
                    className="w-16 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">%</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-destructive transition-opacity"
                  onClick={() => onRemoveColorStop(index)}
                  disabled={gradient.colorStops.length <= 2}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradientControls;
