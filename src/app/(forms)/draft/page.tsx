"use client";

import { useFormBuilder } from "@/context/form-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DraftFormsPage() {
  const { getFormsByStatus, setCurrentForm } = useFormBuilder();
  const router = useRouter();

  const draftForms = getFormsByStatus("draft");

  const handleEditForm = (form: any) => {
    setCurrentForm(form);
    router.push("/create");
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center px-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
        <main className="h-screen border border-gray-200 max-w-lg w-full">
          <header className="h-14 flex gap-x-4 items-center px-4 border-gray-200 border-b">
            <Link href="/" className="block text-left">
              <ArrowLeft size={16} />
            </Link>
            <h2 className="font-medium text-center mx-auto">Draft</h2>
          </header>
          {draftForms?.length === 0 ? (
            <p className="p-4 text-center">No draft forms found.</p>
          ) : (
            <div className="grid gap-4">
              {draftForms?.map((form) => (
                <div
                  key={form.id}
                  className="border p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h2 className="font-medium">{form.title}</h2>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditForm(form)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
