import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose?: () => void;
}

export const ColorPickerButton = ({ color, onChange }: { color: string; onChange: (color: string) => void }) => {
  const [showPicker, setShowPicker] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        className="w-8 h-8 rounded-md border overflow-hidden shadow-sm"
        style={{ backgroundColor: color }}
        onClick={() => setShowPicker(prev => !prev)}
        aria-label="Choose color"
      />
      
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 z-10">
          <ColorPicker
            color={color}
            onChange={onChange}
            onClose={() => setShowPicker(false)}
          />
        </div>
      )}
    </div>
  );
};

export const ColorPicker = ({ color, onChange, onClose }: ColorPickerProps) => {
  const [hsb, setHsb] = useState(hexToHsb(color));
  const [inputValue, setInputValue] = useState(color);
  
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Set input value when color changes
  useEffect(() => {
    setInputValue(color);
    setHsb(hexToHsb(color));
  }, [color]);
  
  useEffect(() => {
    // Close the color picker when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClose && onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Handle saturation change
  const handleSaturationChange = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!saturationRef.current) return;
    
    const { current: element } = saturationRef;
    const rect = element.getBoundingClientRect();
    
    const updateSaturation = (event: MouseEvent) => {
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      
      const newHsb = {
        ...hsb,
        s: x * 100,
        b: 100 - y * 100
      };
      
      setHsb(newHsb);
      const hex = hsbToHex(newHsb.h, newHsb.s, newHsb.b);
      setInputValue(hex);
      onChange(hex);
    };
    
    // Initial update
    updateSaturation(event.nativeEvent);
    
    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      updateSaturation(event);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle hue change
  const handleHueChange = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hueRef.current) return;
    
    const { current: element } = hueRef;
    const rect = element.getBoundingClientRect();
    
    const updateHue = (event: MouseEvent) => {
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      
      const newHsb = {
        ...hsb,
        h: Math.round(x * 360)
      };
      
      setHsb(newHsb);
      const hex = hsbToHex(newHsb.h, newHsb.s, newHsb.b);
      setInputValue(hex);
      onChange(hex);
    };
    
    // Initial update
    updateHue(event.nativeEvent);
    
    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      updateHue(event);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle hex input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    
    // Validate hex color format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      try {
        const newHsb = hexToHsb(value);
        setHsb(newHsb);
        onChange(value);
      } catch (error) {
        // Invalid color format
      }
    }
  };
  
  // Convert HSB to background gradient for saturation picker
  const saturationGradient = `linear-gradient(to right, #fff, hsl(${hsb.h}, 100%, 50%))`;
  const brightnessGradient = 'linear-gradient(to top, #000, transparent)';
  
  return (
    <div 
      ref={wrapperRef}
      className="p-4 bg-card border rounded-lg shadow-lg w-64"
    >
      {/* Current color preview */}
      <div 
        className="w-full h-8 rounded-md mb-4"
        style={{ backgroundColor: inputValue }}
      />
      
      {/* Saturation/Brightness picker */}
      <div 
        ref={saturationRef}
        className="w-full h-32 rounded-md mb-4 relative cursor-crosshair"
        style={{ background: `${saturationGradient}, ${brightnessGradient}` }}
        onMouseDown={handleSaturationChange}
      >
        {/* Thumb indicator */}
        <div 
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full pointer-events-none"
          style={{ 
            left: `${hsb.s}%`, 
            top: `${100 - hsb.b}%`,
            backgroundColor: inputValue,
          }}
        />
      </div>
      
      {/* Hue slider */}
      <div 
        ref={hueRef}
        className="w-full h-6 rounded-md mb-4 cursor-ew-resize"
        style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
        onMouseDown={handleHueChange}
      >
        {/* Thumb indicator */}
        <div 
          className="relative w-4 h-6 -translate-x-1/2 pointer-events-none"
          style={{ 
            left: `${hsb.h / 360 * 100}%`,
            backgroundColor: `hsl(${hsb.h}, 100%, 50%)`,
            border: '2px solid white',
            borderRadius: '2px',
          }}
        />
      </div>
      
      {/* Hex input */}
      <div className="flex items-center">
        <label className="text-xs text-muted-foreground mr-2">#</label>
        <input
          type="text"
          value={inputValue.replace('#', '')}
          onChange={handleInputChange}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Hex color"
        />
      </div>
    </div>
  );
};

// Helper functions for color conversion

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert shorthand hex to full form
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
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
  let s = max === 0 ? 0 : delta / max;
  let v = max;
  
  if (delta !== 0) {
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
  
  return { h, s: s * 100, b: v * 100 };
}

function hexToHsb(hex: string): { h: number; s: number; b: number } {
  const rgb = hexToRgb(hex);
  return rgbToHsb(rgb.r, rgb.g, rgb.b);
}

function hsbToRgb(h: number, s: number, b: number): { r: number; g: number; b: number } {
  s /= 100;
  b /= 100;
  
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  
  return {
    r: Math.round(255 * f(5)),
    g: Math.round(255 * f(3)),
    b: Math.round(255 * f(1))
  };
}

function hsbToHex(h: number, s: number, b: number): string {
  const rgb = hsbToRgb(h, s, b);
  return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
}