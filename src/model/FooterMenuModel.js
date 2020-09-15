export default class FooterMenuModel {
    
    footerText;
    footerLinkType;
    footerInternalLinkUrl;
    footerExternalLinkUrl;

    constructor(data) {
        this.footerText = data.footerText;
        this.footerLinkType = data.footerLinkType;
        this.footerInternalLinkUrl = data.footerInternalLinkUrl;
        this.footerExternalLinkUrl = data.footerExternalLinkUrl;
    }
}