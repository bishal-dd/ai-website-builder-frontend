"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TemplateCategory } from "../types/categories";

interface Props {
  category: TemplateCategory;
}

export function CategoryCard({ category }: Props) {
  return (
    <Link href={`/dashboard/templates/${category.id}`} className="block group">
      <Card className="relative overflow-hidden p-0 border-border/50 bg-card">
        {/* IMAGE */}
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <img
            src={category.image}
            alt={category.title}
            className="h-full w-full object-cover"
          />

          {/* CATEGORY BADGE */}
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow">
              {category.title}
            </span>
          </div>

          {/* subtle hover darkening only */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
        </div>
      </Card>
    </Link>
  );
}
