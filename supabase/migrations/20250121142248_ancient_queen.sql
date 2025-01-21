/*
  # Initial Schema Setup for Todo Points App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `total_points` (integer)
      - `current_rank` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `todos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `points` (integer)
      - `due_date` (timestamp)
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  total_points integer DEFAULT 0,
  current_rank text DEFAULT 'AI Novice',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  title text NOT NULL,
  points integer NOT NULL,
  due_date timestamptz NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Todos policies
CREATE POLICY "Users can CRUD own todos"
  ON todos FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically calculate points
CREATE OR REPLACE FUNCTION check_overdue_todos() RETURNS void AS $$
BEGIN
  UPDATE profiles p
  SET total_points = total_points - t.points
  FROM todos t
  WHERE t.user_id = p.id
    AND NOT t.completed
    AND t.due_date < NOW() - INTERVAL '2 days';
END;
$$ LANGUAGE plpgsql;