"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";

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

function SortableField({
  field,
  onLabelChange,
  onHelpTextChange,
  onValueChange,
  onTypeChange,
  onOptionsChange,
}: {
  field: Field;
  onLabelChange: (value: string) => void;
  onHelpTextChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onTypeChange: (value: Field["type"]) => void;
  onOptionsChange: (options: string[]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  return (
    <FormField
      key={field.id}
      id={field.id}
      label={field.label}
      helpText={field.helpText}
      type={field.type}
      value={field.value}
      options={field.options}
      error={field.error}
      onLabelChange={onLabelChange}
      onHelpTextChange={onHelpTextChange}
      onValueChange={onValueChange}
      onTypeChange={onTypeChange}
      onOptionsChange={onOptionsChange}
      dragProps={{
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      }}
    />
  );
}

export default function Home() {
  const [formStep, setFormStep] = useState<"create" | "preview">("create");
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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

        <section className="h-[calc(100vh-114px)] p-4 space-y-2 overflow-y-scroll relative">
          {formStep === "create" ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={rectSortingStrategy}
              >
                {fields.map((field) => (
                  <SortableField
                    key={field.id}
                    field={field}
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
              </SortableContext>
            </DndContext>
          ) : (
            <FormPreview
              fields={fields}
              onFieldChange={handleFieldChange}
              onSubmit={handleFormSubmit}
            />
          )}

          {formStep === "create" && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="gap-x-2 my-4"
                size="sm"
                onClick={addQuestion}
              >
                <Plus className="h-4 w-4" /> Add Question
              </Button>
            </div>
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
