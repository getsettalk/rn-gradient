import { nanoid } from 'nanoid';
import { ColorStop, Gradient } from '../shared/schema';
import { isLocalStorageAvailable } from './utils';

/**
 * Generate a CSS gradient string from a Gradient object
 */
export const generateGradientCSS = (gradient: Gradient, colorFormat: "hex" | "rgba" = "hex"): string => {
  // Sort color stops by position
  const sortedStops = [...gradient.colorStops].sort((a, b) => a.position - b.position);
  
  // Format color stops based on the specified color format
  const formattedStops = sortedStops.map(stop => {
    if (colorFormat === "rgba") {
      // Convert hex to rgba
      const r = parseInt(stop.color.slice(1, 3), 16);
      const g = parseInt(stop.color.slice(3, 5), 16);
      const b = parseInt(stop.color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 1) ${Math.round(stop.position * 100)}%`;
    } else {
      return `${stop.color} ${Math.round(stop.position * 100)}%`;
    }
  }).join(', ');
  
  if (gradient.useAngle) {
    return `linear-gradient(${gradient.angle}deg, ${formattedStops})`;
  } else {
    // Use 'to bottom' direction when angle is not used
    return `linear-gradient(to bottom, ${formattedStops})`;
  }
};

/**
 * Generate code for React Native linear gradient
 */
export const generateReactNativeCode = (
  gradient: Gradient, 
  colorFormat: "hex" | "rgba" = "hex",
  includeLocations: boolean = true,
): string => {
  // Sort color stops by position
  const sortedStops = [...gradient.colorStops].sort((a, b) => a.position - b.position);
  
  // Format colors based on the specified color format
  const colors = sortedStops.map(stop => {
    if (colorFormat === "rgba") {
      // Convert hex to rgba
      const r = parseInt(stop.color.slice(1, 3), 16);
      const g = parseInt(stop.color.slice(3, 5), 16);
      const b = parseInt(stop.color.slice(5, 7), 16);
      return `"rgba(${r}, ${g}, ${b}, 1)"`;
    } else {
      return `"${stop.color}"`;
    }
  });
  
  // Extract locations
  const locations = sortedStops.map(stop => stop.position);
  
  // Generate the code
  let code = '<LinearGradient\n';
  
  // Add colors
  code += `  colors={[${colors.join(', ')}]}\n`;
  
  // Add locations if needed
  if (includeLocations) {
    code += `  locations={[${locations.join(', ')}]}\n`;
  }
  
  // Add start and end points based on angle
  if (gradient.useAngle) {
    // Convert angle to start and end coordinates
    const angle = gradient.angle % 360;
    const angleRad = (angle - 90) * (Math.PI / 180);
    
    // Calculate start and end points
    // This is a simplified approach that works for common angles
    const start = { x: 0.5, y: 0.5 };
    const end = {
      x: 0.5 + 0.5 * Math.cos(angleRad),
      y: 0.5 + 0.5 * Math.sin(angleRad)
    };
    
    code += `  start={{ x: ${start.x.toFixed(2)}, y: ${start.y.toFixed(2)} }}\n`;
    code += `  end={{ x: ${end.x.toFixed(2)}, y: ${end.y.toFixed(2)} }}\n`;
  } else {
    // Default vertical gradient (top to bottom)
    code += '  start={{ x: 0.5, y: 0 }}\n';
    code += '  end={{ x: 0.5, y: 1 }}\n';
  }
  
  code += '  style={{ flex: 1 }}\n';
  code += '/>';
  
  return code;
};

/**
 * Generate a random gradient
 */
export const generateRandomGradient = (): Gradient => {
  // Generate random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Random angle between 0 and 359
  const angle = Math.floor(Math.random() * 360);
  
  // Random number of color stops (2-4)
  const numStops = Math.floor(Math.random() * 3) + 2;
  
  // Generate color stops
  const colorStops: ColorStop[] = [];
  for (let i = 0; i < numStops; i++) {
    colorStops.push({
      color: getRandomColor(),
      position: i / (numStops - 1)  // Evenly distribute positions
    });
  }
  
  return {
    id: nanoid(),
    name: `Random Gradient`,
    angle,
    useAngle: true,
    colorStops
  };
};

/**
 * Save a gradient to local storage
 */
export const saveGradientToLocalStorage = (gradient: Gradient): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    // Get existing gradients
    const existingGradientsString = localStorage.getItem('savedGradients');
    let savedGradients: Gradient[] = [];
    
    if (existingGradientsString) {
      savedGradients = JSON.parse(existingGradientsString);
    }
    
    // Check if this gradient already exists by ID
    const existingIndex = savedGradients.findIndex(g => g.id === gradient.id);
    
    if (existingIndex !== -1) {
      // Update existing gradient
      savedGradients[existingIndex] = gradient;
    } else {
      // Add new gradient
      savedGradients.push(gradient);
    }
    
    // Save to localStorage
    localStorage.setItem('savedGradients', JSON.stringify(savedGradients));
  } catch (error) {
    console.error('Error saving gradient to localStorage:', error);
  }
};

/**
 * Get saved gradients from local storage
 */
export const getSavedGradientsFromLocalStorage = (): Gradient[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const savedGradientsString = localStorage.getItem('savedGradients');
    if (!savedGradientsString) return [];
    
    return JSON.parse(savedGradientsString);
  } catch (error) {
    console.error('Error getting gradients from localStorage:', error);
    return [];
  }
};

/**
 * Delete a gradient from local storage
 */
export const deleteGradientFromLocalStorage = (id: string): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const existingGradientsString = localStorage.getItem('savedGradients');
    if (!existingGradientsString) return;
    
    let savedGradients: Gradient[] = JSON.parse(existingGradientsString);
    
    // Filter out the gradient to delete
    savedGradients = savedGradients.filter(g => g.id !== id);
    
    // Save to localStorage
    localStorage.setItem('savedGradients', JSON.stringify(savedGradients));
  } catch (error) {
    console.error('Error deleting gradient from localStorage:', error);
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
    console.error('Error clearing gradients from localStorage:', error);
  }
};