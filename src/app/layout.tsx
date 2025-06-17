import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import "rsuite/dist/rsuite-no-reset.min.css";
import { CustomProvider } from "rsuite";
import SessionWrapper from "@/components/SessionWrapper";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "HMS-A",
  description: "Hospital Management System-- Account",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <CustomProvider>
            <SessionWrapper>{children}</SessionWrapper>
          </CustomProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
