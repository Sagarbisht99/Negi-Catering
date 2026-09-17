import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${site.brand.fullName} catering and tiffin services on negicaterer.in.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      breadcrumb={[{ name: "Terms & Conditions" }]}
      title="Terms & Conditions"
      updated="16 September 2026"
      intro={`These Terms & Conditions govern your use of the ${site.brand.fullName} website and catering/tiffin services across ${site.location.label}. By placing an enquiry or order, you agree to these terms.`}
      sections={[
        {
          title: "1. Services",
          body: [
            `${site.brand.name} provides catering, tiffin, buffet, and related food services for events and daily meals. Menus, availability, and service style may vary by date, location, and guest count.`,
            "Quotes shared after enquiry are estimates until confirmed in writing (message, email, or booking confirmation).",
          ],
        },
        {
          title: "2. Bookings & confirmation",
          body: [
            "A booking is confirmed only after we acknowledge your order details and you accept the final menu, timing, and guest count.",
            "Changes to guest count, venue, or menu should be shared as early as possible. Late changes may not always be possible and can affect preparation.",
          ],
        },
        {
          title: "3. Payments",
          body: [
            "Payment terms (advance, balance, mode) will be communicated at confirmation. Services may be held pending agreed advance payment where applicable.",
            "Displayed website content does not constitute a fixed price list. Final amounts depend on menu selection, quantity, and service requirements.",
          ],
        },
        {
          title: "4. Cancellation",
          body: [
            "Cancellation or reschedule requests should be made promptly. Applicable charges, if any, will be shared based on preparation stage and notice period.",
          ],
        },
        {
          title: "5. Food & allergen note",
          body: [
            "Please inform us of allergies, Jain preferences, or dietary restrictions before confirmation. We take care in preparation, but kitchens may handle multiple ingredients.",
          ],
        },
        {
          title: "6. Website use",
          body: [
            "Content on this website (text, images, branding) belongs to Negi Caterers unless otherwise stated. You may not copy or misuse it without permission.",
            "We may update these terms from time to time. Continued use of the site after updates means you accept the revised terms.",
          ],
        },
      ]}
    />
  );
}
