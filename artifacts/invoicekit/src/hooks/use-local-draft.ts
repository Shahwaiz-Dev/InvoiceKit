import { useCallback, useEffect, useRef } from "react";
import type { InvoiceData } from "@/lib/schema";

const DRAFT_KEY = "invoicekit_draft";
const DRAFT_TEMPLATE_KEY = "invoicekit_draft_template";
const DEBOUNCE_MS = 800;

/**
 * Bump this number whenever the InvoiceData schema changes shape.
 * Stale drafts written with an older version are automatically discarded
 * instead of causing hydration errors or silently corrupting form state.
 * Rule: client-localstorage-schema
 */
const DRAFT_VERSION = 2;

type StoredDraft = {
  v: number;
  data: InvoiceData;
  template: string;
};

export function useLocalDraft() {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveDraft = useCallback((data: InvoiceData, template: string) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const payload: StoredDraft = { v: DRAFT_VERSION, data, template };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage errors (e.g. private browsing quota exceeded)
      }
    }, DEBOUNCE_MS);
  }, []);

  const loadDraft = useCallback((): { data: InvoiceData; template: string } | null => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredDraft;
      // Discard stale drafts that were saved with an incompatible schema version
      if (parsed.v !== DRAFT_VERSION) {
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }
      return { data: parsed.data, template: parsed.template ?? "clean" };
    } catch {
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }, []);

  const hasDraft = useCallback((): boolean => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as StoredDraft;
      // Only report a draft if it matches the current schema version
      return parsed.v === DRAFT_VERSION;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return { saveDraft, loadDraft, clearDraft, hasDraft };
}

