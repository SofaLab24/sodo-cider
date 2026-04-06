import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_status" AS ENUM('paid', 'pending', 'cancelled');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "cider_styles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ciders_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "ciders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"style_id" integer NOT NULL,
  	"short_description" varchar,
  	"long_description" jsonb,
  	"abv" numeric,
  	"volume_ml" numeric,
  	"tasting_notes" varchar,
  	"featured_image_id" integer,
  	"available" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "boxes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"price_eur" numeric NOT NULL,
  	"stripe_price_id" varchar,
  	"in_stock" boolean DEFAULT true,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "boxes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ciders_id" integer
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stripe_checkout_session_id" varchar NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'paid' NOT NULL,
  	"customer_email" varchar,
  	"amount_total_cents" numeric NOT NULL,
  	"currency" varchar DEFAULT 'eur',
  	"line_items" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"cider_styles_id" integer,
  	"ciders_id" integer,
  	"boxes_id" integer,
  	"orders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"instagram_url" varchar,
  	"facebook_url" varchar,
  	"site_name" varchar DEFAULT 'Sodo Sidrinė',
  	"nav_ciders_label" varchar DEFAULT 'Ciders',
  	"nav_shop_label" varchar DEFAULT 'Shop',
  	"nav_about_label" varchar DEFAULT 'About',
  	"nav_contact_label" varchar DEFAULT 'Contact',
  	"nav_cart_label" varchar DEFAULT 'Cart',
  	"meta_title_home" varchar,
  	"meta_description_home" varchar,
  	"meta_title_ciders" varchar,
  	"meta_description_ciders" varchar,
  	"meta_title_about" varchar,
  	"meta_description_about" varchar,
  	"meta_title_contact" varchar,
  	"meta_description_contact" varchar,
  	"meta_title_shop" varchar,
  	"meta_description_shop" varchar,
  	"meta_title_cart" varchar,
  	"meta_description_cart" varchar,
  	"meta_title_privacy" varchar,
  	"meta_description_privacy" varchar,
  	"meta_title_terms" varchar,
  	"meta_description_terms" varchar,
  	"meta_title_shipping" varchar,
  	"meta_description_shipping" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"hero_eyebrow" varchar DEFAULT 'Lithuanian cider',
  	"hero_heading" varchar DEFAULT 'From the orchard — into your glass',
  	"hero_lead" varchar DEFAULT 'We ferment what our orchards grow: clear flavours, no compromises on ingredients.',
  	"hero_extra_when_shop_enabled" varchar DEFAULT ' Choose individual ciders or ready-made gift boxes.',
  	"hero_extra_when_shop_disabled" varchar DEFAULT ' Browse the catalogue and get in touch for orders or questions.',
  	"cta_primary_shop_enabled" varchar DEFAULT 'Shop',
  	"cta_secondary_shop_enabled" varchar DEFAULT 'View ciders',
  	"cta_primary_shop_disabled" varchar DEFAULT 'View ciders',
  	"cta_secondary_shop_disabled" varchar DEFAULT 'Contact',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_home_featured_boxes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"featured_section_title" varchar DEFAULT 'Popular boxes',
  	"featured_section_subtitle" varchar DEFAULT 'Packed for shipping — easy to buy for yourself or give as a gift.',
  	"featured_section_link_text" varchar DEFAULT 'All boxes →',
  	"featured_box_button_label" varchar DEFAULT 'Details',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_home_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pillar1_title" varchar DEFAULT 'Local varieties',
  	"pillar1_body" varchar DEFAULT 'Apples and pears from our orchards',
  	"pillar2_title" varchar DEFAULT 'Transparent process',
  	"pillar2_body" varchar DEFAULT 'Fermentation and ageing without shortcuts',
  	"pillar3_title_when_shop_enabled" varchar DEFAULT 'Gift-ready boxes',
  	"pillar3_body_when_shop_enabled" varchar DEFAULT 'Packed and ready to give',
  	"pillar3_title_when_shop_disabled" varchar DEFAULT 'Contact & news',
  	"pillar3_link_text_when_shop_disabled" varchar DEFAULT 'Write to us',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The orchard that becomes cider',
  	"hero_image_id" integer,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Contact us',
  	"intro" jsonb,
  	"email" varchar,
  	"phone" varchar,
  	"address" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ciders_gallery" ADD CONSTRAINT "ciders_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ciders_gallery" ADD CONSTRAINT "ciders_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ciders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ciders" ADD CONSTRAINT "ciders_style_id_cider_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."cider_styles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ciders" ADD CONSTRAINT "ciders_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "boxes" ADD CONSTRAINT "boxes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "boxes_rels" ADD CONSTRAINT "boxes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boxes_rels" ADD CONSTRAINT "boxes_rels_ciders_fk" FOREIGN KEY ("ciders_id") REFERENCES "public"."ciders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cider_styles_fk" FOREIGN KEY ("cider_styles_id") REFERENCES "public"."cider_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ciders_fk" FOREIGN KEY ("ciders_id") REFERENCES "public"."ciders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_boxes_fk" FOREIGN KEY ("boxes_id") REFERENCES "public"."boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_home_hero" ADD CONSTRAINT "home_page_blocks_home_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_home_hero" ADD CONSTRAINT "home_page_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_home_featured_boxes" ADD CONSTRAINT "home_page_blocks_home_featured_boxes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_home_pillars" ADD CONSTRAINT "home_page_blocks_home_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "cider_styles_slug_idx" ON "cider_styles" USING btree ("slug");
  CREATE INDEX "cider_styles_updated_at_idx" ON "cider_styles" USING btree ("updated_at");
  CREATE INDEX "cider_styles_created_at_idx" ON "cider_styles" USING btree ("created_at");
  CREATE INDEX "ciders_gallery_order_idx" ON "ciders_gallery" USING btree ("_order");
  CREATE INDEX "ciders_gallery_parent_id_idx" ON "ciders_gallery" USING btree ("_parent_id");
  CREATE INDEX "ciders_gallery_image_idx" ON "ciders_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "ciders_slug_idx" ON "ciders" USING btree ("slug");
  CREATE INDEX "ciders_style_idx" ON "ciders" USING btree ("style_id");
  CREATE INDEX "ciders_featured_image_idx" ON "ciders" USING btree ("featured_image_id");
  CREATE INDEX "ciders_updated_at_idx" ON "ciders" USING btree ("updated_at");
  CREATE INDEX "ciders_created_at_idx" ON "ciders" USING btree ("created_at");
  CREATE UNIQUE INDEX "boxes_slug_idx" ON "boxes" USING btree ("slug");
  CREATE INDEX "boxes_image_idx" ON "boxes" USING btree ("image_id");
  CREATE INDEX "boxes_updated_at_idx" ON "boxes" USING btree ("updated_at");
  CREATE INDEX "boxes_created_at_idx" ON "boxes" USING btree ("created_at");
  CREATE INDEX "boxes_rels_order_idx" ON "boxes_rels" USING btree ("order");
  CREATE INDEX "boxes_rels_parent_idx" ON "boxes_rels" USING btree ("parent_id");
  CREATE INDEX "boxes_rels_path_idx" ON "boxes_rels" USING btree ("path");
  CREATE INDEX "boxes_rels_ciders_id_idx" ON "boxes_rels" USING btree ("ciders_id");
  CREATE UNIQUE INDEX "orders_stripe_checkout_session_id_idx" ON "orders" USING btree ("stripe_checkout_session_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_cider_styles_id_idx" ON "payload_locked_documents_rels" USING btree ("cider_styles_id");
  CREATE INDEX "payload_locked_documents_rels_ciders_id_idx" ON "payload_locked_documents_rels" USING btree ("ciders_id");
  CREATE INDEX "payload_locked_documents_rels_boxes_id_idx" ON "payload_locked_documents_rels" USING btree ("boxes_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_blocks_home_hero_order_idx" ON "home_page_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "home_page_blocks_home_hero_parent_id_idx" ON "home_page_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_home_hero_path_idx" ON "home_page_blocks_home_hero" USING btree ("_path");
  CREATE INDEX "home_page_blocks_home_hero_hero_image_idx" ON "home_page_blocks_home_hero" USING btree ("hero_image_id");
  CREATE INDEX "home_page_blocks_home_featured_boxes_order_idx" ON "home_page_blocks_home_featured_boxes" USING btree ("_order");
  CREATE INDEX "home_page_blocks_home_featured_boxes_parent_id_idx" ON "home_page_blocks_home_featured_boxes" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_home_featured_boxes_path_idx" ON "home_page_blocks_home_featured_boxes" USING btree ("_path");
  CREATE INDEX "home_page_blocks_home_pillars_order_idx" ON "home_page_blocks_home_pillars" USING btree ("_order");
  CREATE INDEX "home_page_blocks_home_pillars_parent_id_idx" ON "home_page_blocks_home_pillars" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_home_pillars_path_idx" ON "home_page_blocks_home_pillars" USING btree ("_path");
  CREATE INDEX "about_page_hero_image_idx" ON "about_page" USING btree ("hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "cider_styles" CASCADE;
  DROP TABLE "ciders_gallery" CASCADE;
  DROP TABLE "ciders" CASCADE;
  DROP TABLE "boxes" CASCADE;
  DROP TABLE "boxes_rels" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_page_blocks_home_hero" CASCADE;
  DROP TABLE "home_page_blocks_home_featured_boxes" CASCADE;
  DROP TABLE "home_page_blocks_home_pillars" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TYPE "public"."enum_orders_status";`)
}
