"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Image as ImageIcon,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { notify } from "@/lib/notify";

type ProfileUser = {
  name: string;
  email: string;
  image: string;
};

type ImageStatus = "idle" | "loading" | "loaded" | "error";

const isHttpImageUrl = (value: string) => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const getInitials = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export default function ProfileForm({
  initialUser,
}: {
  initialUser: ProfileUser;
}) {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  const [name, setName] = useState(initialUser.name);
  const [imageUrl, setImageUrl] = useState(initialUser.image);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageStatus, setImageStatus] = useState<ImageStatus>("idle");
  const [showNameValidation, setShowNameValidation] = useState(false);
  const [showImageValidation, setShowImageValidation] = useState(false);

  const trimmedName = name.trim();
  const trimmedImageUrl = imageUrl.trim();

  const nameError = trimmedName ? "" : "Please enter your name.";

  const imageUrlError =
    trimmedImageUrl && !isHttpImageUrl(trimmedImageUrl)
      ? "Enter a valid image URL starting with http:// or https://."
      : "";

  const previewImageUrl =
    trimmedImageUrl && !imageUrlError ? trimmedImageUrl : "";

  const displayName = trimmedName || "Your name";
  const displayEmail = session?.user.email || initialUser.email;
  const initials = getInitials(trimmedName || displayEmail);

  const showNameError = showNameValidation && Boolean(nameError);
  const showImageError = showImageValidation && Boolean(imageUrlError);
  const isBrokenImage = Boolean(previewImageUrl && imageStatus === "error");
  const hasImageProblem = showImageError || isBrokenImage;

  const handleImageUrlChange = (value: string) => {
    setImageUrl(value);
    setImageStatus("idle");
    setShowImageValidation(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUpdating) {
      return;
    }

    if (nameError) {
      setShowNameValidation(true);
      notify.error(nameError);
      return;
    }

    if (imageUrlError) {
      setShowImageValidation(true);
      notify.error(imageUrlError);
      return;
    }

    if (isBrokenImage) {
      notify.error(
        "That image URL could not be loaded. Please use a working image URL or clear the field.",
      );
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImageUrl || null,
      });

      if (error) {
        notify.error(
          error.message || "Could not update your profile. Please try again.",
        );
        return;
      }

      setName(trimmedName);
      setImageUrl(trimmedImageUrl);

      try {
        await refetch();
      } catch (refreshError) {
        console.error("Profile session refresh error:", refreshError);
      }

      router.refresh();
      notify.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      notify.apiError(error, "Could not update your profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden border-b border-brand-border bg-gradient-to-br from-brand-ivory via-white to-brand-bronze-light/40">
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-bronze/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-brand-bronze-light/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-bronze/25 bg-white/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-bronze shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Account settings
              </div>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl">
                Your profile,
                <span className="block font-serif font-normal italic text-brand-bronze">
                  in focus.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-brand-stone sm:text-base">
                Keep the name and photo connected to your StudioSpace account
                up to date. Changes are saved securely through Better Auth and
                appear across the app.
              </p>
            </div>

            <Link
              href="/my-listings"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-charcoal shadow-sm transition hover:border-brand-bronze hover:text-brand-bronze focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2 md:self-auto"
            >
              <LayoutDashboard className="h-4 w-4" />
              Manage listings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
          <Card className="gap-0 overflow-hidden border-brand-border bg-white py-0 shadow-sm">
            <CardHeader className="border-b border-brand-border px-6 py-5">
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-brand-bronze-light/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-bronze">
                <Sparkles className="h-3 w-3" />
                Live preview
              </div>

              <CardTitle className="text-lg font-semibold text-brand-charcoal">
                Profile preview
              </CardTitle>

              <CardDescription className="text-sm leading-6 text-brand-stone">
                This is how your profile identity will appear across
                StudioSpace.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-6 py-6">
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-border bg-brand-ivory/70 px-5 py-8 text-center">
                <div className="relative">
                  <Avatar className="size-28 border-4 border-white shadow-xl shadow-brand-charcoal/10 ring-1 ring-brand-border sm:size-32">
                    {previewImageUrl ? (
                      <AvatarImage
                        key={previewImageUrl}
                        src={previewImageUrl}
                        alt={displayName}
                        onLoadingStatusChange={setImageStatus}
                      />
                    ) : null}

                    <AvatarFallback className="bg-brand-bronze text-2xl font-bold text-brand-charcoal sm:text-3xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-brand-charcoal text-brand-ivory shadow-sm">
                    <ImageIcon className="h-4 w-4" />
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="break-words text-xl font-semibold tracking-tight text-brand-charcoal">
                    {displayName}
                  </p>

                  <p className="mt-1 break-all text-sm text-brand-stone">
                    {displayEmail}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-bronze/20 bg-brand-bronze-light/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-bronze">
                  <ShieldCheck className="h-3 w-3" />
                  StudioSpace member
                </span>
              </div>

              <div className="rounded-xl border border-brand-border bg-white p-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-bronze-light/50 text-brand-bronze">
                    <ImageIcon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-stone">
                      Profile image
                    </p>

                    <p className="mt-1 break-all text-xs leading-5 text-brand-charcoal">
                      {previewImageUrl || "Default avatar using your initials"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-0 overflow-hidden border-brand-border bg-white py-0 shadow-sm">
            <CardHeader className="border-b border-brand-border px-6 py-5">
              <CardTitle className="text-lg font-semibold text-brand-charcoal">
                Account details
              </CardTitle>

              <CardDescription className="text-sm leading-6 text-brand-stone">
                Update the name and profile image associated with your account.
                Your email is managed by your sign-in provider.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-6 px-6 py-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="profile-name"
                    className="text-sm font-semibold text-brand-charcoal"
                  >
                    <UserRound className="h-4 w-4 text-brand-bronze" />
                    Name
                  </Label>

                  <Input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={() => setShowNameValidation(true)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    maxLength={80}
                    required
                    aria-invalid={showNameError}
                    aria-describedby={
                      showNameError ? "profile-name-error" : "profile-name-help"
                    }
                    className="h-11 rounded-xl border-brand-border bg-brand-ivory/30 px-3 text-sm text-brand-charcoal placeholder:text-brand-stone/60 focus-visible:border-brand-bronze focus-visible:ring-brand-bronze/20"
                  />

                  {showNameError ? (
                    <p
                      id="profile-name-error"
                      role="alert"
                      className="flex items-start gap-2 text-xs font-medium text-red-600"
                    >
                      <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {nameError}
                    </p>
                  ) : (
                    <p
                      id="profile-name-help"
                      className="text-xs leading-5 text-brand-stone"
                    >
                      This name appears on your profile and studio listings.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="profile-image"
                    className="text-sm font-semibold text-brand-charcoal"
                  >
                    <ImageIcon className="h-4 w-4 text-brand-bronze" />
                    Profile image URL
                  </Label>

                  <Input
                    id="profile-image"
                    name="image"
                    type="url"
                    inputMode="url"
                    value={imageUrl}
                    onChange={(event) =>
                      handleImageUrlChange(event.target.value)
                    }
                    onBlur={() => setShowImageValidation(true)}
                    placeholder="https://example.com/your-photo.jpg"
                    autoComplete="photo"
                    aria-invalid={hasImageProblem}
                    aria-describedby={
                      hasImageProblem
                        ? "profile-image-error"
                        : "profile-image-help"
                    }
                    className="h-11 rounded-xl border-brand-border bg-brand-ivory/30 px-3 text-sm text-brand-charcoal placeholder:text-brand-stone/60 focus-visible:border-brand-bronze focus-visible:ring-brand-bronze/20"
                  />

                  {showImageError ? (
                    <p
                      id="profile-image-error"
                      role="alert"
                      className="flex items-start gap-2 text-xs font-medium text-red-600"
                    >
                      <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {imageUrlError}
                    </p>
                  ) : isBrokenImage ? (
                    <p
                      id="profile-image-error"
                      role="alert"
                      className="flex items-start gap-2 text-xs font-medium text-amber-700"
                    >
                      <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      This image URL could not be loaded. The default avatar is
                      shown instead.
                    </p>
                  ) : trimmedImageUrl ? (
                    <p
                      id="profile-image-help"
                      aria-live="polite"
                      className="flex items-start gap-2 text-xs leading-5 text-brand-stone"
                    >
                      {imageStatus === "loading" ? (
                        <Spinner className="mt-0.5 size-3.5" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      )}
                      {imageStatus === "loading"
                        ? "Loading image preview..."
                        : "Live preview is active. Use a direct link to a JPG, PNG, or WebP image."}
                    </p>
                  ) : (
                    <p
                      id="profile-image-help"
                      className="flex items-start gap-2 text-xs leading-5 text-brand-stone"
                    >
                      <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      No image URL added. Your initials will be used as the
                      default avatar.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="profile-email"
                    className="text-sm font-semibold text-brand-charcoal"
                  >
                    <Mail className="h-4 w-4 text-brand-bronze" />
                    Email address
                    <span className="ml-auto rounded-full bg-brand-stone/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-stone">
                      Read only
                    </span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={displayEmail}
                      readOnly
                      aria-readonly="true"
                      aria-describedby="profile-email-help"
                      className="h-11 cursor-not-allowed rounded-xl border-brand-border bg-brand-stone/5 pr-10 text-sm text-brand-stone focus-visible:border-brand-border focus-visible:ring-0"
                    />

                    <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-stone/70" />
                  </div>

                  <p
                    id="profile-email-help"
                    className="text-xs leading-5 text-brand-stone"
                  >
                    Your email is connected to your sign-in provider and cannot
                    be changed here.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-stretch justify-between gap-3 border-t border-brand-border bg-brand-ivory/50 px-6 py-4 sm:flex-row sm:items-center">
                <p className="flex items-center gap-2 text-xs leading-5 text-brand-stone">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-brand-bronze" />
                  Updates are saved securely through Better Auth.
                </p>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="h-11 shrink-0 rounded-xl bg-brand-bronze px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-bronze-hover focus-visible:ring-brand-bronze disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <Spinner className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Profile
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </section>
    </main>
  );
}
