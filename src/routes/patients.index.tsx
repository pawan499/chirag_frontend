import { DeletePatient } from "@/components/delete-patient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Plus, UserRound } from "@/components/icons";
import { AppLayout } from "@/components/app-layout";
import { EmptyState, ErrorState, LoadingState, PageHeader, SearchField } from "@/components/ui";
import { listPatientRecords } from "@/lib/patient-data";

export const Route = createFileRoute("/patients/")({
  head: () => ({
    meta: [
      { title: "Patients — Chirag Eye Care & Optics" },
      {
        name: "description",
        content: "Search and manage patient records for Chirag Eye Care & Optics.",
      },
      { property: "og:title", content: "Patients — Chirag Eye Care & Optics" },
      { property: "og:description", content: "Search patient records and start visits quickly." },
    ],
  }),
  component: Patients,
});

function Patients() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const result = useQuery({
    queryKey: ["patients", { search: query, page }],
    queryFn: () => listPatientRecords(query, page),
    retry: false,
  });
  const filtered = result.data ?? [];
  return (
    <AppLayout>
      <PageHeader
        eyebrow="Patient records"
        title="Patients"
        description="Search by patient name, ID, or mobile number."
        action={
          <Link to="/patients/new" className="btn-primary">
            <Plus size={17} />
            New patient
          </Link>
        }
      />
      <div className="panel p-4">
        <SearchField
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} patients on this page</span>
          <button className="btn-ghost">
            <MoreHorizontal size={16} />
            More filters
          </button>
        </div>
      </div>
      <div className="panel mt-5 overflow-hidden">
        {result.isPending ? (
          <LoadingState />
        ) : result.isError ? (
          <ErrorState onRetry={() => void result.refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No patients found"
            description="Try a different name, patient ID, or mobile number."
            action={
              <Link to="/patients/new" className="btn-primary">
                <Plus size={16} />
                Add patient
              </Link>
            }
          />
        ) : (
          <>
            <div className="desktop-only table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((patient) => (
                    <tr key={patient._id}>
                      <td>
                        <Link
                          to="/patients/$id"
                          params={{ id: patient._id }}
                          className="flex items-center gap-3"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-blue text-info">
                            <UserRound size={15} />
                          </span>
                          <span>
                            <span className="block font-bold text-ink hover:text-info">
                              {patient.name}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {patient.patientId} ·{" "}
                              {patient.age === undefined || patient.age === null
                                ? "Age not recorded"
                                : `${patient.age} years`}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="text-sm text-muted-foreground">{patient.mobile || "—"}</td>
                      <td className="text-sm text-muted-foreground">{patient.address || "—"}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            aria-label={`Edit ${patient.name}`}
                            title="Edit patient"
                            to="/patients/$id/edit"
                            params={{ id: patient._id }}
                            className="patient-action"
                          >
                            <Pencil size={17} />
                          </Link>
                          <DeletePatient id={patient._id} name={patient.name} stayOnList />
                          <Link
                            aria-label={`Open ${patient.name}`}
                            title="Open patient"
                            to="/patients/$id"
                            params={{ id: patient._id }}
                            className="patient-action"
                          >
                            <MoreHorizontal size={17} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-only w-full flex-col">
              {filtered.map((patient) => (
                <div className="mobile-card" key={patient._id}>
                  <div className="flex items-start justify-between gap-3">
                    <Link to="/patients/$id" params={{ id: patient._id }}>
                      <p className="font-bold text-ink">{patient.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {patient.patientId} · {patient.mobile || "—"}
                      </p>
                    </Link>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {patient.address || "No address recorded"}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      to="/patients/$id/edit"
                      params={{ id: patient._id }}
                      className="patient-action"
                      aria-label={`Edit ${patient.name}`}
                      title="Edit patient"
                    >
                      <Pencil size={17} />
                    </Link>
                    <DeletePatient id={patient._id} name={patient.name} stayOnList />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to="/patients/$id"
                      params={{ id: patient._id }}
                      className="btn-secondary flex-1"
                    >
                      View profile
                    </Link>
                    <Link
                      to="/patients/$id/visits/new"
                      params={{ id: patient._id }}
                      className="btn-primary flex-1"
                    >
                      Start visit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          className="btn-secondary"
          disabled={page === 1 || result.isFetching}
          onClick={() => setPage((value) => value - 1)}
        >
          Previous
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          className="btn-secondary"
          disabled={filtered.length < 20 || result.isFetching || result.isError}
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </button>
      </div>
    </AppLayout>
  );
}
