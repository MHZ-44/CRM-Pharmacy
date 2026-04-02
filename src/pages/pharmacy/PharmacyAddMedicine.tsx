import { useCallback, useState } from "react";
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
  const { data: medicineByBarcode } = useGetOneMedicine(barcode);
  const isExisting = Boolean(medicineByBarcode);

  const [draft, setDraft] = useState({
    name: "",
    strength: "",
    companyName: "",
    form: "",
  });
  const [costPrice, setCostPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const displayName = isExisting ? medicineByBarcode?.name ?? "" : draft.name;
  const displayStrength = isExisting
    ? medicineByBarcode?.strength ?? ""
    : draft.strength;
  const displayCompanyName = isExisting
    ? medicineByBarcode?.company_name ?? ""
    : draft.companyName;
  const displayForm = isExisting ? medicineByBarcode?.form ?? "" : draft.form;

  const tryAutoSubmit = useCallback(
    (nextBarcode: string) => {
      const parsedQuantity = Number.parseInt(quantity, 10);
      const parsedCostPrice = Number.parseFloat(costPrice);

      if (!nextBarcode.trim()) return;
      if (!displayName.trim()) return;
      if (!displayStrength.trim()) return;
      if (!displayCompanyName.trim()) return;
      if (!displayForm.trim()) return;
      if (Number.isNaN(parsedCostPrice) || parsedCostPrice <= 0) return;
      if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) return;

      const formData = {
        barcode: nextBarcode.trim(),
        name: displayName,
        strength: displayStrength,
        company_name: displayCompanyName,
        form: displayForm,
        cost_price: parsedCostPrice,
        default_sell_price: parsedCostPrice,
        quantity: parsedQuantity,
      };

      createMedicine(formData, {
        onSuccess: () => {
          toast.success("Medicine saved successfully.");
          setDraft({
            name: "",
            strength: "",
            companyName: "",
            form: "",
          });
          setCostPrice("");
          setQuantity("");
          setBarcode("");
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Failed to save medicine."));
        },
      });
    },
    [
      costPrice,
      quantity,
      displayName,
      displayStrength,
      displayCompanyName,
      displayForm,
      createMedicine,
    ],
  );

  const handleScan = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setBarcode(trimmed);
    setDraft({
      name: "",
      strength: "",
      companyName: "",
      form: "",
    });
    tryAutoSubmit(trimmed);
  };
  const handleBarcodeChange = (value: string) => {
    setBarcode(value);
    setDraft({
      name: "",
      strength: "",
      companyName: "",
      form: "",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedQuantity = Number.parseInt(quantity, 10);
    const parsedCostPrice = Number.parseFloat(costPrice);

    if (!barcode.trim()) {
      toast.error("Barcode is required.");
      return;
    }

    if (!displayName.trim()) {
      toast.error("Medicine name is required.");
      return;
    }

    if (!displayStrength.trim()) {
      toast.error("Strength is required.");
      return;
    }

    if (!displayCompanyName.trim()) {
      toast.error("Company is required.");
      return;
    }

    if (!displayForm.trim()) {
      toast.error("Form is required.");
      return;
    }

    if (Number.isNaN(parsedCostPrice) || parsedCostPrice <= 0) {
      toast.error("Cost price must be a valid positive number.");
      return;
    }

    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      toast.error("Quantity must be a valid non-negative number.");
      return;
    }

    const formData = {
      barcode: barcode.trim(),
      name: displayName,
      strength: displayStrength,
      company_name: displayCompanyName,
      form: displayForm,
      cost_price: parsedCostPrice,
      default_sell_price: parsedCostPrice,
      quantity: parsedQuantity,
    };

    createMedicine(formData, {
      onSuccess: () => {
        toast.success("Medicine saved successfully.");
        setDraft({
          name: "",
          strength: "",
          companyName: "",
          form: "",
        });
        setCostPrice("");
        setQuantity("");
        setBarcode("");
        navigate("/pharmacy/medicines");
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Failed to save medicine."));
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-slate-200 to-blue-100 text-slate-900 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-blue-800 dark:text-blue-300">
            Create Medicine
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Add or scan a medicine to your pharmacy inventory
          </p>
        </div>

        <Card className="w-full border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-gray-900">
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
                        value={displayName}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        disabled={isExisting}
                        className="h-11 text-base md:text-base dark:bg-slate-900"
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
                        value={displayStrength}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            strength: event.target.value,
                          }))
                        }
                        disabled={isExisting}
                        className="h-11 text-base md:text-base dark:bg-slate-900"
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
                        onChange={(event) =>
                          handleBarcodeChange(event.target.value)
                        }
                        className="h-11 text-base md:text-base dark:bg-slate-900"
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
                          continuous
                          cooldownMs={1500}
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
                        value={displayCompanyName}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            companyName: event.target.value,
                          }))
                        }
                        disabled={isExisting}
                        className="h-11 text-base md:text-base dark:bg-slate-900"
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
                        value={displayForm}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            form: event.target.value,
                          }))
                        }
                        disabled={isExisting}
                        className="h-11 text-base md:text-base dark:bg-slate-900"
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
                      className="h-11 text-base md:text-base dark:bg-slate-900"
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
                      className="h-11 text-base md:text-base dark:bg-slate-900"
                    />
                  </Field>
                </div>

                <Field orientation="horizontal">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
                  >
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
