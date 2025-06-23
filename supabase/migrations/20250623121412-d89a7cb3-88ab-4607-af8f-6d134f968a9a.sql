
-- First, let's drop ALL existing policies on all tables to start fresh
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Drop all existing policies on other tables
DROP POLICY IF EXISTS "Enable read access for own invocations" ON invocations;
DROP POLICY IF EXISTS "Enable insert for own invocations" ON invocations;
DROP POLICY IF EXISTS "Enable update for own invocations" ON invocations;
DROP POLICY IF EXISTS "Users can view own invocations" ON invocations;
DROP POLICY IF EXISTS "Users can insert own invocations" ON invocations;
DROP POLICY IF EXISTS "Users can update own invocations" ON invocations;

DROP POLICY IF EXISTS "Users can view own usage logs" ON usage_logs;
DROP POLICY IF EXISTS "Users can insert own usage logs" ON usage_logs;
DROP POLICY IF EXISTS "Users can view their own usage_logs" ON usage_logs;
DROP POLICY IF EXISTS "Users can insert their own usage_logs" ON usage_logs;

DROP POLICY IF EXISTS "Users can view own billing" ON billing;
DROP POLICY IF EXISTS "Users can update own billing" ON billing;
DROP POLICY IF EXISTS "Users can view their own billing" ON billing;
DROP POLICY IF EXISTS "Users can update their own billing" ON billing;

DROP POLICY IF EXISTS "Users can view own orchestrations" ON orchestrations;
DROP POLICY IF EXISTS "Users can insert own orchestrations" ON orchestrations;
DROP POLICY IF EXISTS "Users can update own orchestrations" ON orchestrations;
DROP POLICY IF EXISTS "Users can view their own orchestrations" ON orchestrations;
DROP POLICY IF EXISTS "Users can insert their own orchestrations" ON orchestrations;
DROP POLICY IF EXISTS "Users can update their own orchestrations" ON orchestrations;

-- Now create clean, simple policies for all tables
-- Profiles policies
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Usage logs policies
CREATE POLICY "usage_logs_select_policy" ON usage_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "usage_logs_insert_policy" ON usage_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Billing policies
CREATE POLICY "billing_select_policy" ON billing
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "billing_update_policy" ON billing
    FOR UPDATE USING (auth.uid() = user_id);

-- Invocations policies
CREATE POLICY "invocations_select_policy" ON invocations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "invocations_insert_policy" ON invocations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invocations_update_policy" ON invocations
    FOR UPDATE USING (auth.uid() = user_id);

-- Orchestrations policies
CREATE POLICY "orchestrations_select_policy" ON orchestrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orchestrations_insert_policy" ON orchestrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orchestrations_update_policy" ON orchestrations
    FOR UPDATE USING (auth.uid() = user_id);
