import { eyeLabels, type Diagnosis } from "@/lib/clinical-options";
export function ClinicalAssessment({
  symptoms,
  diagnoses,
}: {
  symptoms?: string[] | undefined;
  diagnoses?: Diagnosis[] | undefined;
}) {
  if (!symptoms?.length && !diagnoses?.length) return null;
  return (
    <section className="receipt-section">
      <h3>Symptoms & diagnosis</h3>
      {!!symptoms?.length && (
        <p className="receipt-note">
          <b>Symptoms:</b> {symptoms.join(", ")}
        </p>
      )}
      {diagnoses?.map((diagnosis, index) => (
        <p className="receipt-note" key={index}>
          <b>{diagnosis.name}</b> · {eyeLabels[diagnosis.eye]} ·{" "}
          {diagnosis.status === "CONFIRMED" ? "Confirmed" : "Provisional / suspected"}
        </p>
      ))}
    </section>
  );
}
