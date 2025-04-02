import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

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
    value, 
    defaultValue, 
    min = 0, 
    max = 100, 
    step = 1, 
    onValueChange, 
    ...props 
  }, ref) => {
    const [values, setValues] = useState<number[]>(
      value || defaultValue || [min]
    );
    
    const sliderRef = useRef<HTMLDivElement>(null);
    
    // Update internal state when value prop changes
    useEffect(() => {
      if (value) {
        setValues(value);
      }
    }, [value]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      const newValues = [newValue];
      
      setValues(newValues);
      
      if (onValueChange) {
        onValueChange(newValues);
      }
    };
    
    const percent = ((values[0] - min) / (max - min)) * 100;
    
    return (
      <div 
        ref={sliderRef}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
      >
        <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-primary" 
            style={{ width: `${percent}%` }}
          />
        </div>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={values[0]}
          onChange={handleChange}
          className={cn(
            "absolute w-full h-2 appearance-none bg-transparent cursor-pointer",
            "range-thumb:appearance-none range-thumb:h-4 range-thumb:w-4 range-thumb:rounded-full",
            "range-thumb:border-none range-thumb:bg-primary range-thumb:shadow"
          )}
          {...props}
        />
      </div>
    );
  }
);