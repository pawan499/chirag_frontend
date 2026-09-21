import { medicineNameSuggestions } from "@/lib/clinical-options";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { PageHeader, ErrorState, LoadingState } from "@/components/ui";
import { listAll, saveRecord } from "@/lib/clinic";
import { formatCurrency } from "@/lib/app-data";
type Medicine = {
  _id: string;
  name: string;
  genericName?: string;
  unit?: string;
  defaultPrice: number;
};
export const Route = createFileRoute("/medicines")({ component: Medicines });
function Medicines() {
  const cache = useQueryClient();
  const [edit, setEdit] = useState<Medicine | null | undefined>();
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const query = useQuery({
    queryKey: ["medicines"],
    queryFn: () => listAll<Medicine>("/medicines"),
  });
  return (
    <AppLayout>
      <PageHeader
        title="Medicines"
        description="Manage medicines and prices used during examinations."
        action={
          <button className="btn-primary" onClick={() => setEdit(null)}>
            Add medicine
          </button>
        }
      />
      {error && (
        <p role="alert" className="text-danger mb-3">
          {error}
        </p>
      )}
      {edit !== undefined && (
        <form
          key={edit?._id ?? "new"}
          className="panel p-5 mb-5 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (saving) return;
            const form = new FormData(e.currentTarget);
            setSaving(true);
            setError("");
            try {
              await saveRecord(
                edit ? `/medicines/${edit._id}` : "/medicines",
                {
                  name: form.get("name"),
                  genericName: form.get("genericName"),
                  unit: form.get("unit"),
                  defaultPrice: Number(form.get("defaultPrice")),
                },
                edit ? "PATCH" : "POST",
              );
              setEdit(undefined);
              await cache.invalidateQueries();
              toast.success("Medicine saved");
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not save medicine");
            } finally {
              setSaving(false);
            }
          }}
        >
          <datalist id="catalogue-medicine-names">
            {medicineNameSuggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          {(["name", "genericName", "unit", "defaultPrice"] as const).map((key) => (
            <label key={key} className="block">
              <span className="field-label">
                {
                  {
                    name: "Medicine name",
                    genericName: "Generic name",
                    unit: "Unit / pack size",
                    defaultPrice: "Default price (₹)",
                  }[key]
                }
              </span>
              <input
                name={key}
                list={
                  key === "name" || key === "genericName" ? "catalogue-medicine-names" : undefined
                }
                className="field-control"
                defaultValue={edit?.[key] ?? (key === "defaultPrice" ? 0 : "")}
                required={key === "name" || key === "defaultPrice"}
                type={key === "defaultPrice" ? "number" : "text"}
                min="0"
                step="0.01"
                maxLength={key === "unit" ? 40 : 200}
              />
            </label>
          ))}
          <button className="btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save medicine"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setEdit(undefined)}>
            Cancel
          </button>
        </form>
      )}
      <input
        aria-label="Search medicines"
        className="field-control mb-4"
        placeholder="Search medicines"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : (
        <div className="space-y-3">
          {query.data?.length === 0 && <p>No medicines yet. Add your clinic’s medicines above.</p>}
          {query.data
            ?.filter((m) =>
              `${m.name} ${m.genericName}`.toLowerCase().includes(search.toLowerCase()),
            )
            .map((m) => (
              <section className="panel p-4 flex flex-wrap justify-between gap-3" key={m._id}>
                <div>
                  <strong>{m.name}</strong>
                  <p>
                    {m.genericName} · {m.unit} · {formatCurrency(m.defaultPrice ?? 0)}
                  </p>
                </div>
                <button className="btn-secondary" onClick={() => setEdit(m)}>
                  Edit
                </button>
              </section>
            ))}
        </div>
      )}
    </AppLayout>
  );
}
