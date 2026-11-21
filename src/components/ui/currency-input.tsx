import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    "value" | "onChange" | "type"
  > {
  value: number | string | undefined;
  onValueChange: (value: number) => void;
  prefix?: string;
}

function formatWithCommas(raw: string): string {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (!cleaned) return "";

  const firstDotIndex = cleaned.indexOf(".");
  let intPart = cleaned;
  let decPart: string | null = null;

  if (firstDotIndex !== -1) {
    intPart = cleaned.slice(0, firstDotIndex);
    decPart = cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  // Strip leading zeros except when value is "0"
  intPart = intPart.replace(/^0+(?=\d)/, "");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (decPart !== null) {
    return `${formattedInt || "0"}.${decPart}`;
  }

  return formattedInt;
}

function CurrencyInput({
  value,
  onValueChange,
  prefix,
  className,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(() => {
    if (value === undefined || value === null || value === "" || value === 0) {
      return "";
    }
    return formatWithCommas(String(value));
  });

  React.useEffect(() => {
    const numericDisplay = Number(displayValue.replace(/,/g, ""));
    const numericProp =
      value === undefined || value === null || value === "" ? 0 : Number(value);

    if (numericProp === 0 && (displayValue === "" || displayValue === "0")) {
      return;
    }

    if (numericDisplay !== numericProp) {
      setDisplayValue(
        numericProp ? formatWithCommas(String(numericProp)) : ""
      );
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWithCommas(e.target.value);
    setDisplayValue(formatted);

    const stripped = formatted.replace(/,/g, "");
    const parsed = stripped === "" || stripped === "." ? 0 : Number(stripped);
    onValueChange(Number.isNaN(parsed) ? 0 : parsed);
  };

  if (prefix) {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
          {prefix}
        </span>
        <Input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          className={cn("pl-7", className)}
          {...props}
        />
      </div>
    );
  }

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}

export { CurrencyInput };
