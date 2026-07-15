export const INSTALL_PROMPT_DISMISS_KEY = "uclaSportsMri.installPrompt.dismissed";
export const INSTALL_PROMPT_REMINDER_MS = 7 * 24 * 60 * 60 * 1000;

type InstallPromptStorage = Pick<Storage, "getItem" | "setItem">;

export function isInstallPromptDismissed(
  storage?: InstallPromptStorage,
  now = Date.now(),
) {
  try {
    const target = storage ?? (typeof localStorage === "undefined" ? undefined : localStorage);
    if (!target) return false;
    const dismissedAt = Number(target.getItem(INSTALL_PROMPT_DISMISS_KEY));
    const age = now - dismissedAt;
    return Number.isFinite(dismissedAt) && dismissedAt > 0 && age >= 0 && age < INSTALL_PROMPT_REMINDER_MS;
  } catch {
    return false;
  }
}
