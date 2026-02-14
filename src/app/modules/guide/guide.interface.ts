import { Types } from "mongoose";

export enum GuideApplicationStatus {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
}
export interface IApplyGuide {
    userId? : Types.ObjectId;
    divisionId : Types.ObjectId;
    nidPhoto : string;
    status? : GuideApplicationStatus;
}