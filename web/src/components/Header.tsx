import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import ContactForm from "@/components/ContactForm";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Articles", to: "/articles" },
] as const;

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="mb-12 flex items-center justify-between border-b border-border pb-5">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary transition-colors group-hover:bg-primary/90">
            <span className="font-heading text-sm font-bold text-primary-foreground">AI</span>
          </div>
          <div>
            <span className="font-heading text-base font-semibold tracking-tight text-foreground">
              National AI Assessment Framework
            </span>
            <p className="text-[11px] text-muted-foreground tracking-wide">
              Evidence-based policy intelligence
            </p>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-md px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest transition-colors",
                pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to))
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Separator orientation="vertical" className="hidden h-5 sm:block" />
        <ContactForm />
      </div>
    </header>
  );
};

export default Header;
