import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentPageClient } from "@/components/payment-page";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Paiement — ${id}`,
    robots: { index: false, follow: false },
  };
}

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container page">
      <PaymentPageClient orderId={id} />
    </div>
  );
}