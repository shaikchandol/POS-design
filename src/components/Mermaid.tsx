import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter',
});

interface MermaidProps {
  chart: string;
  id: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart, id }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    }
  }, [chart, id]);

  return <div ref={ref} className="mermaid-chart flex justify-center py-4 bg-gray-900/50 rounded-xl overflow-x-auto" />;
};
