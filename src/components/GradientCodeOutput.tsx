import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { Gradient } from '../shared/schema';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { generateGradientCSS, generateReactNativeCode } from '../lib/gradient';
import { useToast } from '../hooks/use-toast';

interface GradientCodeOutputProps {
  gradient: Gradient;
  codeFormat: "reactNative" | "css";
  setCodeFormat: (format: "reactNative" | "css") => void;
  colorFormat: "hex" | "rgba";
  setColorFormat: (format: "hex" | "rgba") => void;
  includeLocations: boolean;
  setIncludeLocations: (include: boolean) => void;
  onToggleUseAngle: (useAngle: boolean) => void;
}

export const GradientCodeOutput = ({
  gradient,
  codeFormat,
  setCodeFormat,
  colorFormat,
  setColorFormat,
  includeLocations,
  setIncludeLocations,
  onToggleUseAngle
}: GradientCodeOutputProps) => {
  const { toast } = useToast();
  
  // Get formatted code
  const cssCode = generateGradientCSS(gradient, colorFormat);
  const reactNativeCode = generateReactNativeCode(gradient, includeLocations, colorFormat);
  
  // Copy code to clipboard
  const handleCopyCode = () => {
    const codeToCopy = codeFormat === 'css' ? cssCode : reactNativeCode;
    
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        toast('Code copied to clipboard', { type: 'success' });
      })
      .catch(() => {
        toast('Failed to copy code', { type: 'error' });
      });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Code Output</h2>
      </div>
      
      {/* Code Format Tabs */}
      <Tabs value={codeFormat} onValueChange={value => setCodeFormat(value as "css" | "reactNative")}>
        <TabsList>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="reactNative">React Native</TabsTrigger>
        </TabsList>
        
        {/* CSS Tab Content */}
        <TabsContent value="css" className="space-y-4">
          {/* Options */}
          <div className="flex flex-wrap gap-4 mb-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="color-format-css" className="text-sm">Use RGBA</Label>
              <Switch
                id="color-format-css"
                checked={colorFormat === 'rgba'}
                onCheckedChange={(checked) => setColorFormat(checked ? 'rgba' : 'hex')}
              />
            </div>
          </div>
          
          {/* Code Display */}
          <div className="relative">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
              <code>{cssCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleCopyCode}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </TabsContent>
        
        {/* React Native Tab Content */}
        <TabsContent value="reactNative" className="space-y-4">
          {/* Options */}
          <div className="flex flex-wrap gap-4 mb-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="color-format-rn" className="text-sm">Use RGBA</Label>
              <Switch
                id="color-format-rn"
                checked={colorFormat === 'rgba'}
                onCheckedChange={(checked) => setColorFormat(checked ? 'rgba' : 'hex')}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="include-locations" className="text-sm">Include Locations</Label>
              <Switch
                id="include-locations"
                checked={includeLocations}
                onCheckedChange={setIncludeLocations}
              />
            </div>
          </div>
          
          {/* Code Display */}
          <div className="relative">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm whitespace-pre-wrap">
              <code>{reactNativeCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleCopyCode}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Note: Install the react-native-linear-gradient package to use this code:</p>
            <pre className="bg-muted p-2 rounded-md mt-1 text-xs">
              npm install react-native-linear-gradient
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};