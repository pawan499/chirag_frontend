import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/app-layout";
import { PageHeader, ErrorState, LoadingState } from "@/components/ui";
import { today, type Collection } from "@/lib/clinic";
import { apiRequest, formatCurrency } from "@/lib/app-data";
export const Route = createFileRoute("/reports")({ component: Reports });
function Reports() {
  const [from, setFrom] = useState(`${today().slice(0, 8)}01`);
  const [to, setTo] = useState(today());
  const valid = !!from && !!to && from <= to;
  const query = useQuery({
    queryKey: ["reports", from, to],
    enabled: valid,
    queryFn: () => apiRequest<Collection>(`/reports/collection?from=${from}&to=${to}`),
  });
  return (
    <AppLayout>
      <PageHeader
        title="Collection reports"
        description="Actual received payments, grouped by payment date in India time. Unpaid bills are not collections."
      />
      <div className="panel p-5 grid gap-4 sm:grid-cols-2 mb-5">
        <label>
          <span className="field-label">From</span>
          <input
            type="date"
            className="field-control"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label>
          <span className="field-label">To</span>
          <input
            type="date"
            className="field-control"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
      </div>
      {!valid ? (
        <p role="alert">Choose a valid date range.</p>
      ) : query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : (
        <>
          <section className="panel p-5 mb-5">
            <p>Total received</p>
            <p className="stat-number mt-3">{formatCurrency(query.data?.totalCollection ?? 0)}</p>
          </section>
          <div className="grid gap-3 sm:grid-cols-4">
            {Object.entries(query.data?.paymentMethods ?? {}).map(([method, amount]) => (
              <section className="panel p-4" key={method}>
                <p>{method}</p>
                <strong>{formatCurrency(amount)}</strong>
              </section>
            ))}
          </div>
          <section className="panel p-5 mt-5">
            <h2 className="font-bold mb-4">Daily collections</h2>
            {query.data?.trend?.length ? (
              query.data.trend.map((p) => (
                <div key={p.date} className="flex justify-between border-t py-3">
                  <span>{p.date}</span>
                  <strong>{formatCurrency(p.collection)}</strong>
                </div>
              ))
            ) : (
              <p>No payments received in this period.</p>
            )}
          </section>
        </>
      )}
    </AppLayout>
  );
}
