
-- Create a security definer function to safely get user data without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT auth.uid();
$$;

-- Drop and recreate the profiles policies using the security definer function
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Create simple policies that don't cause recursion
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (id = public.get_current_user_id());

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (id = public.get_current_user_id());

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (id = public.get_current_user_id());

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO anon;
