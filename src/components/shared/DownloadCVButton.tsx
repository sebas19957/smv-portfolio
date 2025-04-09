"use client";

import Image from "next/image";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DownloadCVButton() {
  const handleDownloadEN = () => {
    const fileUrl =
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/pdfs/Sebasti%C3%A1n_Mosquera_cv_en.pdf";

    window.open(fileUrl, "_blank");
  };

  const handleDownloadES = () => {
    const fileUrl =
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/pdfs/Sebasti%C3%A1n_Mosquera_cv_es.pdf";

    window.open(fileUrl, "_blank");
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleDownloadEN}>
        <Download className="mr-2 h-4 w-4" /> Download CV
        <Image
          src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/svgs/en.svg"
          alt="English"
          width={16}
          height={16}
        />
      </Button>
      <Button onClick={handleDownloadES}>
        <Download className="mr-2 h-4 w-4" /> Descargar CV
        <Image
          src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/svgs/es.svg"
          alt="English"
          width={16}
          height={16}
        />
      </Button>
    </div>
  );
}
