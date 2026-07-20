CREATE TABLE "style" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"prompt" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"example_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "style" ("id", "name", "prompt", "active", "example_image_url") VALUES ('watercolor', 'Watercolor', 'The illustration style is a loose hand-painted watercolor food sketch with soft transparent washes, organic ink-like outlines, warm natural colors, expressive brush textures, subtle color bleeding, and a light blue-grey shadow on a clean white background.', true, NULL);
--> statement-breakpoint
ALTER TABLE "generation" ADD COLUMN "style" text DEFAULT 'watercolor' NOT NULL;--> statement-breakpoint
ALTER TABLE "generation" ADD CONSTRAINT "generation_style_style_id_fk" FOREIGN KEY ("style") REFERENCES "public"."style"("id") ON DELETE no action ON UPDATE no action;