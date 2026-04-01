"use client";

import { useCallback, useEffect, useState } from "react";
import { syncPendingActions } from "@/lib/offline-queue";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshPendingCount = useCallback(() => {
    try {
      const raw = localStorage.getItem("voicehive_pending_actions");
      if (!raw) {
        setPendingCount(0);
        return;
      }

      const items = JSON.parse(raw);
      setPendingCount(Array.isArray(items) ? items.length : 0);
    } catch {
      setPendingCount(0);
    }
  }, []);

  const manualSync = useCallback(async () => {
    if (!navigator.onLine) {
      return { synced: 0, failed: 0, skipped: true as const };
    }

    setIsSyncing(true);

    try {
      const result = await syncPendingActions();
      refreshPendingCount();
      return { ...result, skipped: false as const };
    } catch {
      refreshPendingCount();
      return { synced: 0, failed: 0, skipped: false as const };
    } finally {
      setIsSyncing(false);
    }
  }, [refreshPendingCount]);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const handleQueueUpdated = () => {
      refreshPendingCount();
    };

    const handleOnlineAutoSync = async () => {
      updateOnlineStatus();

      const raw = localStorage.getItem("voicehive_pending_actions");
      if (!raw) return;

      try {
        const items = JSON.parse(raw);
        if (!Array.isArray(items) || items.length === 0) {
          refreshPendingCount();
          return;
        }
      } catch {
        refreshPendingCount();
        return;
      }

      setIsSyncing(true);

      try {
        await syncPendingActions();
        refreshPendingCount();
      } catch {
        refreshPendingCount();
      } finally {
        setIsSyncing(false);
      }
    };

    updateOnlineStatus();
    refreshPendingCount();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("online", handleOnlineAutoSync);
    window.addEventListener("voicehive-queue-updated", handleQueueUpdated);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("online", handleOnlineAutoSync);
      window.removeEventListener("voicehive-queue-updated", handleQueueUpdated);
    };
  }, [refreshPendingCount]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    manualSync,
    refreshPendingCount,
  };
}
