import { basePrompt } from "./basePrompt";
import { websiteContextPrompts } from "./websiteContextPrompts";
import { designStylePrompts } from "./designStylePrompts";
import { sectionContextPrompts } from "./sectionContextPrompts";
import { WizardState } from "../types";

export function buildFullWebsitePromptJSON(state: WizardState) {
  const websiteType = state.websiteType;
  const designType = state.designType || "Modern";

  const websiteContext =
    websiteContextPrompts[websiteType as keyof typeof websiteContextPrompts] ||
    "This is a general-purpose website.";

  const styleContext =
    designStylePrompts[designType as keyof typeof designStylePrompts] ||
    "Use a clear, readable, and balanced style.";

  // Inject Tailwind colors
  const promptWithColors = basePrompt
    .replace(/{{PRIMARY_COLOR}}/g, state.primaryColor || "#4F46E5")
    .replace(/{{SECONDARY_COLOR}}/g, state.secondaryColor || "#F59E0B");

  // Build section instructions for AI
  const sectionsInstructions = state.pageContents
    .map((page) =>
      page.sections
        .map((section) => {
          const sectionContext =
            sectionContextPrompts?.[section.type as keyof typeof sectionContextPrompts] ||
            "Write meaningful content for this section.";
          return `
--- Section: ${section.type} ---
Section Context: ${sectionContext.trim()}
User Content: ${section.content || "No content yet"}
`;
        })
        .join("\n")
    )
    .join("\n");

  // Prompt AI to return structured JSON for rendering
  return `
${promptWithColors.trim()}

🧩 Website Context:
${websiteContext.trim()}

🎨 Design Style Context:
${styleContext.trim()}

📦 All Sections:
${sectionsInstructions.trim()}

🧠 User Data:
Website Name: ${state.websiteName || "Untitled Website"}
Tagline: ${state.tagline || "No tagline yet"}
Primary Color: ${state.primaryColor || "Not chosen"}
Secondary Color: ${state.secondaryColor || "Not chosen"}

🎯 Goal:
Generate the website content as a JSON object suitable for frontend rendering.
Output format rules:
1. The JSON must be an array of pages. Each page contains:
   - "page": page name
   - "sections": array of sections
2. Each section object must contain:
   - "id": unique string
   - "type": "container", "content", or "nav"
   - "tag": semantic HTML tag ("section", "div", "h1", "p", "a", etc.)
   - "class": Tailwind CSS classes for styling
   - "navId": optional, only for nav links
   - "content": text string or nested array of child sections
3. Preserve semantic HTML and responsive Tailwind classes
4. Content should include AI-generated text and user content where provided
5. Do NOT include HTML strings, only structured JSON
6. Return valid JSON only — do NOT add any extra explanation or text

Example output for a single hero section:
{
  "page": "home",
  "sections": [
    {
      "id": "hero-1",
      "type": "container",
      "tag": "section",
      "class": "relative bg-cover bg-center h-screen flex items-center justify-center",
      "content": [
        {
          "id": "headline-1",
          "type": "content",
          "tag": "h1",
          "class": "text-4xl md:text-6xl font-bold mb-4",
          "content": "Experience Luxury in the Heart of Thimphu"
        }
      ]
    }
  ]
}

Use this JSON format for all pages and sections.
`;
}


