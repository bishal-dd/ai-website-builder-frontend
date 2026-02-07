export const scrollToFirstError = (errors: Record<string, string[]>) => {
  const errorFieldOrder = [
    "websiteType",
    "selectedPages",
    "websiteName",
    "description",
    "contact",
  ];

  const firstErrorKey = errorFieldOrder.find((key) => errors[key]?.length);

  if (!firstErrorKey) return;

  const fieldIdMap: Record<string, string> = {
    websiteType: "websiteType",
    selectedPages: "selectedPages",
    websiteName: "websiteName",
    description: "description",
    contact: "contactEmail", // scroll to email first
  };

  const targetId = fieldIdMap[firstErrorKey];

  const el = document.getElementById(targetId);

  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Optional: focus for accessibility
    if ("focus" in el) {
      (el as HTMLElement).focus();
    }
  }
};
