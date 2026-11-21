import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import authService from "@/service/auth.service";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { ArrowLeft, LockKeyhole } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [resetToken] = useState(() => localStorage.getItem("resetToken") || "");
  const [formValues, setFormValues] = useState<ResetPasswordFormValues>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordFormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!resetToken) {
      toast.error("Session expired", {
        description: "Please verify your OTP before resetting your password.",
      });
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [resetToken, navigate]);

  const handleChange =
    (field: keyof ResetPasswordFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const result = resetPasswordSchema.safeParse(formValues);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      toast.error("Validation failed", {
        description: "Please fix the errors in the form.",
      });
      return;
    }

    if (!resetToken) {
      toast.error("Token not found", {
        description: "Please request a new password reset.",
      });
      navigate("/auth/forgot-password", { replace: true });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await authService.resetPassword({
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
        resetToken,
      });

      if (String(response?.status || "").toLowerCase() === "success") {
        localStorage.removeItem("forgot-password-email");
        localStorage.removeItem("resetToken");
        navigate("/auth/login", { replace: true });
      } else {
        toast.error("Reset failed", {
          description: response?.message || "Unable to reset password.",
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
            <LockKeyhole className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Set New Password</h1>
          <p className="text-sm text-muted-foreground">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <div className="space-y-6">
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="block text-sm">
              New Password
            </Label>
            <PasswordInput
              name="password"
              id="password"
              value={formValues.password}
              onChange={handleChange("password")}
              aria-invalid={!!errors.password}
              className="rounded-full h-11 shadow-none border-slate-200 focus:border-primary-venato transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="block text-sm">
              Confirm Password
            </Label>
            <PasswordInput
              name="confirmPassword"
              id="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              className="rounded-full h-11 shadow-none border-slate-200 focus:border-primary-venato transition-colors"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full rounded-full cursor-pointer h-11 bg-primary-venato hover:bg-primary-venato-hover text-white font-semibold transition-colors"
              loading={isSubmitting}
              loadingText="Resetting Password..."
            >
              Reset Password
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
    </form>
  );
}
