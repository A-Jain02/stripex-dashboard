// src/components/PaymentModal.tsx

import { useState } from "react";
import toast from "react-hot-toast";

export default function PaymentModal({ onClose, onSuccess, plan }: { onClose: () => void; onSuccess: () => void; plan: string }) {
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    if (!name || !card || !expiry || !cvv) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Payment for ${plan} plan successful!`);
      onSuccess(); // triggers plan update
      onClose();
    }, 2000); // simulate delay
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-indigo-600">Checkout - {plan} Plan</h2>

        <input
          type="text"
          placeholder="Name on Card"
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Card Number"
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700"
          value={card}
          onChange={(e) => setCard(e.target.value)}
        />
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="MM/YY"
            className="w-1/2 p-2 rounded border dark:bg-gray-700"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-1/2 p-2 rounded border dark:bg-gray-700"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
