import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </>
  );
};

export default AppProvider;
