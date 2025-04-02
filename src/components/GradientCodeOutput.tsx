import React from "react";
import { Gradient } from "../shared/schema";
import { generateGradientCSS, generateReactNativeCode } from "../lib/gradient";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useToast } from "../hooks/use-toast";

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
  onToggleUseAngle,
}: GradientCodeOutputProps) => {
  const { toast } = useToast();

  const code = codeFormat === "css"
    ? generateGradientCSS(gradient, colorFormat)
    : generateReactNativeCode(gradient, colorFormat, includeLocations);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast("Code copied to clipboard", { type: "success" });
    } catch (err) {
      toast("Failed to copy code", { type: "error" });
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div>
        <h3 className="text-lg font-semibold mb-4">Generated Code</h3>
        
        <Tabs defaultValue={codeFormat} onValueChange={(value) => setCodeFormat(value as "reactNative" | "css")}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="reactNative">React Native</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="color-format"
                checked={colorFormat === "rgba"}
                onCheckedChange={(checked) => setColorFormat(checked ? "rgba" : "hex")}
              />
              <Label htmlFor="color-format">Use RGBA</Label>
            </div>
            
            {codeFormat === "reactNative" && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-locations"
                  checked={includeLocations}
                  onCheckedChange={setIncludeLocations}
                />
                <Label htmlFor="include-locations">Include Locations</Label>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 relative">
          <pre className="p-4 rounded-md bg-muted font-mono text-sm overflow-x-auto">
            <code>{code}</code>
          </pre>
          
          <Button
            onClick={copyToClipboard}
            className="absolute top-2 right-2"
            size="sm"
            variant="outline"
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GradientCodeOutput;