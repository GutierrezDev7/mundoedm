"use client";

import { useSiteData } from "@/lib/data-context";
import { SectionManager } from "@/components/admin/SectionManager";
import type { FieldConfig } from "@/components/admin/ItemForm";
import type { SocialLink } from "@/lib/types";

const fields: FieldConfig[] = [
  { key: "name", label: "Nome", type: "text", required: true },
  { key: "href", label: "Link", type: "url", required: true },
  {
    key: "platform",
    label: "Plataforma",
    type: "select",
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "youtube", label: "YouTube" },
      { value: "whatsapp", label: "WhatsApp" },
    ],
    required: true,
  },
];

const columns = [
  { key: "name", label: "Nome" },
  { key: "platform", label: "Plataforma" },
  {
    key: "href",
    label: "Link",
    render: (val: string) => (
      <span className="max-w-[200px] truncate text-gray-500" title={val}>{val}</span>
    ),
  },
];

export default function SocialAdmin() {
  const { data, addSocialLink, updateSocialLink, removeSocialLink } = useSiteData();

  const items = data.social.map((item) => ({ ...item } as unknown as Record<string, string>));

  const handleAdd = (values: Record<string, string>) => {
    addSocialLink({
      name: values.name,
      href: values.href,
      platform: values.platform as SocialLink["platform"],
    });
  };

  const handleUpdate = (id: string, values: Record<string, string>) => {
    updateSocialLink(id, {
      name: values.name,
      href: values.href,
      platform: values.platform as SocialLink["platform"],
    });
  };

  return (
    <SectionManager
      title="Social"
      description="Gerencie os links de redes sociais."
      items={items}
      columns={columns}
      fields={fields}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={removeSocialLink}
    />
  );
}
