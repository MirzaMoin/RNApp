// Global App Model
/**
 * Class contains Fields required for whole app
 * Contains all colors
 * Contains Global Setting
 * Contains user data
 * contains Loading Components
 * Contains Global id and required fields
 */
class GlobalAppModel {
    
    // Colors
    primaryColor;
    secondaryColor;
    tertiaryColor;
    footerColor;
    primaryButtonColor;
    secondaryButtonColor;

    // Loading Images
    loadingImages;
    willShownLoadingImage; // which index will shown next

    // Global app reuired data
    rewardProgramId;
    webFormID;
    userID;
    loadingPageColor;

    constructor() {}
    setAppColor(appColor) {
        this.primaryColor = appColor.primaryColor;
        this.secondaryColor = appColor.secondaryColor;
        this.tertiaryColor = appColor.tertiaryColor;
        this.footerColor = appColor.footerColor;
        this.primaryButtonColor = appColor.primaryButtonColor;
        this.secondaryButtonColor = appColor.secondaryButtonColor;
    }

    setGlobalAppData(appData) {
        this.rewardProgramId = appData.rewardProgramId;
        this.webFormID = appData.webFormID;
    }

    setUserID(userID) {
        this.userID = userID;
    }

    setLoadingImages(images) {
        this.loadingImages = images;
        this.willShownLoadingImage = 0;
    }

    setLoadingPageColor(color) {
        this.loadingPageColor = color;
    }

    getLoadingImage() {
        if (this.loadingImages && this.loadingImages.length > 0) {
            var showingImage = this.loadingImages[this.willShownLoadingImage].imageUrl;

            if (this.willShownLoadingImage < this.loadingImages.length -1) {                
                this.willShownLoadingImage = this.willShownLoadingImage + 1;
            } else {
                this.willShownLoadingImage = 0;
            }
            return showingImage;
        }
    }
}

export default new GlobalAppModel();