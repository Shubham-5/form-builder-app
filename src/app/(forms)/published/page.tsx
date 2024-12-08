"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFormBuilder } from "@/context/form-context";

export default function PublishedFormsPage() {
  const { getFormsByStatus } = useFormBuilder();

  const publishedForms = getFormsByStatus("published");

  return (
    <div className="container mx-auto">
      <div className="flex justify-center px-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
        <main className="h-screen border border-gray-200 max-w-lg w-full">
          <header className="h-14 flex gap-x-4 items-center px-4 border-gray-200 border-b">
            <Link href="/" className="block text-left">
              <ArrowLeft size={16} />
            </Link>
            <h2 className="font-medium text-center mx-auto">Published</h2>
          </header>
          <div className="space-y-4">
            {publishedForms.length === 0 ? (
              <p className="p-4 text-center">No published forms found.</p>
            ) : (
              publishedForms.map((form) => (
                <div key={form.id} className="border p-4 rounded-lg">
                  <h2 className="font-medium">{form.title}</h2>
                  <p className="text-sm text-gray-500">
                    Published: {new Date(form.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm">Total Fields: {form.fields.length}</p>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
