CREATE TABLE "generation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"prompt" text NOT NULL,
	"style_reference" text NOT NULL,
	"image_url" text NOT NULL,
	"ip_hash" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"reported" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "generation_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "generation_slug_idx" ON "generation" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "generation_featured_created_at_idx" ON "generation" USING btree ("featured","created_at" DESC NULLS LAST);