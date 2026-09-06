/**
 * NOTE: This file was NOT part of the pasted reference source. It's
 * reconstructed only enough to satisfy the imports used in
 * authController.js and server.js (`getBranchSubscriptionStatus`,
 * `ensureDefaultPlans`). Replace with your actual implementation.
 */

const { prisma } = require("../config/dbConnect");

/**
 * Determines whether a branch's trial/subscription has expired.
 * @param {object} branch - the Branch record (needs createdAt)
 * @param {object|null} latestSubscription - most recent RestaurantSubscription row, with `plan` included
 * @returns {{ is_expired: boolean }}
 */
function getBranchSubscriptionStatus(branch, latestSubscription) {
  if (!branch) {
    return { is_expired: false };
  }

  if (latestSubscription) {
    const now = new Date();
    const isActiveStatus =
      latestSubscription.status === "active" || latestSubscription.status === "trial";
    const notExpiredByDate = new Date(latestSubscription.end_date) > now;
    return { is_expired: !(isActiveStatus && notExpiredByDate) };
  }

  // Fallback: no subscription row at all -> treat as expired trial.
  return { is_expired: true };
}

/**
 * Ensures the default subscription plans exist in the database.
 * Called once at server startup.
 */
async function ensureDefaultPlans() {
  const defaultPlans = [
    { name: "7-Day Trial", type: "free_trial", price: 0, duration_days: 7 },
    { name: "Monthly Basic", type: "monthly", price: 999, duration_days: 30 },
    { name: "Yearly Premium", type: "yearly", price: 9999, duration_days: 365 },
  ];

  for (const plan of defaultPlans) {
    const exists = await prisma.subscriptionPlan.findFirst({
      where: { name: plan.name },
    });
    if (!exists) {
      await prisma.subscriptionPlan.create({ data: plan });
    }
  }
}

module.exports = { getBranchSubscriptionStatus, ensureDefaultPlans };
