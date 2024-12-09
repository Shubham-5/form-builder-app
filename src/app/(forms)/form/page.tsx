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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FilePenLine,
  Plus,
} from "lucide-react";
import { useFormBuilder, Field } from "@/context/form-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SortableField = ({
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
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  return (
    <FormField
      field={field}
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
};

export default function CreatePage() {
  const {
    currentForm,
    saveForm,
    publishForm,
    addFormField,
    updateFormField,
    updateFormTitle,
  } = useFormBuilder();

  const router = useRouter();

  if (!currentForm) return null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && currentForm) {
      const oldIndex = currentForm.fields.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = currentForm.fields.findIndex(
        (item) => item.id === over?.id
      );

      const newFields = arrayMove(currentForm.fields, oldIndex, newIndex);
      saveForm({ ...currentForm, fields: newFields });
    }
  };

  const handleFieldChange = (id: string, key: keyof Field, value: string) => {
    updateFormField(id, { [key]: value });
  };

  const handleTypeChange = (id: string, newType: Field["type"]) => {
    updateFormField(id, {
      type: newType,
      options: newType === "single-select" ? ["", ""] : undefined,
    });
  };

  const handleOptionsChange = (id: string, newOptions: string[]) => {
    updateFormField(id, { options: newOptions });
  };

  const handlePreview = () => {
    if (currentForm) {
      saveForm({ ...currentForm, status: "draft" });
      router.push("/form/preview");
    }
  };

  return (
    <div className="flex justify-center px-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <main className="h-full border border-gray-200 max-w-lg w-full">
        <header className="h-14 flex gap-x-4 justify-between items-center px-4 border-gray-200 border-b">
          <Link href="/">
            <ArrowLeft size={16} />
          </Link>
          <Input
            placeholder="Untitled form"
            value={currentForm.title || ""}
            onChange={(e) => updateFormTitle(e.target.value)}
            className="text-md font-medium bg-transparent border-none px-0"
          />

          <Button
            variant="outline"
            className="gap-x-2"
            size="sm"
            onClick={handlePreview}
            disabled={currentForm.status !== "draft"}
          >
            Preview <ArrowUpRight size={14} />
          </Button>
        </header>

        <section className="h-[calc(100vh-114px)] p-4 space-y-2 overflow-y-scroll relative">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentForm.fields.map((field) => field.id)}
              strategy={rectSortingStrategy}
            >
              {currentForm.fields.map((field) => (
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

          <div className="flex justify-center">
            <Button
              variant="outline"
              className="gap-x-2 my-4"
              size="sm"
              onClick={addFormField}
            >
              <Plus className="h-4 w-4" /> Add Question
            </Button>
          </div>
        </section>

        <footer className="flex items-center justify-between h-14 px-4 border-gray-200 border-t">
          <Button
            variant="outline"
            className="gap-x-2"
            size="sm"
            onClick={() => {
              saveForm({ ...currentForm, status: "draft" });
              alert("Form successfully saved in draft");
            }}
          >
            <FilePenLine className="h-4 w-4" /> Save as Draft
          </Button>
          <Button
            className="gap-x-2 bg-green-500 text-white border-black"
            onClick={publishForm}
            size="sm"
            disabled={currentForm.fields.length === 0}
          >
            <Check className="h-4 w-4" /> Publish Form
          </Button>
        </footer>
      </main>
    </div>
  );
}
