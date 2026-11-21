import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import authService from "@/service/auth.service";
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";
import { OtpPurpose } from "@/model/auth.model";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const [email] = useState(() => localStorage.getItem("forgot-password-email") || "");
  const [verifyEmail] = useState(() => localStorage.getItem("verify-otp-email") || "");

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

  const slotClassName =
    "h-12 w-11 sm:h-14 sm:w-12 text-lg font-semibold border-slate-200 dark:border-slate-700 bg-background data-[active=true]:border-primary-venato data-[active=true]:ring-primary-venato/25";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-4">
      <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-venato/10 text-primary-venato">
          <MailCheck className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verify OTP
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Enter the verification code sent to{" "}
            <span className="break-all font-semibold text-foreground">
              {activeEmail}
            </span>
            .
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="otp"
            className="block text-center text-sm font-medium text-foreground sm:text-left"
          >
            Verification Code
          </Label>

          <div className="flex justify-center sm:justify-start">
            <InputOTP
              id="otp"
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isSubmitting}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className={slotClassName} />
                <InputOTPSlot index={1} className={slotClassName} />
                <InputOTPSlot index={2} className={slotClassName} />
              </InputOTPGroup>
              <InputOTPSeparator className="text-muted-foreground" />
              <InputOTPGroup>
                <InputOTPSlot index={3} className={slotClassName} />
                <InputOTPSlot index={4} className={slotClassName} />
                <InputOTPSlot index={5} className={slotClassName} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <Button
            type="submit"
            className="h-11 w-full cursor-pointer rounded-full bg-primary-venato font-semibold text-white transition-colors hover:bg-primary-venato-hover"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="Verifying..."
          >
            Verify Code
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full cursor-pointer rounded-full border-slate-200 font-medium text-muted-foreground hover:text-foreground dark:border-slate-700"
            onClick={() =>
              navigate(
                isRegistrationFlow ? "/auth/login" : "/auth/forgot-password",
              )
            }
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            {isRegistrationFlow ? "Back to Sign In" : "Back"}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive a code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="cursor-pointer font-semibold text-primary-venato underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Resend Code"}
        </button>
      </p>
    </div>
  );
}
