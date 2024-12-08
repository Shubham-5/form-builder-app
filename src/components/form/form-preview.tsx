import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/lable";
import { Textarea } from "@/components/ui/text-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Field {
  id: string;
  label: string;
  helpText: string;
  type: "short" | "long" | "single-select" | "number" | "url";
  value: string;
  options?: string[];
  error?: string;
}

interface FormPreviewProps {
  fields: Field[];
  onFieldChange: (id: string, key: keyof Field, value: string) => void;
  onSubmit: () => void;
}

export function FormPreview({
  fields,
  onFieldChange,
  onSubmit,
}: FormPreviewProps) {
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          {field.helpText && (
            <p className="text-sm text-gray-500">{field.helpText}</p>
          )}
          {field.type === "short" && (
            <Input
              id={field.id}
              type="text"
              value={field.value}
              onChange={(e) => onFieldChange(field.id, "value", e.target.value)}
            />
          )}
          {field.type === "long" && (
            <Textarea
              id={field.id}
              value={field.value}
              onChange={(e) => onFieldChange(field.id, "value", e.target.value)}
            />
          )}
          {field.type === "single-select" && (
            <RadioGroup
              value={field.value}
              onValueChange={(value) => onFieldChange(field.id, "value", value)}
            >
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {field.type === "number" && (
            <Input
              id={field.id}
              type="number"
              value={field.value}
              onChange={(e) => onFieldChange(field.id, "value", e.target.value)}
            />
          )}
          {field.type === "url" && (
            <Input
              id={field.id}
              type="url"
              value={field.value}
              onChange={(e) => onFieldChange(field.id, "value", e.target.value)}
            />
          )}
        </div>
      ))}
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}