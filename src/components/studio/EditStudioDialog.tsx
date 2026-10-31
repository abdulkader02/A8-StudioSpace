
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Pencil, X } from "lucide-react";

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
import type { TStudio } from "@/lib/type/type";

type FormValues = {
  title: string;
  category: string;
  price: string;
  capacity: string;
  securityDeposit: string;
  city: string;
  area: string;
  imageUrl: string;
  rating: string;
  amenities: string[];
  description: string;
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

const amenitiesList = [
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

type TProps = {
  studio: TStudio;
  onClose: () => void;
};

export default function EditStudioDialog({ studio, onClose }: TProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormValues>({
    title: studio.title || "",
    category: studio.category || "",
    price: String(studio.price ?? ""),
    capacity: String(studio.capacity ?? ""),
    securityDeposit: String(studio.securityDeposit ?? ""),
    city: studio.location?.city || "",
    area: studio.location?.area || "",
    imageUrl: studio.imageUrls?.[0] || "",
    rating: String(studio.rating ?? ""),
    amenities: studio.amenities || [],
    description: studio.description || "",
  });

  const update = (field: keyof FormValues, value: string) => {
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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSubmitting(true);


    const updatedData = {
      title: form.title.trim(),
      category: form.category,
      price: Number(form.price),
      priceUnit: studio.priceUnit,
      currency: studio.currency,
      capacity: Number(form.capacity),
      securityDeposit: Number(form.securityDeposit || 0),
      location: {
        city: form.city.trim(),
        area: form.area.trim(),
      },
      imageUrls: form.imageUrl.trim()
        ? [form.imageUrl.trim()]
        : [],
      amenities: form.amenities,
      description: form.description.trim(),
      rating: Number(form.rating || 0),
    };

    try {
      const response = await fetch(
        `http://localhost:5000/studio/${studio._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update studio");
      }

      toast.success("Studio updated successfully!");

      onClose();

      setTimeout(() => {
        router.push("/my-listings");
      }, 1000);
    } catch (error) {
      console.error("Update Studio Error:", error);
      toast.error("Could not update studio. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-charcoal/60 p-4 backdrop-blur-sm"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-brand-ivory shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-border bg-white p-5">
          <div>
            <h2 className="text-xl font-semibold text-brand-charcoal">
              Edit Studio
            </h2>
            <p className="mt-1 text-sm text-brand-stone">
              Update your studio information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-brand-stone hover:bg-brand-ivory"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
          {/* Host Information */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Host Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Host Name</Label>
                <Input
                  value={studio.host?.name || ""}
                  placeholder="Not available"
                  readOnly
                  className="bg-brand-ivory"
                />
              </div>

              <div className="grid gap-2">
                <Label>Host Email</Label>
                <Input
                  value={studio.host?.email || ""}
                  placeholder="Not available"
                  readOnly
                  className="bg-brand-ivory"
                />
              </div>
            </div>
          </section>

          {/* Basic Information */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Basic Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label>Studio Name</Label>
                <Input
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => update("category", value)}
                >
                  <SelectTrigger>
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
                <Label>Guest Capacity</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Pricing Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Hourly Price (USD)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Security Deposit (USD)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.securityDeposit}
                  onChange={(e) => update("securityDeposit", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Rating (out of 5)</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => update("rating", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Studio Location
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Area</Label>
                <Input
                  value={form.area}
                  onChange={(e) => update("area", e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          {/* Image */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Studio Image
            </h3>

            <Label>Image URL</Label>
            <Input
              type="url"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className="mt-2"
            />
          </section>

          {/* Amenities */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Studio Amenities
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {amenitiesList.map((amenity) => {
                const selected = form.amenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm ${
                      selected
                        ? "border-brand-bronze bg-brand-bronze-light/20 text-brand-charcoal"
                        : "border-brand-border text-brand-stone"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded border border-brand-bronze">
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    {amenity}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Description */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Studio Description
            </h3>

            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe your studio..."
              className="min-h-32"
              required
            />
          </section>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-bronze text-white hover:bg-brand-bronze-hover"
            >
              <Pencil className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
