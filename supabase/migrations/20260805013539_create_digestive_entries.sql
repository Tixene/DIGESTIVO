/*
# Create digestive_entries table (single-tenant, no auth)

1. New Tables
- `digestive_entries`
  - `id` (uuid, primary key)
  - `entry_date` (date, the day the meal/symptoms were logged)
  - `meal_type` (text: desayuno, almuerzo, cena, snacks)
  - `foods` (text, what the user ate)
  - `bloating` (boolean, hinchazón/distensión)
  - `pain` (boolean, dolor abdominal)
  - `reflux` (boolean, reflujo)
  - `gas` (boolean, gases)
  - `bristol_type` (smallint 1-7 or null, Bristol stool scale)
  - `intensity` (smallint 1-10, discomfort level)
  - `notes` (text, optional)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `digestive_entries`.
- Allow anon + authenticated CRUD (single-tenant, no sign-in, intentionally shared).
*/

CREATE TABLE IF NOT EXISTS digestive_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL CHECK (meal_type IN ('desayuno','almuerzo','cena','snacks')),
  foods text NOT NULL DEFAULT '',
  bloating boolean NOT NULL DEFAULT false,
  pain boolean NOT NULL DEFAULT false,
  reflux boolean NOT NULL DEFAULT false,
  gas boolean NOT NULL DEFAULT false,
  bristol_type smallint CHECK (bristol_type IS NULL OR (bristol_type >= 1 AND bristol_type <= 7)),
  intensity smallint NOT NULL DEFAULT 1 CHECK (intensity >= 1 AND intensity <= 10),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_digestive_entries_date ON digestive_entries(entry_date DESC);

ALTER TABLE digestive_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_entries" ON digestive_entries;
CREATE POLICY "anon_select_entries" ON digestive_entries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_entries" ON digestive_entries;
CREATE POLICY "anon_insert_entries" ON digestive_entries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_entries" ON digestive_entries;
CREATE POLICY "anon_update_entries" ON digestive_entries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_entries" ON digestive_entries;
CREATE POLICY "anon_delete_entries" ON digestive_entries FOR DELETE
  TO anon, authenticated USING (true);
