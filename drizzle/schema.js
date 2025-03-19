import { pgTable, serial, uuid, text, boolean, timestamp, decimal, foreignKey, uniqueIndex, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phoneNumber: text('phone_number'),
  userType: text('user_type').notNull(),
  profileImageUrl: text('profile_image_url'),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const hairstyles = pgTable('hairstyles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow()
});

export const hairdresserProfiles = pgTable('hairdresser_profiles', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  hasPaidRegistration: boolean('has_paid_registration').default(false),
  paymentDate: timestamp('payment_date'),
  paymentMethod: text('payment_method'),
  paymentReference: text('payment_reference'),
  hasAcceptedTerms: boolean('has_accepted_terms').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const hairdresserHairstyles = pgTable('hairdresser_hairstyles', {
  id: serial('id').primaryKey(),
  hairdresserId: uuid('hairdresser_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  hairstyleId: integer('hairstyle_id').notNull().references(() => hairstyles.id, { onDelete: 'cascade' }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  portfolioImages: text('portfolio_images').array(),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => {
  return {
    hairdresserHairstyleUnique: uniqueIndex('hairdresser_hairstyle_unique').on(table.hairdresserId, table.hairstyleId)
  };
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  clientId: uuid('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  hairdresserId: uuid('hairdresser_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  hairstyleId: integer('hairstyle_id').notNull().references(() => hairstyles.id, { onDelete: 'cascade' }),
  appointmentDate: timestamp('appointment_date').notNull(),
  status: text('status').notNull().default('pending'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  transactionType: text('transaction_type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  appointmentId: integer('appointment_id').references(() => appointments.id, { onDelete: 'set null' }),
  paymentMethod: text('payment_method').notNull(),
  paymentReference: text('payment_reference'),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const clientProfiles = pgTable('client_profiles', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  hasAcceptedTerms: boolean('has_accepted_terms').default(false),
  createdAt: timestamp('created_at').defaultNow()
});