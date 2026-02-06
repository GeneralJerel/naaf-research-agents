import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

const CreateReportDialog = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) return;
    setOpen(false);
    navigate(`/research/${encodeURIComponent(country.trim())}`);
    setCountry("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Create Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Create Country Report</DialogTitle>
          <DialogDescription>
            Enter a country name to generate an AI readiness assessment across all 8 layers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            placeholder="e.g. France, Brazil, Nigeria..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={!country.trim()} className="w-full">
            Start Research
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportDialog;
