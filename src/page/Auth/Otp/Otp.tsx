import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import authService from "@/service/auth.service";
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { OtpPurpose } from "@/model/auth.model";

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const email = localStorage.getItem("forgot-password-email") || "";
  const verifyEmail = localStorage.getItem("verify-otp-email") || "";

  const activeEmail = verifyEmail || email;
  const isRegistrationFlow = Boolean(verifyEmail);

  useEffect(() => {
    if (!email && !verifyEmail) {
      toast.error("Session expired", {
        description: "Please request a new verification code.",
      });

      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, verifyEmail, navigate]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validation = otpSchema.safeParse({ otp });

    if (!validation.success) {
      toast.error("Invalid Code", {
        description: "Please enter the complete 6-digit verification code.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await authService.verifyOtp({
        email: activeEmail,
        otp,
        purpose: isRegistrationFlow
          ? OtpPurpose.Registration
          : OtpPurpose.RESETPASSWORD,
      });

      if (isRegistrationFlow) {
        localStorage.removeItem("verify-otp-email");

        toast.success("Email verified successfully", {
          description: "You can now sign in to your account.",
        });

        navigate("/auth/login", { replace: true });
        return;
      }

      const resetToken = response?.payload?.resetToken;

      if (!resetToken) {
        throw new Error("Reset token was not returned by the server.");
      }

      localStorage.setItem("resetToken", resetToken);
      localStorage.removeItem("forgot-password-email");

      toast.success("OTP Verified", {
        description: "You can now reset your password.",
      });

      navigate("/auth/reset-password", { replace: true });
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
    if (isResending || !activeEmail) return;

    try {
      setIsResending(true);

      toast.info("Resending code...", {
        description: `Sending a new code to ${activeEmail}`,
      });

      await authService.sendOtp({
        email: activeEmail,
        purpose: isRegistrationFlow
          ? OtpPurpose.Registration
          : OtpPurpose.RESETPASSWORD,
      });

      toast.success("Code resent successfully");
    } catch (error) {
      toast.error("Failed to resend code", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again later.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-background px-4 transition-colors duration-500">
      <form
        onSubmit={onSubmit}
        className="z-10 w-full max-w-md rounded-[32px] border border-white/20 bg-white/70 p-6 sm:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-all duration-500 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-10 text-center sm:text-left">
          <div className="mb-6 flex items-center justify-center gap-4 sm:justify-start">
            <div className="rounded-2xl bg-primary/10 p-3 ring-1 ring-primary/20 dark:bg-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Verify OTP
          </h1>

          <p className="text-[15px] leading-relaxed text-muted-foreground">
            We've sent a 6-digit verification code to{" "}
            <span className="break-all font-semibold text-foreground">
              {activeEmail}
            </span>
            .
          </p>
        </div>

        <div className="space-y-10">
          <div className="flex flex-col items-center justify-center space-y-4 overflow-x-hidden">
            <Label
              htmlFor="otp"
              className="ml-1 w-full text-left text-sm font-semibold text-foreground/80"
            >
              Verification Code
            </Label>

            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value.replace(/\D/g, ""))}
            >
              <InputOTPGroup className="flex-nowrap gap-1 sm:gap-2 md:gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="
                      h-10 w-10
                      sm:h-12 sm:w-12
                      md:h-14 md:w-14
                      rounded-xl
                      sm:rounded-2xl
                      border-slate-200
                      dark:border-slate-700
                      bg-white/50
                      dark:bg-slate-900/50
                      text-lg
                      sm:text-xl
                      md:text-2xl
                      font-bold
                      shadow-sm
                      transition-all
                      focus-visible:ring-2
                      focus-visible:ring-primary
                      focus:border-primary
                    "
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              type="submit"
              className="h-14 w-full cursor-pointer rounded-2xl bg-primary-venato text-base font-bold text-white shadow-xl shadow-primary/10 transition-all hover:bg-primary/80 active:scale-[0.98] disabled:opacity-70 dark:text-[#111827] dark:hover:bg-gray-200"
              disabled={otp.length !== 6 || isSubmitting}
              loading={isSubmitting}
              loadingText="Verifying..."
            >
              Verify Code
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl font-medium text-muted-foreground transition-all hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
              onClick={() => navigate("/auth/forgot-password")}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>

        <div className="mt-10 text-center text-sm font-medium text-muted-foreground">
          Didn't receive a code?
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="ml-1 cursor-pointer font-bold text-primary underline-offset-4 transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </div>
      </form>
    </div>
  );
}