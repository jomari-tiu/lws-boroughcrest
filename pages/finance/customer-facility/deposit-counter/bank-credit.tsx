import React, { useState } from "react";
import BankCreditComp from "../../../../components/FINANCE/CustomerFacility/DepositCounter/BankCreditComp";

export default function BankCredit() {
    const [isChangeData, setChangeData] = useState({});
    const [isReceiptBookData, setReceiptBookData] = useState({
        itemArray: [],
        selectAll: false,
    });
    const [isBankCredit, setBankCredit] = useState({
        itemArray: [
            {
                id: 1,
                index: "0001",
                bank_account_no: "BDO-555534",
                credit_date: "SEP 22 2022",
                credit_amount: 5000,
                remarks: "Bounce Check",
                receipt_reference_no: "Receipt No.",
                variance: "",
                select: false,
                status: "Posted",
                receipt_no: "",
                reference_no: "",
                children: false,
            },
            {
                id: 2,
                index: "0002",
                bank_account_no: "BDO-555534",
                credit_date: "SEP 22 2022",
                credit_amount: 5000,
                remarks: "Bounce Check",
                receipt_reference_no: "Receipt No.",
                variance: "",
                select: false,
                status: "Posted",
                receipt_no: "",
                reference_no: "",
                children: false,
            },
        ],
        selectAll: false,
    });
    return (
        <BankCreditComp
            setChangeData={setChangeData}
            isBankCredit={isBankCredit}
            setBankCredit={setBankCredit}
            isReceiptBookData={isReceiptBookData}
            setReceiptBookData={setReceiptBookData}
            type="bank-credit"
        />
    );
}
