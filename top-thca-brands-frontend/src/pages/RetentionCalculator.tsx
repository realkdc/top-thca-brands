import { FormEvent, useMemo, useState } from "react";
import { Shield, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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

type CalculatorInputs = {
  monthlyCustomers: string;
  averageOrderValue: string;
  currentRepeatRate: string;
  targetRepeatRate: string;
  margin: string;
};

type LeadFormState = {
  name: string;
  email: string;
  brandName: string;
  website: string;
};

const INITIAL_CALCULATOR_INPUTS: CalculatorInputs = {
  monthlyCustomers: "600",
  averageOrderValue: "45",
  currentRepeatRate: "18",
  targetRepeatRate: "32",
  margin: "48",
};

const INITIAL_LEAD_FORM: LeadFormState = {
  name: "",
  email: "",
  brandName: "",
  website: "",
};

const RetentionCalculator = () => {
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>(
    INITIAL_CALCULATOR_INPUTS
  );
  const [leadForm, setLeadForm] = useState<LeadFormState>(INITIAL_LEAD_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resourcesUnlocked, setResourcesUnlocked] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const { toast } = useToast();

  const { incrementalOrders, incrementalRevenue, incrementalProfit } =
    useMemo(() => {
      const monthlyCustomers = parseNumber(calculatorInputs.monthlyCustomers);
      const aov = parseNumber(calculatorInputs.averageOrderValue);
      const currentRepeatRate =
        parseNumber(calculatorInputs.currentRepeatRate) / 100;
      const targetRepeatRate =
        parseNumber(calculatorInputs.targetRepeatRate) / 100;
      const margin = parseNumber(calculatorInputs.margin) / 100;

      const rawIncrementalOrders =
        monthlyCustomers * Math.max(targetRepeatRate - currentRepeatRate, 0);
      const incrementalRevenue = rawIncrementalOrders * aov;
      const incrementalProfit = incrementalRevenue * margin;

      return {
        incrementalOrders: Math.max(rawIncrementalOrders, 0),
        incrementalRevenue: Math.max(incrementalRevenue, 0),
        incrementalProfit: Math.max(incrementalProfit, 0),
      };
    }, [calculatorInputs]);

  const handleCalculatorInputChange = (
    field: keyof CalculatorInputs,
    value: string
  ) => {
    setCalculatorInputs((prev) => ({
      ...prev,
      [field]: value.replace(/[^0-9.]/g, ""),
    }));
  };

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
        source: "retention-calculator",
        message:
          "Dispensary Retention Calculator requested. Please follow up regarding GreenLoop App Audit.",
      });

      toast({
        title: "Resources unlocked",
        description:
          "Download the calculator below. We’ll follow up with the GreenLoop App Audit shortly.",
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
    <>
      <Helmet>
        <title>Dispensary Retention Calculator - Top THCA Brands</title>
        <meta
          name="description"
          content="Calculate how much revenue you're leaving on the table without a customer retention app. Free 2-minute calculator to project your retention lift and extra profit."
        />
        <meta
          name="keywords"
          content="dispensary retention calculator, customer retention, repeat customers, dispensary revenue calculator, customer retention app"
        />
        
        {/* Open Graph / Facebook */}
        <meta
          property="og:title"
          content="Dispensary Retention Calculator - See Your Revenue Potential"
        />
        <meta
          property="og:description"
          content="Want to see the exact $$ you're leaving without an app? Our 2-min self-serve calculator shows your revenue potential from improved customer retention."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://topthcabrands.com/resources/retention-calculator"
        />
        <meta
          property="og:image"
          content="https://topthcabrands.com/og-image.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://topthcabrands.com/og-image.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Top THCA Brands" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Dispensary Retention Calculator"
        />
        <meta
          name="twitter:description"
          content="Calculate your revenue potential from improved customer retention. Free 2-minute calculator."
        />
        <meta
          name="twitter:image"
          content="https://topthcabrands.com/og-image.png"
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href="https://topthcabrands.com/resources/retention-calculator"
        />
      </Helmet>
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
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <section>
            <div className="rounded-3xl border border-thca-grey/20 bg-gradient-to-b from-[#282a30] via-[#1f2127] to-[#17191f] p-8 shadow-[0_0_120px_rgba(255,0,0,0.1)]">
              <p className="text-xs uppercase tracking-[0.4em] text-thca-red">
                Free resource
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold text-thca-white md:text-5xl">
                Dispensary Retention Calculator
              </h1>
              <p className="mt-6 text-base leading-7 text-thca-white/80">
                See how many extra orders and dollars you can win when more shoppers come back. Use this quick calculator, then grab the spreadsheet to customize it further.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-thca-white/75">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-thca-red"></span>
                  <p>We ask for: shoppers, average spend, repeat %, goal repeat %, margin.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-thca-gold/80"></span>
                  <p>
                    We show: extra orders, extra money, and extra profit each month.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-thca-grey"></span>
                  <p>
                    Drop your info to download the Excel sheet and get the GreenLoop App Audit update.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-thca-grey/20 bg-gradient-to-b from-[#25272e] to-[#1b1d23] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
              <h2 className="font-display text-xl font-semibold text-thca-white">
                Get the workbook
              </h2>
              <p className="mt-3 text-sm text-thca-white/70">
                Tell us who you are and we’ll email when the GreenLoop App Audit is ready. You can download the calculator right away.
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
                  {isSubmitting ? "Sending..." : "Send me the calculator"}
                </button>
              </form>
              {resourcesUnlocked ? (
                <div className="mt-6 space-y-3 rounded-2xl border border-thca-grey/20 bg-gradient-to-r from-[#22232a] to-[#1a1b21] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
                  <p className="text-sm font-semibold text-thca-gold">
                    Resources ready
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <a
                      href="/Dispensary_Retention_Calculator.xlsx"
                      download
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-thca-grey/30 bg-thca-white/5 px-5 py-3 text-sm font-semibold text-thca-white transition hover:border-thca-gold/60 hover:text-thca-gold"
                    >
                      <Download className="h-4 w-4" />
                      Download calculator
                    </a>
                    <a
                      href="/Retention_Calculator_Snapshot.pdf"
                      download
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-thca-grey/30 bg-thca-white/5 px-5 py-3 text-sm font-semibold text-thca-white transition hover:border-thca-gold/60 hover:text-thca-gold"
                    >
                      <Download className="h-4 w-4" />
                      Download summary (PDF)
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

          <section className="rounded-3xl border border-thca-grey/20 bg-gradient-to-br from-[#2a2c33] via-[#202229] to-[#14161c] p-8 shadow-[0_45px_140px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-thca-white/40">
                Interactive model
              </p>
              <span className="rounded-full border border-thca-red/40 bg-thca-red/10 px-4 py-1 text-xs font-semibold text-thca-red">
                Live preview
              </span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold text-thca-white">
              Project your retention lift
            </h2>
            <p className="mt-3 text-sm text-thca-white/80">
              Start with these sample numbers or swap them for yours. Every change instantly updates the results.
            </p>
            <div className="mt-4 rounded-xl border border-thca-grey/20 bg-white/[0.1] px-4 py-3 text-sm text-thca-white/85 shadow-[0_15px_45px_rgba(0,0,0,0.4)]">
              <span className="font-semibold text-thca-gold">Quick math:</span> take your monthly shoppers, multiply by how much the repeat % grows, and you get extra orders. Extra orders × average order value = extra money. Extra money × margin = extra profit.
            </div>

            <div className="mt-8 grid gap-5">
              <CalculatorInput
                label="Monthly customers"
                value={calculatorInputs.monthlyCustomers}
                onChange={(value) =>
                  handleCalculatorInputChange("monthlyCustomers", value)
                }
                prefix=""
                helperText="How many shoppers buy from you in a typical month."
              />
              <CalculatorInput
                label="Average order value"
                value={calculatorInputs.averageOrderValue}
                onChange={(value) =>
                  handleCalculatorInputChange("averageOrderValue", value)
                }
                prefix="$"
                helperText="What the average shopper spends each visit."
              />
              <div className="grid gap-5 md:grid-cols-2">
                <CalculatorInput
                  label="Current repeat %"
                  value={calculatorInputs.currentRepeatRate}
                  onChange={(value) =>
                    handleCalculatorInputChange("currentRepeatRate", value)
                  }
                  suffix="%"
                  helperText="Out of 100 shoppers, how many come back within a month right now."
                />
                <CalculatorInput
                  label="Target repeat % (with app)"
                  value={calculatorInputs.targetRepeatRate}
                  onChange={(value) =>
                    handleCalculatorInputChange("targetRepeatRate", value)
                  }
                  suffix="%"
                  helperText="Where you want that number to land with the app running."
                />
              </div>
              <CalculatorInput
                label="Profit margin"
                value={calculatorInputs.margin}
                onChange={(value) => handleCalculatorInputChange("margin", value)}
                suffix="%"
                helperText="What percent of each dollar you keep after product costs."
              />
            </div>

            <div className="mt-10 rounded-2xl border border-thca-grey/15 bg-white/[0.08] p-6 shadow-[0_25px_90px_rgba(0,0,0,0.5)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-thca-white/70">
                Extra wins compared to today
              </p>
              <p className="mt-2 text-sm text-thca-white/80">
                These totals show the lift you can get once the app pushes your repeat rate from current to target.
              </p>
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <MetricCard
                  title="Extra repeat orders"
                  value={formatNumber(incrementalOrders, 0)}
                  caption="orders per month"
                />
                <MetricCard
                  title="Extra revenue"
                  value={formatCurrency(incrementalRevenue)}
                  caption="per month"
                />
                <MetricCard
                  title="Extra profit"
                  value={formatCurrency(incrementalProfit)}
                  caption="per month"
                  highlight
                />
              </div>
            </div>

            <p className="mt-8 text-sm text-thca-white/55">
              Tip: Unsure on margin? Start with your gross margin percent from P&L and plug it in here.
            </p>
            <button
              type="button"
              onClick={() => setIsDownloadDialogOpen(true)}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-thca-red/60 bg-thca-red/15 px-6 py-3 text-sm font-semibold text-thca-red transition hover:bg-thca-red/25 focus:outline-none focus:ring-2 focus:ring-thca-red/50 focus:ring-offset-2 focus:ring-offset-[#14161c]"
            >
              Download summary PDF
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
                        Grab the PDF snapshot or the workbook and keep iterating
                        with your team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <a
                        href="/Retention_Calculator_Snapshot.pdf"
                        download
                        onClick={() => setIsDownloadDialogOpen(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-thca-grey/30 bg-thca-white/5 px-5 py-3 text-sm font-semibold text-thca-white transition hover:border-thca-gold/60 hover:text-thca-gold"
                      >
                        <Download className="h-4 w-4" />
                        Download summary (PDF)
                      </a>
                      <a
                        href="/Dispensary_Retention_Calculator.xlsx"
                        download
                        onClick={() => setIsDownloadDialogOpen(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-thca-grey/30 bg-thca-white/5 px-5 py-3 text-sm font-semibold text-thca-white transition hover:border-thca-gold/60 hover:text-thca-gold"
                      >
                        <Download className="h-4 w-4" />
                        Download workbook (Excel)
                      </a>
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-thca-white/40">
                      GreenLoop App Audit link coming soon
                    </p>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleLeadFormSubmit}>
                    <DialogHeader>
                      <DialogTitle>Unlock your download</DialogTitle>
                      <DialogDescription className="text-thca-white/70">
                        Drop your info to grab the PDF snapshot now. We’ll email
                        the GreenLoop App Audit when it’s ready.
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
    </>
  );
};

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

const CalculatorInput = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  helperText?: string;
}) => (
  <label className="block">
    <span className="text-xs uppercase tracking-[0.3em] text-thca-white/60">
      {label}
    </span>
    <div className="mt-2 flex items-center gap-3 rounded-xl border border-thca-grey/20 bg-white/[0.12] px-4 py-3 focus-within:border-thca-gold focus-within:ring-1 focus-within:ring-thca-gold/60">
      {prefix ? (
        <span className="text-sm text-thca-white/85">{prefix}</span>
      ) : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm text-thca-white placeholder:text-thca-white/45 focus:outline-none"
        placeholder="0"
        inputMode="decimal"
      />
      {suffix ? (
        <span className="text-sm text-thca-white/85">{suffix}</span>
      ) : null}
    </div>
    {helperText ? (
      <p className="mt-2 text-sm text-thca-white/60">{helperText}</p>
    ) : null}
  </label>
);

const MetricCard = ({
  title,
  value,
  caption,
  highlight,
}: {
  title: string;
  value: string;
  caption: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-2xl border ${
      highlight
        ? "border-thca-gold/40 bg-gradient-to-br from-thca-gold/18 via-[#241c07] to-[#171107] shadow-[0_0_60px_rgba(255,215,0,0.2)]"
        : "border-thca-grey/20 bg-white/[0.12]"
    } p-6`}
  >
    <p className="text-sm uppercase tracking-[0.25em] text-thca-white/55">
      {title}
    </p>
    <p className="mt-4 font-display text-3xl font-semibold text-thca-white">
      {value}
    </p>
    <p className="mt-2 text-sm text-thca-white/60">{caption}</p>
  </div>
);

const parseNumber = (value: string): number => {
  const numeric = parseFloat(value);
  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) {
    return 0;
  }
  return numeric;
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);

const formatNumber = (value: number, fractionDigits = 1): string =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fractionDigits,
  }).format(value);

export default RetentionCalculator;

