-- Initial schema migration
-- Users table
CREATE TYPE "user_role" AS ENUM('admin', 'user', 'moderator');

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) UNIQUE NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"avatar" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Subscriptions table
CREATE TYPE "subscription_status" AS ENUM('active', 'canceled', 'past_due', 'unpaid');
CREATE TYPE "subscription_plan" AS ENUM('free', 'basic', 'pro', 'enterprise');

CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"plan" "subscription_plan" DEFAULT 'free' NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"price_id" varchar(255),
	"amount" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'usd',
	"interval" varchar(20),
	"interval_count" integer DEFAULT 1,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"canceled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Foreign key constraints
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;

-- Indexes for better performance
CREATE INDEX "users_email_idx" ON "users" ("email");
CREATE INDEX "users_role_idx" ON "users" ("role");
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" ("user_id");
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" ("status");
CREATE INDEX "subscriptions_stripe_customer_id_idx" ON "subscriptions" ("stripe_customer_id");