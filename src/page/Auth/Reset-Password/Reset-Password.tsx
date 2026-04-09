import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import authService from "@/service/auth.service"; // Assuming this service exists
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

// 1. Define Zod Schema
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
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get("token"); // Assuming token comes from URL

  // 2. State Management
  const [otp, _setOtp] = useState(localStorage.getItem("otp") || "");
  const [formValues, setFormValues] = useState<ResetPasswordFormValues>({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordFormValues, string>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // 3. Handle Change
  const handleChange =
    (field: keyof ResetPasswordFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  // 4. Submit Handler
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    try {
      setIsSubmitting(true);

      // Replace with your actual service call
      // await authService.resetPassword(token, formValues.password);

      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      if(!otp){
        toast.error("Token not found", {
          description: "Please try again.",
        });
        return;
      }
      // const phone = localStorage.getItem("forgot-password-phone");
      const data = {
      password:formValues.password,
      confirmPassword:formValues.confirmPassword,
      token:otp,
      // phoneNumber:phone
      }
      const response = await authService.resetPassword(data);

      if (response.status === "success") {
        toast.success("Password Updated", {
          description: response.message,
        });
        localStorage.removeItem("forgot-password-phone");
        navigate("/auth/login");
      } else {
        toast.error("Reset failed", {
          description: response.message,
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
             <LockKeyhole className="w-6 h-6 text-primary" />
          </div>
          <h1 className="mb-1 mt-2 text-xl font-semibold">Set New Password</h1>
          <p className="text-muted-foreground">Your new password must be different from previously used passwords.</p>
        </div>

        <div className="space-y-6">

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="block text-sm">
              New Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formValues.password}
                onChange={handleChange("password")}
                aria-invalid={!!errors.password}
                className="rounded-full h-11 shadow-none pr-10" // Extra padding for icon
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1} // Prevent tabbing to this button if preferred
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="block text-sm">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                className="rounded-full h-11 shadow-none pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-full h-11"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="h-4 w-4" />
                <span>Resetting Password...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}