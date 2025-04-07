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
    type: DealTypes;
    audience?: DealAudienceType;
}

export type DealStatuses = 'In Review' | 'Approved' | 'Rejected' | 'Deleted';
export type DealTypes = 'I Want to' | 'I Need to' | 'Other';
export type DealAudienceType = 'public' | 'friends' | 'custom';

export function isValidDealStatus(value: string): value is DealStatuses {
    const ValidDealStatus: string[] = [
        'In Review',
        'Approved',
        'Rejected',
        'Deleted',
    ];

    return ValidDealStatus.indexOf(value) !== -1;
}
