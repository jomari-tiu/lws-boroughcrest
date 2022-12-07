export type ChargePayload = {
    code: string;
    type: string;
    name: string;
    description: string;
    base_rate: number;
    uom: string;
    vat_percent: number;
    receivable_coa_id?: string | number;
    receivable_coa_value?: string;
    discounts_coa_id?: string | number;
    discounts_coa_value?: string;
    revenue_coa_id?: string | number;
    revenue_coa_value?: string;
    advances_coa_id?: string | number;
    advances_coa_value?: string;
    minimum: number;
    interest: string;
    payment_heirarchy: number;
    soa_sort_order: number;
};
