import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Briefcase, GraduationCap, Lightbulb, Rocket, Users, Award,
  Star, Heart, Code, Palette, Globe, BookOpen, Zap, Target,
  Trophy, Flag, MapPin, Camera, Music, Mic, PenTool, Layout,
  Monitor, Smartphone, Coffee, Compass, Layers, Settings,
  CheckCircle, TrendingUp,
} from "lucide-react";

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  Briefcase, GraduationCap, Lightbulb, Rocket, Users, Award,
  Star, Heart, Code, Palette, Globe, BookOpen, Zap, Target,
  Trophy, Flag, MapPin, Camera, Music, Mic, PenTool, Layout,
  Monitor, Smartphone, Coffee, Compass, Layers, Settings,
  CheckCircle, TrendingUp,
};

export const ICON_MAP = ICONS;

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const SelectedIcon = ICONS[value] || Briefcase;
  const filtered = Object.keys(ICONS).filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SelectedIcon className="w-4 h-4" />
          <span className="text-xs">{value || "Pick icon"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <Input
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2 h-8 text-sm"
        />
        <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
          {filtered.map((name) => {
            const Icon = ICONS[name];
            return (
              <button
                key={name}
                onClick={() => { onChange(name); setOpen(false); }}
                className={`p-2 rounded hover:bg-accent/20 transition-colors ${value === name ? "bg-accent/20 ring-1 ring-accent" : ""}`}
                title={name}
              >
                <Icon className="w-4 h-4 mx-auto" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
