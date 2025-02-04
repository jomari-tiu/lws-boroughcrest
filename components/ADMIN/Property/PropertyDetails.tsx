import React, { useContext } from "react";
import { format, isValid, parse } from "date-fns";
import "tippy.js/dist/tippy.css";

import style from "../../../styles/Project/PropertyDetails.module.scss";
import { property, PropertyDefaultValue } from "../../../types/PropertyList";
import AppContext from "../../Context/AppContext";
import { PencilButton } from "../../Reusable/Icons";
import { AccessActionValidation } from "../../Reusable/PermissionValidation/ActionAccessValidation";
import PropertyForm from "./PropertyForm";

type Props = {
  data: property;
};

export default function PropertyDetails({ data }: Props) {
  const PermissionValidationView = AccessActionValidation("Property", "modify");

  const { newPropToggle, setNewPropToggle, setPrompt } = useContext(AppContext);

  const acceptance_date = parse(
    data?.acceptance_date,
    "yyyy-MM-dd",
    new Date()
  );
  const turnover_date = parse(data?.turnover_date, "yyyy-MM-dd", new Date());

  const DefaultFormData: PropertyDefaultValue = {
    unit_code: data?.unit_code,
    address: data?.address,
    area: data?.area,
    class: data?.class,
    type: data?.type,
    acceptance_date: isValid(acceptance_date)
      ? format(acceptance_date, "MMM dd yyyy")
      : "",
    turnover_date: isValid(turnover_date)
      ? format(turnover_date, "MMM dd yyyy")
      : "",
    status: data?.status,
    developer_id: data?.developer?.id,
    project_id: data?.project?.id,
    tower_id: data?.tower?.id,
    floor_id: data?.floor?.id,
    project: data?.project?.name,
    tower: data?.tower?.name,
    floor: data?.floor?.name,
    developer: data?.developer?.name,
  };

  return (
    <div>
      {newPropToggle && <PropertyForm DefaultFormData={DefaultFormData} />}
      <h1 className="pageTitle mb-5">Property Details</h1>
      <ul className={style.FourRows}>
        {PermissionValidationView && (
          <aside className="-mt-4">
            <PencilButton
              FunctionOnClick={() => setNewPropToggle(true)}
              title={"Modify"}
            />
          </aside>
        )}

        <li>
          <p className="label_text">ID</p>
          <h4 className="main_text">{data?.id}</h4>
        </li>
        <li>
          <p className="label_text">UNIT CODE</p>
          <h4 className="main_text">{data?.unit_code}</h4>
        </li>
        <li>
          <p className="label_text">ADDRESS</p>
          <h4 className="main_text">{data?.address}</h4>
        </li>
        <li>
          <p className="label_text">PROJECT</p>
          <h4 className="main_text">{data?.project?.name}</h4>
        </li>
        <li>
          <p className="label_text">TOWER</p>
          <h4 className="main_text">{data?.tower?.name}</h4>
        </li>

        <li>
          <p className="label_text">FLOOR</p>
          <h4 className="main_text">{data?.floor?.name}</h4>
        </li>
        <li>
          <p className="label_text">TYPE</p>
          <h4 className="main_text">{data?.type}</h4>
        </li>
        <li>
          <p className="label_text">DEVELOPER</p>
          <h4 className="main_text">{data?.developer?.name}</h4>
        </li>
        <li>
          <p className="label_text">AREA</p>
          <h4 className="main_text">{data?.area}</h4>
        </li>
        <li>
          <p className="label_text">CLASS</p>
          <h4 className="main_text">{data?.class}</h4>
        </li>
        <li>
          <p className="label_text">ACCEPTANCE DATE</p>
          <h4 className="main_text">{DefaultFormData?.acceptance_date}</h4>
        </li>
        <li>
          <p className="label_text">TURN OVER DATE</p>
          <h4 className="main_text">{DefaultFormData?.turnover_date}</h4>
        </li>
      </ul>
      <h1 className={style.title}>OCCUPANTS</h1>
      <ul className={style.Occupants}>
        <li>
          <p className="label_text">OWNER</p>
          <h4 className="main_text">
            {data?.owner?.name ? data?.owner?.name : data?.developer?.name}
          </h4>
        </li>
        <li>
          <p className="label_text">TENANTS</p>
          <ul>
            {data?.tenants?.map((item: any, index: number) => (
              <li key={index}>
                <h4 className="main_text">{item?.name}</h4>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
