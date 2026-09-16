import { EnquiryProvider } from "@/components/EnquiryProvider";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import OfferPopup from "@/components/OfferPopup";
import Ticker from "@/components/Ticker";
import { ToastProvider } from "@/components/Toast";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <EnquiryProvider>
        <Header />
        <main className="flex-1 pb-20 sm:pb-14">{children}</main>
        <Footer />
        <FloatingActions />
        <Ticker />
        <OfferPopup />
      </EnquiryProvider>
    </ToastProvider>
  );
}
