import { useEffect, useMemo, useState } from "react";
import { Lock, Mail, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import pharmalinkLogo from "@/assets/pharmalink-logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOtpLogin } from "@/hooks/auth/useOtpLogin";
import { useResendOtp } from "@/hooks/auth/useResendOtp";
import { useVerifyOtpLogin } from "@/hooks/auth/useVerifyOtpLogin";
import { useLoginA } from "@/hooks/superAdmin/useLoginA";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

const OTP_LIFETIME_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

const getNowSeconds = () => Math.floor(Date.now() / 1000);

const formatSeconds = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

const getOtpRequestToken = (response) =>
  response?.otp_request_token ?? response?.data?.otp_request_token ?? "";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pharmacies");
  const [otp, setOtp] = useState("");
  const [otpRequestToken, setOtpRequestToken] = useState("");
  const [step, setStep] = useState("credentials");
  const [otpExpiresAt, setOtpExpiresAt] = useState(0);
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const [now, setNow] = useState(getNowSeconds());

  const otpRole = role === "warehouse" ? "warehouse" : "pharmacies";
  const adminLogin = useLoginA();
  const otpLogin = useOtpLogin(otpRole);
  const verifyOtp = useVerifyOtpLogin(otpRole);
  const resendOtp = useResendOtp(otpRole);

  const isOtpRole = role === "pharmacies" || role === "warehouse";
  const otpSecondsLeft = Math.max(0, otpExpiresAt - now);
  const resendSecondsLeft = Math.max(0, resendAvailableAt - now);
  const isPending =
    adminLogin.isPending ||
    otpLogin.isPending ||
    verifyOtp.isPending ||
    resendOtp.isPending;

  const title = step === "otp" ? "Verify OTP" : "Welcome Back";
  const description =
    step === "otp"
      ? "Enter the OTP sent to your account."
      : "Sign in to access your PharmaLink workspace.";

  const roleLabel = useMemo(() => {
    if (role === "admin") return "Admin";
    if (role === "warehouse") return "Warehouse Owner";
    return "Pharmacist";
  }, [role]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(getNowSeconds()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step === "otp" && otpExpiresAt > 0 && otpSecondsLeft === 0) {
      setOtp("");
    }
  }, [otpExpiresAt, otpSecondsLeft, step]);

  const startOtpWindow = (token) => {
    const current = getNowSeconds();
    setOtpRequestToken(token);
    setOtp("");
    setOtpExpiresAt(current + OTP_LIFETIME_SECONDS);
    setResendAvailableAt(current + RESEND_COOLDOWN_SECONDS);
    setStep("otp");
  };

  const handleCredentialsSubmit = (event) => {
    event.preventDefault();

    const trimmedLogin = login.trim();
    if (!trimmedLogin || !password) {
      toast.error("Login and password are required.");
      return;
    }

    if (role === "admin") {
      adminLogin.mutate(
        { login: trimmedLogin, password },
        {
          onSuccess: (response) => {
            toast.success("Signed in successfully.");
            navigate("/home");
          },
          onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to sign in."));
          },
        },
      );
      return;
    }

    otpLogin.mutate(
      { login: trimmedLogin, password },
      {
        onSuccess: (response) => {
          startOtpWindow(getOtpRequestToken(response));
          toast.success("OTP sent successfully.");
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Failed to send OTP."));
        },
      },
    );
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();

    if (otpSecondsLeft === 0) {
      toast.error("OTP expired. Please resend a new code.");
      return;
    }

    if (otp.trim().length < 6) {
      toast.error("Please enter the full OTP.");
      return;
    }

    verifyOtp.mutate(
      { otp },
      {
        onSuccess: () => {
          toast.success("OTP verified.");
          navigate("/reset-password");
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Failed to verify OTP."));
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (!otpRequestToken) {
      toast.error("OTP request token is missing. Please sign in again.");
      setStep("credentials");
      return;
    }

    resendOtp.mutate(
      { otp_request_token: otpRequestToken },
      {
        onSuccess: (response) => {
          startOtpWindow(getOtpRequestToken(response) || otpRequestToken);
          toast.success("OTP resent successfully.");
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Failed to resend OTP."));
        },
      },
    );
  };

  const handleBackToLogin = () => {
    setStep("credentials");
    setOtp("");
    setOtpRequestToken("");
    setOtpExpiresAt(0);
    setResendAvailableAt(0);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-200 to-blue-100 px-4 py-8 text-slate-950 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <Card className="w-full max-w-5xl overflow-hidden border-slate-200 bg-white/95 p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900/95">
        <CardContent className="grid p-0 md:grid-cols-[0.9fr_1.1fr]">
          <section className="flex min-h-[320px] flex-col items-center justify-center bg-[#0f8f8b] p-8 text-white md:min-h-[620px]">
            <div className="flex h-44 w-64 items-center justify-center overflow-hidden">
              <img
                src={pharmalinkLogo}
                alt="PharmaLink logo"
                className="max-h-44 w-full object-contain"
              />
            </div>
            <h1 className="mt-6 text-4xl font-bold">PharmaLink</h1>
            <p className="mt-3 max-w-sm text-center text-sm text-blue-50">
              Connected pharmacy and warehouse operations.
            </p>
          </section>

          <section className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 space-y-2">
                <p className="text-sm font-medium text-[#0f8f8b] dark:text-[#49c7c2]">
                  {roleLabel}
                </p>
                <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                  {title}
                </h2>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  {description}
                </p>
              </div>

              {step === "credentials" ? (
                <form className="space-y-6" onSubmit={handleCredentialsSubmit}>
                  <FieldGroup className="gap-5">
                    <Field>
                      <FieldLabel htmlFor="login">Email or Login</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="login"
                          type="text"
                          value={login}
                          onChange={(event) => setLogin(event.target.value)}
                          placeholder="you@example.com"
                          className="h-12 rounded-xl bg-white pl-10 dark:bg-slate-950"
                          autoComplete="username"
                        />
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="********"
                          className="h-12 rounded-xl bg-white pl-10 dark:bg-slate-950"
                          autoComplete="current-password"
                        />
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel>Login As</FieldLabel>
                      <Select
                        value={role}
                        onValueChange={(value) => {
                          setRole(value);
                          setOtp("");
                          setOtpRequestToken("");
                        }}
                      >
                        <SelectTrigger className="h-12 w-full rounded-xl bg-white dark:bg-slate-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="pharmacies">Pharmacist</SelectItem>
                          <SelectItem value="warehouse">
                            Warehouse Owner
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="h-12 rounded-xl bg-[#0f8f8b] text-white hover:bg-[#0c7d79] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isPending
                        ? isOtpRole
                          ? "Sending OTP..."
                          : "Signing in..."
                        : isOtpRole
                          ? "Send OTP"
                          : "Sign In"}
                    </Button>
                  </FieldGroup>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-slate-800 dark:bg-slate-950 dark:text-blue-200">
                    OTP expires in{" "}
                    <span className="font-semibold">
                      {formatSeconds(otpSecondsLeft)}
                    </span>
                  </div>

                  <Field>
                    <FieldLabel>OTP Code</FieldLabel>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      containerClassName="justify-between"
                      disabled={otpSecondsLeft === 0 || isPending}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-12 w-12 text-base"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </Field>

                  <Button
                    type="submit"
                    disabled={isPending || otpSecondsLeft === 0}
                    className="h-12 w-full rounded-xl bg-[#0f8f8b] text-white hover:bg-[#0c7d79] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToLogin}
                      disabled={isPending}
                    >
                      Change Login
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOtp}
                      disabled={isPending || resendSecondsLeft > 0}
                    >
                      <RotateCcw className="size-4" />
                      {resendSecondsLeft > 0
                        ? `Resend in ${formatSeconds(resendSecondsLeft)}`
                        : "Resend OTP"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
