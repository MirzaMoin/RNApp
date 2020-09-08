import MenuLinkModel from './MenuLink';
// home model
/**
 * For bottom container menu
 * menuText;
 * menuTextColor;
 * menuLinkType;
 * menuInternalLinkUrl;
 * menuExternalLinkUrl;
 * icon;
 */
class MenuPermissionModel {
    
    isVisibleMenuCashbackRedemption;
    isVisibleMenuTransferPoints;
    isVisibleMenuRPGoal;
    isVisibleMenuStoreRewards;
    isVisibleMenuWaysToEarnPoints;
    isVisibleMenuTakeSurvey;
    isVisibleMenuReferFriends;
    isVisibleMenuUploadReciepts;
    isVisibleMenuTxHistory;
    isVisibleMenuShareReferral;
    isVisibleMenuContactUs;
    isVisibleMenuAppointment;
    isVisibleMenuLocation;
    isVisibleUpdatePassword;
    isVisibleChangePassword;
    isVisibleSignOut;

    constructor() {}

    setMenuPermission (data) {
        this.isVisibleMenuCashbackRedemption = data.isVisibleMenuCashbackRedemption;
        this.isVisibleMenuTransferPoints = data.isVisibleMenuTransferPoints;
        this.isVisibleMenuRPGoal = data.isVisibleMenuRPGoal;
        this.isVisibleMenuStoreRewards = data.isVisibleMenuStoreRewards;
        this.isVisibleMenuWaysToEarnPoints = data.isVisibleMenuWaysToEarnPoints;
        this.isVisibleMenuTakeSurvey = data.isVisibleMenuTakeSurvey;
        this.isVisibleMenuReferFriends = data.isVisibleMenuReferFriends;
        this.isVisibleMenuUploadReciepts = data.isVisibleMenuUploadReciepts;
        this.isVisibleMenuTxHistory = data.isVisibleMenuTxHistory;
        this.isVisibleMenuShareReferral = data.isVisibleMenuShareReferral;
        this.isVisibleMenuContactUs = data.isVisibleMenuContactUs;
        this.isVisibleMenuContactUs = data.isVisibleMenuContactUs;
        this.isVisibleMenuLocation = data.isVisibleMenuLocation;
        this.isVisibleUpdatePassword = data.isVisibleUpdatePassword;
        this.isVisibleChangePassword = data.isVisibleChangePassword;
        this.isVisibleSignOut = data.isVisibleSignOut;
    }
}

export default new MenuPermissionModel();