"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

type Props = {
  studio: TStudio;
  onClose: () => void;
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

export default function EditStudioDialog({
  studio,
  onClose,
}: Props) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    ...studio,
    price: String(studio.price ?? ""),
    capacity: String(studio.capacity ?? ""),
    securityDeposit: String(studio.securityDeposit ?? ""),
    rating: String(studio.rating ?? ""),
    city: studio.location?.city || "",
    area: studio.location?.area || "",
    imageUrl: studio.imageUrls?.[0] || "",
  });

  // Field update
  const update = (field: string, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // Amenities update
  const toggleAmenity = (amenity: string) => {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  };

  // Submit
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      // Input-er extra fields ke MongoDB structure-e convert
      const {
        _id,
        city,
        area,
        imageUrl,
        ...studioData
      } = form;

      const updatedData = {
        ...studioData,
        price: Number(form.price),
        capacity: Number(form.capacity),
        securityDeposit: Number(form.securityDeposit || 0),
        rating: Number(form.rating || 0),

        location: {
          city: city.trim(),
          area: area.trim(),
        },

        imageUrls: imageUrl.trim()
          ? [imageUrl.trim()]
          : [],
      };

      const response = await fetch(
        `http://localhost:5000/studio/${_id}`,
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
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Update Studio Error:", error);
      toast.error("Could not update studio. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-brand-border bg-brand-ivory p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-brand-border bg-white p-5 text-left">
          <DialogTitle className="text-xl font-semibold text-brand-charcoal">
            Edit Studio
          </DialogTitle>

          <DialogDescription className="text-sm text-brand-stone">
            Update your studio information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-7"
        >
          {/* Host Information */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Host Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="hostName">Host Name</Label>

                <Input
                  id="hostName"
                  value={form.host?.name || ""}
                  placeholder="Not available"
                  readOnly
                  className="bg-brand-ivory"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hostEmail">Host Email</Label>

                <Input
                  id="hostEmail"
                  value={form.host?.email || ""}
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
                <Label htmlFor="title">Studio Name</Label>

                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) =>
                    update("title", event.target.value)
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>

                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    update("category", value ?? "")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="capacity">
                  Guest Capacity
                </Label>

                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) =>
                    update("capacity", event.target.value)
                  }
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
                <Label htmlFor="price">
                  Hourly Price (USD)
                </Label>

                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    update("price", event.target.value)
                  }
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
                  onChange={(event) =>
                    update(
                      "securityDeposit",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rating">
                  Rating (out of 5)
                </Label>

                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(event) =>
                    update("rating", event.target.value)
                  }
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
                <Label htmlFor="city">City</Label>

                <Input
                  id="city"
                  value={form.city}
                  onChange={(event) =>
                    update("city", event.target.value)
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="area">Area</Label>

                <Input
                  id="area"
                  value={form.area}
                  onChange={(event) =>
                    update("area", event.target.value)
                  }
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

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>

              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(event) =>
                  update("imageUrl", event.target.value)
                }
              />
            </div>
          </section>

          {/* Amenities */}
          <section className="rounded-xl border border-brand-border bg-white p-5">
            <h3 className="mb-4 font-semibold text-brand-charcoal">
              Studio Amenities
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {amenitiesList.map((amenity) => {
                const selected =
                  form.amenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-brand-bronze bg-brand-bronze-light/20 text-brand-charcoal"
                        : "border-brand-border text-brand-stone hover:bg-brand-ivory"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded border border-brand-bronze">
                      {selected && (
                        <Check className="h-3 w-3" />
                      )}
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
              id="description"
              value={form.description}
              onChange={(event) =>
                update("description", event.target.value)
              }
              placeholder="Describe your studio..."
              className="min-h-32"
              required
            />
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-brand-border text-brand-charcoal"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-bronze text-white hover:bg-brand-bronze-hover"
            >
              <Pencil className="mr-2 h-4 w-4" />

              {isSubmitting
                ? "Saving Changes..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}