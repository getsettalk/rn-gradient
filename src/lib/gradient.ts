import { nanoid } from 'nanoid';
import { Gradient, ColorStop } from '../shared/schema';
import { isLocalStorageAvailable } from './utils';

/**
 * Generate a CSS gradient string from a Gradient object
 */
export const generateGradientCSS = (gradient: Gradient, colorFormat: "hex" | "rgba" = "hex"): string => {
  if (!gradient?.colorStops || gradient.colorStops.length < 2) {
    return "linear-gradient(90deg, #ffffff, #000000)";
  }

  // Sort color stops by location
  const sortedStops = [...gradient.colorStops].sort((a, b) => a.location - b.location);
  
  // Direction or angle
  const direction = gradient.useAngle ? `${gradient.angle}deg` : 'to right';
  
  // Format color stops
  const colorStops = sortedStops.map(stop => {
    const color = colorFormat === "rgba" 
      ? convertHexToRGBA(stop.color, stop.opacity)
      : stop.color;
    return `${color} ${Math.round(stop.location * 100)}%`;
  });
  
  // Build the CSS
  return `linear-gradient(${direction}, ${colorStops.join(', ')})`;
};

/**
 * Generate code for React Native linear gradient
 */
export const generateReactNativeCode = (
  gradient: Gradient, 
  includeLocations: boolean = true,
  colorFormat: "hex" | "rgba" = "hex"
): string => {
  if (!gradient?.colorStops || gradient.colorStops.length < 2) {
    return "<LinearGradient colors={['#ffffff', '#000000']} />";
  }

  // Sort color stops by location
  const sortedStops = [...gradient.colorStops].sort((a, b) => a.location - b.location);
  
  // Format colors
  const colors = sortedStops.map(stop => {
    return colorFormat === "rgba" 
      ? `'${convertHexToRGBA(stop.color, stop.opacity)}'`
      : `'${stop.color}'`;
  });
  
  // Format locations if included
  const locations = sortedStops.map(stop => stop.location.toFixed(2));
  
  // Build component code
  let code = "<LinearGradient\n";
  code += `  colors={[${colors.join(", ")}]}\n`;
  
  if (includeLocations) {
    code += `  locations={[${locations.join(", ")}]}\n`;
  }
  
  if (gradient.useAngle) {
    // Convert angle to start/end points for React Native
    const { start, end } = angleToStartEndPoints(gradient.angle);
    code += `  start={${JSON.stringify(start)}}\n`;
    code += `  end={${JSON.stringify(end)}}\n`;
  }
  
  code += "  style={styles.gradient}\n/>";
  
  return code;
};

/**
 * Generate a random gradient
 */
export const generateRandomGradient = (): Gradient => {
  // Generate a gradient with 2-4 color stops
  const numStops = Math.floor(Math.random() * 3) + 2;
  const colorStops: ColorStop[] = [];
  
  // Create evenly spaced color stops
  for (let i = 0; i < numStops; i++) {
    colorStops.push({
      color: generateRandomHexColor(),
      location: i / (numStops - 1),
      opacity: Math.random() * 0.3 + 0.7 // Between 0.7 and 1.0
    });
  }
  
  // Generate random angle
  const angle = Math.floor(Math.random() * 360);
  
  return {
    id: nanoid(),
    name: "Random Gradient",
    colorStops,
    angle,
    useAngle: true
  };
};

/**
 * Save a gradient to local storage
 */
export const saveGradientToLocalStorage = (gradient: Gradient): Gradient | undefined => {
  if (!isLocalStorageAvailable()) return undefined;
  
  try {
    // Get existing gradients
    const savedGradients = getSavedGradientsFromLocalStorage();
    
    // Generate a unique ID if none exists
    const gradientToSave: Gradient = {
      ...gradient,
      id: gradient.id || nanoid()
    };
    
    // Add the new gradient
    const updatedGradients = [...savedGradients, gradientToSave];
    
    // Save to local storage
    localStorage.setItem('savedGradients', JSON.stringify(updatedGradients));
    
    return gradientToSave;
  } catch (error) {
    console.error('Error saving gradient to local storage:', error);
    return undefined;
  }
};

/**
 * Get saved gradients from local storage
 */
export const getSavedGradientsFromLocalStorage = (): Gradient[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const savedGradientsJSON = localStorage.getItem('savedGradients');
    if (!savedGradientsJSON) return [];
    
    const savedGradients = JSON.parse(savedGradientsJSON);
    return Array.isArray(savedGradients) ? savedGradients : [];
  } catch (error) {
    console.error('Error getting saved gradients from local storage:', error);
    return [];
  }
};

/**
 * Delete a gradient from local storage
 */
export const deleteGradientFromLocalStorage = (id: string): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const savedGradients = getSavedGradientsFromLocalStorage();
    const updatedGradients = savedGradients.filter(gradient => gradient.id !== id);
    
    localStorage.setItem('savedGradients', JSON.stringify(updatedGradients));
  } catch (error) {
    console.error('Error deleting gradient from local storage:', error);
  }
};

/**
 * Delete all gradients from local storage
 */
export const deleteAllGradientsFromLocalStorage = (): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem('savedGradients');
  } catch (error) {
    console.error('Error deleting all gradients from local storage:', error);
  }
};

// Helper functions

// Generate a random hex color code
function generateRandomHexColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Convert a hex color to RGBA
 */
function convertHexToRGBA(hex: string, opacity: number = 1): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return rgba value
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Convert an angle to start and end points for React Native LinearGradient
 */
function angleToStartEndPoints(angle: number): { start: { x: number, y: number }, end: { x: number, y: number } } {
  // Normalize angle to 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // Convert angle to radians
  const radians = (normalizedAngle * Math.PI) / 180;
  
  // Calculate the start and end points
  const start = {
    x: 0.5 - 0.5 * Math.cos(radians),
    y: 0.5 - 0.5 * Math.sin(radians)
  };
  
  const end = {
    x: 0.5 + 0.5 * Math.cos(radians),
    y: 0.5 + 0.5 * Math.sin(radians)
  };
  
  // Round to 2 decimal places
  return {
    start: {
      x: parseFloat(start.x.toFixed(2)),
      y: parseFloat(start.y.toFixed(2))
    },
    end: {
      x: parseFloat(end.x.toFixed(2)),
      y: parseFloat(end.y.toFixed(2))
    }
  };
}