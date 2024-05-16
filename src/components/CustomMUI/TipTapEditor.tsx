import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  RichTextEditorProvider,
  RichTextField,
} from 'mui-tiptap';

interface Props {
  initialValue: string;
  onChange: (s: string) => void;
}

export const TipTapEditor = ({ initialValue, onChange }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValue,
    onUpdate: (e) => {
      const newContent = convertHtmlToWhatsappFormatting(e.editor.getHTML());
      onChange(newContent);
    },
  });

  function removePTags(html: string): string {
    return html.replace(/<p[^>]*>(.*?)<\/p>/gi, '');
  }

  function convertHtmlToWhatsappFormatting(text: string) {
    text = text.replace(/<b>\s*(.*?)\s*<\/b>/gi, '*$1*');
    text = text.replace(/<strong>\s*(.*?)\s*<\/strong>/gi, '*$1*');
    text = text.replace(/<i>(.*?)<\/i>/gi, '_$1_');
    text = text.replace(/<em>(.*?)<\/em>/gi, '_$1_');
    text = text.replace(/<s>(.*?)<\/s>/gi, '~$1~');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<p>(.*?)<\/p>/gi, '$1\n');
    return removePTags(text);
  }

  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextField
        controls={
          <MenuControlsContainer>
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonStrikethrough />
          </MenuControlsContainer>
        }
      />
    </RichTextEditorProvider>
  );
};
