export const enquiryStatuses = ["pending", "followup", "resolved"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];
