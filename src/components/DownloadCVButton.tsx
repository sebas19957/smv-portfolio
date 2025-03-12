"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadCVButton() {
  const handleDownload = () => {
    const fileUrl =
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/pdfs/cv_Sebastian_Mosquera.pdf";

    window.open(fileUrl, "_blank");
  };

  return (
    <Button onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" /> Descargar CV
    </Button>
  );
}
