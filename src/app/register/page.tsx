
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { notify } from "@/lib/notify";

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

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [passwordError, setPasswordError] = useState("");

 const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || socialLoading) {
      return;
    }

    const formData = new FormData(e.currentTarget);

    const user = Object.fromEntries(formData.entries()) as {
        name: string;
        image: string;
        email: string;
        password: string;
    };

    // Password validation
    if (!/[A-Z]/.test(user.password)) {
        setPasswordError("Password must contain an uppercase letter.");
        notify.error("Password must contain an uppercase letter.");
        return;
    }

    if (!/[a-z]/.test(user.password)) {
        setPasswordError("Password must contain a lowercase letter.");
        notify.error("Password must contain a lowercase letter.");
        return;
    }

    if (user.password.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        notify.error("Password must be at least 6 characters.");
        return;
    }

    setPasswordError("");

    try {
        setLoading(true);

        const { data, error } = await authClient.signUp.email({
            ...user,
        });

        if (error) {
            notify.error(error.message || "Could not create your account.");
            return;
        }

        if (!data) {
            notify.error("Could not create your account. Please try again.");
            return;
        }

        notify.success("Account created successfully. Please sign in.");
        router.push("/login");
    } catch (error) {
        console.error(error);
        notify.apiError(error, "Registration failed. Please try again.");
    } finally {
        setLoading(false);
    }
};
  // Google social login
  const handleSocialLogin = async (provider: "google") => {
    if (loading || socialLoading) {
      return;
    }

    setSocialLoading(provider);

    try {
      const {error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      // console.log(data);

      if (error) {
        notify.error(error.message || `${provider} sign-in failed.`);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      notify.apiError(error, "Social sign-in failed. Please try again.");
    } finally {
      setSocialLoading("");
    }
  };

  return (
    <div className="mx-auto my-10 w-full max-w-md px-4">
      <Card className="border-brand-border bg-brand-ivory shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-brand-charcoal">
            Create an Account
          </CardTitle>

          <CardDescription className="text-brand-stone">
            Join StudioSpace and start exploring creative spaces.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleEmailSignUp}>
            <FieldGroup>
              {/* Social Login */}
              <Field className="grid justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="border-brand-border text-brand-charcoal hover:bg-brand-stone/10"
                  disabled={!!socialLoading || loading}
                  onClick={() => handleSocialLogin("google")}
                >
                  {socialLoading === "google" ? (
                    <Spinner />
                  ) : (
                    <svg viewBox="0 0 24 24" className="size-4">
                      <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      />
                    </svg>
                  )}
                  Google
                </Button>

              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-brand-ivory">
                Or register with email
              </FieldSeparator>

              {/* Name */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="border-brand-border"
                />
              </Field>

              {/* Photo URL */}
              <Field>
                <FieldLabel htmlFor="image">Photo URL</FieldLabel>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  required
                  className="border-brand-border"
                />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="border-brand-border"
                />
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  minLength={6}
                  onChange={() => setPasswordError("")}
                  className="border-brand-border"
                />

                {passwordError && (
                  <FieldDescription className="text-sm text-red-600">
                    {passwordError}
                  </FieldDescription>
                )}

                <FieldDescription className="text-brand-stone">
                  Must contain uppercase, lowercase and at least 6 characters.
                </FieldDescription>
              </Field>

              {/* Register Button */}
              <Field>
                <Button
                  type="submit"
                  disabled={loading || !!socialLoading}
                  className="w-full bg-brand-bronze text-white hover:bg-brand-bronze-hover"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" />
                      Registering...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <FieldDescription className="text-center text-brand-stone">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-brand-bronze underline-offset-4 hover:underline"
                  >
                    Login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="mt-4 px-6 text-center text-brand-stone">
        By creating an account, you agree to our{" "}
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
