// utils/printButton.ts
export const createPrintButton = (generatePDF: () => void) => (
  <div className="flex justify-end">
    <button
      onClick={generatePDF}
      className="bg-blue-600 w-28 px-3 py-2 rounded-md text-white font-semibold my-4 "
    >
      Print
    </button>
  </div>
);
