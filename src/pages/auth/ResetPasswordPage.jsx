import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import pharmalinkLogo from "@/assets/pharmalink-logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { getStoredAuthToken, getStoredRole } from "@/lib/roles";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

const getPasswordRole = () => {
  const role = getStoredRole();
  return role === "superadmin" ? "admin" : role;
};

const getHomePath = (role) => {
  if (role === "warehouse") return "/warehouse/home";
  if (role === "pharmacies") return "/pharmacy/sales-cart";
  return "/home";
};

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const role = useMemo(getPasswordRole, []);
  const canResetPassword = Boolean(role && getStoredAuthToken());
  const { mutate: resetPassword, isPending } = useResetPassword(role ?? "admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canResetPassword) {
      toast.error("Please sign in first.");
      navigate("/login");
      return;
    }

    if (!currentPassword || !password || !passwordConfirmation) {
      toast.error("All password fields are required.");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Password confirmation does not match.");
      return;
    }

    resetPassword(
      {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully.");
          navigate(getHomePath(role));
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Failed to reset password."));
        },
      },
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-200 to-blue-100 px-4 py-8 text-slate-950 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <Card className="w-full max-w-4xl overflow-hidden border-slate-200 bg-white/95 p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900/95">
        <CardContent className="grid p-0 md:grid-cols-[0.85fr_1.15fr]">
          <section className="flex min-h-[260px] flex-col items-center justify-center bg-[#0f8f8b] p-8 text-white md:min-h-[520px]">
            <div className="flex h-36 w-56 items-center justify-center overflow-hidden">
              <img
                src={pharmalinkLogo}
                alt="PharmaLink logo"
                className="max-h-36 w-full object-contain"
              />
            </div>
            <h1 className="mt-5 text-3xl font-bold">PharmaLink</h1>
          </section>

          <section className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 space-y-2">
                <p className="text-sm font-medium text-[#0f8f8b] dark:text-[#49c7c2]">
                  Account Security
                </p>
                <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                  Reset Password
                </h2>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Set a new password for your PharmaLink account.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <FieldGroup className="gap-5">
                  <PasswordField
                    id="current_password"
                    label="Current Password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    autoComplete="current-password"
                  />
                  <PasswordField
                    id="new_password"
                    label="New Password"
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                  />
                  <PasswordField
                    id="password_confirmation"
                    label="Confirm Password"
                    value={passwordConfirmation}
                    onChange={setPasswordConfirmation}
                    autoComplete="new-password"
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 rounded-xl bg-[#0f8f8b] text-white hover:bg-[#0c7d79] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? "Saving..." : "Save Password"}
                  </Button>
                </FieldGroup>
              </form>
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}

function PasswordField({ id, label, value, onChange, autoComplete }) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <Input
          id={id}
          type="password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 rounded-xl bg-white pl-10 dark:bg-slate-950"
          autoComplete={autoComplete}
        />
      </div>
    </Field>
  );
}
