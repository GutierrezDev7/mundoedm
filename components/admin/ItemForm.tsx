"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "url" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface ItemFormProps {
  title: string;
  fields: FieldConfig[];
  initial?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}

export function ItemForm({ title, fields, initial, onSubmit, onCancel }: ItemFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      init[f.key] = initial?.[f.key] ?? "";
    }
    return init;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button type="button" onClick={onCancel} className="text-gray-500 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={values[field.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-500/50"
                >
                  <option value="">Selecionar...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === "url" ? "url" : "text"}
                  value={values[field.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  required={field.required}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-500/50"
                  placeholder={field.label}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-yellow-500"
          >
            {initial ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}
