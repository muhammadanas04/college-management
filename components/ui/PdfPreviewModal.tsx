import { useState, useEffect } from "react";
import { platform } from "@/lib/platform";

interface PdfPreviewModalProps {
  open: boolean;
  onClose: () => void;
  blob: Blob | null;
  filename: string;
}

export function PdfPreviewModal({ open, onClose, blob, filename }: PdfPreviewModalProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (blob) {
      const newUrl = URL.createObjectURL(blob);
      setUrl(newUrl);
      return () => URL.revokeObjectURL(newUrl);
    } else {
      setUrl(null);
    }
  }, [blob]);

  const handleDownload = async () => {
    if (blob) {
      await platform.downloadFile(blob, filename);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-card border rounded-xl shadow-lg w-full max-w-4xl h-[90vh] mx-4 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">PDF Preview</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 bg-muted/30 overflow-hidden relative p-4">
          {url ? (
            <iframe 
              src={`${url}#view=FitH`} 
              className="w-full h-full border rounded bg-white"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              Loading preview...
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
            Close
          </button>
          <button onClick={handleDownload} className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
