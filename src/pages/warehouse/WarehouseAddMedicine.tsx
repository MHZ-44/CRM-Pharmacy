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
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-white via-slate-100 to-blue-50">

      <form
        onSubmit={handleSubmit}
        className="w-[500px] bg-white shadow-xl rounded-3xl p-8 space-y-4"
      >

        <h1 className="text-2xl font-bold text-blue-800">
          Add Medicine
        </h1>

        <input
          name="name"
          placeholder="Medicine name"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />

        <input
          name="strength"
          placeholder="Strength"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />

        <input
          name="company"
          placeholder="Company"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />

        <input
          name="expiryDate"
          type="date"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
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