import { useState } from "react";
import { BarcodeFormat } from "@zxing/browser";
import { useNavigate, useSearchParams } from "react-router-dom";

import BarcodeScanner from "@/components/BarcodeScanner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

const PRODUCT_BARCODE_LENGTHS = [8, 12, 13, 14];
const PRODUCT_BARCODE_FORMATS = [
  BarcodeFormat.EAN_8,
  BarcodeFormat.EAN_13,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.ITF,
  BarcodeFormat.CODE_128,
];

export default function ScannerButton() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("barcode", value);
    navigate(`/settings?${nextParams.toString()}`, { replace: true });
  };

  return (
    <div className="min-h-full w-full bg-muted/30">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Field orientation="horizontal">
          <Button
            type="button"
            variant={isScannerOpen ? "secondary" : "outline"}
            onClick={() => setIsScannerOpen((value) => !value)}
          >
            {isScannerOpen ? "Close Scanner" : "Scan Barcode"}
          </Button>
        </Field>

        {isScannerOpen && (
          <div className="w-full max-w-sm rounded-md border bg-background p-3">
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
        )}
      </div>
    </div>
  );
}
