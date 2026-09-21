import { ReceiptLink } from "@/components/receipt-link";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/app-layout";
import { PageHeader, ErrorState, LoadingState, EmptyState } from "@/components/ui";
import { listAll, type ClinicOrder } from "@/lib/clinic";
import { formatCurrency } from "@/lib/app-data";
export const Route = createFileRoute("/spectacles")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: typeof search["status"] === "string" ? search["status"] : "All",
  }),
  component: Spectacles,
});
function Spectacles() {
  const { status } = Route.useSearch();
  const [filter, setFilter] = useState(status.toUpperCase().replaceAll(" ", "_"));
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () => listAll<ClinicOrder>("/spectacle-orders"),
  });
  const rows = (query.data ?? []).filter(
    (o) =>
      (filter === "ALL" || o.status === filter) &&
      `${o.orderId} ${o.patient.name} ${o.patient.patientId} ${o.frameName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <AppLayout>
      <PageHeader
        title="Spectacle orders"
        description="Create orders and update delivery status from the patient profile."
        action={
          <Link to="/patients" className="btn-primary">
            Select patient / create order
          </Link>
        }
      />
      <div className="panel p-4 mb-5 flex flex-wrap gap-3">
        <input
          aria-label="Search orders"
          className="field-control"
          placeholder="Search order or patient"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Order status"
          className="field-control"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["ALL", "ORDERED", "IN_PROCESS", "READY", "DELIVERED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No spectacle orders"
          description="Select a patient to create an order, or change your filters."
        />
      ) : (
        <>
          <section className="panel desktop-only overflow-hidden">
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">Spectacle orders and payment balances</caption>
                <thead>
                  <tr>
                    <th scope="col">Order</th>
                    <th scope="col">Patient</th>
                    <th scope="col">Frame / lens</th>
                    <th scope="col">Total</th>
                    <th scope="col">Paid</th>
                    <th scope="col">Due</th>
                    <th scope="col">Status</th>
                    <th scope="col">Expected delivery</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o) => (
                    <tr key={o._id}>
                      <td className="font-bold whitespace-nowrap">{o.orderId}</td>
                      <td>
                        <Link
                          className="text-info font-bold"
                          to="/patients/$id"
                          params={{ id: o.patient._id }}
                        >
                          {o.patient.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{o.patient.patientId}</p>
                      </td>
                      <td>
                        <p>{o.frameName || "—"}</p>
                        <p className="text-xs text-muted-foreground">{o.lensType || "—"}</p>
                      </td>
                      <td className="font-semibold whitespace-nowrap">
                        {formatCurrency(o.totalAmount)}
                      </td>
                      <td className="whitespace-nowrap">{formatCurrency(o.advanceAmount)}</td>
                      <td className="font-semibold whitespace-nowrap">
                        {formatCurrency(o.status === "CANCELLED" ? 0 : o.remainingAmount)}
                      </td>
                      <td className="text-xs font-semibold whitespace-nowrap">
                        {o.status.replaceAll("_", " ")}
                      </td>
                      <td className="whitespace-nowrap">
                        {o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <Link
                          className="btn-secondary whitespace-nowrap"
                          to="/patients/$id"
                          params={{ id: o.patient._id }}
                          aria-label={`Manage order ${o.orderId} or record payment`}
                        >
                          Manage / payment
                        </Link>
                        <div className="mt-2">
                          <ReceiptLink kind="order" id={o._id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <div className="mobile-only w-full flex-col gap-4">
            {rows.map((o) => (
              <section className="panel p-5 space-y-3" key={o._id}>
                <p className="font-bold">
                  {o.orderId} · {o.status.replaceAll("_", " ")}
                </p>
                <Link
                  className="text-info font-bold"
                  to="/patients/$id"
                  params={{ id: o.patient._id }}
                >
                  {o.patient.name}
                </Link>
                <p>
                  {o.frameName} · {o.lensType}
                </p>
                <p>
                  Total {formatCurrency(o.totalAmount)} · Paid {formatCurrency(o.advanceAmount)} ·
                  Due {formatCurrency(o.status === "CANCELLED" ? 0 : o.remainingAmount)}
                </p>
                {o.deliveryDate && (
                  <p>Expected delivery: {new Date(o.deliveryDate).toLocaleDateString()}</p>
                )}
                <Link className="btn-secondary" to="/patients/$id" params={{ id: o.patient._id }}>
                  Manage order / record payment
                </Link>
                <ReceiptLink kind="order" id={o._id} />
              </section>
            ))}
          </div>
        </>
      )}
    </AppLayout>
  );
}
