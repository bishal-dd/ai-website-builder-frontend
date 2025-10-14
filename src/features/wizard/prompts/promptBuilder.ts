import { basePrompt } from "./basePrompt"
import { websiteContextPrompts } from "./websiteContextPrompts"
import { designStylePrompts } from "./designStylePrompts"
import { WizardState } from "../types"
import { sectionContextPrompts } from "./sectionContextPrompts"

export function buildFullWebsitePrompt(state: WizardState) {
  const websiteType = state.websiteType
  const designType = state.designType || "Modern"

  const websiteContext =
    websiteContextPrompts[
      websiteType as keyof typeof websiteContextPrompts
    ] ?? "This is a general-purpose website."

  const styleContext =
    designStylePrompts[
      designType as keyof typeof designStylePrompts
    ] ?? "Use a clear, readable, and balanced style."

  // Gather all sections
  const sectionsContent = state.pageContents
    .map((page) => {
      const sectionsText = page.sections
        .map((section) => {
          const sectionContext =
            sectionContextPrompts?.[section.type as keyof typeof sectionContextPrompts] ??
            "Write meaningful content for this section."
          return `
--- Section: ${section.type} ---
Section Context: ${sectionContext.trim()}
User Content: ${section.content || "No content yet"}
          `
        })
        .join("\n")
      return `
=== Page: ${page.page} ===
${sectionsText}
      `
    })
    .join("\n")

  return `
${basePrompt.trim()}

🧩 Website Context:
${websiteContext.trim()}

🎨 Design Style Context:
${styleContext.trim()}

📦 All Sections:
${sectionsContent.trim()}

🧠 User Data:
Website Name: ${state.websiteName || "Untitled Website"}
Tagline: ${state.tagline || "No tagline yet"}
Primary Color: ${state.primaryColor || "Not chosen"}
Secondary Color: ${state.secondaryColor || "Not chosen"}

🎯 Goal:
Generate creative, structured, and human-like content for all sections.
Keep tone, style, and audience consistent across the website.
Do not repeat content unnecessarily. Output only the website section content.
`
}
