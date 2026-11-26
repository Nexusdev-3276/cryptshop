import type { Metadata } from "next";
import { Confirmation } from "@/components/confirmation";

export const metadata: Metadata = {
  title: "Instructions de paiement",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <div className="container page">
      <Confirmation />
    </div>
  );
}
