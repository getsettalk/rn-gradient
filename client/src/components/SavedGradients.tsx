import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gradient } from "@shared/schema";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateGradientCSS } from "@/lib/gradient";

interface SavedGradientsProps {
  savedGradients: Gradient[];
  onLoad: (gradient: Gradient) => void;
  onDelete: (id: string | undefined) => void;
  onClearAll: () => void;
}

const SavedGradients = ({
  savedGradients,
  onLoad,
  onDelete,
  onClearAll,
}: SavedGradientsProps) => {
  const { toast } = useToast();

  const handleLoad = (gradient: Gradient) => {
    onLoad(gradient);
    toast({
      title: "Gradient loaded",
      description: "The saved gradient has been loaded into the editor.",
      duration: 3000,
    });
  };

  return (
    <Card className="mt-10">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Saved Gradients</h2>
          {savedGradients.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-destructive text-sm transition-colors"
            >
              Clear All
            </Button>
          )}
        </div>

        {savedGradients.length > 0 ? (
          <div className="flex overflow-x-auto py-2 space-x-4 pb-4">
            {savedGradients.map((gradient) => (
              <div
                key={gradient.id}
                className="saved-gradient-item flex-shrink-0"
              >
                <div
                  className="w-40 h-28 rounded-lg mb-2 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  style={{ background: generateGradientCSS(gradient) }}
                  onClick={() => handleLoad(gradient)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground truncate">
                    {gradient.angle}° • {gradient.colorStops.length} colors
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-500 hover:text-destructive transition-colors"
                    onClick={() => onDelete(gradient.id)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-8 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              No saved gradients yet. Click "Save" to add gradients to your collection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedGradients;
