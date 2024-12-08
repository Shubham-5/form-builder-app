"use client";

import * as React from "react";
import { cn, formFieldIcons } from "@/lib/utils";
import { GripVertical, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/text-area";
import { Input } from "../ui/input";
import { Field } from "@/context/form-context";

interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  field: Field;
  onLabelChange: (value: string) => void;
  onHelpTextChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onTypeChange: (
    value: "short" | "long" | "single-select" | "number" | "url"
  ) => void;
  onOptionsChange?: (options: string[]) => void;
  dragProps?: {
    attributes?: React.HTMLAttributes<HTMLButtonElement>;
    listeners?: React.HTMLAttributes<HTMLButtonElement>;
    setNodeRef?: (node: HTMLElement | null) => void;
    transform?: { x: number; y: number } | null;
    transition?: string;
  };
}

export function FormField({
  field,
  onLabelChange,
  onHelpTextChange,
  onValueChange,
  onTypeChange,
  onOptionsChange,
  dragProps,
  ...props
}: FormFieldProps) {
  const addOption = () => {
    if (onOptionsChange) {
      onOptionsChange([...(field?.options || []), ""]);
    }
  };

  const removeOption = (index: number) => {
    if (onOptionsChange) {
      const newOptions = field.options?.filter((_, i) => i !== index);
      onOptionsChange(newOptions!);
    }
  };

  const dragStyle = dragProps?.transform
    ? {
        transform: `translate3d(${dragProps.transform.x}px, ${dragProps.transform.y}px, 0)`,
        transition: dragProps.transition,
      }
    : {};

  return (
    <div
      ref={dragProps?.setNodeRef}
      style={dragStyle}
      className="relative group border border-gray-200 rounded-2xl p-4 bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Input
            type="text"
            placeholder="Write a question"
            className={cn(
              "border-none bg-transparent px-1 -mx-1 text-md",
              field?.error && "text-red-500",
              field?.label && "text-black"
            )}
            value={field?.label}
            onChange={(e) => onLabelChange(e.target.value)}
          />
        </div>
        <div className="flex items-start gap-2">
          <Select value={field.type} onValueChange={onTypeChange}>
            <SelectTrigger className="h-8 px-0 border-none">
              <SelectValue>{formFieldIcons[field.type]}</SelectValue>
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
                  {formFieldIcons["single-select"]}
                  Single Select
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
          <button
            {...dragProps?.attributes}
            {...dragProps?.listeners}
            className="p-2 hover:bg-gray-100 rounded-md cursor-move"
          >
            <GripVertical size={16} />
          </button>
        </div>
      </div>
      <Input
        placeholder="Write a help text or caption (leave empty if not needed)"
        className="border-none bg-transparent h-6 px-1 -mx-1 w-full"
        value={field.helpText}
        onChange={(e) => onHelpTextChange?.(e.target.value)}
      />

      <div className="mt-4">
        {field.type === "short" && (
          <Input
            type="text"
            placeholder="Short answer text"
            value={props.value as string}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
        )}
        {field.type === "long" && (
          <Textarea
            placeholder="Long answer text"
            value={props.value as string}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
        )}
        {field.type === "single-select" && (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="radio"
                  name={`option-${field.id}`}
                  className="w-4 h-4"
                />
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])];
                    newOptions[index] = e.target.value;
                    onOptionsChange?.(newOptions);
                  }}
                  placeholder="Option text"
                />
                {field?.options?.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}

                {index === field.options.length - 1 && (
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
        {field.type === "number" && (
          <Input
            type="number"
            placeholder="0"
            value={props.value as string}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
        )}
        {field.type === "url" && (
          <Input
            type="url"
            placeholder="https://example.com"
            value={props.value as string}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
        )}
      </div>
    </div>
  );
}
