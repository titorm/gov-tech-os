import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'unpaid',
]);

export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free',
  'basic',
  'pro',
  'enterprise',
]);

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  plan: subscriptionPlanEnum('plan').default('free').notNull(),
  status: subscriptionStatusEnum('status').default('active').notNull(),
  priceId: varchar('price_id', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('usd'),
  interval: varchar('interval', { length: 20 }),
  intervalCount: integer('interval_count').default(1),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  canceledAt: timestamp('canceled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;