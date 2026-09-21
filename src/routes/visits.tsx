import { ReceiptLink } from "@/components/receipt-link";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/app-layout";
import { PageHeader, ErrorState, LoadingState, EmptyState } from "@/components/ui";
import { listAll, today, type ClinicVisit } from "@/lib/clinic";
import { formatCurrency } from "@/lib/app-data";
export const Route = createFileRoute("/visits")({ component: Visits });
function Visits() {
  const [date, setDate] = useState(today());
  const query = useQuery({ queryKey: ["visits"], queryFn: () => listAll<ClinicVisit>("/visits") });
  const rows = (query.data ?? []).filter(
    (v) =>
      !date ||
      new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
        new Date(v.visitDate),
      ) === date,
  );
  return (
    <AppLayout>
      <PageHeader
        title="Visits"
        description="Saved examinations and prescriptions."
        action={
          <Link to="/patients" className="btn-primary">
            Select patient / start visit
          </Link>
        }
      />
      <label className="block mb-5">
        <span className="field-label">Visit date (clear for all visits)</span>
        <input
          className="field-control"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No visits recorded"
          description="Select a patient to start an examination."
        />
      ) : (
        <div className="space-y-3">
          {rows.map((v) => (
            <section className="panel p-5" key={v._id}>
              <div className="flex justify-between">
                <Link
                  to="/patients/$id"
                  params={{ id: v.patient._id }}
                  className="text-info font-bold"
                >
                  {v.patient.name}
                </Link>
                <strong>{formatCurrency(v.charges.total)}</strong>
              </div>
              <p className="mt-2">
                {v.visitId} · {new Date(v.visitDate).toLocaleDateString()}
              </p>
              <p>{v.complaint || v.doctorNotes || "Eye examination"}</p>
              <Link
                to="/patients/$id"
                params={{ id: v.patient._id }}
                className="btn-secondary mt-3"
              >
                View prescription & payment
              </Link>
              <div className="mt-3">
                <ReceiptLink kind="visit" id={v._id} label="Bill / prescription" />
              </div>
            </section>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
