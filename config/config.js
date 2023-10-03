console.log("Initialisierung Supabase");

// Supabase Initialisierung
const supabaseUrl = 'https://jgsdufgupzaeyojoffks.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnc2R1Zmd1cHphZXlvam9mZmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMzY4NzgsImV4cCI6MjAxMTkxMjg3OH0.YfdlhuCABrQW3NaruJKYt8wOPyEa-agFgjHHQFuK6fE'
const supa = supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        redirectTo: window.location.origin,  // This will redirect back to the page where the request originated from
    },
});

export { supa }