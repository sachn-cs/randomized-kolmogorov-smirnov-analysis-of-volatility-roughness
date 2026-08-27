'use client';

import * as React from 'react';
import {toPng} from 'html-to-image';
import {Download} from 'lucide-react';
import {Button} from '@/components/ui/button';

export function FigureExportButton({
  targetId,
  filename,
}: {
  targetId: string;
  filename: string;
}) {
  const onClick = async () => {
    const node = document.getElementById(targetId);
    if (!node) return;
    const dataUrl = await toPng(node, {backgroundColor: 'hsl(220 38% 7%)'});
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  };
  return (
    <Button variant="secondary" onClick={onClick}>
      <Download className="h-4 w-4" />
      Export PNG
    </Button>
  );
}
