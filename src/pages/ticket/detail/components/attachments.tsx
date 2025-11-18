import { TrashIcon, Upload } from "lucide-react";
import { type UseMutateFunction } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Button } from "@/components/ui/button";

import type { TicketLevelEnum } from "@/validators/ticket-validator";
import { useState } from "react";
import { TicketFileUploader } from "./uploader";

type RemoveAttachmentPayload = {
  removeAttachments: {
    name: string;
    url: string;
  }[];
};

const Attachments = ({
  id,
  level,
  data,
  disabled,
  mutate,
}: {
  id: string;
  level: TicketLevelEnum;
  data: Record<TicketLevelEnum, { name: string; url: string }[]>;
  disabled: boolean;
  mutate: UseMutateFunction<unknown, unknown, RemoveAttachmentPayload, unknown>;
}) => {
  const levels: TicketLevelEnum[] = ["L1", "L2", "L3"];

  const [isOpen, setIsOpen] = useState(false);

  const ImageGrid = ({ items }: { items: { name: string; url: string }[] }) => {
    if (!items?.length) {
      return (
        <div className="h-50 w-full flex justify-center items-center bg-muted rounded-md">
          No Image Found
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map(({ name, url }) => (
          <div
            key={name}
            className="flex flex-col w-fit border rounded-md shadow-sm overflow-hidden"
          >
            <div className="relative w-fit">
              <ImageZoom>
                <img
                  alt={name}
                  className="h-40 w-60 object-cover"
                  height={800}
                  width={1200}
                  src={url}
                />
              </ImageZoom>

              {!disabled && (
                <Button
                  size="icon-sm"
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 transition cursor-pointer"
                  onClick={() => {
                    mutate({
                      removeAttachments: [
                        {
                          name,
                          url,
                        },
                      ],
                    });
                  }}
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </Button>
              )}
            </div>
            <div
              className="font-normal text-sm text-gray-900 bg-white px-2 py-2 
            truncate max-w-60"
            >
              {name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border shadow-xs rounded-lg p-4 relative">
      <h2 className="font-semibold text-lg mb-2">Attachments</h2>

      <Tabs defaultValue={level}>
        <TabsList>
          {levels.map((lvl) => (
            <TabsTrigger key={lvl} value={lvl} className="w-20 h-8">
              {lvl}
            </TabsTrigger>
          ))}
        </TabsList>

        {levels.map((lvl) => (
          <TabsContent key={lvl} value={lvl}>
            <ImageGrid items={data[lvl]} />
          </TabsContent>
        ))}
      </Tabs>

      <Button
        size="icon-lg"
        className="absolute top-2 right-2 p-2 rounded-md border bg-white hover:bg-gray-200 transition cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Upload className="w-5 h-5 text-black" />
      </Button>

      <TicketFileUploader id={id} open={isOpen} setOpen={setIsOpen} />
    </div>
  );
};
export default Attachments;
