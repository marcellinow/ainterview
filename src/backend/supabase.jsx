import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ffqmshntftrbvolsudtt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcW1zaG50ZnRyYnZvbHN1ZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDM3ODgsImV4cCI6MjA1MDE3OTc4OH0.29Slsj3k-osTaU3A8SwSQw8Suho0rJ-TXZjISum_Pjc";
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
