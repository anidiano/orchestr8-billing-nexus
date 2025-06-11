
-- First, let's fix the RLS policies and enable realtime for the tables

-- Drop existing problematic policies that might cause recursion
DROP POLICY IF EXISTS "Users can access own profile" ON profiles;
DROP POLICY IF EXISTS "Users can access own invocations" ON invocations;

-- Create proper RLS policies for profiles
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create RLS policies for invocations
CREATE POLICY "Users can view own invocations"
ON invocations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invocations"
ON invocations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invocations"
ON invocations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for usage_logs
CREATE POLICY "Users can view own usage logs"
ON usage_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs"
ON usage_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for billing
CREATE POLICY "Users can view own billing"
ON billing
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own billing"
ON billing
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for orchestrations
CREATE POLICY "Users can view own orchestrations"
ON orchestrations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orchestrations"
ON orchestrations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orchestrations"
ON orchestrations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for all tables
ALTER TABLE invocations REPLICA IDENTITY FULL;
ALTER TABLE usage_logs REPLICA IDENTITY FULL;
ALTER TABLE billing REPLICA IDENTITY FULL;
ALTER TABLE orchestrations REPLICA IDENTITY FULL;
ALTER TABLE profiles REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE invocations;
ALTER PUBLICATION supabase_realtime ADD TABLE usage_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE billing;
ALTER PUBLICATION supabase_realtime ADD TABLE orchestrations;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
