// Login Screen Model
class LoginScreenModel {
    
    logInLogoImage;
    logInBackgroundImage;
    logInBackgroundVideo;
    themeType;
    bgColor;
    bgOpacity;
    bannerTitleColor;
    bannerDescColor;
    bannerTitleText;
    bannerDescText;
    signInBtnText;
    signInBtnGradientstartColor;
    signInBtnGradientStopColor;
    forgotPwdBtnText;
    forgotPwdBtnTextColor;
    forgotPwdBtnTextHoverColor;
    forgotPwdBtnGradientstartColor;
    forgotPwdBtnGradientStopColor;
    joinNowBtnText;
    joinNowBtnGradientstartColor;
    joinNowBtnGradientStopColor;
    subDescText;
    subDescColor;
    joinNowBtnTextColor;
    joinNowBtnTextHoverColor;
    signInBtnTextColor;
    signInBtnTextHoverColor;
    isBanner;
    loadingPageColor;

    constructor() {}

    setLoginScreenData (data) {
        this.logInLogoImage = data.logInLogoImage;
        this.logInBackgroundImage = data.logInBackgroundImage;
        this.logInBackgroundVideo = data.logInBackgroundVideo;
        this.themeType = data.themeType;
        this.bgColor = data.bgColor;
        this.bgOpacity = data.bgOpacity;
        this.bannerTitleColor = data.bannerTitleColor;
        this.bannerDescColor = data.bannerDescColor;
        this.bannerTitleText = data.bannerTitleText;
        this.bannerDescText = data.bannerDescText;
        this.signInBtnText = data.signInBtnText;
        this.signInBtnGradientstartColor = data.signInBtnGradientstartColor;
        this.signInBtnGradientStopColor = data.signInBtnGradientstartColor;
        this.forgotPwdBtnText = data.forgotPwdBtnText;
        this.forgotPwdBtnTextColor = data.forgotPwdBtnTextColor;
        this.forgotPwdBtnTextHoverColor = data.forgotPwdBtnTextHoverColor;
        this.forgotPwdBtnGradientstartColor = data.forgotPwdBtnGradientstartColor;
        this.forgotPwdBtnGradientStopColor = data.forgotPwdBtnGradientStopColor;
        this.joinNowBtnText = data.joinNowBtnText;
        this.joinNowBtnGradientstartColor = data.joinNowBtnGradientstartColor;
        this.joinNowBtnGradientStopColor = data.joinNowBtnGradientStopColor;
        this.subDescText = data.subDescText;
        this.subDescColor = data.subDescColor;
        this.joinNowBtnTextColor = data.joinNowBtnTextColor;
        this.joinNowBtnTextHoverColor = data.joinNowBtnTextHoverColor;
        this.signInBtnTextColor = data.signInBtnTextColor;
        this.signInBtnTextHoverColor = data.signInBtnTextHoverColor;
        this.isBanner = data.isBanner;
        this.loadingPageColor = data.loadingPageColor;
    }
}

export default new LoginScreenModel();