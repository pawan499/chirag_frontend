export type PaymentMethod = "Cash" | "UPI" | "Card" | "Other";
export type PaymentStatus = "Paid" | "Pending" | "Partial";
export type OrderStatus = "Ordered" | "In Process" | "Ready" | "Delivered" | "Cancelled";

export type Patient = {
  id: string;
  name: string;
  mobile: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  lastVisit: string;
  due: number;
  latestPower: string;
  activeOrder: OrderStatus | "None";
};

export type Payment = {
  id: string;
  patient: string;
  patientId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  note?: string;
};

export type Medicine = {
  id: string;
  name: string;
  generic: string;
  unit: string;
  price: number;
  active: boolean;
};

export type SpectacleOrder = {
  id: string;
  patient: string;
  patientId: string;
  date: string;
  total: number;
  paid: number;
  status: OrderStatus;
};

export type Visit = {
  id: string;
  patientId: string;
  patient: string;
  date: string;
  type: string;
  amount: number;
  status: PaymentStatus;
  summary: string;
};

export type ChartPoint = { label: string; value: number };

type ApiEnvelope<T> = { success: boolean; message?: string; data: T; pagination?: unknown };

type BackendPatient = {
  _id: string;
  patientId?: string;
  name?: string;
  mobile?: string;
  age?: number;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  createdAt?: string;
  updatedAt?: string;
  paymentSummary?: { due?: number };
};

type BackendPayment = {
  _id: string;
  paymentId?: string;
  amount?: number;
  paymentMethod?: "CASH" | "UPI" | "CARD" | "OTHER";
  paymentDate?: string;
  referenceNumber?: string;
  notes?: string;
  patient?: { _id?: string; patientId?: string; name?: string } | string;
};

type BackendVisit = {
  _id: string;
  visitId?: string;
  patient?: { _id?: string; patientId?: string; name?: string } | string;
  visitDate?: string;
  charges?: { total?: number };
  eyeExamination?: {
    rightEye?: {
      sph?: number | string;
      cyl?: number | string;
      axis?: number | string;
      va?: string;
      add?: number | string;
    };
    leftEye?: {
      sph?: number | string;
      cyl?: number | string;
      axis?: number | string;
      va?: string;
      add?: number | string;
    };
    remarks?: string;
  };
  medicines?: Array<{
    medicineName?: string;
    quantity?: number;
    totalPrice?: number;
    dosage?: string;
    frequency?: string;
    duration?: string;
  }>;
};

type BackendOrder = {
  _id: string;
  orderId?: string;
  patient?: { _id?: string; patientId?: string; name?: string } | string;
  createdAt?: string;
  totalAmount?: number;
  advanceAmount?: number;
  status?: "ORDERED" | "IN_PROCESS" | "READY" | "DELIVERED" | "CANCELLED";
};

type DashboardSummary = {
  todayPatients?: number;
  todayCollection?: number;
  weeklyCollection?: number;
  monthlyCollection?: number;
  pendingDue?: number;
  spectacleOrders?: Record<string, number>;
};

const AUTH_STORAGE_KEY = "eye-shop-session";
const USER_STORAGE_KEY = "eye-shop-user";
const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_BASE_URL"]) ||
  "http://localhost:4000/api/v1";

const formatDateShort = (value?: string | number | Date) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const normalizeGender = (value?: string): Patient["gender"] => {
  switch (value) {
    case "MALE":
      return "Male";
    case "FEMALE":
      return "Female";
    case "OTHER":
    case "PREFER_NOT_TO_SAY":
      return "Other";
    default:
      return "Male";
  }
};

const normalizePaymentMethod = (value?: string): PaymentMethod => {
  switch (value) {
    case "CASH":
      return "Cash";
    case "UPI":
      return "UPI";
    case "CARD":
      return "Card";
    case "OTHER":
      return "Other";
    default:
      return "Cash";
  }
};

const normalizeOrderStatus = (value?: string): OrderStatus => {
  switch (value) {
    case "ORDERED":
      return "Ordered";
    case "IN_PROCESS":
      return "In Process";
    case "READY":
      return "Ready";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Ordered";
  }
};

const normalizeVisitStatus = (value?: number): PaymentStatus => {
  if (value === 0) return "Paid";
  return "Pending";
};

const getStorageValue = (key: string) => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
};

const setStorageValue = (key: string, value: string | null) => {
  if (typeof window === "undefined") return;
  if (value === null) {
    window.localStorage.removeItem(key);
    return;
  }
  window.localStorage.setItem(key, value);
};

export const getAuthToken = () => getStorageValue(AUTH_STORAGE_KEY);
export const getCurrentUser = () => {
  const raw = getStorageValue(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { name?: string; email?: string };
  } catch {
    return null;
  }
};

export const setAuthSession = (token: string, user: unknown) => {
  setStorageValue(AUTH_STORAGE_KEY, token);
  setStorageValue(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  setStorageValue(AUTH_STORAGE_KEY, null);
  setStorageValue(USER_STORAGE_KEY, null);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-session-cleared"));
  }
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields: Array<{ field: string; message: string }> = [],
  ) {
    super(message);
  }
}

export const apiRequest = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);
  const body = payload as ApiEnvelope<T> | { message?: string; data?: T } | null;

  if (!response.ok || (body && "success" in body && body.success === false)) {
    const message = body?.message || "Request failed.";
    if (response.status === 401) {
      clearAuthSession();
    }
    throw new ApiRequestError(
      message,
      response.status,
      Array.isArray(payload?.errors) ? payload.errors : [],
    );
  }

  return (body && "data" in body ? body.data : body) as T;
};

export const loginToDashboard = async (email: string, password: string) => {
  const payload = await apiRequest<{ token: string; user: { name: string; email: string } }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );
  setAuthSession(payload.token, payload.user);
  return payload;
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const payload = await apiRequest<{
    todayPatients: number;
    todayCollection: number;
    weeklyCollection: number;
    monthlyCollection: number;
    pendingDue: number;
    spectacleOrders: Record<string, number>;
  }>("/dashboard/summary");
  return payload;
};

export const fetchPatients = async (search = ""): Promise<Patient[]> => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const payload = await apiRequest<Array<BackendPatient>>(`/patients${query}`);
  return payload.map((patient) => ({
    id: patient.patientId || patient._id,
    name: patient.name || "Unknown patient",
    mobile: patient.mobile || "—",
    age: patient.age || 0,
    gender: normalizeGender(patient.gender),
    lastVisit: "—",
    due: patient.paymentSummary?.due ?? 0,
    latestPower: "—",
    activeOrder: "None",
  }));
};

export const fetchPatientById = async (id: string): Promise<Patient> => {
  const payload = await apiRequest<BackendPatient>(`/patients/${id}`);
  return {
    id: payload.patientId || id,
    name: payload.name || "Unknown patient",
    mobile: payload.mobile || "—",
    age: payload.age || 0,
    gender: normalizeGender(payload.gender),
    lastVisit: "—",
    due: payload.paymentSummary?.due ?? 0,
    latestPower: "—",
    activeOrder: "None",
  };
};

export const fetchPayments = async (): Promise<Payment[]> => {
  const payload = await apiRequest<Array<BackendPayment>>("/payments");
  return payload.map((payment) => {
    const patient = typeof payment.patient === "string" ? null : payment.patient;
    return {
      id: payment.paymentId || payment._id,
      patient: patient?.name || "Unknown patient",
      patientId: patient?.patientId || payment.patient?.toString() || "—",
      date: formatDateShort(payment.paymentDate),
      amount: Number(payment.amount || 0),
      method: normalizePaymentMethod(payment.paymentMethod),
      ...(payment.referenceNumber ? { reference: payment.referenceNumber } : {}),
      ...(payment.notes ? { note: payment.notes } : {}),
    };
  });
};

export const fetchMedicines = async (): Promise<Medicine[]> => {
  const payload = await apiRequest<
    Array<{
      _id: string;
      name: string;
      genericName?: string;
      unit?: string;
      defaultPrice?: number;
      isActive?: boolean;
    }>
  >("/medicines");
  return payload.map((medicine) => ({
    id: medicine._id,
    name: medicine.name,
    generic: medicine.genericName || "—",
    unit: medicine.unit || "—",
    price: Number(medicine.defaultPrice || 0),
    active: medicine.isActive !== false,
  }));
};

export const fetchVisits = async (): Promise<Visit[]> => {
  const payload = await apiRequest<Array<BackendVisit>>("/visits");
  return payload.map((visit) => {
    const patient = typeof visit.patient === "string" ? null : visit.patient;
    return {
      id: visit.visitId || visit._id,
      patientId: patient?._id || visit.patient?.toString() || "—",
      patient: patient?.name || "Unknown patient",
      date: formatDateShort(visit.visitDate),
      type: "Eye Examination",
      amount: Number(visit.charges?.total || 0),
      status: normalizeVisitStatus(Number(visit.charges?.total || 0)),
      summary:
        visit.eyeExamination?.remarks ||
        visit.medicines?.map((item) => item.medicineName).join(", ") ||
        "Consultation recorded",
    };
  });
};

export const fetchOrders = async (): Promise<SpectacleOrder[]> => {
  const payload = await apiRequest<Array<BackendOrder>>("/spectacle-orders");
  return payload.map((order) => {
    const patient = typeof order.patient === "string" ? null : order.patient;
    return {
      id: order.orderId || order._id,
      patient: patient?.name || "Unknown patient",
      patientId: patient?.patientId || "—",
      date: formatDateShort(order.createdAt),
      total: Number(order.totalAmount || 0),
      paid: Number(order.advanceAmount || 0),
      status: normalizeOrderStatus(order.status),
    };
  });
};

export const fetchCollectionTrend = async (): Promise<ChartPoint[]> => {
  const payload = await apiRequest<{ trend?: Array<{ date: string; collection: number }> }>(
    "/reports/collection/weekly",
  );
  const trend = payload?.trend;
  if (!trend) return [];
  return trend.map((point) => ({
    label: new Date(point.date).toLocaleDateString("en-US", { weekday: "short" }),
    value: Number(point.collection || 0),
  }));
};

export const fetchSettings = async () => apiRequest<Record<string, unknown>>("/settings");

export const formatCurrency = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(value)}`;
export const getStatusClass = (status: string) =>
  `status-chip status-${status.toLowerCase().replaceAll(" ", "-")}`;
