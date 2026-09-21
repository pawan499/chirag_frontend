import { z } from "zod";
const registrationEye = z.object({
  unaidedVision: z.string().trim().max(40).optional(),
  correctedVision: z.string().trim().max(40).optional(),
  pinholeVision: z.string().trim().max(40).optional(),
  nearVision: z.string().trim().max(40).optional(),
  sph: z.number().finite().min(-50).max(50).optional(),
  cyl: z.number().finite().min(-50).max(50).optional(),
  axis: z.number().finite().min(0).max(180).optional(),
  add: z.number().finite().min(-50).max(50).optional(),
  iop: z.number().finite().min(0).max(100).optional(),
});
export const investigationSchema = z.object({
  rightEye: registrationEye.optional(),
  leftEye: registrationEye.optional(),
  pd: z.number().finite().min(0).max(100).optional(),
  remarks: z.string().max(2000).optional(),
});
export type Investigation = z.infer<typeof investigationSchema>;
export const investigationFields = [
  { key: "unaidedVision", label: "Distance vision without glasses", placeholder: "6/6" },
  { key: "correctedVision", label: "Distance vision with glasses", placeholder: "6/6" },
  { key: "pinholeVision", label: "Pinhole vision", placeholder: "6/6" },
  { key: "nearVision", label: "Near vision", placeholder: "N6" },
  { key: "sph", label: "SPH (D)", placeholder: "-1.00", min: -50, max: 50 },
  { key: "cyl", label: "CYL (D)", placeholder: "-0.50", min: -50, max: 50 },
  { key: "axis", label: "AXIS (degrees)", placeholder: "90", min: 0, max: 180 },
  { key: "add", label: "ADD (D)", placeholder: "+1.50", min: -50, max: 50 },
  { key: "iop", label: "Eye pressure / IOP (mmHg)", placeholder: "16", min: 0, max: 100 },
] as const;
