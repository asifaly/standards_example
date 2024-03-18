import _ from "lodash";

export const Statuses = { //* HardCode all these status keys in frontend such that whenever status change needed we can map keys from this Statuses object to get changing status value and check this status change is possible by supplying StatusFlow[currentStatusId].includes(changingStatusId)
    new: 1,
    introCall: 2,
    followUp: 3,
    application: 4,
    lost: 5,
    notQualified: 6,
    sentToCustomer: 7,
    submitted: 8,
    loanRejected: 9,
    offerAPF: 10,
    customerApproval: 11,
    customerAccepted: 12,
    customerRejected: 13,
    paymentPending: 14,
    eSignRequired: 15,
    completed: 16
}
export const userTypes = {
    admin: 1,
    sales: 2,
    credit: 3,
    manager: 4,
    contactPerson: 5,
    keyPersonnel: 6
};

export const krediqUsers = [userTypes.admin, userTypes.sales, userTypes.credit, userTypes.manager];
export const customerUsers = [userTypes.contactPerson, userTypes.keyPersonnel]

export const configurationsUnEditable = ["Status", "User Types"]

export const customerEditables = ["sentToCustomer", "customerApproval", "offerAPF", "paymentPending","eSignRequired"]

export const activityStatuses=[Statuses.new,Statuses.introCall,Statuses.followUp,Statuses.application,Statuses.lost,Statuses.notQualified]


export const customerActionButtonStatuses = [Statuses.sentToCustomer, Statuses.customerApproval]

export const krediqActionButtonStatuses = _.filter(Statuses, (value, key) => !customerActionButtonStatuses.includes(value));

export const thirdPartyServicesAPI ="https://api-utility-acvt9.ondigitalocean.app"