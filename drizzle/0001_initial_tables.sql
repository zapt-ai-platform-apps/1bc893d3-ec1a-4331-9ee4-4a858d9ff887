CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "phone_number" TEXT,
  "user_type" TEXT NOT NULL,
  "profile_image_url" TEXT,
  "is_approved" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "hairstyles" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "image_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "hairdresser_profiles" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "has_paid_registration" BOOLEAN DEFAULT FALSE,
  "payment_date" TIMESTAMP,
  "payment_method" TEXT,
  "payment_reference" TEXT,
  "has_accepted_terms" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "hairdresser_hairstyles" (
  "id" SERIAL PRIMARY KEY,
  "hairdresser_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "hairstyle_id" INTEGER NOT NULL REFERENCES "hairstyles"("id") ON DELETE CASCADE,
  "price" DECIMAL(10, 2) NOT NULL,
  "portfolio_images" TEXT[],
  "created_at" TIMESTAMP DEFAULT NOW(),
  UNIQUE("hairdresser_id", "hairstyle_id")
);

CREATE TABLE IF NOT EXISTS "appointments" (
  "id" SERIAL PRIMARY KEY,
  "client_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "hairdresser_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "hairstyle_id" INTEGER NOT NULL REFERENCES "hairstyles"("id") ON DELETE CASCADE,
  "appointment_date" TIMESTAMP NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "total_price" DECIMAL(10, 2) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "transactions" (
  "id" SERIAL PRIMARY KEY,
  "transaction_type" TEXT NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "appointment_id" INTEGER REFERENCES "appointments"("id") ON DELETE SET NULL,
  "payment_method" TEXT NOT NULL,
  "payment_reference" TEXT,
  "platform_fee" DECIMAL(10, 2) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "client_profiles" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "has_accepted_terms" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW()
);