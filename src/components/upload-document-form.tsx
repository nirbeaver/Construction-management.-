"use client"

import { Form } from "@/components/ui/form"
import { Select, SelectItem } from "@/components/ui/select"

interface DocumentSubCategory {
  id: string;
  label: string;
  value: string;
}

const constructionDocumentSubCategories: DocumentSubCategory[] = [
  {
    id: 'blueprints',
    label: 'Blueprints',
    value: 'blueprints'
  },
  {
    id: 'engineering-plans',
    label: 'Engineering Plans',
    value: 'engineering-plans'
  },
  {
    id: 'permits',
    label: 'Permits',
    value: 'permits'
  },
  {
    id: 'inspections',
    label: 'Inspections',
    value: 'inspections'
  },
  {
    id: 'shop-drawings',
    label: 'Shop Drawings',
    value: 'shop-drawings'
  },
  {
    id: 'specifications',
    label: 'Specifications',
    value: 'specifications'
  },
  {
    id: 'structural-engineering',
    label: 'Structural Engineering',
    value: 'structural-engineering'
  },
  {
    id: 'survey',
    label: 'Survey',
    value: 'survey'
  },
  {
    id: 'deputy-inspection',
    label: 'Deputy Inspection',
    value: 'deputy-inspection'
  },
  {
    id: 'other',
    label: 'Other',
    value: 'other'
  }
]

function UploadDocumentForm() {
  return (
    <Form>
      <Select
        name="subCategory"
        label="Sub-Category"
      >
        {constructionDocumentSubCategories.map((subCategory) => (
          <SelectItem 
            key={subCategory.id}
            value={subCategory.value}
          >
            {subCategory.label}
          </SelectItem>
        ))}
      </Select>
    </Form>
  )
} 