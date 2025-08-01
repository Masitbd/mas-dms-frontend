"use client";

import Link from "next/link";
import { Button } from "rsuite";

const MedicineSales = () => {
  return (
    <div>
      <div className="flex justify-between items-center bg-white h-20 w-full px-5 rounded-xl">
        <h1 className="text-2xl font-bold">Medicine Sales</h1>

        <Link href="/medicine-sale/create">
          <Button appearance="primary" color="blue" size="lg">
            Create Sales
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MedicineSales;
