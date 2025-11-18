import { File, Trash } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Definisikan Props
interface FileUploaderProps {
  value: File[];
  onValueChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function FilesUploader({
  value = [], // Default ke array kosong
  onValueChange,
  disabled = false,
}: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Logika: Menambahkan file baru ke list yang sudah ada
      // Jika ingin replace, cukup gunakan: onValueChange(acceptedFiles)
      onValueChange([...value, ...acceptedFiles]);
    },
    disabled: disabled,
    maxFiles: 5, // Sesuai UI text Anda
    maxSize: 2 * 1024 * 1024, // 5MB
  });

  const handleRemove = (fileToRemove: File) => {
    const updatedFiles = value.filter((file) => file !== fileToRemove);
    onValueChange(updatedFiles);
  };

  const filesList = value.map((file, index) => (
    // Gunakan index sebagai key tambahan jika nama file mungkin sama
    <li key={`${file.name}-${index}`} className="relative">
      <Card className="relative p-2 shadow-xs">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            onClick={() => handleRemove(file)}
            disabled={disabled}
          >
            <Trash className="h-5 w-5" aria-hidden={true} />
          </Button>
        </div>
        <CardContent className="flex items-center space-x-3 p-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <File className="h-5 w-5 text-foreground" aria-hidden={true} />
          </span>
          <div className="w-[350px]">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  ));

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-full">
          <div
            {...getRootProps()}
            className={cn(
              isDragActive
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-border",
              "mt-2 flex justify-center rounded-md border border-dashed px-6 py-8 transition-colors duration-200",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div>
              <File
                className="mx-auto h-12 w-12 text-muted-foreground/80"
                aria-hidden={true}
              />
              <div className="mt-4 flex text-muted-foreground justify-center text-center">
                {/* Input props wajib ada */}
                <input {...getInputProps()} />
                <p>
                  Drag and drop or{" "}
                  <span className="font-medium text-primary hover:underline">
                    choose files
                  </span>{" "}
                  to upload
                </p>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Max 5 files and each file should not exceed 5MB
              </p>
            </div>
          </div>

          {filesList.length > 0 && (
            <ul role="list" className="mt-4 space-y-4">
              {filesList}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
