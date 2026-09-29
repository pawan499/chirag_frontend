import { DeletePatient } from "@/components/delete-patient";
import "@/receipt.css";
import { PatientClinic } from "@/components/patient-clinic";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Plus } from "@/components/icons";
import { AppLayout } from "@/components/app-layout";
import { Currency, EmptyState, ErrorState, LoadingState, SectionTitle } from "@/components/ui";
import { genderLabels, getPatientDetails } from "@/lib/patient-data";

export const Route = createFileRoute("/patients/$id/")({
  head: () => ({
    meta: [
      { title: "Patient profile — Chirag Eye Care & Optics" },
      {
        name: "description",
        content: "Review patient history, latest eye power, orders, and outstanding dues.",
      },
      { property: "og:title", content: "Patient profile — Chirag Eye Care & Optics" },
      {
        property: "og:description",
        content: "Review patient history and start a new eye-care visit.",
      },
    ],
  }),
  component: PatientProfile,
});

const dateLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
function PatientProfile() {
  const { id } = Route.useParams();
  const query = useQuery({
    queryKey: ["patients", id, "details"],
    queryFn: () => getPatientDetails(id),
    retry: false,
  });
  const details = query.data;
  if (query.isPending)
    return (
      <AppLayout>
        <LoadingState label="Loading patient…" />
      </AppLayout>
    );
  if (query.isError || !details)
    return (
      <AppLayout>
        <ErrorState onRetry={() => void query.refetch()} />
      </AppLayout>
    );
  const { patient, paymentSummary, recentVisits } = details;
  const fields = [
    ["Mobile number", patient.mobile],
    ["Age", patient.age == null ? "—" : `${patient.age} years`],
    ["Gender", patient.gender ? genderLabels[patient.gender] : "—"],
    ["Blood group", patient.bloodGroup],
    ["Address", patient.address],
    ["Allergies", patient.allergies],
    ["Medical notes", patient.medicalNotes],
  ];
  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/patients" className="btn-ghost">
          <ArrowLeft size={16} />
          Patients
        </Link>
        <Link to="/patients/$id/visits/new" params={{ id }} className="btn-primary">
          <Plus size={16} />
          Start new visit
        </Link>
      </div>
      <section className="panel mb-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{patient.patientId}</p>
            <h1 className="page-title mt-1">{patient.name}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/patients/$id/edit" params={{ id }} className="btn-secondary">
              <Pencil size={15} />
              Edit
            </Link>
            <DeletePatient id={id} name={patient.name} />
          </div>
        </div>
        <dl className="mt-5 grid gap-5 md:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-ink">
                {value || "—"}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <section className="panel p-4">
          <p className="eyebrow">Last visit</p>
          <p className="mt-3 font-bold">{dateLabel(details.latestVisit?.visitDate)}</p>
        </section>
        <section className="panel p-4">
          <p className="eyebrow">Current due</p>
          <p className="mt-3 font-bold">
            <Currency value={paymentSummary.due} />
          </p>
        </section>
        <section className="panel p-4">
          <p className="eyebrow">Active spectacle order</p>
          <p className="mt-3 font-bold">
            {details.activeSpectacleOrder?.status.replaceAll("_", " ") || "None"}
          </p>
        </section>
      </div>
      <section className="panel mb-5 p-5">
        <Link to="/receipts/$kind/$id" params={{ kind: "patient", id }} className="btn-secondary">
          Print registration slip / PDF
        </Link>
      </section>
      <PatientClinic id={id} />
      <section className="panel p-5">
        <SectionTitle title="Recent visits" />
        {recentVisits.length === 0 ? (
          <EmptyState
            title="No visits yet"
            description="This patient's visits will appear here once recorded."
          />
        ) : (
          <div className="space-y-5">
            {recentVisits.map((visit) => (
              <div
                key={visit._id}
                className="flex justify-between gap-4 border-b border-border pb-4"
              >
                <div>
                  <p className="text-xs text-muted-foreground">
                    {dateLabel(visit.visitDate)} · {visit.visitId}
                  </p>
                  <p className="mt-2 text-sm">
                    {visit.complaint || visit.doctorNotes || "Eye examination"}
                  </p>
                </div>
                <Currency value={visit.charges?.total ?? 0} />
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
