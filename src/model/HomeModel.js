/**
 * For bottom container menu
 * menuText;
 * menuTextColor;
 * menuLinkType;
 * menuInternalLinkUrl;
 * menuExternalLinkUrl;
 * icon;
 */
class HomeModel {
    homePageDisplayRibbon;
    homePageRibbonPosition;
    homePageRibbonText;
    homePageRibbonTextColor;
    homePageRibbonBackgroundColor;
    homePageRibbonLinkType;
    homePageRibbonLink;
    homePageTopBackgroundImage;
    homePageTopBackgroundGradientStartColor;
    homePageTopBackgroundGradientStopColor;
    homePageTopBackgroundOpacity;
    homePageTopTextLine1;
    homePageTopTextLine1Color;
    homePageTopTextLine2;
    homePageTopTextLine2Color;
    homePageDisplayTopButton;
    homePageTopButtonText;
    homePageTopButtonTextColor;
    homePageTopButtonGradientStartColor;
    homePageTopButtonGradientStopColor;
    homePageTopButtonLinkType;
    homePageTopButtonLink;
    homePageBottomBackgroundImage;
    homePageBottomBackgroundGradientStartColor;
    homePageBottomBackgroundGradientStopColor;
    homePageBottomBackgroundOpacity;
    homePageBottomDisplayIcon;
    homePageBottomDisplayArrowIcon;
    homePageBottomArrowColor;
    homePageBottomTextAlign;
    homePageDisplayFooter;
    homePageBottomIconShape;
    homePageBottomIconColor;
    homePageBottomIconBackgroundColor;
    footerLinks;
    menuLinks;

    constructor() {}

    setHomeScreenData (data) {
        this.homePageDisplayRibbon = data.homePageDisplayRibbon;
        this.homePageRibbonPosition = data.homePageRibbonPosition;
        this.homePageRibbonText = data.homePageRibbonText;
        this.homePageRibbonTextColor = data.homePageRibbonTextColor;
        this.homePageRibbonBackgroundColor = data.homePageRibbonBackgroundColor;
        this.homePageRibbonLinkType = data.homePageRibbonLinkType;
        this.homePageRibbonLink = data.homePageRibbonLink;
        this.homePageTopBackgroundImage = data.homePageTopBackgroundImage;
        this.homePageTopBackgroundGradientStartColor = data.homePageTopBackgroundGradientStartColor;
        this.homePageTopBackgroundGradientStopColor = data.homePageTopBackgroundGradientStopColor;
        this.homePageTopBackgroundOpacity = data.homePageTopBackgroundOpacity;
        this.homePageTopTextLine1 = data.homePageTopTextLine1;
        this.homePageTopTextLine1Color = data.homePageTopTextLine1Color;
        this.homePageTopTextLine2 = data.homePageTopTextLine2;
        this.homePageTopTextLine2Color = data.homePageTopTextLine2Color;
        this.homePageDisplayTopButton = data.homePageDisplayTopButton;
        this.homePageTopButtonText = data.homePageTopButtonText;
        this.homePageTopButtonTextColor = data.homePageTopButtonTextColor;
        this.homePageTopButtonGradientStartColor = data.homePageTopButtonGradientStartColor;
        this.homePageTopButtonGradientStopColor = data.homePageTopButtonGradientStopColor;
        this.homePageTopButtonLinkType = data.homePageTopButtonLinkType;
        this.homePageTopButtonLink = data.homePageTopButtonLink;
        this.homePageBottomBackgroundImage = data.homePageBottomBackgroundImage;
        this.homePageBottomBackgroundGradientStartColor = data.homePageBottomBackgroundGradientStartColor;
        this.homePageBottomBackgroundGradientStopColor = data.homePageBottomBackgroundGradientStopColor;
        this.homePageBottomBackgroundOpacity = data.homePageBottomBackgroundOpacity;
        this.homePageBottomDisplayIcon = data.homePageBottomDisplayIcon;
        this.homePageBottomDisplayArrowIcon = data.homePageBottomDisplayArrowIcon;
        this.homePageBottomArrowColor = data.homePageBottomArrowColor;
        this.homePageBottomTextAlign = data.homePageBottomTextAlign;
        this.homePageDisplayFooter = data.homePageDisplayFooter;
        this.homePageBottomIconShape = data.homePageBottomIconShape;
        this.homePageBottomIconColor = data.homePageBottomIconColor;
        this.homePageBottomIconBackgroundColor = data.homePageBottomIconBackgroundColor;
        this.footerLinks = data.footerLinks;
        this.menuLinks = data.menuLinks;
    }
}

export default new HomeModel();