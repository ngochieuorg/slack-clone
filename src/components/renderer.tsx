import Quill from 'quill';
import { useEffect, useRef, useState } from 'react';
import 'quill-mention/autoregister';

interface RendererProps {
  value: string;
  cutWord?: number;
  textColor?: string;
  mentionBackground?: string;
  mentionColor?: string;
}

const Renderer = ({
  value,
  textColor = '#1d1c1d',
  mentionBackground = '#d5e3ee',
  mentionColor = '#1264a3',
}: RendererProps) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;

    const container = rendererRef.current;

    const quill = new Quill(document.createElement('div'), {
      theme: 'snow',
    });

    quill.enable(false);

    const contents = JSON.parse(value);

    quill.setContents(contents);

    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, '')
        .trim().length === 0;

    setIsEmpty(isEmpty);

    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [value]);

  useEffect(() => {
    const mentions = document.querySelectorAll('.ql-editor .mention');
    mentions.forEach((mention) => {
      (mention as HTMLElement).style.background = mentionBackground;
      (mention as HTMLElement).style.color = mentionColor;
    });
  }, []);

  if (isEmpty) return null;

  return (
    <div
      ref={rendererRef}
      className="ql-editor ql-renderer"
      style={{ color: textColor }}
    />
  );
};

export default Renderer;
