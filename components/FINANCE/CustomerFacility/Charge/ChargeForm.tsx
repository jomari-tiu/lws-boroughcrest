import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiArrowDownSFill } from "react-icons/ri";
import { useQueryClient } from "react-query";
import { ScaleLoader } from "react-spinners";

import style from "../../../../styles/Popup_Modal.module.scss";
import { ModalSideFade } from "../../../Animation/SimpleAnimation";
import AppContext from "../../../Context/AppContext";
import UOMDropdown from "../../../Dropdowns/UOMDropdown";
import Dropdown from "../../../Dropdowns/withSameKeyDropdown";
import { LoginUserInfo } from "../../../HOC/LoginUser/UserInfo";
import { ChargeCreate, ChargeUpdate } from "../../../ReactQuery/Charge";
import DynamicPopOver from "../../../Reusable/DynamicPopOver";
import { ErrorSubmit } from "../../../Reusable/ErrorMessage";
import {
    NumberBlockInvalidKey,
    TextFieldValidation,
} from "../../../Reusable/InputField";
import { InputNumberForForm } from "../../../Reusable/NumberFormat";
import { AccessActionValidation } from "../../../Reusable/PermissionValidation/ActionAccessValidation";
import SelectDropdown from "../../../Reusable/SelectDropdown";
import { ChargePayload, IDstate } from "./Type";

type Props = {
    setCreate: Function;
    isDefaultValue: ChargePayload;
    type: string;
};
type Error = {
    code: string;
    type: string;
    name: string;
    base_rate: number;
    uom: string;
    vat_percent: string;
    receivable: string;
    discounts: string;
    revenue: string;
    advances: string;
    interest: string;
    payment_heirarchy: string;
    soa_sort_order: string;
};
export default function ChargeForm({ setCreate, isDefaultValue, type }: Props) {
    const Permission_modify = AccessActionValidation("Charges", "modify");

    const { setPrompt } = useContext(AppContext);

    const [userInfo, setUserInfo] = useState<LoginUserInfo>();

    useEffect(() => {
        setUserInfo(JSON.parse(localStorage.userInfo));
    }, []);

    const [isSelect, setSelect] = useState({
        type: false,
        interest: false,
    });
    const SelectField = (value: string, key: string) => {
        if (key === "type") {
            setValue("type", value);
            setSelect({
                ...isSelect,
                type: false,
            });
            setFieldValue({
                ...fieldValue,
                type: value,
            });
        }
        if (key === "interest") {
            setValue("interest", value);
            setSelect({
                ...isSelect,
                interest: false,
            });
            setFieldValue({
                ...fieldValue,
                interest: value,
            });
        }
    };
    const back = () => {
        setForm([true, false]);
    };
    const cancel = () => {
        router.push("");
        setCreate(false);
    };

    const [errorBaseRate, setErrorBaseRate] = useState(false);

    const next = () => {
        if (fieldValue.base_rate === 0 || fieldValue.base_rate === "") return;
        setErrorBaseRate(false);
        setForm([false, true]);
    };

    const queryClient = useQueryClient();
    const router = useRouter();
    var ButtonType = "";
    const [isForm, setForm] = useState([true, false]);
    const [isSave, setSave] = useState(false);

    const [fieldValue, setFieldValue] = useState<ChargePayload>({
        ...isDefaultValue,
    });
    useEffect(() => {
        setValue("base_rate", Number(isDefaultValue.base_rate));
    }, [isDefaultValue]);
    const [isDiscount, setDiscount] = useState<IDstate>({
        value: isDefaultValue.discounts_coa_value,
        id: isDefaultValue.discounts_coa_id,
        toggle: false,
        firstVal: isDefaultValue.discounts_coa_value,
        firstID: isDefaultValue.discounts_coa_id,
    });
    useEffect(() => {
        setValue("discounts", isDiscount.firstVal);
    }, [isDiscount]);
    const [isRevenue, setRevenue] = useState<IDstate>({
        value: isDefaultValue.revenue_coa_value,
        id: isDefaultValue.revenue_coa_id,
        toggle: false,
        firstVal: isDefaultValue.revenue_coa_value,
        firstID: isDefaultValue.revenue_coa_id,
    });
    useEffect(() => {
        setValue("revenue", isRevenue.firstVal);
    }, [isRevenue]);
    const [isAdvance, setAdvance] = useState<IDstate>({
        value: isDefaultValue.advances_coa_value,
        id: isDefaultValue.advances_coa_id,
        toggle: false,
        firstVal: isDefaultValue.advances_coa_value,
        firstID: isDefaultValue.advances_coa_id,
    });
    useEffect(() => {
        setValue("advances", isAdvance.firstVal);
    }, [isAdvance]);
    const [isReceivable, setReceivable] = useState<IDstate>({
        value: isDefaultValue.receivable_coa_value,
        id: isDefaultValue.receivable_coa_id,
        toggle: false,
        firstVal: isDefaultValue.receivable_coa_value,
        firstID: isDefaultValue.receivable_coa_id,
    });
    useEffect(() => {
        setValue("receivable", isReceivable.firstVal);
    }, [isReceivable]);
    const [isUOM, setUOM] = useState({
        value: isDefaultValue.charge_uom_value,
        id: isDefaultValue.charge_uom_id,
        toggle: false,
    });
    useEffect(() => {
        setValue("uom", isUOM.value);
    }, [isUOM]);

    const onSuccess = () => {
        queryClient.invalidateQueries("charge-list");
        queryClient.invalidateQueries(["Charge-detail", router.query.modify]);
        if (type === "Modify") {
            setPrompt({
                message: "Charge successfully updated!",
                type: "success",
                toggle: true,
            });
        } else {
            setPrompt({
                message: "Charge successfully registered!",
                type: "success",
                toggle: true,
            });
        }
        if (ButtonType === "new") {
            // Clear Field
            setFieldValue({
                ...isDefaultValue,
            });
            setAdvance({
                value: "",
                id: "",
                toggle: false,
                firstVal: "",
                firstID: "",
            });
            setDiscount({
                value: "",
                id: "",
                toggle: false,
                firstVal: "",
                firstID: "",
            });
            setRevenue({
                value: "",
                id: "",
                toggle: false,
                firstVal: "",
                firstID: "",
            });
            setUOM({
                value: "",
                id: "",
                toggle: false,
            });
            setReceivable({
                value: "",
                id: "",
                toggle: false,
                firstVal: "",
                firstID: "",
            });
            // back to front form
            setForm([true, false]);
            // Go to create
            router.push("");
            setCreate(true);
        } else {
            router.push("");
            setCreate(false);
        }
    };
    const onError = (e: any) => {
        ErrorSubmit(e, setPrompt);
    };

    const { mutate: Save, isLoading: SaveLoading } = ChargeCreate(
        onSuccess,
        onError
    );
    const { mutate: Update, isLoading: UpdateLoading } = ChargeUpdate(
        onSuccess,
        onError,
        router.query.modify
    );

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Error>();

    const SubmitHandler = (typeButton: string) => {
        ButtonType = typeButton;
    };

    const SubmitForm = () => {
        setSave(false);
        const Payload = {
            code: fieldValue.code,
            type: fieldValue.type,
            name: fieldValue.name,
            description: fieldValue.description,
            base_rate: fieldValue.base_rate,
            vat_percent: fieldValue.vat_percent,
            minimum: fieldValue.minimum,
            interest: fieldValue.interest,
            payment_heirarchy: fieldValue.payment_heirarchy,
            soa_sort_order: fieldValue.soa_sort_order,
            receivable_coa_id:
                isReceivable === undefined ? "" : parseInt(isReceivable.id),
            discounts_coa_id:
                isDiscount === undefined ? "" : parseInt(isDiscount.id),
            revenue_coa_id:
                isRevenue === undefined ? "" : parseInt(isRevenue.id),
            advances_coa_id:
                isAdvance === undefined ? "" : parseInt(isAdvance.id),
            charge_uom_id: isUOM === undefined ? "" : parseInt(isUOM.id),
        };

        if (router.query.modify === undefined) {
            Save(Payload);
        } else {
            Update(Payload);
        }
    };
    return (
        <div>
            <div className={style.container}>
                <section>
                    <p className={style.modal_title}>{type} Charge</p>
                    <motion.div
                        variants={ModalSideFade}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <form
                            onSubmit={handleSubmit(next)}
                            className={isForm[0] ? "" : "hidden"}
                        >
                            <ul className={style.ThreeRows}>
                                <li>
                                    <label>*CODE</label>
                                    <input
                                        className="field"
                                        {...register("code", {
                                            required: "Required!",
                                            minLength: {
                                                value: 4,
                                                message: "4 Character to 10",
                                            },
                                        })}
                                        type="text"
                                        autoComplete="off"
                                        value={fieldValue.code}
                                        onChange={(e: any) => {
                                            if (!TextFieldValidation(e, 10))
                                                return;
                                            setFieldValue({
                                                ...fieldValue,
                                                code: e.target.value,
                                            });
                                        }}
                                    />
                                    {errors?.code && (
                                        <p className="text-[12px]">
                                            {errors?.code.message}
                                        </p>
                                    )}
                                </li>
                                <li>
                                    <label>*TYPE</label>
                                    <SelectDropdown
                                        selectHandler={(value: string) => {
                                            SelectField(value, "type");
                                        }}
                                        className=""
                                        inputElement={
                                            <input
                                                className="w-full field"
                                                {...register("type", {
                                                    required: "Required!",
                                                })}
                                                value={fieldValue.type}
                                                readOnly
                                                autoComplete="off"
                                            />
                                        }
                                        listArray={["Charge", "Deposit"]}
                                    />

                                    {errors?.type && (
                                        <p className="text-[12px]">
                                            {errors?.type.message}
                                        </p>
                                    )}
                                </li>
                                <li>
                                    <label>*NAME</label>
                                    <input
                                        className="field"
                                        type="text"
                                        {...register("name", {
                                            required: "Required!",
                                        })}
                                        autoComplete="off"
                                        value={fieldValue.name}
                                        onChange={(e: any) => {
                                            if (!TextFieldValidation(e, 99999))
                                                return;
                                            setFieldValue({
                                                ...fieldValue,
                                                name: e.target.value,
                                            });
                                        }}
                                    />
                                    {errors?.name && (
                                        <p className="text-[12px]">
                                            {errors?.name.message}
                                        </p>
                                    )}
                                </li>
                                <li>
                                    <label>DESCRIPTION</label>
                                    <input
                                        className="field"
                                        type="text"
                                        autoComplete="off"
                                        value={fieldValue.description}
                                        onChange={(e: any) => {
                                            if (!TextFieldValidation(e, 99999))
                                                return;
                                            setFieldValue({
                                                ...fieldValue,
                                                description: e.target.value,
                                            });
                                        }}
                                    />
                                </li>
                                <li>
                                    <label>*BASE RATE</label>
                                    <InputNumberForForm
                                        noPeso={true}
                                        className={"field w-full"}
                                        isValue={fieldValue.base_rate}
                                        setValue={(
                                            key: string,
                                            value: number
                                        ) => {
                                            console.log(value);
                                            setFieldValue({
                                                ...fieldValue,
                                                base_rate: value,
                                            });
                                            setValue("base_rate", value);
                                        }}
                                        keyField={"base_rate"}
                                    />

                                    {errorBaseRate && (
                                        <p className="text-[12px]">Required!</p>
                                    )}
                                </li>
                                <li>
                                    <label>*UOM</label>
                                    <div
                                        className={`${style.Dropdown} ${style.full}`}
                                    >
                                        <input
                                            className="field w-full"
                                            type="text"
                                            {...register("uom", {
                                                required: "Required!",
                                            })}
                                            value={isUOM.value}
                                            onChange={(e: any) =>
                                                setUOM({
                                                    ...isUOM,
                                                    value: e.target.value,
                                                })
                                            }
                                            autoComplete="off"
                                            onFocus={() =>
                                                setUOM({
                                                    ...isUOM,
                                                    toggle: true,
                                                })
                                            }
                                            onClick={() =>
                                                setUOM({
                                                    ...isUOM,
                                                    toggle: true,
                                                })
                                            }
                                        />
                                        {isUOM.toggle && (
                                            <UOMDropdown
                                                endpoint={
                                                    "/finance/customer-facility/charges/uom-options"
                                                }
                                                name={"Unit of measure"}
                                                value={isUOM}
                                                setFunction={setUOM}
                                            />
                                        )}
                                    </div>
                                    {errors?.uom && (
                                        <p className="text-[12px]">
                                            {errors?.uom.message}
                                        </p>
                                    )}
                                </li>
                                <li>
                                    <label>*VAT%</label>

                                    <div className="percentage w-full">
                                        <input
                                            className={`field w-full ${
                                                userInfo?.corporate_gst_type ===
                                                    "NON-VAT" && "disabled"
                                            }`}
                                            type="number"
                                            {...register("vat_percent", {
                                                required:
                                                    userInfo?.corporate_gst_type ===
                                                    "NON-VAT"
                                                        ? false
                                                        : "Required!",
                                            })}
                                            value={
                                                userInfo?.corporate_gst_type ===
                                                "NON-VAT"
                                                    ? 0
                                                    : fieldValue.vat_percent
                                            }
                                            onChange={(e: any) => {
                                                setFieldValue({
                                                    ...fieldValue,
                                                    vat_percent: parseFloat(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                        />
                                    </div>
                                    {errors?.vat_percent && (
                                        <p className="text-[12px]">
                                            {errors?.vat_percent.message}
                                        </p>
                                    )}
                                </li>
                                <li>
                                    <label>*RECEIVABLE</label>
                                    <div
                                        className={`${style.Dropdown} ${style.full}`}
                                    >
                                        <input
                                            className="field w-full"
                                            type="text"
                                            autoComplete="off"
                                            {...register("receivable", {
                                                required: "Required!",
                                            })}
                                            value={isReceivable.value}
                                            onChange={(e: any) =>
                                                setReceivable({
                                                    ...isReceivable,
                                                    value: e.target.value,
                                                })
                                            }
                                            onClick={() =>
                                                setReceivable({
                                                    ...isReceivable,
                                                    toggle: true,
                                                })
                                            }
                                        />
                                        {isReceivable.toggle && (
                                            <Dropdown
                                                name="receivable"
                                                fieldObject={isReceivable}
                                                searchValue={isReceivable.value}
                                                setFunction={setReceivable}
                                                endpoint="/finance/customer-facility/charges/coa-options/receivable"
                                            />
                                        )}
                                        {errors?.receivable && (
                                            <p className="text-[12px]">
                                                {errors?.receivable.message}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            </ul>

                            <div className="flex w-full justify-end items-center">
                                <aside
                                    className="button_cancel"
                                    onClick={cancel}
                                >
                                    CANCEL
                                </aside>
                                <button
                                    type="submit"
                                    className="buttonRed"
                                    onClick={() => {
                                        setErrorBaseRate(true);
                                    }}
                                >
                                    NEXT
                                </button>
                            </div>
                        </form>
                        {isForm[1] && (
                            <form onSubmit={handleSubmit(SubmitForm)}>
                                <div>
                                    <h1
                                        className={style.modal_label_primaryRed}
                                    >
                                        Primary Information
                                    </h1>
                                    <ul className={style.ThreeRows}>
                                        <li>
                                            <label>*DISCOUNTS</label>
                                            <div
                                                className={`${style.Dropdown} ${style.full}`}
                                            >
                                                <input
                                                    className="field w-full"
                                                    {...register("discounts", {
                                                        required: "Required!",
                                                    })}
                                                    autoComplete="off"
                                                    type="text"
                                                    value={isDiscount.value}
                                                    onChange={(e: any) =>
                                                        setDiscount({
                                                            ...isDiscount,
                                                            value: e.target
                                                                .value,
                                                        })
                                                    }
                                                    onClick={() =>
                                                        setDiscount({
                                                            ...isDiscount,
                                                            toggle: true,
                                                        })
                                                    }
                                                />
                                                {isDiscount.toggle && (
                                                    <Dropdown
                                                        name="discounts"
                                                        fieldObject={isDiscount}
                                                        searchValue={
                                                            isDiscount.value
                                                        }
                                                        setFunction={
                                                            setDiscount
                                                        }
                                                        endpoint="/finance/customer-facility/charges/coa-options/discounts"
                                                    />
                                                )}
                                                {errors?.discounts && (
                                                    <p className="text-[12px]">
                                                        {
                                                            errors?.discounts
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                        <li>
                                            <label>*REVENUE</label>
                                            <div
                                                className={`${style.Dropdown} ${style.full}`}
                                            >
                                                <input
                                                    className="field w-full"
                                                    type="text"
                                                    autoComplete="off"
                                                    {...register("revenue", {
                                                        required: "Required!",
                                                    })}
                                                    value={isRevenue.value}
                                                    onChange={(e: any) =>
                                                        setRevenue({
                                                            ...isRevenue,
                                                            value: e.target
                                                                .value,
                                                        })
                                                    }
                                                    onClick={() =>
                                                        setRevenue({
                                                            ...isRevenue,
                                                            toggle: true,
                                                        })
                                                    }
                                                />
                                                {isRevenue.toggle && (
                                                    <Dropdown
                                                        name="revenue"
                                                        fieldObject={isRevenue}
                                                        searchValue={
                                                            isRevenue.value
                                                        }
                                                        setFunction={setRevenue}
                                                        endpoint="/finance/customer-facility/charges/coa-options/revenue"
                                                    />
                                                )}
                                                {errors?.revenue && (
                                                    <p className="text-[12px]">
                                                        {
                                                            errors?.revenue
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                        <li>
                                            <label>*ADVANCES</label>
                                            <div
                                                className={`${style.Dropdown} ${style.full}`}
                                            >
                                                <input
                                                    className="field w-full"
                                                    type="text"
                                                    autoComplete="off"
                                                    {...register("advances", {
                                                        required: "Required!",
                                                    })}
                                                    value={isAdvance.value}
                                                    onChange={(e: any) =>
                                                        setAdvance({
                                                            ...isAdvance,
                                                            value: e.target
                                                                .value,
                                                        })
                                                    }
                                                    onClick={() =>
                                                        setAdvance({
                                                            ...isAdvance,
                                                            toggle: true,
                                                        })
                                                    }
                                                />
                                                {isAdvance.toggle && (
                                                    <Dropdown
                                                        name="advance"
                                                        fieldObject={isAdvance}
                                                        searchValue={
                                                            isAdvance.value
                                                        }
                                                        setFunction={setAdvance}
                                                        endpoint="/finance/customer-facility/charges/coa-options/advances"
                                                    />
                                                )}
                                                {errors?.advances && (
                                                    <p className="text-[12px]">
                                                        {
                                                            errors?.advances
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                        <li>
                                            <label>MINIMUM</label>
                                            <InputNumberForForm
                                                noPeso={true}
                                                className={"field w-full"}
                                                isValue={fieldValue.minimum}
                                                setValue={(
                                                    key: string,
                                                    value: number
                                                ) => {
                                                    setFieldValue({
                                                        ...fieldValue,
                                                        minimum: value,
                                                    });
                                                }}
                                                keyField={"minimum"}
                                            />
                                        </li>
                                        <li>
                                            <label>*INTEREST</label>
                                            <div className="select">
                                                <span>
                                                    <MdOutlineKeyboardArrowDown />
                                                </span>
                                                <DynamicPopOver
                                                    toRef={
                                                        <input
                                                            type="text"
                                                            autoComplete="off"
                                                            className="field w-full"
                                                            {...register(
                                                                "interest",
                                                                {
                                                                    required:
                                                                        "Required!",
                                                                }
                                                            )}
                                                            readOnly
                                                            onClick={() =>
                                                                setSelect({
                                                                    ...isSelect,
                                                                    interest:
                                                                        true,
                                                                })
                                                            }
                                                            value={
                                                                fieldValue.interest
                                                            }
                                                        />
                                                    }
                                                    samewidth={true}
                                                    toPop={
                                                        <>
                                                            {isSelect.interest && (
                                                                <ul>
                                                                    <li
                                                                        onClick={() =>
                                                                            SelectField(
                                                                                "Bearing",
                                                                                "interest"
                                                                            )
                                                                        }
                                                                    >
                                                                        Bearing
                                                                    </li>
                                                                    <li
                                                                        onClick={() =>
                                                                            SelectField(
                                                                                "Non-Bearing",
                                                                                "interest"
                                                                            )
                                                                        }
                                                                    >
                                                                        Non-Bearing
                                                                    </li>
                                                                </ul>
                                                            )}
                                                        </>
                                                    }
                                                    className=""
                                                />
                                            </div>
                                            {errors?.interest && (
                                                <p className="text-[12px]">
                                                    {errors?.interest.message}
                                                </p>
                                            )}
                                        </li>
                                        <li>
                                            <label>*PAYMENT HEIRARCHY</label>
                                            <input
                                                className="field"
                                                type="number"
                                                {...register(
                                                    "payment_heirarchy",
                                                    {
                                                        required: "Required!",
                                                    }
                                                )}
                                                value={
                                                    fieldValue.payment_heirarchy
                                                }
                                                onKeyDown={
                                                    NumberBlockInvalidKey
                                                }
                                                onChange={(e: any) => {
                                                    if (
                                                        !TextFieldValidation(
                                                            e,
                                                            10
                                                        )
                                                    )
                                                        return;
                                                    setFieldValue({
                                                        ...fieldValue,
                                                        payment_heirarchy:
                                                            parseInt(
                                                                e.target.value
                                                            ),
                                                    });
                                                }}
                                            />
                                            {errors?.payment_heirarchy && (
                                                <p className="text-[12px]">
                                                    {
                                                        errors
                                                            ?.payment_heirarchy
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </li>
                                        <li>
                                            <label>*SOA SORT ORDER</label>
                                            <input
                                                className="field"
                                                type="number"
                                                {...register("soa_sort_order", {
                                                    required: "Required!",
                                                })}
                                                value={
                                                    fieldValue.soa_sort_order
                                                }
                                                onKeyDown={
                                                    NumberBlockInvalidKey
                                                }
                                                onChange={(e: any) => {
                                                    if (
                                                        !TextFieldValidation(
                                                            e,
                                                            10
                                                        )
                                                    )
                                                        return;
                                                    setFieldValue({
                                                        ...fieldValue,
                                                        soa_sort_order:
                                                            parseInt(
                                                                e.target.value
                                                            ),
                                                    });
                                                }}
                                            />
                                            {errors?.soa_sort_order && (
                                                <p className="text-[12px]">
                                                    {
                                                        errors?.soa_sort_order
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </li>
                                    </ul>

                                    <div className={style.SaveButton}>
                                        <aside
                                            className="button_cancel"
                                            onClick={back}
                                        >
                                            BACK
                                        </aside>
                                        {(router.query.modify === undefined ||
                                            Permission_modify) && (
                                            <div className={style.Save}>
                                                <div>
                                                    <button
                                                        type="submit"
                                                        name="save"
                                                        className={
                                                            style.save_button
                                                        }
                                                        onClick={() =>
                                                            SubmitHandler(
                                                                "save"
                                                            )
                                                        }
                                                    >
                                                        {SaveLoading ||
                                                        UpdateLoading ? (
                                                            <ScaleLoader
                                                                color="#fff"
                                                                height="10px"
                                                                width="2px"
                                                            />
                                                        ) : (
                                                            "SAVE"
                                                        )}
                                                    </button>
                                                    <aside
                                                        className={style.Arrow}
                                                    >
                                                        <RiArrowDownSFill
                                                            onClick={() =>
                                                                setSave(!isSave)
                                                            }
                                                        />
                                                    </aside>
                                                </div>
                                                {isSave && (
                                                    <ul>
                                                        <li>
                                                            <button
                                                                onClick={() =>
                                                                    SubmitHandler(
                                                                        "new"
                                                                    )
                                                                }
                                                            >
                                                                SAVE & NEW
                                                            </button>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </section>
            </div>
        </div>
    );
}
