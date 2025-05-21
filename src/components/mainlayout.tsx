import { ToastContainer } from "react-toastify";

import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";

const MainLayout = ({ children }: React.PropsWithChildren) => {
    return ( 
        <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
          <ToastContainer />
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
     );
}
 
export default MainLayout;