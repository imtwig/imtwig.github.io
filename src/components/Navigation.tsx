import { NavLink } from "@/components/NavLink";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "UX Case Studies", path: "/case-studies" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="text-xl font-semibold text-foreground">
            Portfolio
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground font-medium"
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="block text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
