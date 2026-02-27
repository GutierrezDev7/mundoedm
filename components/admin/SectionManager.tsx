"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { ItemForm, type FieldConfig } from "./ItemForm";

interface Column {
  key: string;
  label: string;
  render?: (value: string, item: Record<string, string>) => React.ReactNode;
}

interface SectionManagerProps {
  title: string;
  description: string;
  items: Record<string, string>[];
  columns: Column[];
  fields: FieldConfig[];
  onAdd: (values: Record<string, string>) => void;
  onUpdate: (id: string, values: Record<string, string>) => void;
  onDelete: (id: string) => void;
  idField?: string;
}

export function SectionManager({
  title,
  description,
  items,
  columns,
  fields,
  onAdd,
  onUpdate,
  onDelete,
  idField = "id",
}: SectionManagerProps) {
  const [formMode, setFormMode] = useState<"closed" | "add" | "edit">("closed");
  const [editingItem, setEditingItem] = useState<Record<string, string> | null>(null);

  const handleAdd = (values: Record<string, string>) => {
    onAdd(values);
    setFormMode("closed");
  };

  const handleEdit = (item: Record<string, string>) => {
    setEditingItem(item);
    setFormMode("edit");
  };

  const handleUpdate = (values: Record<string, string>) => {
    if (editingItem) {
      onUpdate(editingItem[idField], values);
    }
    setFormMode("closed");
    setEditingItem(null);
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-gray-500">{description}</p>
        </div>
        <button
          onClick={() => setFormMode("add")}
          className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-yellow-500"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500">Nenhum item adicionado ainda.</p>
            <button
              onClick={() => setFormMode("add")}
              className="mt-4 text-sm text-yellow-500 underline-offset-4 hover:underline"
            >
              Adicionar o primeiro
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acoes
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item[idField] ?? idx}
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-300">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.youtubeUrl && (
                        <a
                          href={item.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                          title="Abrir link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-yellow-400"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item[idField])}
                        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Deletar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        {items.length} {items.length === 1 ? "item" : "itens"}
      </div>

      {formMode === "add" && (
        <ItemForm
          title={`Adicionar ${title}`}
          fields={fields}
          onSubmit={handleAdd}
          onCancel={() => setFormMode("closed")}
        />
      )}

      {formMode === "edit" && editingItem && (
        <ItemForm
          title={`Editar ${title}`}
          fields={fields}
          initial={editingItem}
          onSubmit={handleUpdate}
          onCancel={() => { setFormMode("closed"); setEditingItem(null); }}
        />
      )}
    </div>
  );
}
