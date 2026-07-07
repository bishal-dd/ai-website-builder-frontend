"use client";

import { TEMPLATE_CATEGORIES } from "../types/categories";
import { CategoryCard } from "./CategoryCard";

export function CategoryGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {" "}
      {TEMPLATE_CATEGORIES.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
