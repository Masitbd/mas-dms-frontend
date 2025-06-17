import StoreProvider from "@/redux/StoreProvider";
import "rsuite/dist/rsuite-no-reset.min.css";
import { Container, Content, CustomProvider, Header } from "rsuite";
import DashSidebar from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navber";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <CustomProvider>
        <Header>
          <Navbar />
        </Header>
        <Container className="rs-container-has-sidebar">
          <DashSidebar />

          <Content>
            <div className="overflow-y-scroll max-h-[94vh] p-2 bg-[#f2f3f4]">
              {children}
            </div>
          </Content>
        </Container>
      </CustomProvider>
    </StoreProvider>
  );
}
