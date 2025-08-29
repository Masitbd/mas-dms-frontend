"use client";

import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import { Button, Message, toaster } from "rsuite";
import { Printer } from "lucide-react";

pdfMake.vfs = pdfFonts as unknown as { [file: string]: string };

const SalesInvoice = ({ item }: { item: any }) => {
  console.log(item, "item");
  const handlePrint = async () => {
    console.log(item, "item2");
    try {
      const doc = {
        pageSize: { width: 227, height: "auto" }, // Credit card size in mm
        pageMargins: [2, 2, 2, 2], // Very small margins
        content: [
          {
            // text: bill?.branch?.name,
            text: "MAST Hospital",
            style: "header",
          },
          {
            // text: bill?.branch?.address1,
            text: "Mirpur",
            style: "subHeader",
          },

          {
            // text: `Helpline: ${bill?.branch?.phone}`,
            text: "Helpline: 015.....",
            style: "subHeader",
          },

          //   {
          //     table: {
          //       widths: ["*"],
          //       heights: [1],
          //       body: [
          //         [
          //           {
          //             text: "   Customer Copy   ",
          //             border: [false, false, false, true],
          //             fillColor: "#eeeeee",
          //             style: { alignment: "center", fontSize: 10, bold: "true" },
          //           },
          //         ],
          //       ],
          //     },
          //     margin: [0, 2],
          //   },

          {
            table: {
              widths: ["50%", "50%"],
              body: [
                [
                  {
                    text: [{ text: "Bill No: ", bold: true }, item?.invoice_no],
                    style: "infoText",
                  },
                  {
                    text: [
                      { text: "P.Type: ", bold: true },
                      item?.patient_type || "",
                    ],
                    style: "infoText",
                  },
                ],
                [
                  {
                    text: [{ text: "Phone: ", bold: true }, item?.phone || ""],
                    style: "infoText",
                  },
                  {
                    text: [
                      { text: "Bed No: ", bold: true },
                      item?.bed_no || "",
                    ],
                    style: "infoText",
                  },
                ],
                [
                  {
                    text: [{ text: "Name: ", bold: true }, item?.name],
                    style: "infoText",
                  },
                  {
                    text: [
                      { text: "Date: ", bold: true },
                      new Date(item?.createdAt).toLocaleString() || "",
                    ],
                    style: "infoText",
                  },
                ],
              ],
            },
            layout: "noBorders",
          },

          {
            table: {
              widths: [15, 40, 20, 20, 20, 30],
              headerRows: 1,
              body: [
                [
                  { text: "SN", bold: true },
                  { text: "M Name", bold: true },
                  { text: "Qty", bold: true },
                  { text: "Rate", bold: true },
                  { text: "Disc", bold: true },
                  { text: "Amount", bold: true },
                ],
                ...(item?.medicines?.map((item: any, index: number) => {
                  return [
                    { text: index + 1 },
                    { text: item?.medicineId?.name },
                    { text: item?.quantity },
                    { text: item?.unit_price },
                    { text: item?.discount },
                    { text: item?.total_price },
                  ];
                }) as []),
              ],
            },
            style: "infoText",
            layout: "headerLineOnly",
          },
          {
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "",
                    border: [false, false, false, true],
                    style: { alignment: "center", fontSize: 10, bold: "true" },
                  },
                ],
              ],
            },
            margin: [0, 2],
          },
          //   {
          //     columns: [
          //       {
          //         stack: [
          //           {
          //             text: [{ text: "Total Amount: " }],
          //             style: "infoText",
          //           },
          //           {
          //             text: [{ text: "Total Discount: " }],
          //             style: "infoText",
          //           },
          //           {
          //             text: [{ text: "Extra Discount: " }],
          //             style: "infoText",
          //           },
          //           {
          //             text: [{ text: "Advance Amount: " }],
          //             style: "infoText",
          //           },
          //           {
          //             text: [{ text: "Amount Paid: " }],
          //             style: "infoText",
          //           },
          //         ],
          //         width: "50%",
          //         alignment: "right",
          //       },
          //       {
          //         stack: [
          //           {
          //             text: [{ text: item?.paymentId?.totalBill, bold: true }],
          //             style: "infoText",
          //           },
          //           {
          //             text: [{ text: item?.paymentId?.totalDiscount }],
          //             style: "infoText",
          //           },
          //           {
          //             text: [{ text: item?.paymentId?.extraDiscount ?? 0 }],
          //             style: "infoText",
          //           },
          //           {
          //             text: [{ text: item?.paymentId?.advanceAmount }],
          //             style: "infoText",
          //           },
          //           {
          //             text: [{ text: item?.paymentId?.paid }],
          //             style: "infoText",
          //           },
          //         ],
          //         width: "40%",
          //         alignment: "right",
          //       },
          //     ],
          //   },
          //   {
          //     table: {
          //       widths: ["*"],
          //       body: [
          //         [
          //           {
          //             text: "",
          //             border: [false, false, false, true],
          //             style: { alignment: "center", fontSize: 10, bold: "true" },
          //           },
          //         ],
          //       ],
          //     },
          //     margin: [0, 2],
          //   },
          //   {
          //     columns: [
          //       {
          //         stack: [
          //           {
          //             text: [{ text: "Total Due: " }],
          //             style: "infoText",
          //           },
          //         ],
          //         width: "50%",
          //         alignment: "right",
          //       },
          //       {
          //         stack: [
          //           {
          //             text: [{ text: item?.paymentId?.due, bold: true }],
          //             style: "infoText",
          //           },
          //         ],
          //         width: "40%",
          //         alignment: "right",
          //       },
          //     ],
          //   },

          //   {
          //     table: {
          //       widths: ["*"],
          //       heights: [1],
          //       body: [
          //         [
          //           {
          //             text: "ক্যাশ মেমো ছাড়া বিক্রিত ঔষধ ফেরত নেওয়া হয়না  ",
          //             border: [false, false, false, false],
          //             fillColor: "#eeeeee",
          //             style: { alignment: "center", fontSize: 9, bold: "true" },
          //           },
          //           {
          //             text: "ঔষধের মেয়াদ উত্তীর্ণ তারিখ থাকলে ৩০ দিনের মধ্যে ফেরত নেওয়া হয়। ",
          //             border: [false, false, false, false],
          //             fillColor: "#eeeeee",
          //             style: { alignment: "center", fontSize: 9, bold: "true" },
          //           },
          //         ],
          //       ],
          //     },
          //     margin: [0, 2],
          //   },

          //   {
          //     text: "Developed By Mass It  Sollutions",
          //     style: {
          //       fontSize: 7,
          //       bold: true,
          //       alignment: "center",
          //     },
          //   },
        ],
        styles: {
          infoText: { fontSize: 8, margin: [0, 1, 0, 1] }, // Smaller font and tighter spacing
          barcodeText: { fontSize: 4, bold: true }, // Reduced barcode font size
          header: {
            bold: true,
            alignment: "center",
            fontSize: 18,
          },
          subHeader: {
            alignment: "center",
            fontSize: 8,
          },
        },
      };

      pdfMake.createPdf(doc as unknown as any).print();

      // ! ***************** Please Don't remove it 👹 ⨲⨲⨲⨲⨲⨲⨲⨲⨲⨲⨲
      //? Laser Print
    } catch (error) {
      console.error("Error generating PDF", error);
      toaster.push(
        <Message type="error">
          {(error ?? "something went wrong") as string}
        </Message>
      );
    }
  };

  return (
    <div>
      <Button appearance="ghost" color="green" size="xs" onClick={handlePrint}>
        <Printer />
      </Button>
    </div>
  );
};

export default SalesInvoice;
