import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

type InputNumber = {
    className: string;
    value: string | number;
    onChange: (type: string, value: string | number) => void;
    type: string;
    prefix?: string;
    valueLimit?: number;
};

export const InputNumberForTable = ({
    className,
    value,
    type,
    onChange,
    prefix,
    valueLimit,
}: InputNumber) => {
    let validate = false;
    return (
        <div className="withPesoField">
            <NumericFormat
                className={className + " max-w-[400px]"}
                prefix={prefix}
                placeholder="-"
                value={Number(value) === 0 ? "" : value}
                onKeyDown={(e: any) => {
                    validate && e.key !== "Backspace" && e.preventDefault();
                }}
                fixedDecimalScale
                decimalScale={2}
                decimalSeparator="."
                allowNegative={false}
                thousandSeparator={true}
                onValueChange={(values) => {
                    // formattedValue = $2,223z
                    const { formattedValue, value } = values;
                    if (valueLimit !== undefined) {
                        if (Number(value) <= Number(valueLimit)) {
                            onChange(type, value);
                            validate = false;
                        } else {
                            validate = true;
                        }
                    } else {
                        onChange(type, value);
                    }
                }}
            />
        </div>
    );
};
type InputNumberField = {
    className: string;
    prefix?: string;
    suffix?: string;
    isValue: string | number;
    setValue: (key: string, value: number) => void;
    keyField: string;
    noPeso?: boolean;
};
export const InputNumberForForm = ({
    className,
    prefix,
    suffix,
    isValue,
    setValue,
    keyField,
    noPeso,
}: InputNumberField) => {
    return (
        <div className={noPeso ? "" : "withPesoField"}>
            <NumericFormat
                className={className + " max-w-[400px]"}
                prefix={prefix}
                suffix={suffix}
                value={isValue === 0 ? "" : isValue}
                placeholder="-"
                fixedDecimalScale
                decimalScale={2}
                decimalSeparator="."
                allowNegative={false}
                thousandSeparator={true}
                onValueChange={(values) => {
                    // formattedValue = $2,223
                    // value ie, 2223
                    const { formattedValue, value } = values;
                    setValue(keyField, Number(value));
                }}
            />
        </div>
    );
};

type TextNumberDisplay = {
    value: number | string;
    className: string;
    suffix?: string;
};
export const TextNumberDisplay = ({
    value,
    className,
    suffix,
}: TextNumberDisplay) => {
    return (
        <NumericFormat
            placeholder="-"
            suffix={suffix}
            className={" min-h-[12px] " + className}
            fixedDecimalScale
            value={value}
            displayType="text"
            decimalScale={2}
            decimalSeparator="."
            allowNegative={false}
            thousandSeparator={true}
        />
    );
};

export const TextNumberDisplayPercent = ({
    value,
    className,
    suffix,
}: TextNumberDisplay) => {
    return (
        <NumericFormat
            placeholder="-"
            suffix={suffix}
            className={className}
            value={value === 0 ? "" : value}
            thousandSeparator={true}
        />
    );
};
