import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Disclaimer | ${site.brand.fullName}`,
  description: `Disclaimer for ${site.brand.fullName} website content, menus, and service information.`,
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updated="16 September 2026"
      intro={`Please read this disclaimer carefully before relying on information published on the ${site.brand.fullName} website.`}
      sections={[
        {
          title: "1. General information",
          body: [
            "Website content is for general information and marketing about our catering and tiffin services. It is not a binding offer until a booking is confirmed with you directly.",
          ],
        },
        {
          title: "2. Menus & images",
          body: [
            "Food photos and dish names are illustrative. Actual presentation, ingredients, and seasonal availability may differ. Final menus are confirmed at the time of booking.",
            "Placeholder or representative images may be used until final photography is updated.",
          ],
        },
        {
          title: "3. Availability & timings",
          body: [
            `Service coverage across ${site.location.label} and “next available” timings are indicative. Exact slots depend on kitchen capacity, date, and location.`,
          ],
        },
        {
          title: "4. No liability for indirect loss",
          body: [
            "To the fullest extent permitted by law, we are not liable for indirect or consequential losses arising from use of this website or reliance on unpublished estimates.",
            "For confirmed orders, our responsibility is limited to delivering the agreed catering service as confirmed with you.",
          ],
        },
        {
          title: "5. External links",
          body: [
            "Social or third-party links on this site are provided for convenience. We are not responsible for content or practices of external websites.",
          ],
        },
        {
          title: "6. Contact",
          body: [
            `For clarification on any listing or quote, contact ${site.brand.name} at ${site.contact.email} or ${site.contact.phoneDisplay}.`,
          ],
        },
      ]}
    />
  );
}
