import React, { useEffect, useRef, useState } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export const ColorPicker = ({ color, onChange, onClose }: ColorPickerProps) => {
  const [hsb, setHsb] = useState(hexToHsb(color));
  const [currentColor, setCurrentColor] = useState(color);
  
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Handle clicking outside of the color picker
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  useEffect(() => {
    // Update the color when hsb changes
    const newColor = hsbToHex(hsb.h, hsb.s, hsb.b);
    setCurrentColor(newColor);
    onChange(newColor);
  }, [hsb, onChange]);
  
  // Handle saturation/brightness selection
  useEffect(() => {
    if (!saturationRef.current) return;
    
    const updateSaturation = (event: MouseEvent) => {
      const rect = saturationRef.current!.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      
      setHsb(prev => ({
        ...prev,
        s: x,
        b: 1 - y
      }));
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      updateSaturation(event);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    const handleMouseDown = (event: MouseEvent) => {
      updateSaturation(event);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    saturationRef.current.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      if (saturationRef.current) {
        saturationRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // Handle hue selection
  useEffect(() => {
    if (!hueRef.current) return;
    
    const updateHue = (event: MouseEvent) => {
      const rect = hueRef.current!.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      
      setHsb(prev => ({
        ...prev,
        h: x * 360
      }));
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      updateHue(event);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    const handleMouseDown = (event: MouseEvent) => {
      updateHue(event);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    hueRef.current.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      if (hueRef.current) {
        hueRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // Generate background colors for the hue slider
  const hueBackground = `linear-gradient(to right, 
    #ff0000 0%, 
    #ffff00 17%, 
    #00ff00 33%, 
    #00ffff 50%, 
    #0000ff 67%, 
    #ff00ff 83%, 
    #ff0000 100%
  )`;
  
  // Generate background for the saturation/brightness area
  const saturationBackground = `linear-gradient(to right, #fff, hsl(${hsb.h}, 100%, 50%))`;
  const brightnessOverlay = 'linear-gradient(to bottom, transparent, #000)';
  
  return (
    <div 
      ref={pickerRef}
      className="absolute z-50 w-64 p-3 bg-card border rounded-lg shadow-lg"
      style={{ left: '0', top: '100%', marginTop: '5px' }}
    >
      <div className="space-y-3">
        {/* Current color display */}
        <div 
          className="h-8 w-full rounded"
          style={{ backgroundColor: currentColor }}
        ></div>
        
        {/* Saturation/Brightness area */}
        <div
          ref={saturationRef}
          className="relative h-32 w-full rounded cursor-crosshair"
          style={{ 
            background: saturationBackground,
            backgroundImage: `${saturationBackground}, ${brightnessOverlay}`
          }}
        >
          <div
            className="absolute w-3 h-3 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${hsb.s * 100}%`,
              top: `${(1 - hsb.b) * 100}%`,
              boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)'
            }}
          ></div>
        </div>
        
        {/* Hue slider */}
        <div
          ref={hueRef}
          className="relative h-6 w-full rounded cursor-pointer"
          style={{ background: hueBackground }}
        >
          <div
            className="absolute w-2 h-6 rounded-sm border-2 border-white -translate-x-1/2 pointer-events-none"
            style={{
              left: `${(hsb.h / 360) * 100}%`,
              boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)'
            }}
          ></div>
        </div>
        
        {/* Hex display */}
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium">Hex:</div>
          <div className="text-sm font-mono">{currentColor.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for color conversions
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsb(r: number, g: number, b: number): { h: number; s: number; b: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  if (delta > 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  
  const s = max === 0 ? 0 : delta / max;
  const v = max;
  
  return { h, s, b: v };
}

function hexToHsb(hex: string): { h: number; s: number; b: number } {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsb(r, g, b);
}

function hsbToRgb(h: number, s: number, b: number): { r: number; g: number; b: number } {
  const c = b * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;
  
  let r = 0, g = 0, bl = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; bl = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; bl = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; bl = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; bl = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; bl = c;
  } else {
    r = c; g = 0; bl = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((bl + m) * 255)
  };
}

function hsbToHex(h: number, s: number, b: number): string {
  const { r, g, b: bl } = hsbToRgb(h, s, b);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}