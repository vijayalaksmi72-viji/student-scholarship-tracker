// ============================================================
// daysWaiting.js
// Calculates the number of days an application has been
// waiting since it was applied, unless it has reached a
// terminal stage (Disbursed / Rejected) in which case the
// count freezes at the "last_updated" date.
// ============================================================

const TERMINAL_STAGES = ['Disbursed', 'Rejected'];

function calculateDaysWaiting(appliedDate, stage, lastUpdated) {
  if (!appliedDate) return null;

  const start = new Date(appliedDate);
  if (isNaN(start.getTime())) return null;

  let end;
  if (TERMINAL_STAGES.includes(stage) && lastUpdated) {
    const candidate = new Date(lastUpdated);
    end = isNaN(candidate.getTime()) ? new Date() : candidate;
  } else {
    end = new Date();
  }

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  return diffDays;
}

module.exports = { calculateDaysWaiting, TERMINAL_STAGES };
