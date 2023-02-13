import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { BsPlusLg } from "react-icons/bs";
import { HiMinus } from "react-icons/hi";
import { RiArrowDownSFill } from "react-icons/ri";
import Calendar from "../../Calendar";
import DropdownSearch from "../../DropdownSearch";
import DropDownCOA from "./DropdownCOA";
import { validateCreditDebitField } from "../OpeningBalance/ValidateCreditDebitField";
import { InputNumberForTable, TextNumberDisplay } from "../../NumberFormat";
import AppContext from "../../Context/AppContext";

type defaultArray = defaultObject[];
type defaultObject = {
    id: number;
    account_id: string | number;
    code: number | string;
    accountName: string;
    debit: string;
    credit: string;
};
type Props = {
    DefaultValue: defaultArray;
    type: string;
};

export default function JournalForm({ DefaultValue, type }: Props) {
    const [isSave, setSave] = useState(false);
    const [isDate, setDate] = useState({
        value: "",
        toggle: false,
    });

    const [isDefault, setDefault] = useState<defaultArray>(DefaultValue);

    // TOTAL
    const [totalDebit, setTotalDebit] = useState<number>(0);
    const [totalCredit, setTotalCredit] = useState<number>(0);
    useEffect(() => {
        setTotalDebit(0);
        setTotalCredit(0);
        isDefault.map((item: defaultObject) => {
            setTotalDebit((temp) => Number(temp) + Number(item.debit));
            setTotalCredit((temp) => Number(temp) + Number(item.credit));
        });
    }, [isDefault]);
    return (
        <>
            <div>
                <ul className="flex flex-wrap justify-between pb-8 mb-8 border-b border-gray-300">
                    <li className="w-[20%] 1366px:w-[30%] 820px:w-full 820px:mb-5 flex items-center">
                        <p className=" labelField">DATE</p>
                        <div className="calendar">
                            <span className="cal">
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
                                onChange={() => {}}
                                placeholder="dd/mm/yyyy"
                                onClick={() =>
                                    setDate({ ...isDate, toggle: true })
                                }
                                className="px-2 h-10 1550px:h-8 outline-none rounded-md shadow-md"
                            />
                            {isDate.toggle && (
                                <Calendar value={isDate} setValue={setDate} />
                            )}
                        </div>
                    </li>
                    <li className="w-[75%] max-w-[850px] 1366px:w-[65%] 820px:w-full flex items-center">
                        <p className=" labelField">PARTICULARS</p>
                        <input
                            type="text"
                            className="px-2 h-10 1550px:h-8 outline-none rounded-md shadow-md w-full"
                        />
                    </li>
                </ul>
                <div className="table_container">
                    <table className="table_list forCrud">
                        <thead className="textRed">
                            <tr>
                                <th>CODE</th>
                                <th>ACCOUNT NAME</th>
                                <th>DEBIT</th>
                                <th>CREDIT</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isDefault?.map((item: any, index: number) => (
                                <List
                                    key={index}
                                    index={index}
                                    setDefault={setDefault}
                                    itemList={item}
                                    isDefault={isDefault}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap justify-end py-5 480px:justify-start">
                    <h1 className="text-start text-[16px] min-w-[200px] 1280px:text-[13px] text-ThemeRed pb-1">
                        TOTAL
                    </h1>
                    <div className="withPeso relative flex items-center text-[#757575] font-NHU-bold mr-10">
                        <TextNumberDisplay
                            value={totalDebit}
                            className="text-end w-full text-[#757575] font-NHU-bold text-[18px] 1280px:text-[13px]"
                        />
                    </div>
                    <div className="withPeso relative flex items-center text-[#757575] font-NHU-bold">
                        <TextNumberDisplay
                            value={totalCredit}
                            className="text-end w-full text-[#757575] font-NHU-bold text-[18px] 1280px:text-[13px]"
                        />
                    </div>
                </div>
            </div>
            <div className="DropDownSave">
                <button className="ddback">CANCEL</button>

                <div className="ddSave">
                    <div>
                        <button
                            type="submit"
                            name="save"
                            className="ddsave_button"
                        >
                            SAVE
                        </button>
                        <aside className="ddArrow">
                            <RiArrowDownSFill
                                onClick={() => setSave(!isSave)}
                            />
                        </aside>
                    </div>
                    {isSave && (
                        <ul>
                            <li>
                                <button type="submit">SAVE & NEW</button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

type List = {
    index: number;
    itemList: defaultObject;
    setDefault: Function;
    isDefault: defaultArray;
};

const List = ({ itemList, setDefault, isDefault, index }: List) => {
    const { setPrompt } = useContext(AppContext);
    const AddJournal = (e: any) => {
        if (itemList.account_id === "" || itemList.accountName === "") {
            setPrompt({
                toggle: true,
                message: "Fill out the fields!",
                type: "draft",
            });
            return;
        }
        if (itemList.debit === "" && itemList.credit === "") {
            setPrompt({
                toggle: true,
                message: "Fill out the fields!",
                type: "draft",
            });
            return;
        }
        const random = Math.random();
        setDefault((temp: any) => [
            ...temp,
            {
                id: random,
                code: 0,
                accountName: "",
                debit: "",
                credit: "",
            },
        ]);
    };
    const RemoveJournal = () => {
        setDefault((item: any[]) =>
            item.filter((x: any) => x.id !== itemList.id)
        );
    };
    const updateValue = (key: string, e: any) => {
        const newItems = isDefault.map((item: any) => {
            if (itemList.id == item.id) {
                if (key === "accountName") {
                    return {
                        ...item,
                        accountName: e.target.innerHTML,
                        account_id: e.target.getAttribute("data-id"),
                        code: e.target.getAttribute("data-code"),
                    };
                } else if (key === "code") {
                    return {
                        ...item,
                        code: e.target.value,
                    };
                }
            }
            return item;
        });
        setDefault(newItems);
    };
    const UpdateStateHandler = (key: string, value: any) => {
        const newItems = isDefault.map((item: any) => {
            if (itemList.id == item.id) {
                if (key === "debit") {
                    return {
                        ...item,
                        debit: Number(value),
                        credit: "",
                    };
                }
                if (key === "credit") {
                    return {
                        ...item,
                        credit: Number(value),
                        debit: "",
                    };
                }
            }
            return item;
        });
        setDefault(newItems);
    };

    const [debitValidate, setDebitValidate] = useState("");
    const [creditValidate, setcreditValidate] = useState("");

    useEffect(() => {
        validateCreditDebitField(
            itemList.debit,
            itemList.credit,
            setDebitValidate,
            setcreditValidate
        );
    }, [itemList.debit, itemList.credit]);
    return (
        <tr>
            <td className="w-[20%]">
                <h2>{itemList.code}</h2>
            </td>
            <td>
                <DropDownCOA
                    UpdateStateHandler={updateValue}
                    itemDetail={itemList}
                />
            </td>
            <td>
                <InputNumberForTable
                    className={`number field inline-block w-full bg-white ${debitValidate}`}
                    value={itemList.debit}
                    onChange={UpdateStateHandler}
                    type={"debit"}
                />
            </td>
            <td>
                <InputNumberForTable
                    className={`number field inline-block w-full bg-white ${creditValidate}`}
                    value={itemList.credit}
                    onChange={UpdateStateHandler}
                    type={"credit"}
                />
            </td>
            <td className="actionIcon">
                {isDefault.length > 1 && (
                    <div onClick={RemoveJournal}>
                        <HiMinus />
                    </div>
                )}
                {isDefault.length - 1 === index && (
                    <div
                        className="ml-5 1024px:ml-2"
                        onClick={(e) => AddJournal(e)}
                    >
                        <BsPlusLg />
                    </div>
                )}
            </td>
        </tr>
    );
};
