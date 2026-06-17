export type ReminderType = "J-3" | "J0" | "J+7" | "J+14" | "J+30";

// Décalage en jours par rapport à la date d'échéance (positif = avant, négatif = après)
const REMINDER_OFFSETS: Record<ReminderType, number> = {
  "J-3": 3,
  "J0": 0,
  "J+7": -7,
  "J+14": -14,
  "J+30": -30,
};

export function getDueReminderType(
  due_date: string,
  today: string,
): ReminderType | null {
  const diffDays = Math.round(
    (new Date(due_date).getTime() - new Date(today).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  for (const [type, offset] of Object.entries(REMINDER_OFFSETS)) {
    if (diffDays === offset) {
      return type as ReminderType;
    }
  }

  return null;
}
