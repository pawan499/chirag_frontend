import { PaymentEditor } from "@/components/payment-editor";
import { paymentTime } from "@/lib/payment-time";
import { ReceiptLink } from "@/components/receipt-link";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/app-layout";
import { PageHeader, ErrorState, LoadingState, EmptyState } from "@/components/ui";
import { listAll, today, type ClinicPayment, type Collection } from "@/lib/clinic";
import { apiRequest, fetchDashboardSummary, formatCurrency } from "@/lib/app-data";
export const Route = createFileRoute("/payments")({ component: Payments });
function Payments() {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const [payments, summary, daily] = await Promise.all([
        listAll<ClinicPayment>("/payments"),
        fetchDashboardSummary(),
        apiRequest<Collection>(`/reports/collection/daily?date=${today()}`),
      ]);
      return { payments, summary, daily };
    },
  });
  const rows = (query.data?.payments ?? []).filter((p) =>
    `${p.paymentId} ${p.patient.name} ${p.paymentMethod} ${p.referenceNumber ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <AppLayout>
      <PageHeader
        title="Payments"
        description="Record only payments already received by cash or your existing QR."
        action={
          <Link to="/patients" className="btn-primary">
            Select patient / add payment
          </Link>
        }
      />
      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3 mb-5">
            {[
              ["Today received", query.data?.daily.totalCollection],
              ["Cash today", query.data?.daily.paymentMethods["CASH"]],
              ["Outstanding bills", query.data?.summary.pendingDue],
            ].map(([label, value]) => (
              <section className="panel p-4" key={label}>
                <p>{label}</p>
                <p className="stat-number mt-3">{formatCurrency(Number(value ?? 0))}</p>
              </section>
            ))}
          </div>
          <input
            aria-label="Search payments"
            className="field-control mb-4"
            placeholder="Search patient, reference, method or payment ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {rows.length === 0 ? (
            <EmptyState
              title="No payments found"
              description="Recorded payments will appear here."
            />
          ) : (
            <div className="space-y-3">
              {rows.map((p) => (
                <section className="panel p-4" key={p._id}>
                  <div className="flex justify-between gap-3">
                    <Link
                      to="/patients/$id"
                      params={{ id: p.patient._id }}
                      className="text-info font-bold"
                    >
                      {p.patient.name}
                    </Link>
                    <strong>{formatCurrency(p.amount)}</strong>
                  </div>
                  <p className="text-sm mt-2">
                    {p.paymentId} · {paymentTime(p.paymentDate)} · {p.paymentMethod}
                  </p>
                  <p className="text-sm">
                    {p.referenceNumber} {p.notes}
                  </p>
                  <div className="mt-3">
                    <ReceiptLink kind="payment" id={p._id} />
                    <PaymentEditor payment={p} />
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
