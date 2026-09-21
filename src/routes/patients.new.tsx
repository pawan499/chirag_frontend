import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "@/components/icons";
import { AppLayout } from "@/components/app-layout";
import { PatientForm } from "@/components/patient-form";
import { PageHeader } from "@/components/ui";
import { createPatient } from "@/lib/patient-data";

export const Route = createFileRoute("/patients/new")({
  head: () => ({
    meta: [
      { title: "New patient — Chirag Eye Care & Optics" },
      { name: "description", content: "Create a new patient record." },
      { property: "og:title", content: "New patient — Chirag Eye Care & Optics" },
      {
        property: "og:description",
        content: "Create a patient record and start their first visit.",
      },
    ],
  }),
  component: NewPatient,
});

function NewPatient() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return (
    <AppLayout>
      <PageHeader
        eyebrow="Patient records"
        title="Add new patient"
        description="Only the name is required. You can add details later."
        action={
          <Link to="/patients" className="btn-secondary">
            <ArrowLeft size={16} />
            Back to patients
          </Link>
        }
      />
      <PatientForm
        cancel={
          <Link to="/patients" className="btn-secondary">
            Cancel
          </Link>
        }
        onSave={async (values) => {
          const patient = await createPatient(values);
          await queryClient.invalidateQueries({ queryKey: ["patients"] });
          toast.success("Patient created successfully.");
          await navigate({
            to: "/receipts/$kind/$id",
            params: { kind: "patient", id: patient._id },
          });
        }}
      />
    </AppLayout>
  );
}
