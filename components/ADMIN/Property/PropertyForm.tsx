import React, { useState, useContext, useEffect } from "react";
import { format, isValid, parse } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { RiArrowDownSFill } from "react-icons/ri";
import { useQueryClient } from "react-query";
import { ScaleLoader } from "react-spinners";
import "tippy.js/dist/tippy.css";
import Tippy from "@tippy.js/react";

import style from "../../../styles/Popup_Modal.module.scss";
import { PropertyDefaultValue } from "../../../types/PropertyList";
import { ModalSideFade } from "../../Animation/SimpleAnimation";
import AppContext from "../../Context/AppContext";
import {
  PostDraftProperty,
  PostProperty,
  UpdateDraftProperty,
  UpdateProperty,
} from "../../ReactQuery/PropertyMethod";
import Calendar from "../../Reusable/Calendar";
import DynamicPopOver from "../../Reusable/DynamicPopOver";
import { ErrorSubmit } from "../../Reusable/ErrorMessage";
import {
  InputNumberForm,
  InputTextForm,
  NumberBlockInvalidKey,
} from "../../Reusable/InputField";
import SelectDropdown from "../../Reusable/SelectDropdown";
import Developer from "./Developer";
import Floor from "./Floor";
import Project from "./Project";
import Tower from "./Tower";

type Props = {
  DefaultFormData: PropertyDefaultValue;
  isSearchTable?: string;
};

export default function PropertyForm({
  DefaultFormData,
  isSearchTable,
}: Props) {
  const [acceptanceDate, setAcceptanceDate] = useState({
    value: DefaultFormData.acceptance_date
      ? DefaultFormData.acceptance_date
      : "",
    toggle: false,
  });
  const [turnoverDate, setTurnoverDate] = useState({
    value: DefaultFormData.turnover_date ? DefaultFormData.turnover_date : "",
    toggle: false,
  });

  const [isSelect, setSelect] = useState({
    type: false,
    class: false,
  });
  const SelectField = (value: string, key: string) => {
    if (key === "type") {
      setValue("type", value);
      setSelect({
        ...isSelect,
        type: false,
      });
    }
    if (key === "class") {
      setValue("class", value);
      setSelect({
        ...isSelect,
        class: false,
      });
    }
  };

  useEffect(() => {
    setValue("acceptance_date", acceptanceDate.value, {
      shouldValidate: true,
    });
    setValue("turnover_date", turnoverDate.value, {
      shouldValidate: true,
    });
  }, [acceptanceDate.value, turnoverDate.value]);

  const router = useRouter();
  const [isButton, setButton] = useState("");
  const ErrorDefault = {
    area: "",
    class: "",
    developer_id: "",
    floor_id: "",
    project_id: "",
    tower_id: "",
    type: "",
    unit_code: "",
    address: "",
  };
  const [isError, setError] = useState({
    ...ErrorDefault,
  });
  const [isProject, setProject] = useState(false);
  const [isTower, setTower] = useState(false);
  const [isFloor, setFloor] = useState(false);
  const [isDev, setDev] = useState(false);
  const [isSave, setSave] = useState(false);
  const { setNewPropToggle, propTableRows, setPrompt } = useContext(AppContext);

  const [FormModify, setFormModify] = useState("New");
  const [isUnitCode, setUnitCode] = useState(DefaultFormData.unit_code);

  const dropdownDefault = {
    id: "",
    value: "",
    firstVal: "",
    firstID: "",
  };
  const [isProjectVal, setProjectVal] = useState({
    id: DefaultFormData?.project_id,
    value: DefaultFormData?.project,
    firstVal: DefaultFormData?.project,
    firstID: DefaultFormData?.project_id,
  });
  const [isTowerVal, setTowerVal] = useState({
    id: DefaultFormData?.tower_id,
    value: DefaultFormData?.tower,
    firstVal: DefaultFormData?.tower,
    firstID: DefaultFormData?.tower_id,
  });
  const [isFloorVal, setFloorVal] = useState({
    id: DefaultFormData?.floor_id,
    value: DefaultFormData?.floor,
    firstVal: DefaultFormData?.floor,
    firstID: DefaultFormData?.floor_id,
  });
  const [isDevVal, setDevVal] = useState({
    id: DefaultFormData?.developer_id,
    value: DefaultFormData?.developer,
    firstVal: DefaultFormData?.developer,
    firstID: DefaultFormData?.developer_id,
  });

  const [firstLoadComp_tower, setFirstLoadComp_tower] = useState(true);
  useEffect(() => {
    if (firstLoadComp_tower === false) {
      setTowerVal({
        id: "",
        value: "",
        firstVal: "",
        firstID: "",
      });
    }
    setFirstLoadComp_tower(false);
  }, [isProjectVal.id]);

  const [firstLoadComp_floor, setFirstLoadComp_floor] = useState(true);
  useEffect(() => {
    if (firstLoadComp_floor === false) {
      setFloorVal({
        id: "",
        value: "",
        firstVal: "",
        firstID: "",
      });
    }
    setFirstLoadComp_floor(false);
  }, [isTowerVal.id]);

  const updateProject = (value: any, id: any) => {
    setValue("project", value, {
      shouldValidate: true,
    });
    setProjectVal({
      id: id,
      value: value,
      firstVal: value,
      firstID: id,
    });
  };

  const updateTower = (value: any, id: any) => {
    setValue("tower", value, {
      shouldValidate: true,
    });
    setTowerVal({
      id: id,
      value: value,
      firstVal: value,
      firstID: id,
    });
  };
  const updateFloor = (value: any, id: any) => {
    setValue("floor", value, {
      shouldValidate: true,
    });
    setFloorVal({
      id: id,
      value: value,
      firstVal: value,
      firstID: id,
    });
  };
  const updateDeveloper = (value: any, id: any) => {
    setValue("developer", value, {
      shouldValidate: true,
    });
    setDevVal({
      id: id,
      value: value,
      firstVal: value,
      firstID: id,
    });
  };

  useEffect(() => {
    if (router.query.id !== undefined) {
      setFormModify("Modify");
    }
  }, []);

  const cancel = () => {
    reset();
    setError({ ...ErrorDefault });
    setNewPropToggle(false);
    if (router.query.draft !== undefined) {
      router.push("");
    }
  };

  // Mutation
  const onSuccess = () => {
    queryClient.invalidateQueries(["Property-List"]);
    queryClient.invalidateQueries("get-property-detail");
    setError({ ...ErrorDefault });
    setUnitCode("");
    setDevVal(dropdownDefault);
    setFloorVal(dropdownDefault);
    setProjectVal(dropdownDefault);
    setTowerVal(dropdownDefault);
    setValue("area", "");
    reset();
    if (router.query.id !== undefined) {
      // Update
      queryClient.invalidateQueries([
        "get-property-detail",
        `${router.query.id}`,
      ]);
      setPrompt({
        message: `Property Unit successfully ${
          isButton === "draft" ? "saved as draft" : "updated"
        }!`,
        type: `${isButton === "draft" ? "draft" : "success"}`,
        toggle: true,
      });
    } else {
      // Save
      setPrompt({
        message: `Property Unit successfully ${
          isButton === "draft" ? "saved as draft" : "saved"
        }!`,
        type: `${isButton === "draft" ? "draft" : "success"}`,
        toggle: true,
      });

      // From draft to save
      if (router.query.draft !== undefined) {
        router.push("");
        if (isButton === "new") {
          setNewPropToggle(true);
        }
      }
    }
    if (isButton === "save" || isButton === "draft") {
      setNewPropToggle(false);
    }
    if (isButton === "new" && router.query.id) {
      router.push("/admin/property");
      setNewPropToggle(true);
    }
  };
  const onError = (e: any) => {
    const ErrorField = e.response.data;
    if (ErrorField > 0 || ErrorField !== null || ErrorField !== undefined) {
      setError({ ...ErrorField });
    }
    ErrorSubmit(e, setPrompt);
  };

  // Save Mutation
  const { mutate: SaveMutate, isLoading: SaveLoading } = PostProperty(
    onSuccess,
    onError
  );
  const { mutate: SaveDraftMutate, isLoading: SaveDraftLoading } =
    PostDraftProperty(onSuccess, onError);

  // Update Mutation
  const { mutate: UpdateMutate, isLoading: UpdateLoading } = UpdateProperty(
    onSuccess,
    onError,
    router.query.id
  );
  // Update Draft
  const { mutate: UpdateDraft, isLoading: DraftLoading } = UpdateProperty(
    onSuccess,
    onError,
    router.query.draft
  );
  const { mutate: UpdateDraftMutate, isLoading: UpdateDraftLoading } =
    UpdateDraftProperty(onSuccess, onError, router.query.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PropertyDefaultValue>({
    defaultValues: DefaultFormData,
  });

  const queryClient = useQueryClient();

  const submit = (data: any) => {
    const acceptance_date = parse(
      data.acceptance_date,
      "MMM dd yyyy",
      new Date()
    );
    const turnover_date = parse(data.turnover_date, "MMM dd yyyy", new Date());
    let Payload = {
      unit_code: data.unit_code,
      address: data.address,
      area: data.area,
      class: data.class,
      type: data.type,
      acceptance_date: isValid(acceptance_date)
        ? format(acceptance_date, "yyyy-MM-dd")
        : "",
      turnover_date: isValid(turnover_date)
        ? format(turnover_date, "yyyy-MM-dd")
        : "",
      status: data.status,
      developer_id: isDevVal.id,
      project_id: isProjectVal.id,
      tower_id: isTowerVal.id,
      floor_id: isFloorVal.id,
    };

    if (isButton === "draft") {
      // Draft
      Payload = {
        ...Payload,
        status: "Draft",
      };
      if (router.query.id !== undefined) {
        // Update
        UpdateDraftMutate(Payload);
      } else {
        // Save
        SaveDraftMutate(Payload);
      }
    } else {
      // Save
      Payload = {
        ...Payload,
        status: "Active",
      };
      if (router.query.id !== undefined) {
        // Update
        UpdateMutate(Payload);
      } else if (router.query.draft !== undefined) {
        // Update Draft
        Payload = { ...Payload, status: "Active" };
        UpdateDraft(Payload);
      } else if (
        router.query.draft === undefined &&
        router.query.id === undefined
      ) {
        // Save
        SaveMutate(Payload);
      }
    }
    setSave(false);
  };

  const validateCRUDField = (fieldName: string) => {
    if (fieldName === "Tower") {
      if (
        isProjectVal.id === "" ||
        isProjectVal.id === null ||
        isProjectVal.id === undefined
      ) {
        setPrompt({
          message: "Select a PROJECT first",
          type: "draft",
          toggle: true,
        });
        return false;
      } else {
        return true;
      }
    }
    if (fieldName === "Floor") {
      if (
        isTowerVal.id === "" ||
        isTowerVal.id === null ||
        isTowerVal.id === undefined
      ) {
        setPrompt({
          message: "Select a TOWER first",
          type: "draft",
          toggle: true,
        });
        return false;
      } else {
        return true;
      }
    }
  };

  return (
    <form className={style.container} onSubmit={handleSubmit(submit)}>
      <section>
        <p className={style.modal_title}>{FormModify} Property</p>
        <motion.div
          variants={ModalSideFade}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <h1 className={style.modal_label_primary}>Primary Information</h1>
          <ul className={style.ThreeRows}>
            {FormModify === "Modify" && (
              <li>
                <label>ID</label>

                <p className="rounded-md text-black px-2 py-[2px] outline-none w-[100%] 480px:w-full bg-[#cdb8be]">
                  {router.query.id}
                </p>
              </li>
            )}
            <li>
              <label>*TYPE</label>
              <SelectDropdown
                selectHandler={(value: string) => {
                  setValue("type", value);
                }}
                className=""
                inputElement={
                  <input
                    className="w-full field"
                    {...register("type")}
                    readOnly
                    autoComplete="off"
                  />
                }
                listArray={["Parking", "Unit", "Commercial"]}
              />

              {errors.type && (
                <p className="text-[10px]">{errors.type.message}</p>
              )}
              {isError.type !== "" && (
                <p className="text-[10px]">{isError.type}</p>
              )}
            </li>
            <li>
              <label>*UNIT CODE</label>
              <input
                className="field"
                type="text"
                value={isUnitCode}
                {...register("unit_code")}
                onChange={(e: any) => setUnitCode(e.target.value)}
              />
              {errors.unit_code && (
                <p className="text-[10px]">{errors.unit_code.message}</p>
              )}
              {isError.unit_code !== "" && (
                <p className="text-[10px]">{isError.unit_code}</p>
              )}
            </li>
            <li>
              <label>*CLASS</label>
              <SelectDropdown
                selectHandler={(value: string) => {
                  setValue("class", value);
                }}
                className=""
                inputElement={
                  <input
                    className="w-full field"
                    {...register("class")}
                    readOnly
                    autoComplete="off"
                  />
                }
                listArray={["Saleable", "Leaseable", "Common"]}
              />

              {errors.class && (
                <p className="text-[10px]">{errors.class.message}</p>
              )}
              {isError.class !== "" && (
                <p className="text-[10px]">{isError.class}</p>
              )}
            </li>
            <li>
              <label>*ADDRESS</label>
              <InputTextForm
                register={{ ...register("address") }}
                defaultValue={watch("address")}
                className="field"
                limitation={99999}
              />
              {errors.address && (
                <p className="text-[10px]">{errors.address.message}</p>
              )}
              {isError.address !== "" && (
                <p className="text-[10px]">{isError.address}</p>
              )}
            </li>
            <li>
              <label>*DEVELOPER</label>
              <DynamicPopOver
                className="w-full"
                samewidth={true}
                toRef={
                  <input
                    className="field w-full"
                    type="text"
                    {...register("developer")}
                    autoComplete="off"
                    onClick={() => setDev(true)}
                    value={isDevVal.value}
                    onChange={(e: any) =>
                      setDevVal({
                        ...isDevVal,
                        value: e.target.value,
                      })
                    }
                  />
                }
                toPop={
                  <>
                    {isDev && (
                      <Developer
                        set={setDev}
                        update={updateDeveloper}
                        isValID={isDevVal.id}
                        isObject={isDevVal}
                        setObject={setDevVal}
                      />
                    )}
                  </>
                }
              />

              {errors.developer && (
                <p className="text-[10px]">{errors.developer.message}</p>
              )}
              {isError.developer_id !== "" && (
                <p className="text-[10px]">{isError.developer_id}</p>
              )}
            </li>
            <li>
              <label>*PROJECT</label>
              <DynamicPopOver
                className="w-full"
                samewidth={false}
                toRef={
                  <input
                    type="text"
                    className="field w-full"
                    onClick={() => setProject(true)}
                    autoComplete="off"
                    {...register("project")}
                    value={isProjectVal.value}
                    onChange={(e: any) =>
                      setProjectVal({
                        ...isProjectVal,
                        value: e.target.value,
                      })
                    }
                  />
                }
                toPop={
                  <>
                    {isProject && (
                      <Project
                        set={setProject}
                        update={updateProject}
                        isValID={isProjectVal.id}
                        isObject={isProjectVal}
                        setObject={setProjectVal}
                      />
                    )}
                  </>
                }
              />

              {errors.project && (
                <p className="text-[10px]">{errors.project.message}</p>
              )}
              {isError.project_id !== "" && (
                <p className="text-[10px]">{isError.project_id}</p>
              )}
            </li>
            <li>
              <label>*TOWER</label>
              <DynamicPopOver
                className="w-full"
                samewidth={false}
                toRef={
                  <input
                    className="field w-full"
                    type="text"
                    onClick={() => {
                      if (!validateCRUDField("Tower")) return;
                      setTower(true);
                    }}
                    autoComplete="off"
                    {...register("tower")}
                    value={isTowerVal.value}
                    onChange={(e: any) => {
                      if (!validateCRUDField("Tower")) return;
                      setTowerVal({
                        ...isTowerVal,
                        value: e.target.value,
                      });
                    }}
                  />
                }
                toPop={
                  <>
                    {isTower && (
                      <Tower
                        set={setTower}
                        is={isTower}
                        update={updateTower}
                        isValID={isTowerVal.id}
                        isObject={isTowerVal}
                        setObject={setTowerVal}
                        project_id={isProjectVal.id}
                        project_name={isProjectVal.value}
                      />
                    )}
                  </>
                }
              />

              {errors.tower && (
                <p className="text-[10px]">{errors.tower.message}</p>
              )}
              {isError.tower_id !== "" && (
                <p className="text-[10px]">{isError.tower_id}</p>
              )}
            </li>
            <li>
              <label>*FLOOR</label>
              <DynamicPopOver
                className="w-full"
                samewidth={false}
                toRef={
                  <input
                    className="field w-full"
                    type="text"
                    {...register("floor")}
                    autoComplete="off"
                    onClick={() => {
                      if (!validateCRUDField("Floor")) return;
                      setFloor(true);
                    }}
                    value={isFloorVal.value}
                    onChange={(e: any) => {
                      if (!validateCRUDField("Floor")) return;
                      setFloorVal({
                        ...isFloorVal,
                        value: e.target.value,
                      });
                    }}
                  />
                }
                toPop={
                  <>
                    {isFloor && (
                      <Floor
                        set={setFloor}
                        is={isFloor}
                        update={updateFloor}
                        isValID={isFloorVal.id}
                        isObject={isFloorVal}
                        setObject={setFloorVal}
                        tower_id={isTowerVal.id}
                        tower_name={isTowerVal.value}
                      />
                    )}
                  </>
                }
              />

              {errors.floor && (
                <p className="text-[10px]">{errors.floor.message}</p>
              )}
              {isError.floor_id !== "" && (
                <p className="text-[10px]">{isError.floor_id}</p>
              )}
            </li>
            <li>
              <label>*AREA</label>
              <InputNumberForm
                className="field"
                register={{ ...register("area") }}
                defaultValue={watch("area")}
                limitation={10}
              />
              {errors.area && (
                <p className="text-[10px]">{errors.area.message}</p>
              )}
              {isError.area !== "" && (
                <p className="text-[10px]">{isError.area}</p>
              )}
            </li>
            <li>
              <label>ACCEPTANCE DATE</label>

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
                  className="field w-full"
                  type="text"
                  {...register("acceptance_date")}
                  autoComplete="off"
                  placeholder="MMM dd yyyy"
                  onClick={() =>
                    setAcceptanceDate({
                      ...acceptanceDate,
                      toggle: true,
                    })
                  }
                />
                {acceptanceDate.toggle && (
                  <Calendar
                    value={acceptanceDate}
                    setValue={setAcceptanceDate}
                  />
                )}
              </div>
            </li>
            <li>
              <label>TURNOVER DATE</label>
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
                  className="field w-full"
                  {...register("turnover_date")}
                  placeholder="MMM dd yyyy"
                  autoComplete="off"
                  onClick={() =>
                    setTurnoverDate({
                      ...turnoverDate,
                      toggle: true,
                    })
                  }
                />
                {turnoverDate.toggle && (
                  <Calendar value={turnoverDate} setValue={setTurnoverDate} />
                )}
              </div>
            </li>
          </ul>
          <div className={style.SaveButton}>
            <aside className={style.back} onClick={cancel}>
              CANCEL
            </aside>

            <aside className={style.Save}>
              <div>
                <button
                  type="submit"
                  name="save"
                  className={style.save_button}
                  onClick={() => setButton("save")}
                >
                  {SaveDraftLoading ||
                  SaveLoading ||
                  UpdateLoading ||
                  DraftLoading ||
                  UpdateDraftLoading ? (
                    <ScaleLoader color="#fff" height="10px" width="2px" />
                  ) : (
                    "SAVE"
                  )}
                </button>
                <aside className={style.Arrow}>
                  <RiArrowDownSFill onClick={() => setSave(!isSave)} />
                </aside>
              </div>
              {isSave && (
                <ul>
                  <li>
                    <button onClick={() => setButton("new")}>SAVE & NEW</button>
                  </li>
                  {router.query.draft === undefined && (
                    <li>
                      <button onClick={() => setButton("draft")}>
                        SAVE AS DRAFT
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </aside>
          </div>
        </motion.div>
      </section>
    </form>
  );
}
