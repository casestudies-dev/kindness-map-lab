import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bwuavugkvvwtgjciobkl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dWF2dWdrdnZ3dGdqY2lvYmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTYwOTcsImV4cCI6MjA5MTY3MjA5N30.eXgNX4H4PTc8pO8vjs4VsxyrovaD6sLQLa9ehYcUmwU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
