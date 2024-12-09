"use client";

import { Button } from "@/components/ui/button";
import { useFormBuilder } from "@/context/form-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookCopy, FilePenLine, FileText, Plus } from "lucide-react";

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
          <Button
            variant="outline"
            size="sm"
            className="flex gap-x-1"
            onClick={handleCreateForm}
          >
            <Plus size={14} /> Create a Form
          </Button>
        </header>

        <section className="p-4 grid grid-cols-2 gap-4">
          <Link
            href="/draft"
            className="hover:bg-gray-50 shadow-sm rounded-2xl border h-32 relative"
          >
            <div className="flex items-center justify-center gap-4 h-full">
              <FilePenLine size={40} className=" stroke-1 text-gray-500" />
              <div>
                <p className="font-medium text-left leading-tight">Draft</p>
                <p className="text-sm">Forms</p>
              </div>
            </div>
          </Link>

          <Link
            href="/published"
            className="hover:bg-gray-50 shadow-sm rounded-2xl border h-32"
          >
            <div className="flex items-center justify-center gap-4 h-full">
              <FileText size={40} className=" stroke-1 text-gray-500" />
              <div>
                <p className="font-medium text-left leading-tight">Published</p>
                <p className="text-sm">Forms</p>
              </div>
            </div>
          </Link>

          <Link
            href="/submitted"
            className="hover:bg-gray-50 shadow-sm rounded-2xl border h-32"
          >
            <div className="flex items-center justify-center gap-4 h-full">
              <BookCopy size={40} className=" stroke-1 text-gray-500" />
              <div>
                <p className="font-medium text-left leading-tight">Submitted</p>
                <p className="text-sm">Forms</p>
              </div>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
