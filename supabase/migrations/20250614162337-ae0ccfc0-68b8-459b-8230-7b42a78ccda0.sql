
-- Drop the problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new, simpler policies that won't cause recursion
CREATE POLICY "Enable read access for users based on user_id" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Also fix any potential issues with other tables
DROP POLICY IF EXISTS "Users can view own invocations" ON invocations;
DROP POLICY IF EXISTS "Users can insert own invocations" ON invocations;
DROP POLICY IF EXISTS "Users can update own invocations" ON invocations;

-- Recreate invocations policies without recursion
CREATE POLICY "Enable read access for own invocations" ON invocations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own invocations" ON invocations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own invocations" ON invocations
    FOR UPDATE USING (auth.uid() = user_id);
