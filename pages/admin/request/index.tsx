import React from "react";
import {
    RequestIcon,
    RequestRefresh,
} from "../../../components/Reusable/Icons";
import CardContainer from "../../../components/ADMIN/Request/CardContainer";
import RequestModal from "../../../components/ADMIN/Request/RequestModal";
import { useRouter } from "next/router";
import Link from "next/link";
import { PageAccessValidation } from "../../../components/Reusable/PermissionValidation/PageAccessValidation";
import NoPermissionComp from "../../../components/Reusable/PermissionValidation/NoPermissionComp";

export default function Request() {
    const router = useRouter();

    const PagePermisson_NewRequest = PageAccessValidation(
        "Customer Request View (New Request)"
    );

    const PagePermisson_InProcess = PageAccessValidation(
        "Customer Request View (In Process)"
    );

    const PagePermisson_InReview = PageAccessValidation(
        "Customer Request View (In Review)"
    );

    const PagePermisson_Closed = PageAccessValidation(
        "Customer Request View (Closed)"
    );

    if (
        !PagePermisson_NewRequest &&
        PagePermisson_NewRequest !== undefined &&
        !PagePermisson_InProcess &&
        PagePermisson_InProcess !== undefined &&
        !PagePermisson_InReview &&
        PagePermisson_InReview !== undefined &&
        !PagePermisson_Closed &&
        PagePermisson_Closed !== undefined
    ) {
        return <NoPermissionComp />;
    }

    return (
        <div>
            {router.query.type !== undefined && <RequestModal />}
            <h1 className="pageTitle">Request Board</h1>
            <ul className="w-full flex justify-end items-center">
                <li className="mr-5">
                    <Link href="/admin/request/request-list">
                        <a>
                            <RequestIcon />
                        </a>
                    </Link>
                </li>
                <li>
                    <RequestRefresh />
                </li>
            </ul>
            <div className=" overflow-auto w-full">
                <ul className="flex flex-wrap mt-5 min-w-[1000px]">
                    <li className="w-1/4">
                        <CardContainer
                            endPoint=""
                            color="#8f384d"
                            type="New Request"
                        />
                    </li>

                    <li className="w-1/4">
                        <CardContainer
                            endPoint=""
                            color="#5c6e91"
                            type="In Process"
                        />
                    </li>

                    <li className="w-1/4">
                        <CardContainer
                            endPoint=""
                            color="#dd9866"
                            type="In Review"
                        />
                    </li>

                    <li className="w-1/4">
                        <CardContainer
                            endPoint=""
                            color="#41b6ff"
                            type="Closed"
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
}
