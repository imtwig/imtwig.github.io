import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectRatio?: string;
}

const ImageUpload = ({ value, onChange, folder = "general", className = "", aspectRatio = "aspect-video" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("cms-images").upload(path, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded!");
  };

  return (
    <div className={`relative ${className}`}>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {value ? (
        <div className={`relative rounded-lg overflow-hidden border border-border ${aspectRatio}`}>
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => inputRef.current?.click()} disabled={uploading}>
              <ImagePlus className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => onChange("")}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`w-full ${aspectRatio} rounded-lg border-2 border-dashed border-border hover:border-accent/50 bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground transition-colors cursor-pointer`}
        >
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
          <span className="text-xs">{uploading ? "Uploading..." : "Click to upload"}</span>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
