export type RolePermission = {
    id: number;
    menu: string;
    type: string;
    roles: Roles;
    rolesNumber: number;
    sectionEnd: boolean;
    duration: number;
};
export type Roles = {
    all: boolean | null;
    view: boolean | null;
    create: boolean | null;
    modify: boolean | null;
    print: boolean | null;
    approve: boolean | null;
};

export const RolesAndPermissionTable: RolePermission[] = [
    {
        id: 1,
        menu: "Admin",
        type: "primary",
        sectionEnd: false,
        roles: {
            all: null,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: false,
        },
        rolesNumber: 5,
        duration: 0,
    },
    {
        id: 2,
        menu: "Customer",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: false,
        },
        rolesNumber: 5,
        duration: 0,
    },
    {
        id: 3,
        menu: "Property",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: null,
        },
        rolesNumber: 4,
        duration: 0,
    },
    {
        id: 4,
        menu: "Customer Request",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: null,
            view: null,
            create: null,
            modify: null,
            print: null,
            approve: null,
        },
        rolesNumber: 0,
        duration: 0,
    },
    {
        id: 5,
        menu: "Customer Request View (New Request)",
        type: "tertiary",
        sectionEnd: false,
        roles: {
            all: false,
            view: null,
            create: null,
            modify: null,
            print: null,
            approve: false,
        },
        rolesNumber: 1,
        duration: 0,
    },
    {
        id: 6,
        menu: "Customer Request View (In Process)",
        type: "tertiary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: null,
            modify: null,
            print: null,
            approve: false,
        },
        rolesNumber: 2,
        duration: 0,
    },
    {
        id: 7,
        menu: "Customer Request View (In Review)",
        type: "tertiary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: null,
            modify: null,
            print: null,
            approve: false,
        },
        rolesNumber: 2,
        duration: 0,
    },
    {
        id: 8,
        menu: "Customer Request View (Closed)",
        type: "tertiary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: null,
            modify: null,
            print: false,
            approve: null,
        },
        rolesNumber: 2,
        duration: 0,
    },
    {
        id: 9,
        menu: "Communication",
        type: "secondary",
        sectionEnd: true,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: null,
            print: null,
            approve: null,
        },
        rolesNumber: 2,
        duration: 0,
    },
    {
        id: 10,
        menu: "Finance",
        type: "primary",
        sectionEnd: false,
        roles: {
            all: null,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: false,
        },
        rolesNumber: 5,
        duration: 0,
    },
    {
        id: 11,
        menu: "Chart of Accounts",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: null,
        },
        rolesNumber: 4,
        duration: 0,
    },

    {
        id: 12,
        menu: "Opening Balance",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: null,
            approve: null,
        },
        rolesNumber: 3,
        duration: 0,
    },
    {
        id: 13,
        menu: "Bank Reconciliation",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: null,
        },
        rolesNumber: 4,
        duration: 0,
    },
    {
        id: 14,
        menu: "Journal",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: false,
        },
        rolesNumber: 5,
        duration: 0,
    },
    {
        id: 15,
        menu: "Charges",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: null,
            approve: null,
        },
        rolesNumber: 3,
        duration: 0,
    },
    {
        id: 16,
        menu: "Billing",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: false,
        },
        rolesNumber: 5,
        duration: 0,
    },
    {
        id: 17,
        menu: "Collection",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: null,
            print: false,
            approve: false,
        },
        rolesNumber: 4,
        duration: 0,
    },
    {
        id: 18,
        menu: "Deposit Counter",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: false,
        },
        rolesNumber: 5,
        duration: 0,
    },
    {
        id: 19,
        menu: "Adjustment",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: false,
            approve: false,
        },
        rolesNumber: 5,
        duration: 0,
    },
    {
        id: 20,
        menu: "Check Receivables",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: null,
            print: false,
            approve: false,
        },
        rolesNumber: 4,
        duration: 0,
    },
    {
        id: 21,
        menu: "Email Blast",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: null,
            create: false,
            modify: null,
            print: null,
            approve: null,
        },
        rolesNumber: 1,
        duration: 0,
    },
    {
        id: 22,
        menu: "Reports",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: null,
            view: null,
            create: null,
            modify: null,
            print: null,
            approve: null,
        },
        rolesNumber: 0,
        duration: 0,
    },
    {
        id: 23,
        menu: "General Reports",
        type: "tertiary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: null,
            modify: null,
            print: false,
            approve: null,
        },
        rolesNumber: 2,
        duration: 0,
    },
    {
        id: 24,
        menu: "Customer Reports",
        type: "tertiary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: null,
            modify: null,
            print: false,
            approve: null,
        },
        rolesNumber: 2,
        duration: 0,
    },
    {
        id: 25,
        menu: "Policy",
        type: "secondary",
        sectionEnd: false,
        roles: {
            all: false,
            view: false,
            create: false,
            modify: false,
            print: null,
            approve: null,
        },
        rolesNumber: 3,
        duration: 0,
    },
];
