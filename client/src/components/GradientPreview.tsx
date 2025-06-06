import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gradient } from "@shared/schema";
import { Shuffle, Heart, ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateGradientCSS, generateReactNativeCode } from "@/lib/gradient";

interface GradientPreviewProps {
  gradient: Gradient;
  onRandomize: () => void;
  onSave: () => void;
  codeFormat: "reactNative" | "css";
}

const GradientPreview = ({ gradient, onRandomize, onSave, codeFormat }: GradientPreviewProps) => {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const gradientStyle = {
    background: generateGradientCSS(gradient)
  };

  const handleRandomizeClick = () => {
    setIsAnimating(true);
    onRandomize();
    setTimeout(() => setIsAnimating(false), 350); // Animation duration
  };

  const handleCopyCode = () => {
    const codeToCopy = codeFormat === "reactNative" 
      ? generateReactNativeCode(gradient)
      : `.gradient {\n  background: ${generateGradientCSS(gradient)};\n}`;
    
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${codeFormat === "reactNative" ? "React Native" : "CSS"} code has been copied.`,
          duration: 3000
        });
      })
      .catch(err => {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard.",
          variant: "destructive",
          duration: 3000
        });
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <section className="mb-10">
      <div 
        className="w-full h-64 rounded-xl mb-4 shadow-lg transition-all duration-300"
        style={gradientStyle}
      />
      
      <div className="flex flex-wrap justify-between gap-4">
        <Button 
          variant="default" 
          onClick={handleRandomizeClick} 
          className={`flex items-center gap-2 transition-transform duration-300 ${isAnimating ? 'scale-110' : ''}`}
        >
          <Shuffle className="h-4 w-4" />
          Randomize
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyCode}
            className="flex items-center gap-2"
          >
            <ClipboardCopy className="h-4 w-4" />
            {codeFormat === "reactNative" ? "Copy RN Code" : "Copy CSS"}
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={onSave} 
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GradientPreview;
