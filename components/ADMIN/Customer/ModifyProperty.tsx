import React, { useRef, useEffect, useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import { UpdateProperties } from "../../ReactQuery/CustomerMethod";
import { motion } from "framer-motion";
import { ModalSideFade } from "../../Animation/SimpleAnimation";
import { ScaleLoader } from "react-spinners";
import { GetUnitCode } from "../../ReactQuery/CustomerMethod";
import { useRouter } from "next/router";

type ModifyRolesPermission = {
    setToggle: Function;
    properties: any;
};

export default function ModifyProperty({
    setToggle,
    properties,
}: ModifyRolesPermission) {
    let buttonClick = "";
    const [isProperty, setProperty] = useState([
        {
            id: 1,
            unit_code: "",
            project: "",
        },
    ]);
    const router = useRouter();
    const id = router.query.id;

    const OnSuccess = () => {
        console.log(buttonClick);
        if (buttonClick === "save") {
            alert("Property Successfully updated!");
            router.reload();
        }
        if (buttonClick === "saveNew") {
            alert("Property Successfully updated!");
            router.push("/admin/customer?new");
        }
    };

    const { mutate, isLoading } = UpdateProperties(id, OnSuccess);

    useEffect(() => {
        const existedProperties = properties.map((item: any) => {
            return {
                id: item.id,
                unit_code: item.unit_code,
                project: item.project.name,
            };
        });
        setProperty(existedProperties);
    }, []);

    const [isSave, setSave] = useState(false);

    const mutateHandler = () => {
        const ArrayPropertyID = isProperty.map((item: any) => {
            return item.unit_code;
        });

        if (ArrayPropertyID.includes("")) {
            alert("Cannot proceed, one of unit code is empty");
            return;
        }

        const stringify = JSON.stringify(ArrayPropertyID);

        const Payload = {
            unit_codes: stringify,
            _method: "PUT",
        };
        mutate(Payload);
    };

    const save = () => {
        buttonClick = "save";
        mutateHandler();
    };
    const saveNew = () => {
        buttonClick = "saveNew";
        console.log(buttonClick);
        mutateHandler();
    };

    return (
        <div className=" fixed top-0 left-0 h-screen overflow-auto w-full bg-[#00000040] p-10 z-50 flex justify-center items-center origin-top 480px:p-5">
            <section className=" p-10 bg-[#e2e3e4ef] rounded-lg w-[90%] max-w-[700px] text-ThemeRed shadow-lg">
                <p className=" text-[16px] mb-3 font-bold">Create Customer</p>

                <motion.div
                    variants={ModalSideFade}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <h1 className=" w-full text-[24px] mb-3">
                        Property Information
                    </h1>

                    <table className="w-full mb-20">
                        <thead>
                            <tr>
                                <th className=" text-[12px] font-semibold mb-1 uppercase text-start">
                                    UNIT CODE
                                </th>
                                <th className=" text-[12px] font-semibold mb-1 uppercase text-start">
                                    PROJECT
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isProperty.map((item, index) => (
                                <List
                                    detail={item}
                                    setProperty={setProperty}
                                    key={index}
                                    isProperty={isProperty}
                                    id={index}
                                />
                            ))}
                        </tbody>
                    </table>

                    <div className=" w-full flex justify-end items-center mb-10">
                        <button
                            className=" text-ThemeRed font-semibold text-[14px] mr-5"
                            onClick={() => setToggle(false)}
                        >
                            CANCEL
                        </button>

                        {isLoading ? (
                            <div className=" relative text-white flex justify-center items-center duration-75 hover:bg-ThemeRed50 leading-none bg-ThemeRed rounded-md text-[14px] mr-5">
                                <div>
                                    <ScaleLoader
                                        color="#fff"
                                        height="10px"
                                        width="2px"
                                    />
                                </div>
                            </div>
                        ) : (
                            <button className=" relative text-white flex justify-center items-center duration-75 hover:bg-ThemeRed50 leading-none bg-ThemeRed rounded-md text-[14px] mr-5">
                                <div
                                    className=" h-8 px-5 w-full flex justify-center items-center"
                                    onClick={() => setSave(!isSave)}
                                >
                                    SAVE
                                    <RiArrowDownSFill className=" ml-1 text-[24px]" />
                                </div>
                                {isSave && (
                                    <ul className=" absolute top-full bg-white w-full">
                                        <aside
                                            onClick={save}
                                            className="text-ThemeRed inline-block py-2 w-full text-center hover:bg-ThemeRed hover:text-white duration-75"
                                        >
                                            SAVE
                                        </aside>
                                        <aside
                                            onClick={saveNew}
                                            className="text-ThemeRed inline-block py-2 w-full text-center hover:bg-ThemeRed hover:text-white duration-75"
                                        >
                                            SAVE & NEW
                                        </aside>
                                    </ul>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
type List = {
    detail: any;
    setProperty: Function;
    isProperty: {}[];
    id: number;
};
const List = ({ detail, setProperty, isProperty, id }: List) => {
    const newID = Math.random();
    const [isSelect, setSelect] = useState(false);

    const updateValue = (event: any) => {
        const unit_code = event.target.innerHTML;
        let validate = true;
        isProperty.map((item: any) => {
            if (item.unit_code === unit_code) {
                alert("Selected Unit Code already in the list");
                validate = false;
                return;
            }
        });
        if (validate === true) {
            const newItems = isProperty.map((item: any) => {
                if (detail.id == item.id) {
                    return {
                        ...item,
                        project: event.target.getAttribute("data-projname"),
                        unit_code: unit_code,
                    };
                }
                return item;
            });
            setProperty(newItems);
            setSelect(false);
        }
    };

    return (
        <tr>
            <td className=" max-w-[50px] pr-2 ">
                <div className=" relative">
                    <input
                        type="text"
                        value={detail.unit_code}
                        onChange={(e) => updateValue(e)}
                        className="w-full rounded-md text-black px-2 text-[14px] py-[2px] outline-none"
                        onFocus={() => setSelect(true)}
                    />
                    {isSelect && (
                        <Select
                            setSelect={setSelect}
                            updateValue={updateValue}
                        />
                    )}
                </div>
            </td>
            <td className="pr-2">
                <p className="w-full rounded-md text-black h-6 px-2 text-[14px] py-[2px] outline-none bg-ThemeRed50">
                    {detail.project}
                </p>
            </td>
            <td className=" flex justify-center">
                <div className="flex justify-between w-10">
                    {isProperty.length > 1 && (
                        <button
                            className=" text-[32px] text-ThemeRed mr-2"
                            onClick={() =>
                                setProperty((item: any[]) =>
                                    item.filter(
                                        (x: { id: any }) => x.id !== detail.id
                                    )
                                )
                            }
                        >
                            -
                        </button>
                    )}
                    {isProperty.length - 1 === id && (
                        <button
                            className=" text-[32px] text-ThemeRed"
                            onClick={() =>
                                setProperty((item: any) => [
                                    ...item,
                                    {
                                        id: newID,
                                        unit_code: "",
                                        project: "",
                                    },
                                ])
                            }
                        >
                            +
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

const Select = ({ setSelect, updateValue }: any) => {
    const Menu = useRef<any>();

    // Get unit codes to display
    const { isLoading, data, isError } = GetUnitCode();

    useEffect(() => {
        const clickOutSide = (e: any) => {
            if (!Menu.current.contains(e.target)) {
                setSelect(false);
            }
        };
        document.addEventListener("mousedown", clickOutSide);
        return () => {
            document.removeEventListener("mousedown", clickOutSide);
        };
    });

    return (
        <ul
            ref={Menu}
            className=" absolute top-full left-0 w-full bg-white z-10"
        >
            {isLoading && (
                <div className="flex justify-center">
                    <ScaleLoader color="#8f384d" height="10px" width="2px" />
                </div>
            )}
            {!isLoading &&
                data?.data.map((item: any, index: number) => (
                    <li
                        key={index}
                        data-projname={item.project.name}
                        onClick={updateValue}
                        className="cursor-pointer hover:bg-ThemeRed hover:text-white px-2 py-1"
                    >
                        {item.unit_code}
                    </li>
                ))}
        </ul>
    );
};
