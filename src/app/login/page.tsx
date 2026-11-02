
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { notify } from "@/lib/notify";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || googleLoading) {
      return;
    }

    const formData = new FormData(e.currentTarget);

    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        ...user,
      });

      if (error) {
        notify.error(error.message || "Invalid email or password.");
        return;
      }

      if (!data) {
        notify.error("We couldn't sign you in. Please try again.");
        return;
      }

      notify.success("Signed in successfully. Welcome back!");
      router.push("/");
    } catch (error) {
      console.error(error);
      notify.apiError(error, "Could not sign you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    if (loading || googleLoading) {
      return;
    }

    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        notify.error(error.message || "Google sign-in failed.");
      }
    } catch (error) {
      console.error(error);
      notify.apiError(error, "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto my-10 w-full max-w-md px-4">
      <Card className="border-border bg-background shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Welcome Back
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            Login to your StudioSpace account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <FieldGroup>
              {/* Google Login */}
              <Field>
                <Button
                  type="button"
                  variant="outline"
                  disabled={googleLoading || loading}
                  onClick={handleGoogleLogin}
                  className="w-full border-border text-foreground hover:bg-muted-foreground/10"
                >
                  {googleLoading ? (
                    <Spinner />
                  ) : (
                    <svg viewBox="0 0 24 24" className="size-4">
                      <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-background">
                Or continue with email
              </FieldSeparator>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="border-border"
                />
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <span className="text-xs text-muted-foreground">
                    Forgot password?
                  </span>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="border-border"
                />
              </Field>

              {/* Login Button */}
              <Field>
                <Button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-brand-bronze text-white hover:bg-brand-bronze-hover"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <FieldDescription className="text-center text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-brand-bronze underline-offset-4 hover:underline"
                  >
                    Register
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="mt-4 px-6 text-center text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
