import { useEffect, useRef } from "react";
import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  type IScannerControls,
} from "@zxing/browser";

function isExpectedVideoAbortError(error: unknown) {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    error.name === "AbortError" ||
    message.includes("aborted by the user agent") ||
    message.includes("play request was interrupted")
  );
}

type BarcodeScannerProps = {
  onScan: (value: string) => void;
  requireNumeric?: boolean;
  minLength?: number;
  confirmReads?: number;
  stabilizeMs?: number;
  allowedLengths?: number[];
  possibleFormats?: BarcodeFormat[];
};
export default function BarcodeScanner({
  onScan,
  requireNumeric = false,
  minLength = 1,
  confirmReads = 2,
  stabilizeMs = 700,
  allowedLengths,
  possibleFormats,
}: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasCompletedScanRef = useRef(false);
  const onScanRef = useRef(onScan);
  const lastCandidateRef = useRef("");
  const candidateCountRef = useRef(0);
  const candidateFirstSeenAtRef = useRef(0);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    if (possibleFormats && possibleFormats.length > 0) {
      codeReader.possibleFormats = possibleFormats;
    }
    hasCompletedScanRef.current = false;
    lastCandidateRef.current = "";
    candidateCountRef.current = 0;
    candidateFirstSeenAtRef.current = 0;

    let controls: IScannerControls | null = null;
    let cancelled = false;

    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, _error) => {
            if (result) {
              if (hasCompletedScanRef.current) return;

              const text = result.getText().trim();
              const isNumeric = /^\d+$/.test(text);
              const hasValue = text.length > 0;

              if (!hasValue) {
                return;
              }

              if (requireNumeric && !isNumeric) {
                return;
              }

              if (text.length < minLength) {
                return;
              }

              if (
                allowedLengths &&
                allowedLengths.length > 0 &&
                !allowedLengths.includes(text.length)
              ) {
                return;
              }

              if (lastCandidateRef.current === text) {
                candidateCountRef.current += 1;
              } else {
                lastCandidateRef.current = text;
                candidateCountRef.current = 1;
                candidateFirstSeenAtRef.current = Date.now();
              }

              if (candidateCountRef.current < Math.max(1, confirmReads)) {
                return;
              }

              if (
                Date.now() - candidateFirstSeenAtRef.current <
                Math.max(0, stabilizeMs)
              ) {
                return;
              }

              hasCompletedScanRef.current = true;
              onScanRef.current(text);
              controls?.stop();
            }
          },
        );

        if (cancelled) {
          controls.stop();
        }
      } catch (error) {
        if (isExpectedVideoAbortError(error)) {
          return;
        }

        console.error("Failed to start barcode scanner", error);
      }
    };
    void startScanner();
    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [allowedLengths, confirmReads, minLength, possibleFormats, requireNumeric, stabilizeMs]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%" }} />
    </div>
  );
}
