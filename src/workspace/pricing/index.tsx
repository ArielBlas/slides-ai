import { PricingTable } from "@clerk/clerk-react";
import React from "react";

type Props = {};

const Pricing = (props: Props) => {
  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-background">
      <div className="text-center max-w-4xk w-full px-4">
        <h2 className="font-bold text-2xl mb-2">Pricing</h2>
        <p className="text-gray-600 mb-8">
          Start Creating unlimited PPT sliders
        </p>
        <div className="flex justify-center">
          <PricingTable />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
