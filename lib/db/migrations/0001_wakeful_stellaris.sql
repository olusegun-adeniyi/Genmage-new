CREATE TABLE "daily_cost" (
	"date" date PRIMARY KEY NOT NULL,
	"amount_usd" numeric(6, 2) DEFAULT '0' NOT NULL
);
