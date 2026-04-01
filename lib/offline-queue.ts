export type HiveInput = {
  name: string;
  location?: string;
  inspectedAt: string;
  broodFrames?: number;
  honeyFrames?: number;
  queenSeen?: boolean;
  temperament?: string;
  notes?: string;
};

export type PendingAction =
  | {
      id: string;
      type: "create";
      payload: HiveInput;
      createdAt: number;
    }
  | {
      id: string;
      type: "update";
      hiveId: string;
      payload: Partial<HiveInput>;
      createdAt: number;
    }
  | {
      id: string;
      type: "delete";
      hiveId: string;
      createdAt: number;
    };

const STORAGE_KEY = "voicehive_pending_actions";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function notifyQueueUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("voicehive-queue-updated"));
  }
}

export function getPendingActions(): PendingAction[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PendingAction[];
  } catch {
    return [];
  }
}

export function savePendingActions(actions: PendingAction[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  notifyQueueUpdated();
}

export function addPendingAction(action: PendingAction): void {
  const actions = getPendingActions();
  actions.push(action);
  savePendingActions(actions);
}

export function removePendingAction(actionId: string): void {
  const actions = getPendingActions().filter((a) => a.id !== actionId);
  savePendingActions(actions);
}

export function getPendingCount(): number {
  return getPendingActions().length;
}

export function createActionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function syncPendingActions(): Promise<{
  synced: number;
  failed: number;
}> {
  const actions = getPendingActions();
  let synced = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      let response: Response;

      if (action.type === "create") {
        response = await fetch("/api/voelker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.payload),
        });
      } else if (action.type === "update") {
        response = await fetch(`/api/voelker/${action.hiveId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.payload),
        });
      } else {
        response = await fetch(`/api/voelker/${action.hiveId}`, {
          method: "DELETE",
        });
      }

      if (!response.ok) {
        failed++;
        continue;
      }

      removePendingAction(action.id);
      synced++;
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}
