import type { Investigation } from "./investigation";
import type { Diagnosis } from "./clinical-options";
import { apiRequest } from "./app-data";
export type Eye = NonNullable<Investigation["rightEye"]> & { va?: string };
export type Examination = Omit<Investigation, "rightEye" | "leftEye"> & {
  rightEye?: Eye | undefined;
  leftEye?: Eye | undefined;
};
export type ClinicVisit = {
  _id: string;
  visitId: string;
  visitDate: string;
  patient: { _id: string; name: string; patientId: string };
  complaint?: string;
  doctorNotes?: string;
  symptoms?: string[];
  diagnoses?: Diagnosis[];
  eyeExamination?: Examination;
  medicines: {
    medicineName: string;
    quantity: number;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
    strength?: string;
    eye?: "OD" | "OS" | "OU" | "NA";
  }[];
  charges: { total: number };
};
export type ClinicOrder = {
  _id: string;
  orderId: string;
  patient: ClinicVisit["patient"];
  rightEye?: Eye;
  leftEye?: Eye;
  pd?: number;
  frameName?: string;
  lensType?: string;
  deliveryDate?: string;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  status: string;
};
export type ClinicPayment = {
  editedAt?: string;
  editHistory?: { note: string; editedAt: string }[];
  _id: string;
  paymentId: string;
  patient: ClinicVisit["patient"];
  visit?: string;
  spectacleOrder?: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
};
export type Collection = {
  totalCollection: number;
  paymentMethods: Record<string, number>;
  trend?: { date: string; collection: number }[];
};
export const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
export async function listAll<T>(path: string): Promise<T[]> {
  const result: T[] = [];
  for (let page = 1; ; page++) {
    const rows = await apiRequest<T[]>(
      `${path}${path.includes("?") ? "&" : "?"}limit=100&page=${page}`,
    );
    result.push(...rows);
    if (rows.length < 100) return result;
  }
}
export const saveRecord = <T>(path: string, data: unknown, method = "POST") =>
  apiRequest<T>(path, { method, body: JSON.stringify(data) });
export function eyePayload(form: FormData, prefix: string): Eye {
  return Object.fromEntries(
    [
      "sph",
      "cyl",
      "axis",
      "add",
      "va",
      "unaidedVision",
      "correctedVision",
      "pinholeVision",
      "nearVision",
      "iop",
    ].flatMap((key) => {
      const value = String(form.get(`${prefix}.${key}`) ?? "").trim();
      return value === ""
        ? []
        : [
            [
              key,
              ["va", "unaidedVision", "correctedVision", "pinholeVision", "nearVision"].includes(
                key,
              )
                ? value
                : Number(value),
            ],
          ];
    }),
  );
}
