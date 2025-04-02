import React, { useRef, useState } from "react";
import { Gradient } from "../shared/schema";
import { generateGradientCSS, generateReactNativeCode } from "../lib/gradient";
import { Button } from "./ui/button";
import { RefreshCw, Copy, Save, CheckCheck } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";

interface GradientPreviewProps {
  gradient: Gradient;
  onRandomize: () => void;
  onSave: () => void;
  codeFormat: "reactNative" | "css";
}

const GradientPreview = ({ gradient, onRandomize, onSave, codeFormat }: GradientPreviewProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [gradientName, setGradientName] = useState(gradient.name || "");
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Update name when gradient changes
  React.useEffect(() => {
    setGradientName(gradient.name || "");
  }, [gradient]);
  
  // Generate CSS gradient string
  const gradientStyle = {
    background: generateGradientCSS(gradient),
  };
  
  // Copy gradient code to clipboard
  const handleCopyCode = () => {
    let codeToCopy = "";
    
    if (codeFormat === "css") {
      codeToCopy = `background: ${generateGradientCSS(gradient)};`;
    } else {
      codeToCopy = generateReactNativeCode(gradient);
    }
    
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        setIsCopied(true);
        toast("Gradient code copied to clipboard", { type: "success" });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast("Failed to copy code to clipboard", { type: "error" });
      });
  };
  
  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGradientName(e.target.value);
    gradient.name = e.target.value;
  };
  
  // Handle save
  const handleSave = () => {
    if (!gradientName) {
      setGradientName(`Gradient ${new Date().toLocaleString()}`);
      gradient.name = `Gradient ${new Date().toLocaleString()}`;
    }
    onSave();
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={onRandomize}
              title="Generate random gradient"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Randomize</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleCopyCode}
              title="Copy gradient code"
            >
              {isCopied ? (
                <CheckCheck className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy Code</span>
            </Button>
          </div>
        </div>
        
        <div 
          ref={previewRef}
          className="w-full h-56 rounded-lg flex items-center justify-center overflow-hidden checkerboard"
        >
          <div 
            className="w-full h-full"
            style={gradientStyle}
          />
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Input
            placeholder="Gradient name"
            value={gradientName}
            onChange={handleNameChange}
            className="flex-1"
          />
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GradientPreview;