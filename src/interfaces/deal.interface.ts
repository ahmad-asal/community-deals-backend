export interface Deal {
    id?: number;
    title: string;
    description: string;
    categoryId: number;
    autherId: number;
    expiryDate: Date | null;
    status: DealStatuses;
    created_at?: string;
    updated_at?: string;
}

export type DealStatuses = 'In Review' | 'Approved' | 'Rejected' | 'Deleted';

export function isValidDealStatus(value: string): value is DealStatuses {
    const ValidDealStatus: string[] = [
        'In Review',
        'Approved',
        'Rejected',
        'Deleted',
    ];

    return ValidDealStatus.indexOf(value) !== -1;
}
