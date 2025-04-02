import * as React from "react";
import { cn } from "../../lib/utils";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = ({ className, defaultValue, value, onValueChange, ...props }: TabsProps) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div
      className={cn("w-full", className)}
      data-selected-value={selectedValue}
      {...props}
    />
  );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = ({ className, ...props }: TabsListProps) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
);

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = ({ className, value, ...props }: TabsTriggerProps) => {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tabs = e.currentTarget.closest("[data-selected-value]") as HTMLElement;
    if (tabs) {
      const onValueChange = (tabs as any).__onValueChange;
      if (onValueChange) onValueChange(value);
      else {
        // Fallback to manually updating the data attribute
        tabs.setAttribute("data-selected-value", value);
      }
    }
    props.onClick?.(e);
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm",
        className
      )}
      data-selected={
        value === (props as any).parentElement?.parentElement?.getAttribute("data-selected-value")
          ? ""
          : undefined
      }
      onClick={onClick}
      {...props}
    />
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = ({ className, value, ...props }: TabsContentProps) => (
  <div
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    data-state={
      value === (props as any).parentElement?.getAttribute("data-selected-value")
        ? "active"
        : "inactive"
    }
    hidden={
      value !== (props as any).parentElement?.getAttribute("data-selected-value")
    }
    {...props}
  />
);