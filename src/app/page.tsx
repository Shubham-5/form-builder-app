"use client";

import { Button } from "@/components/ui/button";
import { useFormBuilder } from "@/context/form-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  const { createNewForm } = useFormBuilder();

  function handleCreateForm() {
    createNewForm();
    router.push("/form");
  }

  return (
    <div className="flex justify-center px-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <main className="h-screen border border-gray-200 max-w-lg w-full">
        <header className="h-14 flex gap-x-4 justify-between items-center px-4 border-gray-200 border-b">
          <h2 className="font-medium">Form Builder</h2>
          <Button variant="outline" size="sm" onClick={handleCreateForm}>
            Create a Form
          </Button>
        </header>

        <section className="p-4 grid grid-cols-2 gap-4">
          <Link href="/draft" className="bg-gray-50 rounded-2xl border h-32">
            <div className="z-10 flex items-center justify-center gap-2 h-full">
              <p className="text-gray-500 font-medium">Draft</p>
            </div>
          </Link>

          <Link
            href="/published"
            className="bg-gray-50 rounded-2xl border h-32"
          >
            <div className="z-10 flex items-center justify-center gap-2 h-full">
              <p className="text-gray-500 font-medium">Published</p>
            </div>
          </Link>

          <Link
            href="/submitted"
            className="bg-gray-50 rounded-2xl border h-32"
          >
            <div className="z-10 flex items-center justify-center gap-2 h-full">
              <p className="text-gray-500 font-medium">Sumitted</p>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
