export type ParsedVoiceInput = {
  name?: string;
  location?: string;
  inspectedAt?: string;
  broodFrames?: number;
  honeyFrames?: number;
  queenSeen?: boolean;
  temperament?: string;
  notes?: string;
};

function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseGermanDate(text: string): string | undefined {
  const input = text.toLowerCase();

  if (input.includes("heute")) return formatDateISO(new Date());

  if (input.includes("gestern")) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatDateISO(d);
  }

  const numericMatch = input.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (numericMatch) {
    const day = Number(numericMatch[1]);
    const month = Number(numericMatch[2]) - 1;
    const year = Number(numericMatch[3]);
    return formatDateISO(new Date(year, month, day));
  }

  const monthNames: Record<string, number> = {
    januar: 0,
    februar: 1,
    märz: 2,
    maerz: 2,
    april: 3,
    mai: 4,
    juni: 5,
    juli: 6,
    august: 7,
    september: 8,
    oktober: 9,
    november: 10,
    dezember: 11,
  };

  const textMatch = input.match(
    /(?:am\s+)?(\d{1,2})\.\s*(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember)/i
  );

  if (textMatch) {
    const day = Number(textMatch[1]);
    const month = monthNames[textMatch[2].toLowerCase()];
    const year = new Date().getFullYear();
    return formatDateISO(new Date(year, month, day));
  }

  return undefined;
}

export function parseVoiceText(text: string): ParsedVoiceInput {
  const input = text.toLowerCase();
  const result: ParsedVoiceInput = {
    notes: text.trim(),
  };

  const parsedDate = parseGermanDate(text);
  if (parsedDate) result.inspectedAt = parsedDate;

  const volkMatch = text.match(/(volk\s*\d+)/i);
  if (volkMatch) result.name = volkMatch[1].trim();

  const standMatch = text.match(/stand\s+([a-zA-ZäöüÄÖÜß0-9\- ]+)/i);
  if (standMatch) result.location = standMatch[1].trim();

  const brutwabenMatch = input.match(/(\d+)\s*brutwaben?/);
  if (brutwabenMatch) result.broodFrames = Number(brutwabenMatch[1]);

  const honigwabenMatch = input.match(/(\d+)\s*honigwaben?/);
  if (honigwabenMatch) result.honeyFrames = Number(honigwabenMatch[1]);

  if (input.includes("königin nicht gesehen") || input.includes("koenigin nicht gesehen")) {
    result.queenSeen = false;
  } else if (input.includes("königin gesehen") || input.includes("koenigin gesehen")) {
    result.queenSeen = true;
  }

  if (input.includes("ruhig")) result.temperament = "ruhig";
  else if (input.includes("leicht nervös") || input.includes("leicht nervoes")) {
    result.temperament = "leicht nervös";
  } else if (input.includes("nervös") || input.includes("nervoes")) {
    result.temperament = "nervös";
  } else if (input.includes("aggressiv")) {
    result.temperament = "aggressiv";
  }

  return result;
}
