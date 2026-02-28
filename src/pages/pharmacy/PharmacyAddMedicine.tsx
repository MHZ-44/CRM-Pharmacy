import { useState, useEffect } from "react";
import { BarcodeFormat } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import BarcodeScanner from "@/components/BarcodeScanner";
import { useGetOneMedicine } from "@/hooks/pharmacy/useGetOneMedicine";
import { useCreateMedicine } from "@/hooks/pharmacy/useCreateMedicine";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useNavigate } from "react-router-dom";

const PRODUCT_BARCODE_LENGTHS = [13];
const PRODUCT_BARCODE_FORMATS = [BarcodeFormat.EAN_13];

function PharmacyAddMedicine() {
  const [showScanner, setShowScanner] = useState(false);
  const [barcode, setBarcode] = useState("");
  const { mutate: createMedicine, isPending } = useCreateMedicine();
  const navigate = useNavigate();
  const { data: medicineByBarcode, isSuccess } = useGetOneMedicine(barcode);
  const isExisting = Boolean(medicineByBarcode);

  const [name, setName] = useState("");
  const [strength, setStrength] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [form, setForm] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (!barcode.trim()) {
      setName("");
      setStrength("");
      setCompanyName("");
      setForm("");
      return;
    }

    if (medicineByBarcode) {
      setName(medicineByBarcode.name);
      setStrength(medicineByBarcode.strength);
      setCompanyName(medicineByBarcode.company_name);
      setForm(medicineByBarcode.form);
      return;
    }

    if (isSuccess) {
      setName("");
      setStrength("");
      setCompanyName("");
      setForm("");
    }
  }, [barcode, isSuccess, medicineByBarcode]);

  const handleScan = (value: string) => {
    setBarcode(value);
    setShowScanner(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedQuantity = Number.parseInt(quantity, 10);

    if (!barcode.trim()) {
      toast.error("Barcode is required.");
      return;
    }

    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      toast.error("Quantity must be a valid non-negative number.");
      return;
    }

    const formData = {
      barcode: barcode.trim(),
      name,
      strength,
      company_name: companyName,
      form,
      cost_price: costPrice,
      default_sell_price: costPrice,
      quantity: parsedQuantity,
    };

    createMedicine(formData, {
      onSuccess: () => {
        toast.success("Medicine saved successfully.");
        setName("");
        setStrength("");
        setCompanyName("");
        setForm("");
        setCostPrice("");
        setQuantity("");
        setBarcode("");
        navigate("/");
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Failed to save medicine."));
      },
    });
  };

  return (
    <div className="min-h-full w-full bg-muted/30">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight">
          Create Medicine
        </h1>

        <Card className="w-full">
          <CardContent className="px-8">
            <form className="w-full text-lg" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field>
                    <FieldLabel className="text-base" htmlFor="form-name">
                      Name
                    </FieldLabel>
                    <Input
                      id="form-name"
                      type="text"
                      placeholder="Paracetamol"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={isExisting}
                      className="h-11 text-base md:text-base"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-base" htmlFor="form-strength">
                      Strength
                    </FieldLabel>
                    <Input
                      id="form-strength"
                      type="text"
                      placeholder="500mg"
                      value={strength}
                      onChange={(event) => setStrength(event.target.value)}
                      disabled={isExisting}
                      className="h-11 text-base md:text-base"
                    />
                  </Field>

                  <Field className="md:col-span-2">
                    <FieldLabel className="text-base" htmlFor="form-barcode">
                      Barcode
                    </FieldLabel>
                    <div className="flex flex-wrap gap-3">
                      <Input
                        id="form-barcode"
                        type="text"
                        placeholder="Scan or enter barcode"
                        value={barcode}
                        onChange={(event) => setBarcode(event.target.value)}
                        className="h-11 text-base md:text-base"
                      />
                      <Button
                        type="button"
                        variant={showScanner ? "secondary" : "outline"}
                        onClick={() => setShowScanner((value) => !value)}
                      >
                        {showScanner ? "Close Scanner" : "Scan Barcode"}
                      </Button>
                    </div>
                    <FieldDescription>
                      {isExisting
                        ? "Barcode exists. Product fields are auto-filled and locked."
                        : "Use the camera to scan the product barcode."}
                    </FieldDescription>
                  </Field>

                  {showScanner && (
                    <Field className="md:col-span-2">
                      <div className="w-full max-w-xs rounded-md border bg-background p-3">
                        <BarcodeScanner
                          requireNumeric
                          minLength={8}
                          confirmReads={2}
                          stabilizeMs={800}
                          allowedLengths={PRODUCT_BARCODE_LENGTHS}
                          possibleFormats={PRODUCT_BARCODE_FORMATS}
                          onScan={handleScan}
                        />
                      </div>
                    </Field>
                  )}

                  <Field>
                    <FieldLabel className="text-base" htmlFor="form-company">
                      Company
                    </FieldLabel>
                    <Input
                      id="form-company"
                      type="text"
                      placeholder="Pfizer"
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      disabled={isExisting}
                      className="h-11 text-base md:text-base"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-base" htmlFor="form-form">
                      Form
                    </FieldLabel>
                    <Input
                      id="form-form"
                      type="text"
                      placeholder="Tablets"
                      value={form}
                      onChange={(event) => setForm(event.target.value)}
                      disabled={isExisting}
                      className="h-11 text-base md:text-base"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-base" htmlFor="form-cost">
                      Cost Price
                    </FieldLabel>
                    <Input
                      id="form-cost"
                      type="number"
                      step="0.01"
                      placeholder="2.50"
                      value={costPrice}
                      onChange={(event) => setCostPrice(event.target.value)}
                      className="h-11 text-base md:text-base"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-base" htmlFor="form-qty">
                      Quantity
                    </FieldLabel>
                    <Input
                      id="form-qty"
                      type="number"
                      placeholder="0"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      className="h-11 text-base md:text-base"
                    />
                  </Field>
                </div>

                <Field orientation="horizontal">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PharmacyAddMedicine;
