import * as React from "react";
import { cn } from "../../lib/utils";

interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (values: number[]) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ 
    className, 
    min = 0, 
    max = 100, 
    step = 1, 
    value, 
    defaultValue, 
    onValueChange,
    ...props 
  }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value);
      onValueChange?.([newValue]);
    };

    // Calculate percentage for the slider thumb position and colored track
    const currentValue = value?.[0] ?? defaultValue?.[0] ?? min;
    const percent = ((currentValue - min) / (max - min)) * 100;

    return (
      <div className={cn("relative w-full", className)}>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className="w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:mt-[-3px] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted [&::-webkit-slider-runnable-track]:h-2"
          style={{
            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percent}%, var(--muted) ${percent}%, var(--muted) 100%)`
          }}
          {...props}
        />
      </div>
    );
  }
);