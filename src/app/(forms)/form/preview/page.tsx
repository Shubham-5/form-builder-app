"use client";

import { FormPreview } from "@/components/form/form-preview";
import { Field, useFormBuilder } from "@/context/form-context";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function FormPreviewPage() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fieldCompletionStatus, setFieldCompletionStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const { currentForm, updateFormField } = useFormBuilder();
  const router = useRouter();

  if (!currentForm) return null;

  const handleFieldChange = (id: string, key: keyof Field, value: string) => {
    updateFormField(id, { [key]: value });

    setFieldCompletionStatus((prev) => ({
      ...prev,
      [id]: isFieldCompleted(value),
    }));
  };

  const isFieldCompleted = (value: string): boolean => {
    return value.trim() !== "";
  };

  const completionPercentage = useMemo(() => {
    if (!currentForm.fields.length) return 0;

    const completedFieldsCount = currentForm.fields.filter(
      (field) => fieldCompletionStatus[field.id] || false
    ).length;

    return (completedFieldsCount / currentForm.fields.length) * 100;
  }, [currentForm.fields, fieldCompletionStatus]);

  const handleFormSubmit = () => {
    if (currentForm) {
      if (completionPercentage === 100) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    }
  };
  return (
    <main className="flex justify-center px-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <div className="h-screen border border-gray-200 max-w-lg w-full relative">
        <header className="h-14 flex gap-x-4 items-center px-4 border-gray-200 border-b">
          <ArrowLeft
            size={16}
            onClick={() => router.back()}
            className="cursor-pointer"
          />
          <h2 className="font-medium text-center mx-auto">Draft</h2>

          <div className="w-full space-y-2">
            <p className="text-right text-sm">
              Form completeness — {completionPercentage.toFixed(0)}%
            </p>
            <div className="max-w-[20rem] w-full ml-auto bg-gray-200 rounded-full h-1">
              <div
                className="bg-green-500 h-1 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </header>
        <section className="p-4">
          {showSuccessMessage ? (
            <p className="text-center text-green-500 mt-2">
              Form submitted successfully!
            </p>
          ) : (
            <FormPreview
              fields={currentForm.fields}
              onFieldChange={handleFieldChange}
              onSubmit={handleFormSubmit}
              status={currentForm.status}
              completionPercentage={completionPercentage}
            />
          )}
        </section>
      </div>
    </main>
  );
}
