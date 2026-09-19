import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://blwskzwzfqcflaxpescm.supabase.co";
const supabaseKey = "sb_publishable_Fn0e51hzGgAAOeP6TSYuoA_838eyAvN";

export const supabase = createClient(supabaseUrl, supabaseKey);
