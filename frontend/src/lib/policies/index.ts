import content from "./content.json";

export type PolicyId = keyof typeof content;

export type PolicyBlock =
  | { type: "paragraph" | "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

type Policy = {
  title: string;
  lastUpdated: string;
  intro: PolicyBlock[];
  sections: { heading: string; blocks: PolicyBlock[] }[];
};

// Generated from the original PDFs by scripts/extract-policies.py.
export const policies = content as Record<PolicyId, Policy>;
