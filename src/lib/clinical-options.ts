// These are recording options, not diagnostic or prescribing rules.
export const distanceVisionOptions = [
  ["PL+", "Light perception present"],
  ["PL-", "No light perception"],
  ["HM+", "Hand movement perceived"],
  ["HM-", "Hand movement not perceived"],
  ...[
    "1/60",
    "2/60",
    "3/60",
    "4/60",
    "5/60",
    "6/60",
    "6/36",
    "6/24",
    "6/18",
    "6/12",
    "6/9",
    "6/6",
  ].map((value) => [value, value]),
];
export const nearVisionOptions = ["N5", "N6", "N8", "N10", "N12", "N18", "N24", "N36"];
export const diagnosisOptions = ["Conjunctivitis", "Pterygium", "Cataract"];
export const symptomOptions = ["Redness", "Pain", "Watering", "Itching", "Blurred vision"];
export const eyeLabels = {
  OD: "Right eye (OD)",
  OS: "Left eye (OS)",
  OU: "Both eyes (OU)",
  NA: "Not applicable",
};
export type Diagnosis = {
  name: string;
  eye: "OD" | "OS" | "OU";
  status: "PROVISIONAL" | "CONFIRMED";
};
// Readable generic names only; verify the exact product/strength when prescribing.
export const medicineNameSuggestions = ["Carboxymethylcellulose sodium", "Moxifloxacin"];
