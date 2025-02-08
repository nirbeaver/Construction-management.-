export const BANK_OPTIONS = [
  { value: "wells_fargo", label: "Wells Fargo" },
  { value: "chase", label: "Chase Bank" },
  { value: "bank_of_america", label: "Bank of America" },
  { value: "citibank", label: "Citibank" },
  { value: "banner", label: "Banner Bank" },
  { value: "us_bank", label: "US Bank" },
  { value: "other", label: "Other Bank" },
] as const;

export const CREDIT_CARD_TYPES = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
] as const;

export const CONSTRUCTION_CATEGORIES = {
  structural_engineering: {
    label: "Structural Engineering",
    subcategories: [
      "Foundation Plans",
      "Framing Plans",
      "Seismic Calculations",
      "Load Calculations",
      "Retaining Wall Calculations",
      "Structural Details",
      "Foundation Details",
      "Framing Details",
      "Steel Details",
      "Shear Wall Details"
    ]
  },
  deputy_inspection: {
    label: "Deputy Inspection",
    subcategories: [
      "Foundation Inspection",
      "Framing Inspection",
      "Pool Inspection",
      "Concrete Inspection",
      "Steel Inspection",
      "Masonry Inspection",
      "Shear Wall Inspection",
      "Retaining Wall Inspection",
      "Final Inspection",
      "Special Inspection"
    ]
  },
  survey_services: {
    label: "Survey Services",
    subcategories: [
      "Boundary Survey",
      "Topographic Survey",
      "ALTA Survey",
      "As-Built Survey",
      "Site Planning",
      "Plot Plan",
      "Grading Plan",
      "Stake Out",
      "Final Survey",
      "Elevation Certificate"
    ]
  },
  architectural: {
    label: "Architectural",
    subcategories: [
      "Floor Plans",
      "Elevations",
      "Sections",
      "Details",
      "Title 24"
    ]
  },
  permits: {
    label: "Permits & Approvals",
    subcategories: [
      "Building Permit",
      "Grading Permit",
      "Electrical Permit",
      "Plumbing Permit",
      "Mechanical Permit",
      "Pool Permit"
    ]
  }
} as const;

export const CATEGORIES = [
  {
    value: "labor",
    label: "Labor",
    subcategories: ["General Labor", "Skilled Labor", "Supervision"]
  },
  {
    value: "materials",
    label: "Materials",
    subcategories: ["Building Materials", "Finishes", "Hardware", "Equipment"]
  },
  {
    value: "construction_documents",
    label: "Construction Documents",
    subcategories: [
      "Blueprints",
      "Engineering Plans",
      "Permits",
      "Inspections",
      "Shop Drawings",
      "Specifications",
      "Other",
      "Structural Engineering",
      "Deputy Inspection",
      "Survey"
    ]
  },
  {
    value: "equipment",
    label: "Equipment",
    subcategories: ["Rental", "Purchase", "Maintenance"]
  },
  {
    value: "permits",
    label: "Permits",
    subcategories: ["Building", "Electrical", "Plumbing", "Mechanical"]
  },
  {
    value: "insurance",
    label: "Insurance",
    subcategories: ["Liability", "Workers Comp", "Builders Risk"]
  },
  {
    value: "utilities",
    label: "Utilities",
    subcategories: ["Electricity", "Water", "Gas", "Temporary Services"]
  },
  {
    value: "subcontractors",
    label: "Subcontractors",
    subcategories: ["Electrical", "Plumbing", "HVAC", "Roofing"]
  },
  {
    value: "other",
    label: "Other",
    subcategories: ["Miscellaneous", "Administrative", "Professional Services"]
  },
] as const; 