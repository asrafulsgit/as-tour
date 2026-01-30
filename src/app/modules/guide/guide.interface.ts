
export enum GuideApplicationStatus {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
}
export interface IApplyGuide {
    userId? : string;
    divisionId : string;
    nidPhoto : string;
    status? : GuideApplicationStatus;
}