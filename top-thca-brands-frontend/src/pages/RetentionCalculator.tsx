import { FormEvent, useMemo, useState } from "react";
import { Shield, Download } from "lucide-react";
import { Link } from "react-router-dom";

import { submitContact } from "@/api/contactService";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-thca-black text-thca-white flex flex-col">
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
            <div className="rounded-3xl border border-thca-grey/30 bg-gradient-to-b from-[#1b1b1b] via-[#151515] to-[#0f0f0f] p-8 shadow-[0_0_120px_rgba(255,0,0,0.06)]">
              <p className="text-xs uppercase tracking-[0.4em] text-thca-red">
                Free resource
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold text-thca-white md:text-5xl">
                Dispensary Retention Calculator
              </h1>
              <p className="mt-6 text-base leading-7 text-thca-white/70">
                Model the revenue unlocked when your repeat shoppers stick. Use
                our calculator for quick projections, then download the Excel
                workbook to plug the formula into your own stack.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-thca-white/75">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-thca-red"></span>
                  <p>Inputs: customers, AOV, repeat rate, target repeat rate, margin.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-thca-gold/80"></span>
                  <p>
                    Outputs: incremental orders, revenue, and profit per month.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-thca-grey"></span>
                  <p>
                    Unlock Excel download + GreenLoop App Audit link after submitting your details.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-thca-grey/25 bg-[#151515] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.4)]">
              <h2 className="font-display text-xl font-semibold text-thca-white">
                Get the workbook
              </h2>
              <p className="mt-3 text-sm text-thca-white/60">
                Share who we’re helping and we’ll keep you posted when the GreenLoop App Audit link goes live.
              </p>
              <form className="mt-6 grid gap-5" onSubmit={handleLeadFormSubmit}>
                <LabelledInput
                  label="Your name"
                  required
                  value={leadForm.name}
                  onChange={(value) => handleLeadFormChange("name", value)}
                  placeholder="KeShaun Camon"
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
                  placeholder="GreenHaus"
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
                <div className="mt-6 space-y-3 rounded-2xl border border-thca-grey/25 bg-[#1c1c1c] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
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

          <section className="rounded-3xl border border-thca-grey/25 bg-gradient-to-br from-[#1e1e1e] via-[#151515] to-[#101010] p-8 shadow-[0_40px_130px_rgba(0,0,0,0.5)]">
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
            <p className="mt-3 text-sm text-thca-white/70">
              Start with the sample assumptions or dial each field to mirror
              your dispensary. The opportunity section underneath updates in
              real time.
            </p>
            <div className="mt-4 rounded-xl border border-thca-grey/30 bg-white/[0.06] px-4 py-3 text-xs text-thca-white/70">
              <span className="font-semibold text-thca-gold">Formula snapshot:</span> incremental
              orders = monthly customers × (target repeat − current repeat).
              We multiply that by AOV for revenue and apply your margin to get profit.
            </div>

            <div className="mt-8 grid gap-5">
              <CalculatorInput
                label="Monthly customers"
                value={calculatorInputs.monthlyCustomers}
                onChange={(value) =>
                  handleCalculatorInputChange("monthlyCustomers", value)
                }
                prefix=""
                helperText="Unique shoppers who purchase at least once per month."
              />
              <CalculatorInput
                label="Average order value"
                value={calculatorInputs.averageOrderValue}
                onChange={(value) =>
                  handleCalculatorInputChange("averageOrderValue", value)
                }
                prefix="$"
                helperText="Average basket size before taxes and fees."
              />
              <div className="grid gap-5 md:grid-cols-2">
                <CalculatorInput
                  label="Current repeat %"
                  value={calculatorInputs.currentRepeatRate}
                  onChange={(value) =>
                    handleCalculatorInputChange("currentRepeatRate", value)
                  }
                  suffix="%"
                  helperText="Percent of customers returning within 30 days today."
                />
                <CalculatorInput
                  label="Target repeat % (with app)"
                  value={calculatorInputs.targetRepeatRate}
                  onChange={(value) =>
                    handleCalculatorInputChange("targetRepeatRate", value)
                  }
                  suffix="%"
                  helperText="Your retention goal once the mobile app launches."
                />
              </div>
              <CalculatorInput
                label="Profit margin"
                value={calculatorInputs.margin}
                onChange={(value) => handleCalculatorInputChange("margin", value)}
                suffix="%"
                helperText="Gross margin after COGS. Example: 48 means $0.48 profit per $1 revenue."
              />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <MetricCard
                title="Incremental repeat orders"
                value={formatNumber(incrementalOrders, 0)}
                caption="orders / month"
              />
              <MetricCard
                title="Additional revenue"
                value={formatCurrency(incrementalRevenue)}
                caption="per month"
              />
              <MetricCard
                title="Projected profit"
                value={formatCurrency(incrementalProfit)}
                caption="per month"
                highlight
              />
            </div>

            <p className="mt-8 text-xs text-thca-white/40">
              Tip: Margin is after COGS. Need help estimating? Start with your
              blended gross margin percentage.
            </p>
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
    <span className="text-xs uppercase tracking-[0.3em] text-thca-white/45">
      {label}
      {required ? " *" : ""}
    </span>
    <input
      className="mt-2 w-full rounded-xl border border-thca-grey/25 bg-white/5 px-4 py-3 text-sm text-thca-white placeholder:text-thca-white/40 focus:border-thca-gold focus:outline-none focus:ring-1 focus:ring-thca-gold/60"
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
    <span className="text-xs uppercase tracking-[0.3em] text-thca-white/45">
      {label}
    </span>
    <div className="mt-2 flex items-center gap-3 rounded-xl border border-thca-grey/25 bg-white/5 px-4 py-3 focus-within:border-thca-gold focus-within:ring-1 focus-within:ring-thca-gold/60">
      {prefix ? (
        <span className="text-sm text-thca-white/75">{prefix}</span>
      ) : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm text-thca-white placeholder:text-thca-white/40 focus:outline-none"
        placeholder="0"
        inputMode="decimal"
      />
      {suffix ? (
        <span className="text-sm text-thca-white/75">{suffix}</span>
      ) : null}
    </div>
    {helperText ? (
      <p className="mt-2 text-xs text-thca-white/45">{helperText}</p>
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
        ? "border-thca-gold/40 bg-gradient-to-br from-thca-gold/20 via-thca-black/20 to-thca-black/60 shadow-[0_0_60px_rgba(255,215,0,0.15)]"
        : "border-thca-grey/25 bg-white/5"
    } p-6`}
  >
    <p className="text-xs uppercase tracking-[0.3em] text-thca-white/40">
      {title}
    </p>
    <p className="mt-4 font-display text-3xl font-semibold text-thca-white">
      {value}
    </p>
    <p className="mt-2 text-xs text-thca-white/40">{caption}</p>
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

