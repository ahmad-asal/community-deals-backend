export interface Deal {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    expiryDate: Date | null;
    status: DealStatuses;
}

export type DealStatuses = 'In Review' | 'Approved' | 'Rejected';

export function isValidDealStatus(value: string): value is DealStatuses {
    const ValidDealStatus: string[] = ['In Review', 'Approved', 'Rejected'];

    return ValidDealStatus.indexOf(value) !== -1;
}
