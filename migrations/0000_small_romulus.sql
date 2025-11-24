CREATE TABLE "confirmed_weeks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_start" date NOT NULL,
	CONSTRAINT "confirmed_weeks_week_start_unique" UNIQUE("week_start")
);
--> statement-breakpoint
CREATE TABLE "hourly_rates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rate" text DEFAULT '35' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"start_time" text,
	"end_time" text,
	"skipped" boolean DEFAULT false
);
