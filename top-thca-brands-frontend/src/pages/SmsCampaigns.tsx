import { FormEvent, useState } from "react";
import { Shield, Download, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { submitContact } from "@/api/contactService";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LeadFormState = {
  name: string;
  email: string;
  brandName: string;
  website: string;
};

const INITIAL_LEAD_FORM: LeadFormState = {
  name: "",
  email: "",
  brandName: "",
  website: "",
};

const SmsCampaigns = () => {
  const [leadForm, setLeadForm] = useState<LeadFormState>(INITIAL_LEAD_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resourcesUnlocked, setResourcesUnlocked] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleLeadFormChange = (field: keyof LeadFormState, value: string) => {
    setLeadForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLeadFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.brandName) {
      toast({
        title: "Missing details",
        description: "Please provide your name, email, and brand name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContact({
        name: leadForm.name,
        email: leadForm.email,
        brandName: leadForm.brandName,
        website: leadForm.website,
        message:
          "7 Dispensary SMS Campaigns playbook requested. Please follow up about product-led retention.",
      });

      toast({
        title: "Playbook unlocked",
        description:
          "Download the SMS campaign swipe file below. We’ll follow up shortly.",
      });
      setResourcesUnlocked(true);
      setLeadForm(INITIAL_LEAD_FORM);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "We couldn’t process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-thca-white flex flex-col">
      <header className="border-b border-thca-grey/30 bg-thca-black/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-3 text-thca-white">
            <Shield className="h-7 w-7 text-thca-red" />
            <span className="font-display text-xl font-semibold tracking-tight">
              TOP<span className="text-thca-red">THCA</span>
            </span>
          </Link>
          <span className="text-xs uppercase tracking-[0.3em] text-thca-white/40">
            Resources
          </span>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <section className="rounded-3xl border border-thca-grey/20 bg-gradient-to-br from-[#2a2c33] via-[#202229] to-[#14161c] p-8 shadow-[0_45px_140px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-thca-white/40">
                Swipe file
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-thca-red/40 bg-thca-red/10 px-4 py-1 text-xs font-semibold text-thca-red">
                <MessageCircle className="h-3.5 w-3.5" />
                SMS Ready
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold text-thca-white md:text-5xl">
              7 Proven Dispensary SMS Campaigns
            </h1>
            <p className="mt-4 text-base leading-7 text-thca-white/80">
              Tried-and-tested texts that fill slow hours, re-engage lapsed
              shoppers, and boost loyalty. Copy, paste, edit the brackets, and
              press send.
            </p>

            <div className="mt-8 grid gap-4 text-sm text-thca-white/75">
              <ResourceHighlight
                title="Ready-to-launch scripts"
                description="Templates for win-backs, flash promos, VIP access, birthdays, and more."
              />
              <ResourceHighlight
                title="Compliance checklist"
                description="Built-in reminders for opt-out language, quiet hours, and segmentation."
              />
              <ResourceHighlight
                title="Timing cheat sheet"
                description="Know exactly when to schedule each message for maximum lift."
              />
            </div>

            <div className="mt-10 rounded-2xl border border-thca-grey/15 bg-white/[0.08] p-6 shadow-[0_25px_90px_rgba(0,0,0,0.5)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-thca-white/70">
                Sample copy
              </p>
              <div className="mt-4 grid gap-5">
                {SAMPLE_CAMPAIGNS.map((campaign) => (
                  <SampleCampaign key={campaign.title} {...campaign} />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDownloadDialogOpen(true)}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-thca-red/60 bg-thca-red/15 px-6 py-3 text-sm font-semibold text-thca-red transition hover:bg-thca-red/25 focus:outline-none focus:ring-2 focus:ring-thca-red/50 focus:ring-offset-2 focus:ring-offset-[#14161c]"
            >
              <Download className="h-4 w-4" />
              Unlock the full PDF
            </button>

            <Dialog
              open={isDownloadDialogOpen}
              onOpenChange={setIsDownloadDialogOpen}
            >
              <DialogContent className="border-thca-grey/20 bg-gradient-to-b from-[#25272e] to-[#1b1d23] text-thca-white">
                {resourcesUnlocked ? (
                  <div className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>Downloads unlocked</DialogTitle>
                      <DialogDescription className="text-thca-white/70">
                        Save the SMS playbook and start plugging it into your
                        loyalty flows.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <a
                        href="/TopTHCABrands_7_Dispensary_SMS_Campaigns.pdf"
                        download
                        onClick={() => setIsDownloadDialogOpen(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-thca-grey/30 bg-thca-white/5 px-5 py-3 text-sm font-semibold text-thca-white transition hover:border-thca-gold/60 hover:text-thca-gold"
                      >
                        <Download className="h-4 w-4" />
                        Download SMS playbook (PDF)
                      </a>
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-thca-white/40">
                      GreenLoop App Audit update coming soon
                    </p>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleLeadFormSubmit}>
                    <DialogHeader>
                      <DialogTitle>Unlock your playbook</DialogTitle>
                      <DialogDescription className="text-thca-white/70">
                        Drop your info and we’ll instantly unlock the PDF. We’ll
                        also send the GreenLoop audit note when it’s live.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <LabelledInput
                        label="Your name"
                        required
                        value={leadForm.name}
                        onChange={(value) => handleLeadFormChange("name", value)}
                        placeholder="Jordan Example"
                      />
                      <LabelledInput
                        label="Work email"
                        required
                        type="email"
                        value={leadForm.email}
                        onChange={(value) =>
                          handleLeadFormChange("email", value)
                        }
                        placeholder="you@dispensary.com"
                      />
                      <LabelledInput
                        label="Brand or dispensary"
                        required
                        value={leadForm.brandName}
                        onChange={(value) =>
                          handleLeadFormChange("brandName", value)
                        }
                        placeholder="Summit Collective"
                      />
                      <LabelledInput
                        label="Website (optional)"
                        value={leadForm.website}
                        onChange={(value) =>
                          handleLeadFormChange("website", value)
                        }
                        placeholder="https://yourstore.com"
                      />
                    </div>
                    <DialogFooter>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full bg-thca-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-thca-red/90 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Unlock download"}
                      </button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </section>

          <section>
            <div className="rounded-3xl border border-thca-grey/20 bg-gradient-to-b from-[#282a30] via-[#1f2127] to-[#17191f] p-8 shadow-[0_0_120px_rgba(255,0,0,0.1)]">
              <p className="text-xs uppercase tracking-[0.4em] text-thca-red">
                Free resource
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold text-thca-white md:text-5xl">
                Fuel orders on autopilot
              </h2>
              <p className="mt-6 text-base leading-7 text-thca-white/80">
                Your push notification strategy is only half the story. These
                seven SMS sequences help you retarget app installs, remind
                shoppers when to reorder, and beat quiet hours—without sounding
                spammy.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-thca-white/75">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-4 w-4 text-thca-gold" />
                  <p>
                    Every script includes CTA, urgency, and compliant opt-out
                    language.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-4 w-4 text-thca-gold" />
                  <p>
                    Designed for dispensaries launching or scaling mobile app
                    retention programs.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-4 w-4 text-thca-gold" />
                  <p>
                    Pair it with the Dispensary Retention Calculator to model
                    the impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-thca-grey/20 bg-gradient-to-b from-[#25272e] to-[#1b1d23] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
              <h3 className="font-display text-xl font-semibold text-thca-white">
                Get the playbook
              </h3>
              <p className="mt-3 text-sm text-thca-white/70">
                Tell us who you are and we’ll email when the GreenLoop App Audit
                is ready. You can download the SMS playbook right away.
              </p>
              <form className="mt-6 grid gap-5" onSubmit={handleLeadFormSubmit}>
                <LabelledInput
                  label="Your name"
                  required
                  value={leadForm.name}
                  onChange={(value) => handleLeadFormChange("name", value)}
                  placeholder="Jordan Example"
                />
                <LabelledInput
                  label="Work email"
                  required
                  type="email"
                  value={leadForm.email}
                  onChange={(value) => handleLeadFormChange("email", value)}
                  placeholder="you@dispensary.com"
                />
                <LabelledInput
                  label="Brand or dispensary"
                  required
                  value={leadForm.brandName}
                  onChange={(value) => handleLeadFormChange("brandName", value)}
                  placeholder="Summit Collective"
                />
                <LabelledInput
                  label="Website (optional)"
                  value={leadForm.website}
                  onChange={(value) => handleLeadFormChange("website", value)}
                  placeholder="https://yourstore.com"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-thca-red px-6 py-3 font-semibold text-white transition hover:bg-thca-red/90 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send me the playbook"}
                </button>
              </form>
              {resourcesUnlocked ? (
                <div className="mt-6 space-y-3 rounded-2xl border border-thca-grey/20 bg-gradient-to-r from-[#22232a] to-[#1a1b21] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
                  <p className="text-sm font-semibold text-thca-gold">
                    Resources ready
                  </p>
                  <div className="grid gap-3">
                    <a
                      href="/TopTHCABrands_7_Dispensary_SMS_Campaigns.pdf"
                      download
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-thca-grey/30 bg-thca-white/5 px-5 py-3 text-sm font-semibold text-thca-white transition hover:border-thca-gold/60 hover:text-thca-gold"
                    >
                      <Download className="h-4 w-4" />
                      Download SMS playbook (PDF)
                    </a>
                    <span className="inline-flex items-center justify-center rounded-full border border-dashed border-thca-grey/40 px-5 py-3 text-sm font-medium text-thca-white/50">
                      GreenLoop App Audit link coming soon
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-xs uppercase tracking-[0.3em] text-thca-white/30">
                  Unlocks after submission
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-thca-grey/20 bg-thca-black/80 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 text-xs text-thca-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} Top THCA Brands</span>
          <span className="uppercase tracking-[0.3em] text-thca-white/50">
            THCA Elite Scene
          </span>
        </div>
      </footer>
    </div>
  );
};

const ResourceHighlight = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3">
    <span className="mt-1 h-2 w-2 rounded-full bg-thca-red"></span>
    <div>
      <p className="text-sm font-semibold text-thca-white">{title}</p>
      <p className="text-sm text-thca-white/70">{description}</p>
    </div>
  </div>
);

const SampleCampaign = ({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) => (
  <div className="rounded-2xl border border-thca-grey/20 bg-white/[0.12] p-5">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-thca-white/60">
      {title}
    </p>
    <p className="mt-3 whitespace-pre-line font-mono text-sm text-thca-white/80">
      {copy}
    </p>
  </div>
);

const SAMPLE_CAMPAIGNS = [
  {
    title: "Win-Back (30-day lapse)",
    copy:
      "[Store]: We’ve got a bag with your name on it. Come back this week for [10% off any order] with code [WELCOME10]. Ends Sun. Order ahead: [shortlink]",
  },
  {
    title: "VIP Early Access",
    copy:
      "[Store VIP]: Two-hour early access to [Limited Drop] + [free pickup]. Claim before doors open: [shortlink]",
  },
  {
    title: "Slow-Hour Flash",
    copy:
      "[Store]: Fill the 2-5 PM dip: [BOGO carts] today only. Skip the line, order ahead: [shortlink]",
  },
] as const;

const LabelledInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) => (
  <label className="block">
    <span className="text-xs uppercase tracking-[0.3em] text-thca-white/60">
      {label}
      {required ? " *" : ""}
    </span>
    <input
      className="mt-2 w-full rounded-xl border border-thca-grey/20 bg-white/[0.12] px-4 py-3 text-sm text-thca-white placeholder:text-thca-white/40 focus:border-thca-gold focus:outline-none focus:ring-1 focus:ring-thca-gold/60"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      required={required}
    />
  </label>
);

export default SmsCampaigns;

