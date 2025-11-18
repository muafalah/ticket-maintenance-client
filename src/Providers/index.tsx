import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </>
  );
};

export default AppProvider;
