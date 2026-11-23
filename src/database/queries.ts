import db from "./db";

// ==================== RENEWAL TASKS ====================

export interface RenewalTask {
  id: number;
  title: string;
  frequency_days: number;
  last_executed_at: string | null;
  next_due_at: string;
  reminder_time: string | null;
}

// 1. Fetch all renewal tasks
export function getRenewalTasks(): RenewalTask[] {
  try {
    const result = db.getAllSync(
      "SELECT * FROM renewal_tasks ORDER BY next_due_at ASC",
    );
    return result as RenewalTask[];
  } catch (error) {
    console.error("Error fetching renewal tasks:", error);
    return [];
  }
}

// 2. Insert a new renewal task
export function createRenewalTask(
  title: string,
  frequencyDays: number,
  nextDueAt: string,
  reminderTime: string,
) {
  try {
    const statement = db.prepareSync(
      "INSERT INTO renewal_tasks (title, frequency_days, next_due_at, reminder_time) VALUES (?, ?, ?, ?)",
    );
    statement.executeSync([title, frequencyDays, nextDueAt, reminderTime]);
    statement.finalizeSync();
    console.log("Renewal task created successfully");
  } catch (error) {
    console.error("Error creating renewal task:", error);
  }
}

// 3. Mark renewal task as completed (updates last execution & calculates next due date dynamically)
export function executeRenewalTask(id: number, frequencyDays: number) {
  try {
    const now = new Date();
    const lastExecutedStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

    // Calculate next due date: Today + frequency_days
    const nextDueDate = new Date();
    nextDueDate.setDate(now.getDate() + frequencyDays);
    const nextDueStr = nextDueDate.toISOString().split("T")[0];

    const statement = db.prepareSync(
      "UPDATE renewal_tasks SET last_executed_at = ?, next_due_at = ? WHERE id = ?",
    );
    statement.executeSync([lastExecutedStr, nextDueStr, id]);
    statement.finalizeSync();
    console.log(`Renewal task ${id} executed and rescheduled.`);
  } catch (error) {
    console.error("Error executing renewal task:", error);
  }
}

// ==================== DAILY HABITS ====================

export interface Habit {
  id: number;
  title: string;
  scheduled_time: string; // e.g., "18:30"
  is_active: number;
}

export interface HabitChecklistStep {
  id: number;
  habit_id: number;
  step_name: string;
  sort_order: number;
}

// 1. Fetch all active habits
export function getHabits(): Habit[] {
  try {
    const result = db.getAllSync(
      "SELECT * FROM habits WHERE is_active = 1 ORDER BY scheduled_time ASC",
    );
    return result as Habit[];
  } catch (error) {
    console.error("Error fetching habits:", error);
    return [];
  }
}

// 2. Create a new habit with checklist steps
export function createHabit(
  title: string,
  scheduledTime: string,
  steps: string[],
) {
  try {
    // Insert habit
    const habitStmt = db.prepareSync(
      "INSERT INTO habits (title, scheduled_time) VALUES (?, ?)",
    );
    const habitResult = habitStmt.executeSync([title, scheduledTime]);
    const habitId = habitResult.lastInsertRowId;
    habitStmt.finalizeSync();

    // Insert checklist steps
    steps.forEach((stepName, index) => {
      const stepStmt = db.prepareSync(
        "INSERT INTO habit_checklist_items (habit_id, step_name, sort_order) VALUES (?, ?, ?)",
      );
      stepStmt.executeSync([habitId, stepName, index]);
      stepStmt.finalizeSync();
    });

    console.log("Habit and checklist steps created successfully.");
  } catch (error) {
    console.error("Error creating habit:", error);
  }
}

// 3. Get checklist items for a specific habit
export function getHabitChecklist(habitId: number): HabitChecklistStep[] {
  try {
    const result = db.getAllSync(
      "SELECT * FROM habit_checklist_items WHERE habit_id = ? ORDER BY sort_order ASC",
      [habitId],
    );
    return result as HabitChecklistStep[];
  } catch (error) {
    console.error("Error fetching checklist:", error);
    return [];
  }
}

// 4. Complete a habit for today
export function finishHabitLog(habitId: number, dateStr: string) {
  try {
    const statement = db.prepareSync(
      "INSERT INTO habit_logs (habit_id, date, status, finished_at) VALUES (?, ?, ?, ?)",
    );
    const nowTime = new Date().toLocaleTimeString();
    statement.executeSync([habitId, dateStr, "completed", nowTime]);
    statement.finalizeSync();
    console.log(`Habit ${habitId} marked completed for ${dateStr}`);
  } catch (error) {
    console.error("Error finishing habit log:", error);
  }
}

// Check if a habit was completed on a specific date (YYYY-MM-DD)
export function isHabitCompletedToday(
  habitId: number,
  dateStr: string,
): boolean {
  try {
    const result = db.getFirstSync(
      'SELECT COUNT(*) as count FROM habit_logs WHERE habit_id = ? AND date = ? AND status = "completed"',
      [habitId, dateStr],
    ) as { count: number };
    return result.count > 0;
  } catch (error) {
    console.error("Error checking habit completion:", error);
    return false;
  }
}

// Calculate current streak for a habit (consecutive days backward from today)
export function getHabitStreak(habitId: number): number {
  try {
    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const completed = isHabitCompletedToday(habitId, dateStr);

      if (completed) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1); // Move to previous day
      } else {
        // If today isn't completed yet, check if yesterday was completed to keep streak alive
        if (
          streak === 0 &&
          dateStr === new Date().toISOString().split("T")[0]
        ) {
          currentDate.setDate(currentDate.getDate() - 1);
          const yesterdayStr = currentDate.toISOString().split("T")[0];
          if (isHabitCompletedToday(habitId, yesterdayStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }
    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
}

// 1. Delete a renewal task by ID
export function deleteRenewalTask(id: number) {
  try {
    const statement = db.prepareSync("DELETE FROM renewal_tasks WHERE id = ?");
    statement.executeSync([id]);
    statement.finalizeSync();
    console.log(`Renewal task ${id} deleted.`);
  } catch (error) {
    console.error("Error deleting renewal task:", error);
  }
}

// 2. Delete a habit (and cascade delete checklist items and logs)
export function deleteHabit(id: number) {
  try {
    const statement = db.prepareSync("DELETE FROM habits WHERE id = ?");
    statement.executeSync([id]);
    statement.finalizeSync();
    console.log(`Habit ${id} deleted.`);
  } catch (error) {
    console.error("Error deleting habit:", error);
  }
}

// 1. Get single renewal task by ID
export function getRenewalTaskById(id: number): RenewalTask | null {
  try {
    return db.getFirstSync("SELECT * FROM renewal_tasks WHERE id = ?", [
      id,
    ]) as RenewalTask | null;
  } catch (error) {
    console.error("Error fetching renewal task:", error);
    return null;
  }
}

// 2. Update renewal task
export function updateRenewalTask(
  id: number,
  title: string,
  frequencyDays: number,
) {
  try {
    const statement = db.prepareSync(
      "UPDATE renewal_tasks SET title = ?, frequency_days = ? WHERE id = ?",
    );
    statement.executeSync([title, frequencyDays, id]);
    statement.finalizeSync();
  } catch (error) {
    console.error("Error updating renewal task:", error);
  }
}

// 3. Get single habit by ID
export function getHabitById(id: number): Habit | null {
  try {
    return db.getFirstSync("SELECT * FROM habits WHERE id = ?", [
      id,
    ]) as Habit | null;
  } catch (error) {
    console.error("Error fetching habit:", error);
    return null;
  }
}

// 4. Update habit
export function updateHabit(id: number, title: string, scheduledTime: string) {
  try {
    const statement = db.prepareSync(
      "UPDATE habits SET title = ?, scheduled_time = ? WHERE id = ?",
    );
    statement.executeSync([title, scheduledTime, id]);
    statement.finalizeSync();
  } catch (error) {
    console.error("Error updating habit:", error);
  }
}
