/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/preserve-manual-memoization */
import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  type Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import {
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- TIPE DATA & KONSTANTA ---

const LIST_TYPES = ["numbered-list", "bulleted-list"];

interface SlateEditorProps {
  value?: string; // JSON string
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// --- KOMPONEN UTAMA ---

export const SlateEditor = ({
  value,
  onChange,
  placeholder,
  disabled,
}: SlateEditorProps) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  // Parse JSON string ke Slate Node
  const initialValue: Descendant[] = useMemo(() => {
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [{ type: "paragraph", children: [{ text: value }] }];
      }
    }
    return [{ type: "paragraph", children: [{ text: "" }] }];
  }, []);

  // Fungsi render elemen blok (seperti <ul>, <li>, <h1>)
  const renderElement = useCallback((props: any) => <Element {...props} />, []);

  // Fungsi render text style (seperti bold, italic)
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const handleChange = (val: Descendant[]) => {
    // Kita cek apakah ada perubahan konten
    const isAstChange = editor.operations.some(
      (op) => "set_selection" !== op.type
    );
    if (isAstChange && onChange) {
      onChange(JSON.stringify(val));
    }
  };

  return (
    <div
      className={cn(
        disabled && "border-none rounded-md",
        "w-full rounded-md border border-input bg-background shadow-xs"
      )}
    >
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleChange}
      >
        {/* --- TOOLBAR BAGIAN ATAS --- */}
        {!disabled && (
          <div className="flex flex-wrap gap-1 border-b bg-muted/20 p-2">
            <MarkButton format="bold" icon={<Bold className="h-4 w-4" />} />
            <MarkButton format="italic" icon={<Italic className="h-4 w-4" />} />
            <MarkButton
              format="underline"
              icon={<Underline className="h-4 w-4" />}
            />
            <MarkButton format="code" icon={<Code className="h-4 w-4" />} />
            <div className="h-6 w-px bg-border mx-1" /> {/* Divider */}
            <BlockButton
              format="heading-one"
              icon={<Heading1 className="h-4 w-4" />}
            />
            <BlockButton
              format="heading-two"
              icon={<Heading2 className="h-4 w-4" />}
            />
            <BlockButton
              format="block-quote"
              icon={<Quote className="h-4 w-4" />}
            />
            <BlockButton
              format="numbered-list"
              icon={<ListOrdered className="h-4 w-4" />}
            />
            <BlockButton
              format="bulleted-list"
              icon={<List className="h-4 w-4" />}
            />
          </div>
        )}

        {/* --- AREA KETIK --- */}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={
            disabled ? "No content" : placeholder || "Type something..."
          }
          readOnly={disabled}
          className={cn(
            "w-full p-4 text-sm focus-visible:outline-none",
            disabled
              ? "cursor-not-allowed bg-muted/90 opacity-70 rounded-md"
              : "min-h-[150px] "
          )}
          // Tambahkan Shortcut Keyboard
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }
            switch (event.key) {
              case "b": {
                event.preventDefault();
                toggleMark(editor, "bold");
                break;
              }
              case "i": {
                event.preventDefault();
                toggleMark(editor, "italic");
                break;
              }
              case "u": {
                event.preventDefault();
                toggleMark(editor, "underline");
                break;
              }
            }
          }}
        />
      </Slate>
    </div>
  );
};

// --- HELPER FUNCTIONS & SUB-COMPONENTS ---

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    LIST_TYPES.includes(format) ? "block" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  } as any;
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote {...attributes} className="mt-6 border-l-2 pl-6 italic">
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul {...attributes} className="my-6 ml-6 list-disc [&>li]:mt-2">
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1
          {...attributes}
          className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4"
        >
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2
          {...attributes}
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4"
        >
          {children}
        </h2>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return (
        <ol {...attributes} className="my-6 ml-6 list-decimal [&>li]:mt-2">
          {children}
        </ol>
      );
    default:
      return (
        <p {...attributes} className="leading-7 not-first:mt-6">
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {children}
      </code>
    );
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({
  format,
  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button" // Penting agar tidak submit form
      className={cn(
        "h-8 w-8 p-0",
        isBlockActive(editor, format)
          ? "bg-muted text-foreground"
          : "text-muted-foreground"
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const MarkButton = ({
  format,
  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button" // Penting agar tidak submit form
      className={cn(
        "h-8 w-8 p-0",
        isMarkActive(editor, format)
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground"
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};
