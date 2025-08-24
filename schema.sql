


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."booking_status" AS ENUM (
    'pending',
    'confirmed',
    'canceled',
    'completed'
);


ALTER TYPE "public"."booking_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_status" AS ENUM (
    'pending',
    'done',
    'no_payment'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_type" AS ENUM (
    'online',
    'cash'
);


ALTER TYPE "public"."payment_type" OWNER TO "postgres";


CREATE TYPE "public"."service_type" AS ENUM (
    'accommodation',
    'culinary experiences',
    'Tours and Activities',
    'Aesthetic and Well-being Services'
);


ALTER TYPE "public"."service_type" OWNER TO "postgres";


COMMENT ON TYPE "public"."service_type" IS 'service type for the services table';



CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'business',
    'customer'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'auth'
    AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at, display_name)
  VALUES (NEW.id, NEW.email, NOW(), NOW(), NEW.display_name);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "admin_id" "uuid",
    "action" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "service_id" "uuid" NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "booking_date" timestamp without time zone NOT NULL,
    "time_slot_start" timestamp without time zone NOT NULL,
    "time_slot_end" timestamp without time zone NOT NULL,
    "special_request" "text",
    "payment_status" "public"."payment_status",
    "status" "public"."booking_status" DEFAULT 'pending'::"public"."booking_status",
    "validation_status" "text" DEFAULT 'pending'::"text",
    "service_options" "text"[],
    CONSTRAINT "bookings_validation_status_check" CHECK (("validation_status" = ANY (ARRAY['pending'::"text", 'provider_validated'::"text", 'customer_validated'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."disputes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid",
    "user_id" "uuid",
    "provider_id" "uuid",
    "reason" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "resolved_at" timestamp without time zone,
    CONSTRAINT "disputes_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'resolved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."disputes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "message" "text" NOT NULL,
    "is_read" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "booking_id" "uuid",
    "service_provider_id" "uuid",
    "type" "text" DEFAULT 'booking'::"text",
    "expires_at" timestamp without time zone,
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['booking'::"text", 'payment'::"text", 'dispute'::"text", 'reminder'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_transactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "amount" numeric NOT NULL,
    "payment_method" "json",
    "transaction_date" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "booking_id" "uuid",
    "customer_id" "uuid",
    "provider_id" "uuid",
    "payment_status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status" NOT NULL,
    "commission" numeric DEFAULT 0 NOT NULL,
    "net_amount" numeric GENERATED ALWAYS AS (("amount" - "commission")) STORED,
    "commission_retrieved" boolean DEFAULT false,
    "payment_type" "public"."payment_type" DEFAULT 'online'::"public"."payment_type"
);


ALTER TABLE "public"."payment_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."provider_locations" (
    "location_id" "uuid" NOT NULL,
    "provider_id" "uuid" NOT NULL,
    "address" "text" NOT NULL,
    "coordinates" "json",
    "contact_info" "json",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."provider_locations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."provider_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "provider_id" "uuid",
    "plan_id" "uuid",
    "start_date" timestamp without time zone DEFAULT "now"() NOT NULL,
    "end_date" timestamp without time zone NOT NULL,
    "status" "text" DEFAULT 'active'::"text",
    "auto_renew" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "trial_end_date" timestamp without time zone,
    "grace_end_date" timestamp without time zone,
    CONSTRAINT "provider_subscriptions_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'canceled'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."provider_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."refunds" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "payment_id" "uuid",
    "amount" numeric NOT NULL,
    "reason" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "processed_at" timestamp without time zone,
    "costumer_id" "uuid" NOT NULL,
    CONSTRAINT "refunds_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processed'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."refunds" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."review" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "service_id" "uuid",
    "customer_id" "uuid",
    "review" integer NOT NULL,
    "review_text" character varying(255),
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."review" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_categories" (
    "category_id" "uuid" NOT NULL,
    "sector_id" "uuid",
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."service_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_options" (
    "option_id" "uuid" NOT NULL,
    "service_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "price" numeric NOT NULL,
    "duration" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."service_options" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_providers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "company_id" "uuid",
    "name" character varying(255) NOT NULL,
    "description" "text",
    "location" "json",
    "contact_info" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "business_name" character varying(255) NOT NULL,
    "user_id" "uuid",
    "service_id" "uuid"
);


ALTER TABLE "public"."service_providers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_sectors" (
    "sector_id" "uuid" NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."service_sectors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."services" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "price" numeric(10,2),
    "duration_minutes" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "service_name" "text",
    "service_type" "public"."service_type",
    "availability" "json",
    "location" character varying(255) NOT NULL,
    "photos" "json"[],
    "provider_id" "uuid",
    "category_id" "uuid",
    "date" "date",
    "commission_rate" numeric DEFAULT 10.0
);


ALTER TABLE "public"."services" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "features" "json" NOT NULL,
    "duration_days" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."subscription_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "name" "text",
    "phone_number" "text",
    "profile_picture" "text",
    "payment_methods" "json",
    "email" character varying(255) NOT NULL,
    "preferences" "json",
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wish_list" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "service_id" "uuid",
    "customer_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."wish_list" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_logs"
    ADD CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."disputes"
    ADD CONSTRAINT "disputes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."provider_locations"
    ADD CONSTRAINT "provider_locations_pkey" PRIMARY KEY ("location_id");



ALTER TABLE ONLY "public"."provider_subscriptions"
    ADD CONSTRAINT "provider_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."refunds"
    ADD CONSTRAINT "refunds_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "reservations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "review_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_categories"
    ADD CONSTRAINT "service_categories_pkey" PRIMARY KEY ("category_id");



ALTER TABLE ONLY "public"."service_options"
    ADD CONSTRAINT "service_options_pkey" PRIMARY KEY ("option_id");



ALTER TABLE ONLY "public"."service_sectors"
    ADD CONSTRAINT "service_sectors_pkey" PRIMARY KEY ("sector_id");



ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_providers"
    ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "unique_email" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_phone_number_key" UNIQUE ("phone_number");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wish_list"
    ADD CONSTRAINT "wish_list_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_notifications_booking_id" ON "public"."notifications" USING "btree" ("booking_id");



CREATE INDEX "idx_notifications_service_provider_id" ON "public"."notifications" USING "btree" ("service_provider_id");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_service_type" ON "public"."services" USING "btree" ("service_type");



CREATE INDEX "idx_service_type_price" ON "public"."services" USING "btree" ("service_type", "price");



CREATE INDEX "provider_locations_provider_id_idx" ON "public"."provider_locations" USING "btree" ("provider_id");



CREATE INDEX "service_categories_sector_id_idx" ON "public"."service_categories" USING "btree" ("sector_id");



CREATE INDEX "service_options_service_id_idx" ON "public"."service_options" USING "btree" ("service_id");



CREATE INDEX "services_category_id_idx" ON "public"."services" USING "btree" ("category_id");



ALTER TABLE ONLY "public"."admin_logs"
    ADD CONSTRAINT "admin_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."disputes"
    ADD CONSTRAINT "disputes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."disputes"
    ADD CONSTRAINT "disputes_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."disputes"
    ADD CONSTRAINT "disputes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."provider_locations"
    ADD CONSTRAINT "provider_locations_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."provider_subscriptions"
    ADD CONSTRAINT "provider_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."provider_subscriptions"
    ADD CONSTRAINT "provider_subscriptions_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."refunds"
    ADD CONSTRAINT "refunds_costumer_id_fkey" FOREIGN KEY ("costumer_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."refunds"
    ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."payment_transactions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wish_list"
    ADD CONSTRAINT "reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "reservations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "reservations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wish_list"
    ADD CONSTRAINT "reservations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_categories"
    ADD CONSTRAINT "service_categories_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "public"."service_sectors"("sector_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_options"
    ADD CONSTRAINT "service_options_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_providers"
    ADD CONSTRAINT "service_providers_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_providers"
    ADD CONSTRAINT "service_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("category_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "transaction_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "transaction_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "transaction_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_auth_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Authenticated users can delete their own disputes" ON "public"."disputes" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Authenticated users can delete their own provider locations" ON "public"."provider_locations" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "provider_id"));



CREATE POLICY "Authenticated users can delete their own refunds" ON "public"."refunds" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "costumer_id"));



CREATE POLICY "Authenticated users can delete their own reviews" ON "public"."review" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "customer_id"));



CREATE POLICY "Authenticated users can delete their own wish list items" ON "public"."wish_list" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "customer_id"));



CREATE POLICY "Authenticated users can insert disputes" ON "public"."disputes" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert provider locations" ON "public"."provider_locations" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert refunds" ON "public"."refunds" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert reviews" ON "public"."review" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert service categories" ON "public"."service_categories" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert service categories" ON "public"."service_options" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert service categories" ON "public"."service_sectors" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert wish list items" ON "public"."wish_list" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can select all reviews" ON "public"."review" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can select service categories" ON "public"."service_categories" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can select service categories" ON "public"."service_options" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can select service categories" ON "public"."service_sectors" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can select their own disputes" ON "public"."disputes" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Authenticated users can select their own provider locations" ON "public"."provider_locations" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "provider_id"));



CREATE POLICY "Authenticated users can select their own refunds" ON "public"."refunds" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "costumer_id"));



CREATE POLICY "Authenticated users can select their own wish list items" ON "public"."wish_list" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "customer_id"));



CREATE POLICY "Authenticated users can update their own disputes" ON "public"."disputes" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK (true);



CREATE POLICY "Authenticated users can update their own provider locations" ON "public"."provider_locations" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "provider_id")) WITH CHECK (true);



CREATE POLICY "Authenticated users can update their own refunds" ON "public"."refunds" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "costumer_id")) WITH CHECK (true);



CREATE POLICY "Authenticated users can update their own reviews" ON "public"."review" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "customer_id")) WITH CHECK (true);



CREATE POLICY "Authenticated users can update their own wish list items" ON "public"."wish_list" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "customer_id")) WITH CHECK (true);



CREATE POLICY "Providers can manage their profile" ON "public"."service_providers" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own profile" ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can delete their own profile" ON "public"."users" FOR DELETE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can read their own profile" ON "public"."users" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own profile" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "admin_full_access_logs" ON "public"."admin_logs" USING (("auth"."role"() = 'admin'::"text"));



CREATE POLICY "admin_full_access_notifications" ON "public"."notifications" USING (("auth"."role"() = 'admin'::"text"));



CREATE POLICY "admin_full_access_reservations" ON "public"."bookings" USING (("auth"."role"() = 'admin'::"text"));



CREATE POLICY "admin_full_access_services" ON "public"."services" USING (("auth"."role"() = 'admin'::"text"));



CREATE POLICY "admin_full_access_stores" ON "public"."service_providers" USING (("auth"."role"() = 'admin'::"text"));



ALTER TABLE "public"."admin_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "allow_own_notifications" ON "public"."notifications" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "allow_own_reservations" ON "public"."bookings" USING (("customer_id" = "auth"."uid"()));



ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."disputes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."provider_locations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."provider_subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."refunds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."review" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_options" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_sectors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscription_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wish_list" ENABLE ROW LEVEL SECURITY;


-- Step 1.1: Create an ENUM type for staff status
CREATE TYPE public.staff_status AS ENUM (
    'pending_invitation',
    'active',
    'inactive'
);

-- Step 1.2: Create the main "staff" table
-- This table links a user account (auth.users) to a service provider.
CREATE TABLE public.staff (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    provider_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status public.staff_status DEFAULT 'pending_invitation'::public.staff_status NOT NULL,
    -- Using a text array for permissions is flexible. You can add more roles later.
    -- Example: {'manage_bookings', 'view_schedule', 'edit_services'}
    permissions text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,

    CONSTRAINT staff_pkey PRIMARY KEY (id),
    -- Foreign key to the service_providers table (the employer)
    CONSTRAINT staff_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE,
    -- Foreign key to the auth.users table (the staff member's login)
    CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    -- A user can only be a staff member for a specific provider once
    CONSTRAINT staff_provider_user_unique UNIQUE (provider_id, user_id)
);

COMMENT ON TABLE public.staff IS 'Stores staff members who work for a service provider.';
COMMENT ON COLUMN public.staff.permissions IS 'Defines what actions this staff member is allowed to perform.';


-- Step 1.3: Create the "staff_assignments" join table
-- This is where a provider assigns a staff member to a specific service at a specific location.
CREATE TABLE public.staff_assignments (
    staff_id uuid NOT NULL,
    service_id uuid NOT NULL,
    location_id uuid NOT NULL,
    assigned_at timestamp with time zone DEFAULT now() NOT NULL,

    -- A staff member can only be assigned to a service/location combination once
    CONSTRAINT staff_assignments_pkey PRIMARY KEY (staff_id, service_id, location_id),
    -- When a staff record is deleted, remove their assignments
    CONSTRAINT staff_assignments_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE,
    -- When a service is deleted, remove any staff assignments to it
    CONSTRAINT staff_assignments_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE,
    -- When a location is deleted, remove any staff assignments there
    CONSTRAINT staff_assignments_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.provider_locations(location_id) ON DELETE CASCADE
);

COMMENT ON TABLE public.staff_assignments IS 'Links staff members to specific services and locations they are allowed to manage.';

-- Step 1.4: Enable Row Level Security on the new tables
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;


ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



























GRANT ALL ON TABLE "public"."admin_logs" TO "anon";
GRANT ALL ON TABLE "public"."admin_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_logs" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON TABLE "public"."disputes" TO "anon";
GRANT ALL ON TABLE "public"."disputes" TO "authenticated";
GRANT ALL ON TABLE "public"."disputes" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."payment_transactions" TO "anon";
GRANT ALL ON TABLE "public"."payment_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."provider_locations" TO "anon";
GRANT ALL ON TABLE "public"."provider_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."provider_locations" TO "service_role";



GRANT ALL ON TABLE "public"."provider_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."provider_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."provider_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."refunds" TO "anon";
GRANT ALL ON TABLE "public"."refunds" TO "authenticated";
GRANT ALL ON TABLE "public"."refunds" TO "service_role";



GRANT ALL ON TABLE "public"."review" TO "anon";
GRANT ALL ON TABLE "public"."review" TO "authenticated";
GRANT ALL ON TABLE "public"."review" TO "service_role";



GRANT ALL ON TABLE "public"."service_categories" TO "anon";
GRANT ALL ON TABLE "public"."service_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."service_categories" TO "service_role";



GRANT ALL ON TABLE "public"."service_options" TO "anon";
GRANT ALL ON TABLE "public"."service_options" TO "authenticated";
GRANT ALL ON TABLE "public"."service_options" TO "service_role";



GRANT ALL ON TABLE "public"."service_providers" TO "anon";
GRANT ALL ON TABLE "public"."service_providers" TO "authenticated";
GRANT ALL ON TABLE "public"."service_providers" TO "service_role";



GRANT ALL ON TABLE "public"."service_sectors" TO "anon";
GRANT ALL ON TABLE "public"."service_sectors" TO "authenticated";
GRANT ALL ON TABLE "public"."service_sectors" TO "service_role";



GRANT ALL ON TABLE "public"."services" TO "anon";
GRANT ALL ON TABLE "public"."services" TO "authenticated";
GRANT ALL ON TABLE "public"."services" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_plans" TO "anon";
GRANT ALL ON TABLE "public"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_plans" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."wish_list" TO "anon";
GRANT ALL ON TABLE "public"."wish_list" TO "authenticated";
GRANT ALL ON TABLE "public"."wish_list" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
