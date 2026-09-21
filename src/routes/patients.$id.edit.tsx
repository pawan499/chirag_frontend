import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "@/components/icons";
import { AppLayout } from "@/components/app-layout";
import { PatientForm } from "@/components/patient-form";
import { ErrorState, LoadingState, PageHeader } from "@/components/ui";
import { getPatientRecord, updatePatient } from "@/lib/patient-data";

export const Route = createFileRoute("/patients/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit patient — Chirag Eye Care & Optics" },
      { name: "description", content: "Update a patient record." },
      { property: "og:title", content: "Edit patient — Chirag Eye Care & Optics" },
      {
        property: "og:description",
        content: "Update patient details without losing their visit history.",
      },
    ],
  }),
  component: EditPatient,
});

function EditPatient() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["patients", id],
    queryFn: () => getPatientRecord(id),
    retry: false,
  });
  const patient = query.data;
  return (
    <AppLayout>
      {query.isPending ? (
        <LoadingState label="Loading patient…" />
      ) : query.isError || !patient ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : (
        <>
          <PageHeader
            eyebrow={`Patient records · ${patient.patientId}`}
            title={`Edit ${patient.name}`}
            action={
              <Link to="/patients/$id" params={{ id }} className="btn-secondary">
                <ArrowLeft size={16} />
                Back to profile
              </Link>
            }
          />
          <PatientForm
            key={id}
            patient={patient}
            cancel={
              <Link to="/patients/$id" params={{ id }} className="btn-secondary">
                Cancel
              </Link>
            }
            onSave={async (values) => {
              await updatePatient(id, values);
              await queryClient.invalidateQueries({ queryKey: ["patients"] });
              toast.success("Patient updated successfully.");
              await navigate({ to: "/patients/$id", params: { id } });
            }}
          />
        </>
      )}
    </AppLayout>
  );
}
