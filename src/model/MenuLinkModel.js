// home model
export default class MenuLinkModel {
    
    menuText;
    menuTextColor;
    menuLinkType;
    menuInternalLinkUrl;
    menuExternalLinkUrl;
    icon;

    constructor(data) {
        this.menuText = data.menuText;
        this.menuTextColor = data.menuTextColor;
        this.menuLinkType = data.menuLinkType;
        this.menuInternalLinkUrl = data.menuInternalLinkUrl;
        this.menuExternalLinkUrl = data.menuExternalLinkUrl;
        this.icon = data.icon;
    }
}