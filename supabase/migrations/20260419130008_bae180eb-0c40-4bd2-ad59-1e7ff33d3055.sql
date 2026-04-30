CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-visitor-report') THEN
    PERFORM cron.unschedule('weekly-visitor-report');
  END IF;
END $$;

SELECT cron.schedule(
  'weekly-visitor-report',
  '0 1 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://txgfubqeodypgveuispo.supabase.co/functions/v1/weekly-visitor-report',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Z2Z1YnFlb2R5cGd2ZXVpc3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjQyMTQsImV4cCI6MjA4OTUwMDIxNH0.7W0lbhFpq95XWSJzamaQ9JLMfxYQRvgtB6XA4y2IH7g"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);