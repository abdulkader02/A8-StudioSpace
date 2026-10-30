
"use client";

import { useState } from "react";
import {
  Check,
  PackagePlus,
  RotateCcw,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Admin session type
type AdminSession = {
  name: string;
  email: string;
};

// Studio form type
type FormValues = {
  title: string;
  category: string;
  price: string;
  capacity: string;
  securityDeposit: string;
  city: string;
  area: string;
  imageUrl: string;
  amenities: string[];
  description: string;
};

type TextField = Exclude<keyof FormValues, "amenities">;

const initialForm: FormValues = {
  title: "",
  category: "",
  price: "",
  capacity: "",
  securityDeposit: "",
  city: "",
  area: "",
  imageUrl: "",
  amenities: [],
  description: "",
};

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
  "Dance Studio",
  "Content Creation Studio",
  "Meeting Space",
  "Other",
];

const amenities = [
  "High-Speed Wi-Fi",
  "Air Conditioning",
  "Professional Lighting",
  "Photography Equipment",
  "Video Equipment",
  "Soundproofing",
  "Green Screen",
  "Makeup Room",
  "Changing Room",
  "Parking",
  "Waiting Area",
  "Restroom",
  "Kitchen Access",
  "Power Backup",
];

export default function AddStudioPage() {
  const [form, setForm] = useState<FormValues>(initialForm);

  // Replace this state with your actual Better Auth session data.
  const [adminSession] = useState<AdminSession | null>(null);

  const update = (field: TextField, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      category: form.category,
      price: Number(form.price),
      priceUnit: "hour",
      currency: "USD",
      capacity: Number(form.capacity),
      securityDeposit: Number(form.securityDeposit || 0),
      location: {
        city: form.city.trim(),
        area: form.area.trim(),
      },
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      amenities: form.amenities,
      description: form.description.trim(),
      isPublished: false,
      isFeatured: false,
    };

    console.log("New Studio Data:", payload);

    // TODO: Connect this payload to your Express API.
  };

  return (
    <main className="min-h-screen bg-brand-ivory px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-bronze/30 bg-brand-bronze-light/20 px-3 py-1 text-sm font-medium text-brand-bronze">
            <PackagePlus className="h-4 w-4" />
            Studio Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl">
            Add New Studio
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-stone sm:text-base">
            Add your studio details, facilities, and pricing information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Admin Information */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Admin Information
              </h2>

              <p className="mt-1 text-sm text-brand-stone">
                Populated from your authenticated session — not editable.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="adminName">Admin Name</Label>

                <Input
                  id="adminName"
                  value={adminSession?.name ?? ""}
                  placeholder="Loading admin information..."
                  readOnly
                  aria-readonly="true"
                  className="h-12 cursor-not-allowed bg-brand-ivory text-brand-stone"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="adminEmail">Admin Email</Label>

                <Input
                  id="adminEmail"
                  type="email"
                  value={adminSession?.email ?? ""}
                  placeholder="Loading admin information..."
                  readOnly
                  aria-readonly="true"
                  className="h-12 cursor-not-allowed bg-brand-ivory text-brand-stone"
                />
              </div>
            </div>
          </section>

          {/* Basic Information */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-brand-stone">
                Provide the essential details about your studio.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="title">Studio Name *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Creative Photography Studio"
                  className="h-12"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Studio Category *</Label>

                <Select
                  value={form.category}
                  onValueChange={(value) => update("category", value)}
                  required
                >
                  <SelectTrigger id="category" className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="capacity">Guest Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  placeholder="e.g. 20"
                  className="h-12"
                  required
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Pricing Information
              </h2>
              <p className="mt-1 text-sm text-brand-stone">
                Set your studio rental price in US Dollars.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="price">Hourly Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="e.g. 50"
                  className="h-12"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="securityDeposit">
                  Security Deposit (USD)
                </Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.securityDeposit}
                  onChange={(e) =>
                    update("securityDeposit", e.target.value)
                  }
                  placeholder="e.g. 100"
                  className="h-12"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Studio Location
              </h2>
              <p className="mt-1 text-sm text-brand-stone">
                Where is your studio located?
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="e.g. New York"
                  className="h-12"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="area">Area / Neighborhood *</Label>
                <Input
                  id="area"
                  value={form.area}
                  onChange={(e) => update("area", e.target.value)}
                  placeholder="e.g. Manhattan"
                  className="h-12"
                  required
                />
              </div>
            </div>
          </section>

          {/* Studio Image */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Studio Image
              </h2>
              <p className="mt-1 text-sm text-brand-stone">
                Add a URL for the main studio image.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="https://example.com/studio-image.jpg"
                className="h-12"
              />
            </div>
          </section>

          {/* Amenities */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-brand-charcoal">
                  Studio Amenities
                </h2>
                <p className="mt-1 text-sm text-brand-stone">
                  Select all facilities available at your studio.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    amenities: [],
                  }))
                }
                className="text-brand-bronze hover:bg-brand-bronze-light/20"
              >
                Clear all
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((amenity) => {
                const selected = form.amenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    aria-pressed={selected}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
                      selected
                        ? "border-brand-bronze bg-brand-bronze-light/20 text-brand-charcoal"
                        : "border-brand-border text-brand-stone hover:border-brand-bronze/50"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        selected
                          ? "border-brand-bronze bg-brand-bronze text-white"
                          : "border-brand-border"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>

                    {amenity}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Description */}
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Studio Description
              </h2>
              <p className="mt-1 text-sm text-brand-stone">
                Describe your studio and what makes it suitable for creative work.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe your studio, facilities, and suitable activities..."
                className="min-h-36 resize-y"
                required
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-12 border-brand-border text-brand-charcoal hover:bg-brand-ivory"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Form
            </Button>

            <Button
              type="submit"
              className="h-12 bg-brand-bronze px-8 text-white hover:bg-brand-bronze-hover"
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              Add Studio
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
