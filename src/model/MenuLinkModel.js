// home model
class MenuLinkModel {
    
    menuText;
    menuTextColor;
    menuLinkType;
    menuInternalLinkUrl;
    menuExternalLinkUrl;
    icon;

    constructor() {}

    getMenuLink (data) {
        this.menuText = data.menuText;
        this.menuTextColor = data.menuTextColor;
        this.menuLinkType = data.menuLinkType;
        this.menuInternalLinkUrl = data.menuInternalLinkUrl;
        this.menuExternalLinkUrl = data.menuExternalLinkUrl;
        this.icon = data.icon;
    }
}

export default new MenuLinkModel();