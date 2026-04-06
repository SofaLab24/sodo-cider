"use client";

import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import { hasLexicalContent } from "@/lib/rich-text";

type Props = {
  data: unknown;
  className?: string;
};

export function LexicalRichText({ data, className }: Props) {
  if (!hasLexicalContent(data)) return null;
  return (
    <div className={className}>
      <RichText data={data as SerializedEditorState} />
    </div>
  );
}
