import React from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  documentTitle?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  contentRef,
  documentTitle = "Print Document",
  buttonText = "Print",
  variant = "outline",
  size = "default",
  className = "",
}) => {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    onBeforePrint: async () => {
      console.log("Preparing to print...");
    },
    onAfterPrint: async () => {
      console.log("Print completed");
    },
  });

  const handleClick = () => {
    // Validate ref before printing
    if (!contentRef.current) {
      console.error("Print error: Content ref is not attached to any element");
      alert("Không thể in: Nội dung chưa được tải. Vui lòng thử lại.");
      return;
    }

    if (
      !contentRef.current.innerHTML ||
      contentRef.current.innerHTML.trim() === ""
    ) {
      console.error("Print error: Content ref element is empty");
      alert("Không thể in: Nội dung trống. Vui lòng đảm bảo có dữ liệu để in.");
      return;
    }

    handlePrint();
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      <Printer className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
};
