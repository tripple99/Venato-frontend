
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import authService from "@/service/auth.service";
// import { useSettingsStore } from "@/store/useSetting";
import { AlertCircle } from 'lucide-react';
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import z from "zod";

const forgotPasswordSchema = z.object({
  email: z.email().min(1,"Email is required")
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

    const result = forgotPasswordSchema.safeParse(formValues);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
      });
      toast.error("Validation failed", {
        description: "Please enter a valid phone number with country code.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await authService.sendOtp({ phoneNumber: formValues.email });

      localStorage.setItem("forgot-password-phone", formValues.email);
      localStorage.setItem("forgot-password-token", response.data.accessToken);
      navigate("/auth/otp");

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
      {/* <div className="flex justify-center mb-6">
        <img src={appLogo} alt="Logo" className="h-20 w-20" />
      </div> */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-1 mt-4 text-xl font-semibold">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter the phone number associated with your account and we'll send you a verification code.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="block text-sm">
             Email 
            </Label>
            <div className="relative">
              <Input
                value={formValues.email}
                onChange={(value) => {
                  setFormValues({email:value.target.value});
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className="rounded-full h-11 shadow-none"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full rounded-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span>Requesting Code...</span>
                </div>
              ) : (
                "Send Verification Code"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full h-11"
              onClick={() => navigate("/auth/login")}
              disabled={isSubmitting}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>

      <p className="text-accent-foreground text-center text-sm mt-6">
        Not a Member?
        <Button asChild variant="link" className="px-2">
          <Link to="/auth/register">Register Now</Link>
        </Button>
      </p>
    </form>
  );
}