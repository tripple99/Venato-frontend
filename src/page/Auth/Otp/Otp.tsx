import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import authService from "@/service/auth.service";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { ArrowLeft, ShieldCheck } from "lucide-react";

// 1. Define Zod Schema for OTP (usually 6 digits)
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Retrieve phone from localStorage (set in the previous Forgot Password step)
  const phone =
    localStorage.getItem("forgot-password-phone") || "your phone number";

  // 2. Submit Handler
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = otpSchema.safeParse({ otp });

    if (!result.success) {
      toast.error("Invalid Code", {
        description: "Please enter the full 6-digit code sent to your phone.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // We use the phone number from localStorage for verification
      await authService.verifyOtp({ phoneNumber: phone, otp });
      localStorage.setItem("otp", otp);
      toast.success("OTP Verified", {
        description: "You can now reset your password.",
      });

      navigate("/auth/reset-password");
    } catch (error) {
      toast.error("Verification Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Invalid or expired code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      toast.info("Resending code...", { description: `Sent to ${phone}` });
      await authService.sendOtp({ phoneNumber: phone });
      toast.success("Code resent successfully!");
    } catch {
      toast.error("Failed to resend code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-background relative overflow-hidden transition-colors duration-500">
      <form
        onSubmit={onSubmit}
        className="max-w-md w-full bg-white/70 dark:bg-slate-900/40 p-8 rounded-[32px] border border-white/20 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 z-10"
      >
        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4 mb-6">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl ring-1 ring-primary/20">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground tracking-tight">
            Verify OTP
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            We've sent a 6-digit verification code to{" "}
            <span className="text-foreground font-semibold">{phone}</span>.
          </p>
        </div>

        <div className="space-y-10">
          {/* OTP Input Field */}
          <div className="space-y-4 flex flex-col items-center justify-center">
            <Label
              htmlFor="otp"
              className="w-full text-left text-sm font-semibold text-foreground/80 ml-1"
            >
              Verification Code
            </Label>

            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="rounded-2xl size-14 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-foreground text-2xl font-bold focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all shadow-sm"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <Button
              type="submit"
              className="w-full rounded-2xl h-14 bg-[#111827] dark:bg-gray-100 text-white dark:text-[#111827] hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-base transition-all shadow-xl shadow-primary/10 active:scale-[0.98] disabled:opacity-70"
              disabled={isSubmitting || otp.length < 6}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <Spinner className="h-5 w-5 border-2 text-current" />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify Code"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-2xl h-14 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-medium"
              onClick={() => navigate("/auth/forgot-password")}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>

        <div className="mt-10 text-center text-sm font-medium text-muted-foreground">
          Didn't receive a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:text-primary/80 font-bold decoration-2 underline-offset-4 ml-1 transition-colors"
          >
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
}
