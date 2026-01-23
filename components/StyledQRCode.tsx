
import React, { useEffect, useRef } from 'react';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType
} from 'qr-code-styling';

interface StyledQRCodeProps {
  value: string;
  size: number;
  logo?: string;
}

const StyledQRCode: React.FC<StyledQRCodeProps> = ({ value, size, logo }) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling>(new QRCodeStyling({
    width: size,
    height: size,
    type: 'svg' as DrawType,
    data: value,
    margin: 0,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'L' as ErrorCorrectionLevel
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 0,
    },
    dotsOptions: {
      color: '#000000',
      type: 'square' as DotType
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'square' as CornerSquareType
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'square' as CornerDotType
    }
  }));

  useEffect(() => {
    if (ref.current) {
      qrCode.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    qrCode.current.update({
      data: value,
      width: size,
      height: size,
      image: logo
    });
  }, [value, size, logo]);

  return <div ref={ref} />;
};

export default StyledQRCode;
