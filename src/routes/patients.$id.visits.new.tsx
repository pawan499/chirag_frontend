import { DiagnosisFields, type DiagnosisDraft } from "@/components/diagnosis-fields";
import { PrescriptionFields, type PrescriptionItem } from "@/components/prescription-fields";
import { symptomOptions } from "@/lib/clinical-options";
import type { ClinicVisit } from "@/lib/clinic";
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { ErrorState, LoadingState, PageHeader } from "@/components/ui";
import { EyeFields } from "@/components/eye-fields";
import { getPatientRecord } from "@/lib/patient-data";
import { fetchSettings, formatCurrency } from "@/lib/app-data";
import { eyePayload, listAll, saveRecord } from "@/lib/clinic";
export const Route = createFileRoute("/patients/$id/visits/new")({ component: NewVisit });
function NewVisit() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const cache = useQueryClient();
  const query = useQuery({
    queryKey: ["visit-form", id],
    queryFn: async () => {
      const [patient, settings, medicines] = await Promise.all([
        getPatientRecord(id),
        fetchSettings(),
        listAll<{ _id: string; name: string; defaultPrice: number; unit?: string }>("/medicines"),
      ]);
      return { patient, settings, medicines };
    },
  });
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisDraft[]>([]);
  const [fee, setFee] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  if (query.isPending)
    return (
      <AppLayout>
        <LoadingState />
      </AppLayout>
    );
  if (query.isError || !query.data)
    return (
      <AppLayout>
        <ErrorState onRetry={() => void query.refetch()} />
      </AppLayout>
    );
  const { patient, settings, medicines } = query.data;
  const consultation = fee ?? Number(settings["defaultConsultationFee"] ?? 0);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    try {
      const visit = await saveRecord<ClinicVisit>("/visits", {
        patient: id,
        complaint: form.get("complaint"),
        symptoms: form.getAll("symptoms"),
        diagnoses,
        doctorNotes: form.get("doctorNotes"),
        eyeExamination: {
          rightEye: eyePayload(form, "right"),
          leftEye: eyePayload(form, "left"),
          ...(form.get("pd") ? { pd: Number(form.get("pd")) } : {}),
          remarks: form.get("remarks"),
        },
        medicines: items.map((item) => ({
          ...(item.id ? { medicine: item.id } : { medicineName: item.name.trim() }),
          strength: item.strength,
          ...(item.eye ? { eye: item.eye } : {}),
          instructions: item.instructions,
          quantity: item.quantity,
          unitPrice: item.price,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
        })),
        charges: { consultation },
        ...(form.get("followUpDate") ? { followUpDate: form.get("followUpDate") } : {}),
      });
      await cache.invalidateQueries();
      toast.success("Visit and prescription saved.");
      void navigate({ to: "/receipts/$kind/$id", params: { kind: "visit", id: visit._id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save visit");
    } finally {
      setSaving(false);
    }
  }
  return (
    <AppLayout>
      <PageHeader
        title={`New visit · ${patient.name}`}
        description="Save the examination and medicines, then record a spectacle order or payment from the patient profile."
        action={
          <Link to="/patients/$id" params={{ id }} className="btn-secondary">
            Patient history
          </Link>
        }
      />
      <form onSubmit={submit} className="space-y-5">
        <fieldset disabled={saving} className="space-y-5">
          <section className="panel p-5 space-y-5">
            <h2 className="font-bold">1. Eye examination</h2>
            <label className="block">
              <span className="field-label">Complaint / symptoms</span>
              <textarea name="complaint" className="field-control" maxLength={2000} />
            </label>
            <fieldset className="flex flex-wrap gap-4">
              <legend className="field-label mb-2">Symptoms</legend>
              {symptomOptions.map((symptom) => (
                <label key={symptom} className="flex items-center gap-2">
                  <input type="checkbox" name="symptoms" value={symptom} />
                  {symptom}
                </label>
              ))}
            </fieldset>
            <EyeFields prefix="right" label="Right eye (OD)" detailed />
            <EyeFields prefix="left" label="Left eye (OS)" detailed />
            <label className="block">
              <span className="field-label">PD (mm)</span>
              <input
                name="pd"
                type="number"
                min="0"
                max="100"
                step="0.1"
                className="field-control"
              />
            </label>
            <label className="block">
              <span className="field-label">Machine readings / examination remarks</span>
              <textarea name="remarks" className="field-control" maxLength={2000} />
            </label>
            <label className="block">
              <span className="field-label">Doctor notes / treatment plan</span>
              <textarea name="doctorNotes" className="field-control" maxLength={5000} />
            </label>
            <label className="block">
              <span className="field-label">Follow-up date</span>
              <input name="followUpDate" type="date" className="field-control" />
            </label>
          </section>
          <DiagnosisFields value={diagnoses} onChange={setDiagnoses} />
          {patient.allergies && (
            <p className="panel p-4">
              <b>Recorded allergies:</b> {patient.allergies}
            </p>
          )}
          <PrescriptionFields items={items} onChange={setItems} medicines={medicines} />
          <section className="panel p-5">
            <label>
              <span className="field-label">Consultation fee (₹)</span>
              <input
                className="field-control"
                type="number"
                min="0"
                step="0.01"
                required
                value={consultation}
                onChange={(e) => setFee(Number(e.target.value))}
              />
            </label>
            <p className="my-4 font-bold">
              Visit bill:{" "}
              {formatCurrency(
                consultation + items.reduce((sum, item) => sum + item.price * item.quantity, 0),
              )}
            </p>
            <p className="text-sm mb-4">
              Payment can be recorded after saving. No payment is collected automatically.
            </p>
            {error && (
              <p role="alert" className="text-danger mb-3">
                {error}
              </p>
            )}
            <button className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save visit & print prescription"}
            </button>
          </section>
        </fieldset>
      </form>
    </AppLayout>
  );
}
