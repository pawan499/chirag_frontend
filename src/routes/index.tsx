import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/app-layout";
import { PageHeader, ErrorState, LoadingState } from "@/components/ui";
import { fetchDashboardSummary, formatCurrency, apiRequest } from "@/lib/app-data";
import { today, type Collection } from "@/lib/clinic";
export const Route = createFileRoute("/")({ component: Dashboard });
function Dashboard() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [summary, daily] = await Promise.all([
        fetchDashboardSummary(),
        apiRequest<Collection>(`/reports/collection/daily?date=${today()}`),
      ]);
      return { summary, daily };
    },
  });
  return (
    <AppLayout>
      <PageHeader
        eyebrow={today()}
        title="Clinic dashboard"
        description="Patient care, spectacle orders and received collections."
        action={
          <Link to="/patients/new" className="btn-primary">
            New patient
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <Link className="btn-secondary" to="/patients">
          Find patient / start visit
        </Link>
        <Link className="btn-secondary" to="/spectacles" search={{ status: "All" }}>
          Manage spectacle orders
        </Link>
        <Link className="btn-secondary" to="/payments">
          Record / view payments
        </Link>
      </div>
      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Patients seen today", String(query.data?.summary.todayPatients ?? 0)],
              ["Received today", formatCurrency(query.data?.summary.todayCollection ?? 0)],
              ["Received this month", formatCurrency(query.data?.summary.monthlyCollection ?? 0)],
              ["Outstanding bills", formatCurrency(query.data?.summary.pendingDue ?? 0)],
            ].map(([label, value]) => (
              <section className="panel p-5" key={label}>
                <p className="text-sm">{label}</p>
                <p className="stat-number mt-4">{value}</p>
              </section>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 mt-6">
            <section className="panel p-5">
              <h2 className="font-bold mb-4">Today's payment methods</h2>
              {Object.entries(query.data?.daily.paymentMethods ?? {}).map(([method, amount]) => (
                <div className="flex justify-between py-3 border-t" key={method}>
                  <span>{method}</span>
                  <strong>{formatCurrency(amount)}</strong>
                </div>
              ))}
              <Link to="/reports" className="btn-secondary mt-4">
                View collection reports
              </Link>
            </section>
            <section className="panel p-5">
              <h2 className="font-bold mb-4">Spectacle orders</h2>
              {["ORDERED", "IN_PROCESS", "READY", "DELIVERED"].map((status) => (
                <Link
                  key={status}
                  to="/spectacles"
                  search={{ status }}
                  className="flex justify-between py-3 border-t"
                >
                  <span>{status.replaceAll("_", " ")}</span>
                  <strong>{query.data?.summary.spectacleOrders?.[status] ?? 0}</strong>
                </Link>
              ))}
            </section>
          </div>
        </>
      )}
    </AppLayout>
  );
}
