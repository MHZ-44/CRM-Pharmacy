import { useState } from "react";
import BarcodeScanner from "@/components/BarcodeScanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarcodeFormat } from "@zxing/browser";

const PRODUCT_BARCODE_LENGTHS = [8, 12, 13, 14];
const PRODUCT_BARCODE_FORMATS = [
  BarcodeFormat.EAN_8,
  BarcodeFormat.EAN_13,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.ITF,
  BarcodeFormat.CODE_128,
];

export default function PharmacyAddNewMedicine() {
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
      <div className="w-full md:max-w-2xl">
        <h1 className="mb-3 text-lg font-semibold">Scan Product</h1>
        <BarcodeScanner
          requireNumeric
          minLength={8}
          confirmReads={2}
          stabilizeMs={800}
          allowedLengths={PRODUCT_BARCODE_LENGTHS}
          possibleFormats={PRODUCT_BARCODE_FORMATS}
          onScan={(value) => setCode(value)}
        />
      </div>

      <Card className="w-fit min-w-40 py-4">
        <CardHeader className="px-4 pb-1">
          <CardTitle className="text-sm">Barcode Result</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <p className="max-w-[220px] break-all font-mono text-xs">
            {code || "No code yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
