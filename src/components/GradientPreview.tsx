import React from 'react';
import { Save, Shuffle, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Gradient } from '../shared/schema';
import { generateGradientCSS, generateReactNativeCode } from '../lib/gradient';
import { useToast } from '../hooks/use-toast';

interface GradientPreviewProps {
  gradient: Gradient;
  onRandomize: () => void;
  onSave: () => void;
  codeFormat: "reactNative" | "css";
}

const GradientPreview = ({ gradient, onRandomize, onSave, codeFormat }: GradientPreviewProps) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    // Get the code based on format
    const code = codeFormat === 'css' 
      ? generateGradientCSS(gradient)
      : generateReactNativeCode(gradient);
    
    // Copy to clipboard
    navigator.clipboard.writeText(code)
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
        <h2 className="text-xl font-semibold">Preview</h2>
      </div>
      
      {/* Preview area */}
      <div 
        className="w-full h-64 rounded-lg shadow-sm border overflow-hidden"
        style={{ background: generateGradientCSS(gradient) }}
      />
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onRandomize}
          className="flex items-center gap-1 active:scale-95 transition-transform active:bg-primary/90"
        >
          <Shuffle className="h-4 w-4 mr-1" />
          Randomize
        </Button>
        
        <Button
          onClick={() => {
            // Call the save function
            onSave();
            
            // Add visual feedback
            const button = document.activeElement as HTMLButtonElement;
            if (button) {
              button.classList.add('animate-pulse', 'bg-green-600', 'text-white');
              setTimeout(() => {
                button.classList.remove('animate-pulse', 'bg-green-600', 'text-white');
              }, 500);
            }
            
            // Show toast directly from here as well
            toast('Gradient saved successfully', { type: 'success' });
          }}
          variant="outline"
          className="flex items-center gap-1 active:scale-95 transition-transform hover:border-primary/50"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        
        <Button
          onClick={handleCopy}
          variant="secondary"
          className="flex items-center gap-1 ml-auto active:scale-95 transition-transform"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy Code
        </Button>
      </div>
    </div>
  );
};

export default GradientPreview;