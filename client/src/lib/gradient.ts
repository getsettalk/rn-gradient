import { Gradient, ColorStop } from "@shared/schema";
import { nanoid } from "nanoid";

const hexToRgba = (hex: string): string => {
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
  
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

export const generateGradientCSS = (gradient: Gradient, colorFormat: "hex" | "rgba" = "hex"): string => {
  // Sort color stops by position
  const sortedStops = [...gradient.colorStops].sort((a, b) => a.position - b.position);
  
  // Format the color stops
  const formattedStops = sortedStops.map(stop => {
    const color = colorFormat === "rgba" ? hexToRgba(stop.color) : stop.color;
    return `${color} ${stop.position}%`;
  });
  
  return `linear-gradient(${gradient.angle}deg, ${formattedStops.join(', ')})`;
};

export const generateReactNativeCode = (
  gradient: Gradient, 
  colorFormat: "hex" | "rgba" = "hex",
  includeLocations: boolean = false
): string => {
  // Sort color stops by position
  const sortedStops = [...gradient.colorStops].sort((a, b) => a.position - b.position);
  
  // Format colors array
  const colors = sortedStops.map(stop => 
    colorFormat === "rgba" ? hexToRgba(stop.color) : stop.color
  );
  
  const colorsArrayStr = colors.map(color => `'${color}'`).join(', ');
  
  // Format locations array if needed
  const locations = sortedStops.map(stop => stop.position / 100);
  const locationsArrayStr = locations.join(', ');

  let code = `import LinearGradient from 'react-native-linear-gradient';\n\n`;
  code += `const GradientComponent = () => (\n`;
  code += `  <LinearGradient\n`;
  code += `    colors={[${colorsArrayStr}]}\n`;
  
  if (gradient.useAngle) {
    code += `    useAngle={true}\n`;
    code += `    angle={${gradient.angle}}\n`;
  } else {
    // Calculate start and end based on angle
    const angleInRadians = ((90 - gradient.angle) * Math.PI) / 180; // Convert to RN system

    const startX = 0.5 + 0.5 * Math.cos(angleInRadians);
    const startY = 0.5 - 0.5 * Math.sin(angleInRadians);
    const endX = 0.5 - 0.5 * Math.cos(angleInRadians);
    const endY = 0.5 + 0.5 * Math.sin(angleInRadians);
    
    
    
    
    
    code += `    start={{x: ${startX.toFixed(2)}, y: ${startY.toFixed(2)}}}\n`;
    code += `    end={{x: ${endX.toFixed(2)}, y: ${endY.toFixed(2)}}}\n`;
  }
  
  if (includeLocations && sortedStops.length > 0) {
    code += `    locations={[${locationsArrayStr}]}\n`;
  }
  
  code += `    style={{ flex: 1 }}\n`;
  code += `  />\n`;
  code += `);\n\n`;
  code += `export default GradientComponent;`;
  
  return code;
};

export const generateRandomGradient = (): Gradient => {
  // Generate 2-3 random colors
  const numColors = Math.floor(Math.random() * 2) + 2; // 2-3 colors
  const colorStops: ColorStop[] = [];
  
  // Generate random colors with evenly distributed positions
  for (let i = 0; i < numColors; i++) {
    const position = Math.round((i / (numColors - 1)) * 100);
    colorStops.push({
      color: getRandomColor(),
      position
    });
  }
  
  return {
    id: nanoid(),
    angle: Math.floor(Math.random() * 360),
    colorStops,
    useAngle: false
  };
};

const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
