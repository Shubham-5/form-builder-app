"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

export interface Field {
  id: string;
  label: string;
  helpText: string;
  type: "short" | "long" | "single-select" | "number" | "url";
  value: string;
  options: string[];
  error?: string;
}

export interface FormData {
  id: string;
  title: string;
  fields: Field[];
  status: "draft" | "published" | "submitted";
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface FormContextType {
  forms: FormData[];
  currentForm: FormData | null;
  setCurrentForm: (form: FormData | null) => void;
  createNewForm: () => void;
  saveForm: (form: FormData) => void;
  publishForm: () => void;
  updateFormField: (
    fieldId: string,
    updates: Partial<Field | FormData>
  ) => void;
  updateFormTitle: (title: string) => void;
  addFormField: () => void;
  removeFormField: (fieldId: string) => void;
  resetCurrentForm: () => void;
}

const createEmptyForm = (): FormData => ({
  id: Date.now().toString(),
  title: "Untitled Form",
  fields: [],
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
});

export const FormBuilderContext = createContext<FormContextType>({
  forms: [],
  currentForm: null,
  setCurrentForm: () => {},
  createNewForm: () => {},
  saveForm: () => {},
  publishForm: () => {},
  updateFormField: () => {},
  updateFormTitle: () => {},
  addFormField: () => {},
  removeFormField: () => {},
  resetCurrentForm: () => {},
});

export const FormBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [forms, setForms] = useState<FormData[]>(() => {
    if (typeof window === "undefined") {
      const savedForms = localStorage.getItem("formBuilderForms");
      return savedForms ? JSON.parse(savedForms) : [];
    }
    return [];
  });

  const [currentForm, setCurrentForm] = useState<FormData | null>(() => {
    if (typeof window === "undefined") {
      const savedCurrentForm = localStorage.getItem("currentForm");
      return savedCurrentForm ? JSON.parse(savedCurrentForm) : null;
    }
    return null;
  });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("formBuilderForms", JSON.stringify(forms));
  //   }
  // }, [forms]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     if (currentForm) {
  //       localStorage.setItem("currentForm", JSON.stringify(currentForm));
  //     } else {
  //       localStorage.removeItem("currentForm");
  //     }
  //   }
  // }, [currentForm]);

  const createNewForm = () => {
    const newForm = createEmptyForm();
    setCurrentForm(newForm);
  };

  const saveForm = (updatedForm: FormData) => {
    const newForm: FormData = {
      ...updatedForm,
      updatedAt: new Date().toISOString(),
      version: updatedForm.version + 1,
    };

    const existingFormIndex = forms.findIndex((f) => f.id === newForm.id);

    if (existingFormIndex !== -1) {
      const updatedForms = [...forms];
      updatedForms[existingFormIndex] = newForm;
      setForms(updatedForms);
    } else {
      setForms([...forms, newForm]);
    }

    setCurrentForm(newForm);
  };

  const publishForm = () => {
    if (currentForm) {
      saveForm({ ...currentForm, status: "published" });
    }
  };

  const updateFormTitle = (title: string) => {
    if (!currentForm) return;
    setCurrentForm({
      ...currentForm,
      title,
    });
  };

  const updateFormField = (
    fieldId: string,
    updates: Partial<Field | FormData>
  ) => {
    if (!currentForm) return;

    const updatedFields = currentForm.fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field
    );

    setCurrentForm({
      ...currentForm,
      fields: updatedFields,
    });
  };

  const addFormField = () => {
    if (!currentForm) return;

    const newField: Field = {
      id: Date.now().toString(),
      label: "",
      helpText: "",
      type: "short",
      value: "",
      options: ["", ""],
    };

    setCurrentForm({
      ...currentForm,
      fields: [...(currentForm.fields || []), newField],
    });
  };

  const removeFormField = (fieldId: string) => {
    if (!currentForm) return;

    const updatedFields = currentForm.fields.filter(
      (field) => field.id !== fieldId
    );

    setCurrentForm({
      ...currentForm,
      fields: updatedFields,
    });
  };

  const resetCurrentForm = () => {
    setCurrentForm(null);
  };

  return (
    <FormBuilderContext.Provider
      value={{
        forms,
        currentForm,
        setCurrentForm,
        createNewForm,
        saveForm,
        publishForm,
        updateFormField,
        updateFormTitle,
        addFormField,
        removeFormField,
        resetCurrentForm,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
};
