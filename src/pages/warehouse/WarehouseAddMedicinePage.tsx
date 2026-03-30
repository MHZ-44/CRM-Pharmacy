import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function WarehouseAddMedicine() {
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState({
    name: "",
    strength: "",
    quantity: "",
    company: "",
    price: "",
    expiryDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedicine({
      ...medicine,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");

    medicines.push({
      ...medicine,
      id: Date.now(),
    });

    localStorage.setItem("medicines", JSON.stringify(medicines));

    toast.success("Medicine added successfully");

    navigate("/warehouse");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-white via-slate-200 to-blue-100 text-slate-900 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-[500px] rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-4 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Add Medicine
        </h1>

        <input
          name="name"
          placeholder="Medicine name"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />

        <input
          name="strength"
          placeholder="Strength"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />

        <input
          name="company"
          placeholder="Company"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />

        <input
          name="expiryDate"
          type="date"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Medicine
        </Button>

      </form>
    </div>
  );
}
