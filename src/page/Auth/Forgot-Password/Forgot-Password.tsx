import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import authService from "@/service/auth.service";
import { AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [formValues, setFormValues] = useState<ForgotPasswordFormValues>({
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordFormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const result = forgotPasswordSchema.safeParse(formValues);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
      });
      toast.error("Validation failed", {
        description: fieldErrors.email?.[0] || "Please enter a valid email address.",
      });
      return;
    }

    const cleanEmail = result.data.email;

    try {
      setIsSubmitting(true);

      const response = await authService.forgotPassword(cleanEmail);

      // Clear any stale registration verification or reset token so /auth/otp uses RESETPASSWORD flow
      localStorage.removeItem("verify-otp-email");
      localStorage.removeItem("resetToken");

      if (response?.status) {
        localStorage.setItem("forgot-password-email", cleanEmail);
        navigate("/auth/otp");
      } else {
        toast.error("Account not found", {
          description: response?.message || "No account found with that email address.",
        });
      }
    } catch (error: any) {
      toast.error("Server Error", {
        description:
          error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md m-auto h-fit w-full">
      <div className="p-6">
        <div className="mb-6 space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-venato/10 text-primary-venato mb-3">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter the email address associated with your account and we&apos;ll send you a verification code.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formValues.email}
                onChange={(e) => {
                  setFormValues({ email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className="rounded-full h-11 shadow-none border-slate-200 focus:border-primary-venato transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full rounded-full h-11 bg-primary-venato hover:bg-primary-venato-hover text-white font-semibold cursor-pointer"
              loading={isSubmitting}
              loadingText="Sending Code..."
            >
              Send Verification Code
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full h-11 cursor-pointer"
              onClick={() => navigate("/auth/login")}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Button>
          </div>
        </div>
      </div>

      <p className="text-accent-foreground text-center text-sm mt-2">
        Not a Member?
        <Button asChild variant="link" className="px-2 text-primary-venato">
          <Link to="/auth/register">Register Now</Link>
        </Button>
      </p>
    </form>
  );
}
