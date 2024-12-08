"use client";
import { FormField } from "@/components/form/form-field";
import { FormPreview } from "@/components/form/form-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Check, FilePenLine, Plus } from "lucide-react";
import { useState } from "react";

interface Field {
  id: string;
  label: string;
  helpText: string;
  type: "short" | "long" | "single-select" | "number" | "url" | null;
  value: string;
  options?: string[];
  error?: string;
}

export default function Home() {
  const [formStep, setFormStep] = useState<"create" | "preview">("create");
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleFieldChange = (id: string, key: keyof Field, value: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const handleTypeChange = (id: string, newType: Field["type"]) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
              ...field,
              type: newType,
              options: newType === "single-select" ? ["", ""] : undefined,
            }
          : field
      )
    );
  };

  const handleOptionsChange = (id: string, newOptions: string[]) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, options: newOptions } : field
      )
    );
  };

  const addQuestion = () => {
    const newField: Field = {
      id: Date.now().toString(),
      label: "",
      helpText: "",
      type: "short",
      value: "",
    };
    setFields([...fields, newField]);
  };

  const handlePreview = () => {
    setFormStep("preview");
    setCompletionPercentage(0);
  };

  const handleFormSubmit = () => {
    const filledFields = fields.filter((field) => field.value !== "").length;
    const newCompletionPercentage = (filledFields / fields.length) * 100;
    setCompletionPercentage(newCompletionPercentage);

    if (newCompletionPercentage === 100) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  return (
    <div className="flex justify-center px-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <main className="h-full border border-gray-200 max-w-lg w-full">
        <header className="h-14 flex gap-x-4 justify-between items-center px-4 border-gray-200 border-b">
          <Input
            placeholder="Untitled form"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-md font-medium bg-transparent border-none px-0"
          />
          {formStep === "create" ? (
            <Button
              variant="outline"
              className="gap-x-2"
              size="sm"
              onClick={handlePreview}
            >
              Preview <ArrowUpRight size={14} />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="gap-x-2"
              size="sm"
              onClick={() => setFormStep("create")}
            >
              Edit Form
            </Button>
          )}
        </header>

        <section className="h-[calc(100vh-114px)] p-4 space-y-2 overflow-y-scroll">
          {formStep === "create" ? (
            <>
              {fields.map((field) => (
                <FormField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  helpText={field.helpText}
                  type={field.type}
                  value={field.value}
                  options={field.options}
                  error={field.error}
                  onLabelChange={(value) =>
                    handleFieldChange(field.id, "label", value)
                  }
                  onHelpTextChange={(value) =>
                    handleFieldChange(field.id, "helpText", value)
                  }
                  onValueChange={(value) =>
                    handleFieldChange(field.id, "value", value)
                  }
                  onTypeChange={(value) =>
                    handleTypeChange(field.id, value as Field["type"])
                  }
                  onOptionsChange={(options) =>
                    handleOptionsChange(field.id, options)
                  }
                />
              ))}

              <Button
                variant="outline"
                className="gap-x-2 my-4"
                size="sm"
                onClick={addQuestion}
              >
                <Plus className="h-4 w-4" /> Add Question
              </Button>
            </>
          ) : (
            <FormPreview
              fields={fields}
              onFieldChange={handleFieldChange}
              onSubmit={handleFormSubmit}
            />
          )}
        </section>

        <footer className="flex items-center justify-between h-14 px-4 border-gray-200 border-t">
          {formStep === "create" ? (
            <>
              <Button variant="outline" className="gap-x-2" size="sm" disabled>
                <FilePenLine className="h-4 w-4" /> Save as Draft
              </Button>
              <Button
                className="gap-x-2 bg-green-500 text-white border-black"
                onClick={handlePreview}
                size="sm"
                disabled={fields.length === 0}
              >
                <Check className="h-4 w-4" /> Publish Form
              </Button>
            </>
          ) : (
            <div className="w-full">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-center">
                Form Completion: {completionPercentage.toFixed(0)}%
              </p>
              {showSuccessMessage && (
                <p className="text-center text-green-500 mt-2">
                  Form submitted successfully!
                </p>
              )}
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}
