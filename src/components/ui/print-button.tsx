import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  documentTitle?: string;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  contentRef,
  documentTitle = 'Print Document',
  buttonText = 'Print',
  variant = 'outline',
  size = 'default',
  className = ''
}) => {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
    `,
  });

  return (
    <Button
      onClick={handlePrint}
      variant={variant}
      size={size}
      className={className}
    >
      <Printer className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
};