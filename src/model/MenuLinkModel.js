// home model
export default class MenuLinkModel {
    
    menuText;
    menuTextColor;
    menuLinkType;
    menuInternalLinkUrl;
    menuExternalLinkUrl;
    icon;
    menuTopColor;
    menuBottomColor;
    menuBackgroudImage;
    menuOpacity;

    constructor(data) {
        this.menuText = data.menuText;
        this.menuTextColor = data.menuTextColor;
        this.menuLinkType = data.menuLinkType;
        this.menuInternalLinkUrl = data.menuInternalLinkUrl;
        this.menuExternalLinkUrl = data.menuExternalLinkUrl;
        this.icon = data.icon;
        this.menuTopColor = data.menuTopColor;
        this.menuBottomColor = data.menuBottomColor;
        this.menuBackgroudImage = data.menuBackgroudImage;
        this.menuOpacity = data.menuOpacity;
    }
}