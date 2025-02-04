import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";

import DropDownCustomer from "../../../Dropdowns/DropDownCustomer";
import DropDownCharge from "../../../Dropdowns/DropDownCharge";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../../util/api";
import { getCookie } from "cookies-next";
import { BarLoader, ScaleLoader } from "react-spinners";

import { CreateUpdateSubledger, GetSubledger } from "./Query";
import AppContext from "../../../Context/AppContext";
import Calendar from "../../../Reusable/Calendar";
import {
    TextNumberDisplay,
    InputNumberForTable,
} from "../../../Reusable/NumberFormat";
import TableErrorMessage from "../../../Reusable/TableErrorMessage";
import { format, isValid, parse } from "date-fns";
import { ErrorSubmit } from "../../../Reusable/ErrorMessage";
import { TextFieldValidationNoSpace } from "../../../Reusable/InputField";
import { AccessActionValidation } from "../../../Reusable/PermissionValidation/ActionAccessValidation";
import { MinusButtonTable, PlusButtonTable } from "../../../Reusable/Icons";

export type isTableItemArray = isTableItemObj[];

export type isTableItemObj = {
    id: number | string;
    id_backend: null | number;
    customer_id: string;
    customer_name: string;
    date: string;
    reference_no: string;
    charge_id: string;
    charge: string;
    account: string;
    amount: string;
};

export default function SubTable() {
    const Permission_modify = AccessActionValidation(
        "Opening Balance",
        "modify"
    );

    const Permission_create = AccessActionValidation(
        "Opening Balance",
        "create"
    );

    const Permission_view = AccessActionValidation("Opening Balance", "view");

    const { setPrompt } = useContext(AppContext);

    const onSucces = () => {
        setPrompt({
            toggle: true,
            message: "Subledger successfully saved!",
            type: "success",
        });
    };

    const onError = (e: any) => {
        ErrorSubmit(e, setPrompt);
    };

    const { data, isLoading, isError } = GetSubledger();

    const { isLoading: mutateLoading, mutate } = CreateUpdateSubledger(
        onSucces,
        onError
    );

    const [isTableItem, setTableItem] = useState<isTableItemArray>([]);

    const Removehandler = (id: string | number) => {
        const cloneFilter = isTableItem.filter(
            (itemFilter) => itemFilter.id !== id
        );
        setTableItem(cloneFilter);
    };

    useEffect(() => {
        if (!isLoading && !isError) {
            const random = Math.random();
            const CloneArray = data?.data.map((item: any, index: number) => {
                const date = parse(item.date, "yyyy-MM-dd", new Date());

                return {
                    id: index,
                    id_backend: item.id,
                    customer_id: item.customer?.id,
                    customer_name: item.customer?.name,
                    date: isValid(date) ? format(date, "MMM dd yyyy") : "",
                    reference_no: item.reference_no,
                    charge_id: item.charge?.id,
                    charge: item.charge?.name,
                    account: item.account_type,
                    amount: item.amount,
                };
            });

            if (data?.data.length <= 0 || !Permission_view) {
                setTableItem([
                    {
                        id: random,
                        id_backend: null,
                        customer_id: "",
                        customer_name: "",
                        date: "",
                        reference_no: "",
                        charge_id: "",
                        charge: "",
                        account: "advance",
                        amount: "",
                    },
                ]);
            } else {
                setTableItem(CloneArray);
            }
        }
    }, [data?.data]);

    const [isTotal, setTotal] = useState<number>(0);

    useEffect(() => {
        if (data?.status === 200) {
            setTotal(0);
            isTableItem.map((item: isTableItemObj) => {
                setTotal((temp) => Number(temp) + Number(item.amount));
            });
        }
    }, [isTableItem]);

    const SubmitHandler = () => {
        let validate = true;
        const subledger = isTableItem.map((item: isTableItemObj) => {
            if (
                item.customer_id === "" ||
                item.date === "" ||
                item.reference_no === "" ||
                item.charge_id === "" ||
                item.amount === "" ||
                item.amount === null
            ) {
                setPrompt({
                    message: "Please fill out all fields!",
                    toggle: true,
                    type: "draft",
                });
                validate = false;
                return;
            } else {
                const date = parse(item.date, "MMM dd yyyy", new Date());
                return {
                    id: item.id_backend === undefined ? null : item.id_backend,
                    customer_id: parseInt(item.customer_id),
                    date: isValid(date) ? format(date, "yyyy-MM-dd") : "",
                    reference_no: item.reference_no,
                    charge_id: parseInt(item.charge_id),
                    account_type: item.account,
                    amount: parseFloat(item.amount),
                };
            }
        });
        const Payload = {
            subledger: subledger,
        };
        if (validate) mutate(Payload);
    };

    return (
        <>
            <div className="table_container">
                <table className="table_list">
                    <thead className="textRed">
                        <tr>
                            <th className=" min-w-[130px] 480px:min-w-0">
                                CUSTOMER ID
                            </th>
                            <th>CUSTOMER NAME</th>
                            <th>DATE</th>
                            <th>REFERENCE NO.</th>
                            <th>CHARGE</th>
                            <th>ACCOUNT</th>
                            <th>AMOUNT</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isTableItem.map((item: isTableItemObj, index) => (
                            <List
                                itemDetail={item}
                                setTableItem={setTableItem}
                                isTableItem={isTableItem}
                                key={index}
                                rowNumber={index}
                                Permission_modify={Permission_modify}
                                Permission_create={Permission_create}
                                RemoveHandler={Removehandler}
                            />
                        ))}
                        <tr className="noBorder">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="flex justify-end">
                                <h1 className="text-start text-[16px]1280px:text-[13px] text-ThemeRed  pt-10">
                                    SUBTOTAL
                                </h1>
                            </td>
                            <td>
                                <div className=" w-full flex justify-end  pt-10">
                                    <TextNumberDisplay
                                        value={isTotal}
                                        className="text-end withPeso w-full text-[#757575] font-NHU-bold text-[18px] 1280px:text-[13px]"
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {isLoading && (
                    <div className="w-full flex justify-center items-center">
                        <aside className="text-center flex justify-center py-5">
                            <BarLoader
                                color={"#8f384d"}
                                height="10px"
                                width="200px"
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </aside>
                    </div>
                )}
                {isError && <TableErrorMessage />}
            </div>
            {/* <div className="mt-10 border-b border-ThemeRed"></div> */}
            {/* <div className="flex flex-wrap justify-end py-5 480px:justify-start">
                <h1 className="text-start text-[16px] min-w-[200px] 1280px:text-[13px] text-ThemeRed pb-1">
                    SUBTOTAL
                </h1>
                <div className="withPeso relative flex items-center text-[#757575] font-NHU-bold">
                    <TextNumberDisplay
                        value={isTotal}
                        className="text-end w-full text-[#757575] font-NHU-bold text-[18px] 1280px:text-[13px]"
                    />
                </div>
            </div> */}
            <div className="flex justify-end py-5 mt-5">
                {/* <button className="button_cancel">Cancel</button> */}
                {(Permission_create || Permission_modify) && (
                    <button className="buttonRed" onClick={SubmitHandler}>
                        {mutateLoading ? (
                            <ScaleLoader
                                color="#fff"
                                height="10px"
                                width="2px"
                            />
                        ) : (
                            "SAVE"
                        )}
                    </button>
                )}
            </div>
        </>
    );
}
type List = {
    itemDetail: isTableItemObj;
    setTableItem: Function;
    isTableItem: isTableItemArray;
    rowNumber: number;
    Permission_create: boolean;
    Permission_modify: boolean;
    RemoveHandler: (id: string | number) => void;
};

const List = ({
    itemDetail,
    setTableItem,
    isTableItem,
    rowNumber,
    Permission_create,
    Permission_modify,
    RemoveHandler,
}: List) => {
    const { setPrompt } = useContext(AppContext);

    const itemData: isTableItemObj = itemDetail;
    const [isDate, setDate] = useState({
        value: itemData.date,
        toggle: false,
    });

    useEffect(() => {
        const e = "";
        UpdateStateHandler("date", e);
    }, [isDate]);

    const UpdateStateHandler = (key: string, event: any) => {
        const newItems = isTableItem.map((item: any) => {
            if (itemData.id == item.id) {
                if (key === "reference_no") {
                    return {
                        ...item,
                        reference_no: event.target.value,
                    };
                }
                if (key === "amount") {
                    return {
                        ...item,
                        amount: Number(event),
                    };
                }
                if (key === "customer") {
                    return {
                        ...item,
                        customer_id: event.target.getAttribute("data-id"),
                        customer_name: event.target.innerHTML,
                    };
                }
                if (key === "charge") {
                    return {
                        ...item,
                        charge_id: event.target.getAttribute("data-id"),
                        charge: event.target.innerHTML,
                    };
                }
                if (key === "advance") {
                    return {
                        ...item,
                        account: "advance",
                    };
                }
                if (key === "received") {
                    return {
                        ...item,
                        account: "Receivable",
                    };
                }
                if (key === "date") {
                    return {
                        ...item,
                        date: isDate.value,
                    };
                }
            }
            return item;
        });
        setTableItem(newItems);
    };

    const AddRowHandler = (e: any) => {
        // console.log("asdasd");
        // if (e.key !== "Enter") {
        //     return;
        // }
        if (!Permission_create) {
            setPrompt({
                message: "You do not have an access to create new row",
                toggle: true,
                type: "draft",
            });
        }
        if (isTableItem.length !== rowNumber + 1) {
            return;
        }
        const random = Math.random();
        if (
            itemData.customer_name === "" ||
            itemData.date === "" ||
            itemData.reference_no === "" ||
            itemData.reference_no === null ||
            itemData.charge === "" ||
            itemData.amount === "" ||
            itemData.amount === null
        ) {
            setPrompt({
                message: "Complete the current row before creating new row",
                toggle: true,
                type: "draft",
            });
            return;
        }
        setTableItem([
            ...isTableItem,
            {
                id: random,
                id_backend: null,
                customer_id: "",
                customer_name: "",
                date: "",
                reference_no: "",
                charge_id: "",
                charge: "",
                account: "advance",
                amount: "",
            },
        ]);
    };

    return (
        <tr>
            <td>
                <h2>{itemData.customer_id} </h2>
            </td>
            <td>
                {/* <td onKeyUp={(e) => AddRowHandler(e)}> */}
                <DropDownCustomer
                    UpdateStateHandler={UpdateStateHandler}
                    itemDetail={itemData}
                    forTable={true}
                    classnameInput={` ${
                        !Permission_modify &&
                        itemData.id_backend !== null &&
                        "disabled"
                    }`}
                />
            </td>
            <td>
                <article className="calendar relative">
                    <span className="cal ">
                        <Image
                            src="/Images/CalendarMini.png"
                            width={15}
                            height={15}
                            alt=""
                        />
                    </span>
                    <input
                        type="text"
                        value={isDate.value}
                        className={`${
                            !Permission_modify &&
                            itemData.id_backend !== null &&
                            "disabled"
                        }`}
                        onChange={() => {}}
                        placeholder="MM dd yyyy"
                        onClick={() => setDate({ ...isDate, toggle: true })}
                    />
                    {isDate.toggle && (
                        <Calendar
                            forTable={true}
                            value={isDate}
                            setValue={setDate}
                        />
                    )}
                </article>
            </td>
            <td>
                <input
                    type="text"
                    value={itemData.reference_no}
                    className={`field w-full ${
                        !Permission_modify &&
                        itemData.id_backend !== null &&
                        "disabled"
                    }`}
                    onChange={(e) => {
                        if (!TextFieldValidationNoSpace(e, 20)) return;
                        UpdateStateHandler("reference_no", e);
                    }}
                />
            </td>
            <td>
                <DropDownCharge
                    UpdateStateHandler={UpdateStateHandler}
                    itemDetail={itemData}
                    forTable={true}
                    className={` ${
                        !Permission_modify &&
                        itemData.id_backend !== null &&
                        "disabled"
                    }`}
                />
            </td>
            <td>
                <div
                    className={`ToggleAccount ${itemData.account} ${
                        !Permission_modify &&
                        itemData.id_backend !== null &&
                        "disabled"
                    }`}
                >
                    <ul className="min-w-[180px] flex relative">
                        <li
                            className="item ad"
                            onClick={(e) => {
                                UpdateStateHandler("advance", e);
                            }}
                        >
                            Advance
                        </li>
                        <li
                            className="item re"
                            onClick={(e) => {
                                UpdateStateHandler("received", e);
                            }}
                        >
                            Received
                        </li>
                        <li className="moving"></li>
                    </ul>
                </div>
            </td>
            <td>
                <InputNumberForTable
                    className={`field w-full number ${
                        !Permission_modify &&
                        itemData.id_backend !== null &&
                        "disabled"
                    }`}
                    value={itemData.amount}
                    type="amount"
                    onChange={UpdateStateHandler}
                />
            </td>
            <td className="actionIcon flex items-center">
                {Permission_modify && itemData.id_backend !== null && (
                    <>
                        {isTableItem.length > 1 && (
                            <div onClick={() => RemoveHandler(itemData.id)}>
                                <MinusButtonTable />
                            </div>
                        )}
                    </>
                )}
                {itemData.id_backend === null && Permission_create && (
                    <>
                        {isTableItem.length > 1 && (
                            <div onClick={() => RemoveHandler(itemData.id)}>
                                <MinusButtonTable />
                            </div>
                        )}
                    </>
                )}
                {isTableItem.length - 1 === rowNumber && Permission_create && (
                    <div
                        className="ml-5 1024px:ml-2"
                        onClick={(e) => AddRowHandler(e)}
                    >
                        <PlusButtonTable />
                    </div>
                )}
            </td>
        </tr>
    );
};
