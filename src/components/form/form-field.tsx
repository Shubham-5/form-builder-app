"use client";

import * as React from "react";
import { cn, formFieldIcons } from "@/lib/utils";
import { Disc2, GripVertical, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/text-area";
import { Input } from "../ui/input";

interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  label?: string;
  helpText?: string;
  type?: "short" | "long" | "single-select" | "number" | "url";
  error?: string;
  options?: string[];
  onLabelChange?: (value: string) => void;
  onHelpTextChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onOptionsChange?: (options: string[]) => void;
}

export function FormField({
  id,
  label,
  helpText,
  type = "short",
  className,
  error,
  options = [],
  onLabelChange,
  onHelpTextChange,
  onValueChange,
  onTypeChange,
  onOptionsChange,
  ...props
}: FormFieldProps) {
  const addOption = () => {
    if (onOptionsChange) {
      onOptionsChange([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (onOptionsChange) {
      const newOptions = options.filter((_, i) => i !== index);
      onOptionsChange(newOptions);
    }
  };

  return (
    <div className="relative group border border-gray-200 rounded-2xl p-4 bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Input
            type="text"
            placeholder="Write a question"
            className={cn(
              "border-none bg-transparent px-1 -mx-1 text-md",
              error && "text-red-500",
              label && "text-black"
            )}
            value={label}
            onChange={(e) => onLabelChange?.(e.target.value)}
          />
        </div>
        <div className="flex items-start gap-2">
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="h-8 px-0 border-none">
              {formFieldIcons[type]}
            </SelectTrigger>
            <SelectContent className="w-[180px]">
              <SelectItem value="short">
                <div className="flex items-center gap-x-2">
                  {formFieldIcons["short"]} Short Answer
                </div>
              </SelectItem>
              <SelectItem value="long">
                <div className="flex items-center gap-x-2">
                  {formFieldIcons["long"]} Long Answer
                </div>
              </SelectItem>
              <SelectItem value="single-select">
                <div className="flex items-center gap-x-2">
                  <Disc2 size={14} />
                  {formFieldIcons["single-select"]}
                </div>
              </SelectItem>
              <SelectItem value="number">
                <div className="flex items-center gap-x-2">
                  {formFieldIcons["number"]}
                  Number
                </div>
              </SelectItem>
              <SelectItem value="url">
                <div className="flex items-center gap-x-2">
                  {formFieldIcons["url"]}
                  URL
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <GripVertical size={16} />
          </button>
        </div>
      </div>
      <Input
        placeholder="Write a help text or caption (leave empty if not needed)"
        className="border-none bg-transparent h-6 px-1 -mx-1 w-full"
        value={helpText}
        onChange={(e) => onHelpTextChange?.(e.target.value)}
      />

      <div className="mt-4">
        {type === "short" && (
          <Input
            type="text"
            placeholder="Short answer text"
            value={props.value as string}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
        )}
        {type === "long" && (
          <Textarea
            placeholder="Long answer text"
            value={props.value as string}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
        )}
        {type === "single-select" && (
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input type="radio" name={`option-${id}`} className="w-4 h-4" />
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    onOptionsChange?.(newOptions);
                  }}
                  placeholder="Option text"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                {options?.length - 1 === index && (
                  <Button
                    className="last:block hidden"
                    variant="ghost"
                    size="icon"
                    onClick={addOption}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        {type === "number" && (
          <Input
            type="number"
            placeholder="0"
            value={props.value as string}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
        )}
        {type === "url" && (
          <Input
            type="url"
            placeholder="https://example.com"
            value={props.value as string}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
