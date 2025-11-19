import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FormComment from "./form-comment";
import ListComment from "./list-comment";
import ListHistory from "./list-history";

const Activity = ({ id }: { id: string }) => {
  return (
    <div className="border shadow-xs rounded-lg p-4 relative">
      <h2 className="font-semibold text-lg mb-2">Activity</h2>

      <Tabs defaultValue="comment">
        <TabsList>
          <TabsTrigger value="comment" className="w-30 h-8">
            Comment
          </TabsTrigger>
          <TabsTrigger value="history" className="w-30 h-8">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comment" className="py-2 space-y-4">
          <ListComment id={id} />
          <FormComment id={id} />
        </TabsContent>
        <TabsContent value="history" className="py-2">
          <ListHistory id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Activity;
