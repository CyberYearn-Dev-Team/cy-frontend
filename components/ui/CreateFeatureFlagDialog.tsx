"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  createFeatureFlag,
  CreateFeatureFlagDTO,
} from "@/lib/services/featureFlagService";

// Theme Colors (same as stored file)
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";

interface CreateFeatureFlagDialogProps {
  onSuccess: () => void;
}

export function CreateFeatureFlagDialog({
  onSuccess,
}: CreateFeatureFlagDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateFeatureFlagDTO>({
    name: "",
    description: "",
    impact: "medium",
    stage: "experimental",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createFeatureFlag(formData);
      toast.success("Feature flag created successfully!");
      setOpen(false);
      onSuccess();

      setFormData({
        name: "",
        description: "",
        impact: "medium",
        stage: "experimental",
      });
    } catch (error) {
      console.error("Error creating feature flag:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create feature flag"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Styled to match All Categories button */}
        <button
          className={`
            flex items-center justify-center px-4 py-2 rounded-lg border 
            border-gray-300 dark:border-gray-700 ${bgCard} ${textDark}
            hover:bg-gray-100 dark:hover:bg-gray-700 transition 
            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
          `}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Flag
        </button>
      </DialogTrigger>

      <DialogContent className={`${bgCard} text-gray-900 dark:text-gray-100`}>
        <DialogHeader>
          <DialogTitle className={`font-semibold ${textDark}`}>
            Create New Feature Flag
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className={textMedium}>
              Name
            </Label>
            <Input
              id="name"
              className={`${bgCard} border-gray-300 dark:border-gray-700`}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter feature name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className={textMedium}>
              Description
            </Label>
            <Textarea
              id="description"
              className={`${bgCard} border-gray-300 dark:border-gray-700`}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter feature description"
              rows={3}
              required
            />
          </div>

          {/* Impact + Stage */}
          <div className="flex justify-between gap-4">
            {/* Impact */}
            <div className="space-y-2">
              <Label htmlFor="impact" className={textMedium}>
                Impact
              </Label>
              <Select
                value={formData.impact}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setFormData({ ...formData, impact: value })
                }
              >
                <SelectTrigger
                  className={`${bgCard} border-gray-300 dark:border-gray-700`}
                >
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent className={bgCard}>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stage */}
            <div className="space-y-2">
              <Label htmlFor="stage" className={textMedium}>
                Stage
              </Label>
              <Select
                value={formData.stage}
                onValueChange={(value: "experimental" | "beta") =>
                  setFormData({ ...formData, stage: value })
                }
              >
                <SelectTrigger
                  className={`${bgCard} border-gray-300 dark:border-gray-700`}
                >
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className={bgCard}>
                  <SelectItem value="experimental">Experimental</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="core">Core</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between space-x-2 pt-4">
            {/* Cancel */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className={`
                px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                ${bgCard} ${textDark} hover:bg-gray-100 dark:hover:bg-gray-700 
                transition disabled:opacity-50 cursor-pointer
              `}
            >
              Cancel
            </button>

            {/* Submit — primary theme button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-4 py-2 rounded-lg text-white 
                transition duration-200 cursor-pointer
              `}
              style={{
                backgroundColor: primary,
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor = hover)
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor = primary)
              }
            >
              {isSubmitting ? "Creating..." : "Create Flag"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
