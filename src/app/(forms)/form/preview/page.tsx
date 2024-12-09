"use client";

import { FormPreview } from "@/components/form/form-preview";
import { Field, useFormBuilder } from "@/context/form-context";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FormPreviewPage() {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { currentForm, updateFormField } = useFormBuilder();
  const router = useRouter();

  if (!currentForm) return null;

  const handleFieldChange = (id: string, key: keyof Field, value: string) => {
    updateFormField(id, { [key]: value });
  };

  const handleFormSubmit = () => {
    if (currentForm) {
      const filledFields = currentForm.fields.filter(
        (field: { value: string }) => field.value !== ""
      ).length;
      const newCompletionPercentage =
        (filledFields / currentForm.fields.length) * 100;
      setCompletionPercentage(newCompletionPercentage);

      if (newCompletionPercentage === 100) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    }
  };
  return (
    <>
      <div className="flex justify-center px-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
        <main className="h-screen border border-gray-200 max-w-lg w-full relative">
          <header className="h-14 flex gap-x-4 items-center px-4 border-gray-200 border-b">
            <ArrowLeft size={16} onClick={() => router.back()} />
            <h2 className="font-medium text-center mx-auto">Draft</h2>

            <div className="w-full">
              <p className="text-center">
                Form Completion: {completionPercentage.toFixed(0)}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
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
        </main>
      </div>
    </>
  );
}
