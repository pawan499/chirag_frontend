import { Link } from "@tanstack/react-router";
import { ReceiptText } from "lucide-react";
export function ReceiptLink({
  kind,
  id,
  label = "View receipt",
}: {
  kind: "visit" | "order" | "payment";
  id: string;
  label?: string;
}) {
  return (
    <Link to="/receipts/$kind/$id" params={{ kind, id }} className="btn-secondary">
      <ReceiptText size={15} />
      {label}
    </Link>
  );
}
