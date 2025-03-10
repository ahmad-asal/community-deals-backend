export type dealFilters = {
    categoryId?: number;
    status?: 'In Review' | 'Approved' | 'Rejected';
    query?: string;
    createdAt?: string;
    activity?: 'active' | 'expired';
    intrestedOnly?: boolean;
    authorId?: number;
    country?: string;
    type?: 'I Want to' | 'I Need to' | 'Other';
};
