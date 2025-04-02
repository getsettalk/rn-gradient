import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gradient } from "@shared/schema";
import { generateReactNativeCode, generateGradientCSS } from "@/lib/gradient";

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

const GradientCodeOutput = ({
  gradient,
  codeFormat,
  setCodeFormat,
  colorFormat,
  setColorFormat,
  includeLocations,
  setIncludeLocations,
  onToggleUseAngle
}: GradientCodeOutputProps) => {
  const reactNativeCode = generateReactNativeCode(gradient, colorFormat, includeLocations);
  const cssCode = `.gradient {\n  background: ${generateGradientCSS(gradient, colorFormat)};\n}`;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Code Export</h2>
        
        <Tabs 
          defaultValue="reactNative" 
          value={codeFormat} 
          onValueChange={(value) => setCodeFormat(value as "reactNative" | "css")}
          className="mb-4"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="reactNative">React Native</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reactNative" className="mt-4">
            <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm text-muted-foreground leading-relaxed">
              <code>{reactNativeCode}</code>
            </pre>
          </TabsContent>
          
          <TabsContent value="css" className="mt-4">
            <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm text-muted-foreground leading-relaxed">
              <code>{cssCode}</code>
            </pre>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-3 text-muted-foreground">Output Format</h3>
            <RadioGroup
              value={colorFormat}
              onValueChange={(value) => setColorFormat(value as "hex" | "rgba")}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hex" id="formatHex" />
                <Label htmlFor="formatHex" className="text-sm text-muted-foreground">HEX (#RRGGBB)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rgba" id="formatRgba" />
                <Label htmlFor="formatRgba" className="text-sm text-muted-foreground">RGBA (r,g,b,a)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-3 text-muted-foreground">Additional Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="useAngleCheck" 
                  checked={gradient.useAngle}
                  onCheckedChange={(checked) => onToggleUseAngle(checked === true)}
                />
                <Label htmlFor="useAngleCheck" className="text-sm text-muted-foreground">
                  Use angle property instead of start/end
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeLocations"
                  checked={includeLocations}
                  onCheckedChange={(checked) => setIncludeLocations(checked === true)}
                />
                <Label htmlFor="includeLocations" className="text-sm text-muted-foreground">
                  Include stop locations
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradientCodeOutput;
