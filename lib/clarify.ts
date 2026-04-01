export type RequiredSettings = {
  requireQueenSeen?: boolean;
  requireBroodFrames?: boolean;
  requireHoneyFrames?: boolean;
  requireTemperament?: boolean;
  requireNotes?: boolean;
};

export type InspectionLike = {
  queenSeen?: boolean | null;
  broodFrames?: number | null;
  honeyFrames?: number | null;
  temperament?: string | null;
  notes?: string | null;
};

export function getMissingQuestions(
  data: InspectionLike,
  settings?: RequiredSettings | null
): string[] {
  const questions: string[] = [];
  if (!settings) return questions;

  if (settings.requireQueenSeen && data.queenSeen === undefined) {
    questions.push("Wurde die Königin gesehen?");
  }

  if (
    settings.requireBroodFrames &&
    (data.broodFrames === undefined || data.broodFrames === null)
  ) {
    questions.push("Wie viele Brutwaben wurden gesehen?");
  }

  if (
    settings.requireHoneyFrames &&
    (data.honeyFrames === undefined || data.honeyFrames === null)
  ) {
    questions.push("Wie viele Honigwaben wurden gesehen?");
  }

  if (settings.requireTemperament && !data.temperament) {
    questions.push("Wie war das Verhalten des Volkes?");
  }

  if (settings.requireNotes && !data.notes) {
    questions.push("Bitte ergänze eine kurze Notiz.");
  }

  return questions;
}
