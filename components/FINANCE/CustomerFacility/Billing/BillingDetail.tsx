import React, { useEffect, useState } from "react";
import style from "../../../../styles/Project/PropertyDetails.module.scss";
import "tippy.js/dist/tippy.css";
import { TextNumberDisplay } from "../../../Reusable/NumberFormat";
import { PencilButton } from "../../../Reusable/Icons";
import Link from "next/link";
import { format, isValid, parse } from "date-fns";
import { AccessActionValidation } from "../../../Reusable/PermissionValidation/ActionAccessValidation";

export type InvoiceDetail = {
    id: string | number;
    customer: {
        id: number;
        name: string;
        class: string;
        properties: { unit_code: string }[];
    };
    invoice_no: string;
    billing_date: string;
    due_date: string;
    trail: {
        event: string;
        user: string;
        date: string;
        time: string;
        datetime: string;
    }[];
    status: string;
    invoice_list: ShowInvoice[];
};

export type InvoiceList = {
    id: string | number;
    charge: {
        id: number | string;
        name: string;
        charge_uom_id: number | string;
        vat_percent: number | string;
        uom: {
            name: string;
        };
    };
    description: string;
    unit_price: number | string;
    quantity: number | string;
    vat: number | string;
    amount: number | string;
    billing_batch_list_id: string;
    billing_readings_list_id: string;
    property_unit_code?: string;
    property_id?: string;
    property?: {
        unit_code: string;
    };
};

export type ShowInvoice = {
    id: string | number;
    charge: {
        id: number | string;
        name: string;
        charge_uom_id: number | string;
        vat_percent: number | string;
        uom: {
            name: string;
        };
    };
    description: string;
    unit_price: number | string;
    quantity: number | string;
    vat: number | string;
    amount: number | string;
    billing_batch_list_id: string;
    billing_readings_list_id: string;
    property: {
        id: string | number;
        unit_code: string;
    };
};

type Props = {
    InvoiceDetail: InvoiceDetail;
};

export default function BillingDetail({ InvoiceDetail }: Props) {
    const Permission_modify = AccessActionValidation("Billing", "modify");
    const [isTotalVat, setTotalVat] = useState(0);
    const [isTotalAmount, setTotalAmount] = useState(0);
    useEffect(() => {
        setTotalVat(0);
        setTotalAmount(0);
        InvoiceDetail.invoice_list.map((item) => {
            setTotalVat((prev) => Number(prev) + Number(item.vat));
            setTotalAmount((prev) => Number(prev) + Number(item.amount));
        });
    }, [InvoiceDetail]);
    const Due_Date = parse(InvoiceDetail.due_date, "yyyy-MM-dd", new Date());
    const Billing_Date = parse(
        InvoiceDetail.billing_date,
        "yyyy-MM-dd",
        new Date()
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h1 className="pageTitle mb-5">Billing Details</h1>
            </div>
            <ul className={`${style.ThreeRows} relative ${style.narrow}`}>
                {InvoiceDetail.status === "Pending" && Permission_modify && (
                    <Link
                        href={`/finance/customer-facility/billing/modify/${InvoiceDetail.id}`}
                    >
                        <a>
                            <div className=" absolute top-[15px] right-[15px]">
                                <PencilButton
                                    FunctionOnClick={() => {}}
                                    title={"Modify"}
                                />
                            </div>
                        </a>
                    </Link>
                )}
                <li>
                    <p className="label_text">Customer</p>
                    <h4 className="main_text">{InvoiceDetail.customer.name}</h4>
                </li>
                <li>
                    <p className="label_text">Class</p>
                    <h4 className="main_text">
                        {InvoiceDetail.customer.class}
                    </h4>
                </li>
                <li>
                    <p className="label_text">Property</p>
                    <h4 className="main_text">
                        {InvoiceDetail.customer.properties.map((item, index) =>
                            InvoiceDetail.customer.properties.length - 1 ===
                            index
                                ? item.unit_code
                                : item.unit_code + ", "
                        )}
                    </h4>
                </li>
                <li>
                    <p className="label_text">Invoice No.</p>
                    <h4 className="main_text">{InvoiceDetail.invoice_no}</h4>
                </li>
                <li>
                    <p className="label_text">Billing Date</p>
                    <h4 className="main_text">
                        {isValid(Billing_Date)
                            ? format(Due_Date, "MMM dd yyyy")
                            : ""}
                    </h4>
                </li>
                <li>
                    <p className="label_text">Due Date</p>
                    <h4 className="main_text">
                        {isValid(Due_Date)
                            ? format(Due_Date, "MMM dd yyyy")
                            : ""}
                    </h4>
                </li>
            </ul>
            <ul className={`${style.OneRow} ${style.wide}`}>
                <li className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th className="label_text">CHARGE</th>
                                <th className="label_text">PROPERTY</th>
                                <th className="label_text">DESCRIPTION</th>
                                <th className="label_text">UNIT PRICE</th>
                                <th className="label_text">QUANTITY</th>
                                <th className="label_text">UOM</th>
                                <th className="label_text">VAT</th>
                                <th className="label_text">DUE AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {InvoiceDetail.invoice_list.map((item, index) => (
                                <List key={index} itemDetail={item} />
                            ))}

                            <tr>
                                <td colSpan={6} className={style.total}>
                                    <p className="label_text">TOTAL:</p>
                                </td>
                                <td>
                                    <TextNumberDisplay
                                        className="withPeso main_text font-NHU-bold"
                                        value={isTotalVat}
                                    />
                                </td>
                                <td>
                                    <TextNumberDisplay
                                        className="withPeso main_text font-NHU-bold"
                                        value={isTotalAmount}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </li>
            </ul>
            <ul className={`${style.Occupants} ${style.wide}`}>
                <li className={style.noMb}>
                    <p className="label_text">TRAIL</p>
                    {InvoiceDetail.trail.map((item, index) => (
                        <h4 className="main_text noMB" key={index}>
                            {item.event} {item.user} {item.date} {item.time}
                        </h4>
                    ))}
                </li>
            </ul>
        </div>
    );
}

type ListProps = {
    itemDetail: InvoiceList;
};

const List = ({ itemDetail }: ListProps) => {
    return (
        <tr>
            <td>
                <h4 className="main_text">{itemDetail.charge.name}</h4>
            </td>
            <td>
                <h4 className="main_text">{itemDetail?.property?.unit_code}</h4>
            </td>
            <td>
                <h4 className="main_text">{itemDetail.description}</h4>
            </td>
            <td>
                <h4 className="main_text">{itemDetail.unit_price}</h4>
            </td>
            <td>
                <h4 className="main_text">{itemDetail.quantity}</h4>
            </td>
            <td>
                <h4 className="main_text">{itemDetail.charge.uom.name}</h4>
            </td>
            <td>
                <TextNumberDisplay
                    className="withPeso main_text font-NHU-bold"
                    value={itemDetail.vat}
                />
            </td>
            <td>
                <TextNumberDisplay
                    className="withPeso main_text font-NHU-bold"
                    value={itemDetail.amount}
                />
            </td>
        </tr>
    );
};
