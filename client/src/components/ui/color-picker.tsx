import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  return { r, g, b };
};

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const ColorPicker = ({ color, onChange, onClose }: ColorPickerProps) => {
  const [internalColor, setInternalColor] = useState(color);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Common colors palette
  const commonColors = [
    "#f44336", "#e91e63", "#9c27b0", "#673ab7", 
    "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", 
    "#009688", "#4caf50", "#8bc34a", "#cddc39", 
    "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"
  ];

  // Close the color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Initialize HSL values from the input color
  useEffect(() => {
    // For simplicity, we'll convert hex to HSL
    // This is a simplified approach - in a real app you might want to use a library
    const { r, g, b } = hexToRgb(color);
    
    // Approximate HSL values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // Calculate lightness
    const l = (max + min) / (2 * 255);
    
    // Calculate saturation
    let s = 0;
    if (max !== min) {
      s = l > 0.5 
        ? (max - min) / (2 * 255 - max - min)
        : (max - min) / (max + min);
    }
    
    // Calculate hue
    let h = 0;
    if (max !== min) {
      if (max === r) {
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / (max - min) + 2;
      } else {
        h = (r - g) / (max - min) + 4;
      }
      h *= 60;
    }
    
    setHue(Math.round(h));
    setSaturation(Math.round(s * 100));
    setLightness(Math.round(l * 100));
  }, [color]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInternalColor(value);
    
    // Validate hex format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      onChange(value);
    }
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    updateColorFromHSL(newHue, saturation, lightness);
  };

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSaturation = parseInt(e.target.value);
    setSaturation(newSaturation);
    updateColorFromHSL(hue, newSaturation, lightness);
  };

  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLightness = parseInt(e.target.value);
    setLightness(newLightness);
    updateColorFromHSL(hue, saturation, newLightness);
  };

  const updateColorFromHSL = (h: number, s: number, l: number) => {
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l / 100 - c / 2;

    let r = 0, g = 0, b = 0;
    if (h < 60) {
      r = c; g = x; b = 0;
    } else if (h < 120) {
      r = x; g = c; b = 0;
    } else if (h < 180) {
      r = 0; g = c; b = x;
    } else if (h < 240) {
      r = 0; g = x; b = c;
    } else if (h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    const newR = Math.round((r + m) * 255);
    const newG = Math.round((g + m) * 255);
    const newB = Math.round((b + m) * 255);
    
    const newColor = rgbToHex(newR, newG, newB);
    setInternalColor(newColor);
    onChange(newColor);
  };

  const handleCommonColorClick = (color: string) => {
    setInternalColor(color);
    onChange(color);
  };

  const hueGradient = `linear-gradient(to right, 
    hsl(0, 100%, 50%), 
    hsl(60, 100%, 50%), 
    hsl(120, 100%, 50%), 
    hsl(180, 100%, 50%), 
    hsl(240, 100%, 50%), 
    hsl(300, 100%, 50%), 
    hsl(360, 100%, 50%))`;

  const saturationGradient = `linear-gradient(to right, 
    hsl(${hue}, 0%, ${lightness}%), 
    hsl(${hue}, 100%, ${lightness}%))`;

  const lightnessGradient = `linear-gradient(to right, 
    hsl(${hue}, ${saturation}%, 0%), 
    hsl(${hue}, ${saturation}%, 50%), 
    hsl(${hue}, ${saturation}%, 100%))`;

  return (
    <Card ref={colorPickerRef} className="w-64 z-50 shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <div 
            className="w-12 h-12 rounded-md border"
            style={{ backgroundColor: internalColor }}
          />
          <Input 
            type="text" 
            value={internalColor} 
            onChange={handleHexChange}
            className="ml-2 flex-1"
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs">Hue</span>
              <span className="text-xs">{hue}°</span>
            </div>
            <div 
              className="h-5 rounded-sm mb-1"
              style={{ background: hueGradient }}
            />
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs">Saturation</span>
              <span className="text-xs">{saturation}%</span>
            </div>
            <div 
              className="h-5 rounded-sm mb-1"
              style={{ background: saturationGradient }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={handleSaturationChange}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs">Lightness</span>
              <span className="text-xs">{lightness}%</span>
            </div>
            <div 
              className="h-5 rounded-sm mb-1"
              style={{ background: lightnessGradient }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={handleLightnessChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs mb-2">Common Colors</p>
          <div className="grid grid-cols-8 gap-1">
            {commonColors.map((clr, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-sm cursor-pointer hover:scale-110 transition-transform border border-gray-600"
                style={{ backgroundColor: clr }}
                onClick={() => handleCommonColorClick(clr)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
