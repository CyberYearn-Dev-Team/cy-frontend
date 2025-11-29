"use client";

import { useState } from "react";
import { X } from "lucide-react";

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl p-6 rounded-xl w-full max-w-md relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-2">Report Technical Issue</h2>

        {/* NEW WRITE-UP */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Please let us know what issue you encountered, what you were trying to
          do, or any unexpected behavior you noticed. Your feedback helps us fix
          problems quickly and improve your experience.
        </p>

        <textarea
          className="w-full p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none"
          rows={6}
          placeholder="Describe the issue you experienced..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={() => {
            if (message.trim().length < 3) return;
            onSubmit(message);
            setMessage("");
          }}
          className="w-full mt-4 bg-[#72a210] text-white py-2 rounded-lg font-semibold cursor-pointer"
        >
          Submit Issue
        </button>
      </div>
    </div>
  );
}
