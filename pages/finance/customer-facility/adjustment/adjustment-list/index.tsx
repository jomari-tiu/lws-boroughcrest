import React, { useState } from "react";

import AdjustmentTable from "../../../../../components/FINANCE/CustomerFacility/Adjustment/AdjustmentTable";
import { AccessActionValidation } from "../../../../../components/Reusable/PermissionValidation/ActionAccessValidation";
import NoPermissionComp from "../../../../../components/Reusable/PermissionValidation/NoPermissionComp";
import { PageAccessValidation } from "../../../../../components/Reusable/PermissionValidation/PageAccessValidation";

export default function AdjustmentList() {
  const [isType, setType] = useState("unposted");

  const [isPeriod, setPeriod] = useState({
    from: "",
    to: "",
  });

  const PagePermisson = PageAccessValidation("Adjustment");

  if (!PagePermisson && PagePermisson !== undefined) {
    return <NoPermissionComp />;
  }

  return (
    <>
      <ul className="SimpleTab">
        <li
          className={`${isType === "unposted" && "Active"}`}
          onClick={() => {
            setType("unposted");
            setPeriod({ from: "", to: "" });
          }}
        >
          Unposted Adjustment
        </li>
        <li
          className={`${isType === "posted" && "Active"}`}
          onClick={() => {
            setPeriod({ from: "", to: "" });
            setType("posted");
          }}
        >
          Posted Adjustment
        </li>
      </ul>
      <AdjustmentTable
        type={isType}
        isPeriod={isPeriod}
        setPeriod={setPeriod}
      />
    </>
  );
}
