import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { TrendingUp } from "lucide-react";

import { authService } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await authService.signup(values);
      login(res.token, res.user);
      toast.success(`Welcome, ${res.user.name}!`);
      navigate("/dashboard");
    } catch {
      toast.error("Sign up failed. Try a different email.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-brand-600 p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <span className="font-semibold">ExpenseTrack</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-tight mb-3">
            Start with clarity. Spend with confidence.
          </h1>
          <p className="text-brand-200 text-sm leading-relaxed">
            Set budgets by category, track every transaction, and get alerted
            before you overspend.
          </p>
        </div>
        <p className="text-brand-300 text-xs">
          © {new Date().getFullYear()} ExpenseTrack
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-50">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="font-semibold text-ink-900">ExpenseTrack</span>
            </div>
            <h2 className="text-2xl font-semibold text-ink-900">
              Create account
            </h2>
            <p className="text-sm text-ink-300 mt-1">
              Free to start, no card required
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Rahul Sharma"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              size="lg"
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-ink-300 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
