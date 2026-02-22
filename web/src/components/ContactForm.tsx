import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const subject = encodeURIComponent(`NAAF Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:contact@naaf.ai?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        setForm({ name: "", email: "", message: "" });
        setStatus("idle");
      }, 3000);
    }, 500);
  };

  return (
    <Card className="p-5">
      <h3 className="font-heading text-lg font-bold text-foreground mb-1">
        Get in Touch
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Questions about the framework or interested in collaboration? Send us a message.
      </p>

      {status === "sent" ? (
        <div className="rounded-md bg-primary/5 border border-primary/20 p-4 text-center">
          <p className="text-sm font-medium text-foreground">
            Your email client should have opened.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            If it didn't, you can reach us directly at contact@naaf.ai
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="text-sm h-9"
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="text-sm h-9"
            />
          </div>
          <Textarea
            placeholder="How can we help?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={3}
            className="text-sm resize-none"
          />
          <Button
            type="submit"
            size="sm"
            disabled={status === "sending"}
            className="w-full sm:w-auto"
          >
            {status === "sending" ? "Opening email…" : "Send Message"}
          </Button>
        </form>
      )}
    </Card>
  );
};

export default ContactForm;
