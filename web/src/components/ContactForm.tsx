import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const subject = encodeURIComponent(`NAAF Inquiry — ${form.organization || form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nOrganization: ${form.organization}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:contact@naaf.ai?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        setForm({ name: "", email: "", organization: "", message: "" });
        setStatus("idle");
        setOpen(false);
      }, 3000);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Contact Us</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden">
        <div className="border-b border-border px-6 pt-6 pb-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-heading text-lg font-bold tracking-tight">
              Contact Us
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              Reach our research team for inquiries on methodology, partnerships, or custom assessments.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          {status === "sent" ? (
            <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-5 text-center">
              <p className="text-sm font-medium text-foreground">
                Your email client has been opened.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Alternatively, write to us directly at contact@naaf.ai
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name" className="text-xs font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email" className="text-xs font-medium">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="jane@organization.gov"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-org" className="text-xs font-medium">
                  Organization
                </Label>
                <Input
                  id="contact-org"
                  placeholder="Ministry of Digital Affairs"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-message" className="text-xs font-medium">
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="Describe your inquiry or area of interest..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full"
              >
                {status === "sending" ? "Opening email client…" : "Send Inquiry"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
