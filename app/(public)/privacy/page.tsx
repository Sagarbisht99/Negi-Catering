import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy explaining how ${site.brand.fullName} collects and uses your information on negicaterer.in.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      breadcrumb={[{ name: "Privacy Policy" }]}
      title="Privacy Policy"
      updated="16 September 2026"
      intro={`${site.brand.fullName} respects your privacy. This policy explains what information we collect through enquiries and how we use it to serve your catering needs.`}
      sections={[
        {
          title: "1. Information we collect",
          body: [
            "When you submit an enquiry or contact form, we may collect your name, email, mobile number, event type, guest count, and any preferences you share.",
            "We may also receive basic technical data such as browser type or device information when you browse the website.",
          ],
        },
        {
          title: "2. How we use information",
          body: [
            "We use your details to respond to enquiries, prepare quotes, confirm bookings, coordinate delivery/service, and improve our customer experience.",
            "We do not sell your personal information to third parties.",
          ],
        },
        {
          title: "3. Sharing",
          body: [
            "Information may be shared only with team members or service partners involved in fulfilling your order (for example kitchen or delivery coordination), and only as needed.",
            "We may disclose information if required by law or to protect our rights and safety.",
          ],
        },
        {
          title: "4. Storage & security",
          body: [
            "We take reasonable steps to keep enquiry details secure. No method of transmission or storage is 100% secure, so please share only what is needed for your booking.",
          ],
        },
        {
          title: "5. Your choices",
          body: [
            `You may request correction or deletion of enquiry details by contacting us at ${site.contact.email} or ${site.contact.phoneDisplay}.`,
            "If you no longer wish to receive follow-up messages about a closed enquiry, tell us and we will stop non-essential communication.",
          ],
        },
        {
          title: "6. Updates",
          body: [
            "We may update this Privacy Policy periodically. The “Last updated” date at the top will reflect the latest version.",
          ],
        },
      ]}
    />
  );
}
