
-- Create storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true);

-- Allow public read access
CREATE POLICY "Public read access on cms-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'cms-images');

-- Allow public upload
CREATE POLICY "Public upload access on cms-images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'cms-images');

-- Allow public update
CREATE POLICY "Public update access on cms-images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'cms-images');

-- Allow public delete
CREATE POLICY "Public delete access on cms-images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'cms-images');
