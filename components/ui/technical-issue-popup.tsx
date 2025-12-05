"use client";

import { useState } from "react";
import { Bug } from "lucide-react";

export default function TechnicalIssuePopup({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);

    try {
      await onSubmit(message);
      setMessage("");
    } catch (err) {
      console.error("Error submitting issue:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl p-6 sm:p-8 rounded-xl w-full max-w-lg relative">

        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
            Report an Issue
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
          Please describe the issue you experienced in detail. Our support team will review your report and get back to you as soon as possible.
        </p>

        {/* Textarea */}
        <textarea
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white mb-6"
          rows={6}
          placeholder="Describe the issue you experienced..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Issue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
