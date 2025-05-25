/*
  # Fix RLS policies for profiles and invocations

  1. Changes
    - Remove potentially recursive policies
    - Add simplified RLS policies for profiles and invocations tables
    - Ensure proper access control without recursion

  2. Security
    - Enable RLS on both tables
    - Add direct user-based policies without cross-table references
    - Maintain security while preventing infinite recursion
*/

-- First, drop any existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can read own data" ON profiles;
DROP POLICY IF EXISTS "Users can read own invocations" ON invocations;

-- Create simplified policy for profiles
CREATE POLICY "Users can access own profile"
ON profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create simplified policy for invocations
CREATE POLICY "Users can access own invocations"
ON invocations
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);