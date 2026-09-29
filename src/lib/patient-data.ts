import { z } from "zod";
import { investigationSchema } from "./investigation";
import { apiRequest } from "./app-data";

const optionalText = <T extends z.ZodType<string>>(schema: T) =>
  schema.optional().or(z.literal(""));
export const patientFormSchema = z.object({
  name: z.string().trim().min(1, "Enter the patient's name.").max(120),
  mobile: optionalText(
    z
      .string()
      .trim()
      .regex(/^[+\d\s()-]{7,20}$/, "Enter a valid phone number (7–20 characters)."),
  ),
  age: z.number().int().min(0).max(130).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY", ""]).optional(),
  address: z.string().max(500).optional(),
  bloodGroup: z.string().max(10).optional(),
  allergies: z.string().max(1000).optional(),
  medicalNotes: z.string().max(3000).optional(),
  investigation: investigationSchema.optional(),
});
export type PatientFormValues = z.infer<typeof patientFormSchema>;
export type PatientRecord = Omit<PatientFormValues, "gender"> & {
  _id: string;
  patientId: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  dateOfBirth?: string;
};
export const genderLabels = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

// Omit blank optional fields so an empty age never becomes 0 and an empty
// gender is not rejected by the API. Age 0 is a valid, explicit value.
export function patientPayload(values: PatientFormValues) {
  return Object.fromEntries(
    Object.entries(patientFormSchema.parse(values)).filter(
      ([, value]) => value !== "" && value !== undefined,
    ),
  );
}
export const createPatient = (values: PatientFormValues) =>
  apiRequest<PatientRecord>("/patients", {
    method: "POST",
    body: JSON.stringify(patientPayload(values)),
  });
export const updatePatient = (id: string, values: PatientFormValues) => {
  const parsed = patientFormSchema.parse(values);
  const payload = Object.fromEntries(
    Object.keys(patientFormSchema.shape).map((key) => {
      const value = parsed[key as keyof PatientFormValues];
      return [key, value === "" || value === undefined ? null : value];
    }),
  );
  return apiRequest<PatientRecord>(`/patients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};
export const getPatientRecord = (id: string) => apiRequest<PatientRecord>(`/patients/${id}`);
export const listPatientRecords = (search: string, page: number) =>
  apiRequest<PatientRecord[]>(
    `/patients?${new URLSearchParams({ search, page: String(page), limit: "20" })}`,
  );

export type PatientDetails = {
  patient: PatientRecord;
  latestVisit?: { visitDate?: string } | null;
  activeSpectacleOrder?: { status: string } | null;
  paymentSummary: { totalBilled: number; totalPaid: number; due: number };
  recentVisits: Array<{
    _id: string;
    visitId: string;
    visitDate: string;
    complaint?: string;
    doctorNotes?: string;
    charges?: { total?: number };
  }>;
};
export const getPatientDetails = (id: string) =>
  apiRequest<PatientDetails>(`/patients/${id}/details`);
