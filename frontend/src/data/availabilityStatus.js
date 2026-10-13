// Single source of truth for the "available this month" claim shown in
// AvailabilityBadge (hero chip + top bar). Edit the `status` value by hand
// whenever your real booking status changes — this file exists so the
// badge never quietly goes stale into a decorative, falsifiable claim.
//
// 'open'    — taking new projects, no near-term capacity limit to flag
// 'limited' — taking on a small, explicit number of new projects (set slotsLeft)
// 'closed'  — fully booked; next availability is a future month

const availabilityStatus = {
  status: 'limited',
  slotsLeft: 1,
  // Bump this whenever you change `status` or `slotsLeft`, so it's obvious
  // at a glance whether the claim above is still fresh.
  updatedOn: '2026-10-12',
};

export default availabilityStatus;
