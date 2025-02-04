import React, { useContext, useEffect, useState } from "react";
import { format, isValid, parse } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsSearch } from "react-icons/bs";
import { GoEye } from "react-icons/go";
import { BarLoader, ScaleLoader } from "react-spinners";
import "tippy.js/dist/tippy.css";
import Tippy from "@tippy.js/react";

import styleSearch from "../../../../styles/SearchFilter.module.scss";
import AppContext from "../../../Context/AppContext";
import { ErrorSubmit } from "../../../Reusable/ErrorMessage";
import { MinusButtonTable, PlusButtonTable } from "../../../Reusable/Icons";
import {
  TextNumberDisplay,
  InputNumberForTable,
} from "../../../Reusable/NumberFormat";
import Pagination from "../../../Reusable/Pagination";
import { AccessActionValidation } from "../../../Reusable/PermissionValidation/ActionAccessValidation";
import TableErrorMessage from "../../../Reusable/TableErrorMessage";
import { isTableBankCredit } from "./BankCreditComp";
import DepositDetail from "./DepositDetail";
import DropdownIndex from "./DropdownIndex";
import { GetReceiptsBook, MultipleUpdateReceiptBook } from "./Query";

export type isReceiptBookData = {
  itemArray: isTableItemObjRB[];
  selectAll: boolean;
};

export type isTableItemObjRB = {
  id: string | number;
  document_date: string;
  depositor: string;
  receipt_no: string;
  bank_and_account_no: number | string;
  reference_no: string;
  deposit_date: string;
  deposit_amount: number | string;
  status: string;
  index: string;
  indexID: string | number;
  indexAmount: string | number;
  select: boolean;
  variance: number | string;
  childrenRB: childType[];
};

type childType = {
  id: 1;
  indexID: string | number;
  index: string;
  amount: string | number;
  variance: number;
};

type Props = {
  type: string;
  isReceiptBookData: isReceiptBookData;
  setReceiptBookData: Function;
  isBankCredit: isTableBankCredit;
  setBankCredit: Function;
  setChangeData: Function;
  SaveHandler: () => void;
  isLoadingSave: any;
};

export default function Receiptsbook({
  type,
  isReceiptBookData,
  setReceiptBookData,
  setChangeData,
  SaveHandler,
  isLoadingSave,
}: Props) {
  const { setPrompt } = useContext(AppContext);
  const router = useRouter();
  const [TablePage, setTablePage] = useState<number>(1);
  const [isSearch, setSearch] = useState("");

  const [isSelectedIDs, setSelectedIDs] = useState<number[]>([]);

  // GET SELECTED INDEX FOR FILTERING DROPDOWN
  const [OverallSelectedIndex, setOverallSelectedIndex] = useState<string[]>(
    []
  );
  useEffect(() => {
    let IndexParent: string[] = [];

    let IndexChildren: string[] = [];

    isReceiptBookData.itemArray.map((item: isTableItemObjRB) => {
      IndexParent = [...IndexParent, item.index];
    });

    isReceiptBookData.itemArray.map((item: isTableItemObjRB) => {
      item.childrenRB.map((item2) => {
        IndexChildren = [...IndexChildren, `${item2.index}`];
      });
    });

    const OverallSelectedIndex = [...IndexParent, ...IndexChildren].filter(
      (filterItem) => filterItem !== ""
    );

    setOverallSelectedIndex(OverallSelectedIndex);
  }, [isReceiptBookData.itemArray]);
  // End

  const selectAll = () => {
    if (isReceiptBookData.selectAll) {
      // remove
      setSelectedIDs([]);
    } else {
      // add
      const ReceiptBookIDs = isReceiptBookData?.itemArray?.map((item) => {
        return Number(item.id);
      });
      setSelectedIDs(ReceiptBookIDs);
    }
    const newItems = isReceiptBookData?.itemArray?.map((item: any) => {
      return {
        ...item,
        select: !isReceiptBookData.selectAll,
      };
    });
    setReceiptBookData({
      itemArray: newItems,
      selectAll: !isReceiptBookData.selectAll,
    });
  };

  const Permission_create = AccessActionValidation("Deposit Counter", "create");

  const Permission_modify = AccessActionValidation("Deposit Counter", "modify");

  const Permission_approve = AccessActionValidation(
    "Deposit Counter",
    "approve"
  );

  const [isPaginate, setPaginate] = useState(10);

  const displayType = type === "receipts-book" ? "matched" : "unmatched";

  const { data, isLoading, isError } = GetReceiptsBook(
    isSearch,
    TablePage,
    displayType,
    "receipt_book",
    isPaginate
  );

  // APPLY RECEIPT BOOK DATA FROM API
  useEffect(() => {
    if (data?.status === 200 || !isLoading) {
      let selectAll = false;
      const CloneArray = data?.data.data.map((item: any) => {
        let select = false;
        if (isSelectedIDs.includes(item.id)) {
          select = true;
        }
        let variance =
          Number(item?.amount_paid) - Number(item?.bank_credit[0]?.credit);
        variance = isNaN(variance) ? 0 : variance;
        return {
          id: item.id,
          document_date: item?.receipt_date,
          depositor: item?.depositor,
          receipt_no: item?.receipt_no,
          bank_and_account_no:
            item?.bank_account?.bank_branch === undefined
              ? ""
              : `${item?.bank_account?.bank_branch} - ${item?.bank_account?.bank_acc_no}`,
          reference_no: item?.reference_no,
          deposit_date: item?.deposit_date,
          deposit_amount: item?.amount_paid,
          variance: item?.amount_paid,
          status: item?.status,
          index: item?.bank_credit[0]?.index,
          indexID: item?.bank_credit[0]?.id,
          indexAmount: item?.bank_credit[0]?.credit,
          select: select,
          childrenRB: item?.bank_credit
            ?.filter((_: any, indx: number) => indx > 0)
            .map((itemChild: any) => {
              variance = Number(variance) - Number(itemChild?.credit);
              return {
                id: itemChild.id,
                indexID: itemChild.id,
                index: itemChild.index,
                amount: itemChild?.credit,
                variance: variance,
              };
            }),
        };
      });
      if (
        CloneArray.length !== 0 &&
        CloneArray.every((val: any) => isSelectedIDs.includes(val.id))
      ) {
        selectAll = true;
      } else {
        selectAll = false;
      }
      setReceiptBookData({
        itemArray: CloneArray,
        selectAll: selectAll,
      });
    }
  }, [data?.data.data, isSelectedIDs]);

  const AddHandler = (id: string | number) => {
    const cloneToAdd = isReceiptBookData?.itemArray?.map(
      (item: isTableItemObjRB) => {
        if (item.id === id) {
          return {
            ...item,
            childrenRB: [
              ...item.childrenRB,
              {
                id: Math.random(),
                index: "",
                amount: "",
                // variance: 0,
              },
            ],
          };
        }
        return item;
      }
    );
    setReceiptBookData({
      ...isReceiptBookData,
      itemArray: cloneToAdd,
    });
  };

  const DeleteHandler = (id: string | number) => {
    const cloneToDelete = isReceiptBookData.itemArray.filter(
      (item) => item.id !== id
    );
    setReceiptBookData({
      ...isReceiptBookData,
      itemArray: cloneToDelete,
    });
  };

  const DeleteHandlerChildren = (
    parentID: string | number,
    selectedID: string | number
  ) => {
    const cloneToDelete = isReceiptBookData?.itemArray?.map(
      (item: isTableItemObjRB) => {
        if (item.id === parentID) {
          const clonetoFilter = item.childrenRB.filter(
            (filterItem) => filterItem.id !== selectedID
          );
          return {
            ...item,
            childrenRB: clonetoFilter,
          };
        }
        return item;
      }
    );

    setChangeData({
      dataThatChangeID: parentID,
      parentID: parentID,
      fromWhere: "receipt book",
    });

    setReceiptBookData({
      ...isReceiptBookData,
      itemArray: cloneToDelete,
    });
  };

  let buttonClicked = "";

  const onSuccess = () => {
    setPrompt({
      message: `Items successfully updated status!`,
      type: "success",
      toggle: true,
    });
    buttonClicked = "";
    setOverallSelectedIndex([]);
  };
  const onError = (e: any) => {
    ErrorSubmit(e, setPrompt);
    buttonClicked = "";
  };

  const { isLoading: updateLoading, mutate: updateMutate } =
    MultipleUpdateReceiptBook(onSuccess, onError);

  const UpdateStatus = (status: string) => {
    buttonClicked = status;
    const Payload = {
      deposit_ids: isSelectedIDs,
      status: status,
    };
    if (isSelectedIDs?.length > 0) {
      updateMutate(Payload);
    } else {
      setPrompt({
        message: "Select a Receipt Book!",
        type: "draft",
        toggle: true,
      });
    }
  };
  return (
    <>
      {router.query.detail !== undefined && (
        <DepositDetail id={router.query.detail} />
      )}
      {type === "receipts-book" && (
        <>
          <h1 className=" text-[24px] 1366px:text-[20px] mb-5 480px:mb-2 flex items-center">
            Receipts Book
          </h1>
          <section className={`${styleSearch.container}`}>
            <div className={styleSearch.searchBarAdvF}>
              <div className={styleSearch.searchBar}>
                <input
                  type="text"
                  placeholder="Search"
                  value={isSearch}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <BsSearch className={styleSearch.searchIcon} />
              </div>
            </div>

            <ul className={styleSearch.navigation}>
              <li className={styleSearch.importExportPrint}>
                <Tippy theme="ThemeRed" content="Return">
                  <div
                    className={`${styleSearch.noFill} mr-5`}
                    onClick={() => UpdateStatus("In Process")}
                  >
                    <Image
                      src="/Images/f_back.png"
                      height={25}
                      width={30}
                      alt="Export"
                    />
                  </div>
                </Tippy>
              </li>
              {Permission_approve && (
                <li className={styleSearch.importExportPrint}>
                  <Tippy theme="ThemeRed" content="Approve">
                    <div
                      className={`${styleSearch.noFill} mr-5`}
                      onClick={() => UpdateStatus("Posted")}
                    >
                      <Image
                        src="/Images/f_check.png"
                        height={25}
                        width={30}
                        alt="Export"
                      />
                    </div>
                  </Tippy>
                </li>
              )}
            </ul>
          </section>
        </>
      )}
      {type !== "receipts-book" && (
        <section className={`${styleSearch.container}`}>
          <div className={styleSearch.period}>
            <h1 className=" text-[20px] 1366px:text-[20px] flex items-center">
              Receipts Book{" "}
              <Link href="/finance/customer-facility/deposit-counter/receipts-book">
                <a>
                  <GoEye className=" text-ThemeRed ml-2 text-[16px]" />
                </a>
              </Link>
            </h1>
          </div>

          <ul className={styleSearch.navigation}>
            <li className={styleSearch.importExportPrint}>
              {Permission_create && (
                <Link href="/finance/customer-facility/deposit-counter/create-deposit">
                  <a className="buttonRed mr-5">CREATE DEPOSIT</a>
                </Link>
              )}
              {Permission_modify && (
                <button className="buttonRed" onClick={() => SaveHandler()}>
                  {isLoadingSave ? (
                    <ScaleLoader color="#fff" height="10px" width="2px" />
                  ) : (
                    "SAVE"
                  )}
                </button>
              )}
            </li>
          </ul>
        </section>
      )}

      <div
        className={`table_container relative  ${
          type !== "receipts-book" && "max-half"
        }`}
      >
        <table className="table_list relative">
          <thead className="textRed">
            <tr>
              {type === "receipts-book" && (
                <th className=" w-10">
                  <input
                    type="checkbox"
                    checked={isReceiptBookData.selectAll}
                    onChange={selectAll}
                  />
                </th>
              )}
              <th>DOC. DATE</th>
              <th>DEPOSITOR</th>
              <th>RECEIPT NO.</th>
              <th>BANK & ACCOUNT NO.</th>
              <th>REFERENCE NO.</th>
              <th>DEPOSIT DATE</th>
              <th>DEPOSIT AMOUNT</th>
              {type === "receipts-book" && <th>CREDIT AMOUNT</th>}
              <th>INDEX</th>
              {type !== "receipts-book" && <th>VARIANCE</th>}
              {type !== "receipts-book" && <th></th>}
            </tr>
          </thead>
          <tbody>
            {isReceiptBookData?.itemArray?.map(
              (item: isTableItemObjRB, index: number) => (
                <List
                  key={index}
                  itemDetail={item}
                  isReceiptBookData={isReceiptBookData}
                  setTableItem={setReceiptBookData}
                  type={type}
                  index={index}
                  setChangeData={setChangeData}
                  AddHandler={AddHandler}
                  DeleteHandler={DeleteHandler}
                  DeleteHandlerChildren={DeleteHandlerChildren}
                  setSelectedIDs={setSelectedIDs}
                  isSelectedIDs={isSelectedIDs}
                  SelectedIndex={OverallSelectedIndex}
                  Permission_modify={Permission_modify}
                />
              )
            )}
          </tbody>
        </table>
        {Number(isPaginate) === Number(isReceiptBookData?.itemArray.length) &&
          type !== "receipts-book" && (
            <div className=" h-[40px] w-full flex justify-center items-center">
              <button
                className=" text-ThemeRed hover:underline font-NHU-bold"
                onClick={() => setPaginate((prev) => Number(prev) + 10)}
              >
                Load more...
              </button>
            </div>
          )}

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

      {type === "receipts-book" && (
        <Pagination
          setTablePage={setTablePage}
          tablePage={TablePage}
          totalPage={data?.data.meta.last_page}
        />
      )}
    </>
  );
}

type ListProps = {
  itemDetail: isTableItemObjRB;
  isReceiptBookData: isReceiptBookData;
  setTableItem: Function;
  type: string;
  index: number;
  setChangeData: Function;
  DeleteHandler: (id: string | number) => void;
  AddHandler: (id: string | number) => void;
  DeleteHandlerChildren: (
    parentID: string | number,
    selectedID: string | number
  ) => void;
  isSelectedIDs: number[];
  setSelectedIDs: Function;
  SelectedIndex: string[];
  Permission_modify: boolean;
};

const List = ({
  itemDetail,
  isReceiptBookData,
  setTableItem,
  type,
  setChangeData,
  AddHandler,
  DeleteHandlerChildren,
  isSelectedIDs,
  setSelectedIDs,
  SelectedIndex,
  Permission_modify,
}: ListProps) => {
  const updateValue = (key: string, e: any) => {
    const indexID = e.target.getAttribute("data-indexID");
    const indexAmount = e.target.getAttribute("data-indexAmount");
    const index = e.target.getAttribute("data-index");
    const ChildRowID = e.target.getAttribute("data-rowID");
    const newItems = isReceiptBookData?.itemArray?.map(
      (item: isTableItemObjRB) => {
        if (itemDetail.id == item.id) {
          if (key === "select") {
            if (item.select) {
              // remove
              const filterSelected = isSelectedIDs.filter(
                (itemFilt) => Number(item.id) !== itemFilt
              );
              setSelectedIDs(filterSelected);
            } else {
              // add
              setSelectedIDs([...isSelectedIDs, item.id]);
            }
            return {
              ...item,
              select: !item?.select,
            };
          }
          if (key === "index") {
            return {
              ...item,
              index: index,
              indexAmount: indexAmount,
              indexID: indexID,
              variance: Number(itemDetail.variance) - Number(indexAmount),
            };
          }
          if (key === "indexChild") {
            const childArray = item?.childrenRB?.map((childItem: childType) => {
              if (Number(childItem.id) === Number(ChildRowID)) {
                return {
                  ...childItem,
                  amount: indexAmount,
                  index: index,
                  indexID: indexID,
                };
              }
              return childItem;
            });
            return {
              ...item,
              childrenRB: childArray,
            };
          }
        }
        return item;
      }
    );
    setTableItem({
      itemArray: newItems,
      selectAll: false,
    });
  };

  const SelectHandler = (e: any) => {
    updateValue("index", e);
    setChangeData({
      dataThatChangeID: itemDetail.id,
      fromWhere: "receipt book",
      parentID: itemDetail.id,
      childreID: "",
    });
  };

  const SelectHandlerChildDD = (e: any) => {
    const ChildRowID = e.target.getAttribute("data-rowID");
    updateValue("indexChild", e);
    setChangeData({
      dataThatChangeID: itemDetail.id,
      fromWhere: "receipt book",
      parentID: itemDetail.id,
      childreID: ChildRowID,
    });
  };

  let deposit_date: any = parse(
    itemDetail.deposit_date,
    "yyyy-MM-dd",
    new Date()
  );
  deposit_date = isValid(deposit_date)
    ? format(deposit_date, "MMM dd yyyy")
    : "";

  let document_date: any = parse(
    itemDetail.document_date,
    "yyyy-MM-dd",
    new Date()
  );
  document_date = isValid(document_date)
    ? format(document_date, "MMM dd yyyy")
    : "";

  const remainingVariance =
    Number(itemDetail.deposit_amount) - Number(itemDetail.indexAmount);

  return (
    <>
      <tr className={`${itemDetail?.childrenRB?.length > 0 && "noBorder"}`}>
        {type === "receipts-book" && (
          <td className="checkbox w-[50px]">
            {itemDetail?.status !== "Posted" && (
              <input
                type="checkbox"
                onChange={(e: any) => updateValue("select", e)}
                checked={itemDetail?.select}
              />
            )}
          </td>
        )}

        <td>{deposit_date}</td>
        <td>{itemDetail?.depositor}</td>
        <td>
          {itemDetail?.receipt_no === null
            ? "Consolidated"
            : itemDetail?.receipt_no}
        </td>
        <td>{itemDetail?.bank_and_account_no}</td>
        <td>
          {type === "receipts-book" ? (
            itemDetail?.reference_no
          ) : (
            <>
              <Link
                href={`/finance/customer-facility/deposit-counter?detail=${itemDetail.id}`}
              >
                <a>{itemDetail?.reference_no}</a>
              </Link>
            </>
          )}
        </td>
        <td>{deposit_date}</td>
        <td>
          <TextNumberDisplay
            value={itemDetail?.deposit_amount}
            className={itemDetail?.deposit_amount === "" ? "" : "withPeso"}
          />
        </td>
        {type === "receipts-book" && (
          <td>
            <TextNumberDisplay
              value={itemDetail?.indexAmount}
              className={itemDetail?.indexAmount === "" ? "" : "withPeso"}
            />
          </td>
        )}
        <td>
          {type === "receipts-book" ? (
            itemDetail?.index
          ) : (
            <>
              {Permission_modify ? (
                <DropdownIndex
                  name="index"
                  value={itemDetail?.index}
                  selectHandler={SelectHandler}
                  rowID={itemDetail.id}
                  selectedIndex={SelectedIndex}
                />
              ) : (
                <input type="text" className="field disabled" />
              )}
            </>
          )}
        </td>
        {type !== "receipts-book" && (
          <td>
            <InputNumberForTable
              onChange={() => {}}
              value={remainingVariance}
              className={"field disabled w-full max-w-[150px] text-end"}
              type={""}
            />
          </td>
        )}
        {type !== "receipts-book" && (
          <td className="actionIcon h-full flex items-center">
            {itemDetail?.variance !== 0 &&
              itemDetail?.childrenRB?.length <= 0 &&
              Permission_modify && (
                <div
                  className={`ml-5 h-full 1024px:ml-2 ${
                    remainingVariance <= 0 && "pointer-events-none opacity-[.5]"
                  }`}
                  onClick={() => AddHandler(itemDetail?.id)}
                >
                  <PlusButtonTable />
                </div>
              )}
          </td>
        )}
      </tr>
      {itemDetail?.childrenRB?.map((itemChildren, index: number) => (
        <ChildList
          key={index}
          itemDetail={itemDetail}
          itemChildren={itemChildren}
          SelectHandlerChildDD={SelectHandlerChildDD}
          index={index}
          type={type}
          DeleteHandlerChildren={DeleteHandlerChildren}
          AddHandler={AddHandler}
          SelectedIndex={SelectedIndex}
        />
      ))}
    </>
  );
};

type ChildListProps = {
  itemDetail: isTableItemObjRB;
  index: number;
  type: string;
  itemChildren: childType;
  SelectHandlerChildDD: (e: any) => void;
  AddHandler: (id: string | number) => void;
  DeleteHandlerChildren: (
    parentID: string | number,
    selectedID: string | number
  ) => void;
  SelectedIndex: string[];
};

const ChildList = ({
  itemDetail,
  index,
  type,
  itemChildren,
  SelectHandlerChildDD,
  DeleteHandlerChildren,
  AddHandler,
  SelectedIndex,
}: ChildListProps) => {
  return (
    <>
      <tr
        className={`${
          itemDetail?.childrenRB?.length - 1 !== index && "noBorder"
        }`}
      >
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        {type === "receipts-book" && <td></td>}
        {type === "receipts-book" && (
          <td>
            <TextNumberDisplay
              value={itemChildren.amount}
              className="withPeso"
            />
          </td>
        )}
        <td>
          {type === "receipts-book" ? (
            itemChildren.index
          ) : (
            <DropdownIndex
              name="index"
              value={itemChildren.index}
              selectHandler={SelectHandlerChildDD}
              selectedIndex={SelectedIndex}
              rowID={itemChildren.id}
            />
          )}
        </td>
        {type !== "receipts-book" && (
          <td>
            <InputNumberForTable
              onChange={() => {}}
              value={itemChildren?.variance}
              className={"field disabled w-full max-w-[150px] text-end"}
              type={""}
            />
          </td>
        )}
        {type !== "receipts-book" && (
          <td className="actionIcon">
            <div
              onClick={() =>
                DeleteHandlerChildren(itemDetail.id, itemChildren.id)
              }
            >
              <MinusButtonTable />
            </div>
            {itemDetail?.variance !== 0 &&
              index === itemDetail?.childrenRB?.length - 1 && (
                <div
                  className={`ml-5 1024px:ml-2 ${
                    Number(itemDetail.variance) <= 0 &&
                    "pointer-events-none opacity-[.5]"
                  }`}
                  onClick={() => AddHandler(itemDetail.id)}
                >
                  <PlusButtonTable />
                </div>
              )}
          </td>
        )}
      </tr>
    </>
  );
};
