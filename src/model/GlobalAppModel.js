// Global App Model
/**
 * Class contains Fields required for whole app
 * Contains all colors
 * Contains Global Setting
 * Contains user data
 * contains Loading Components
 * Contains Global id and required fields
 */
import { parseColor } from './../utils/utility';
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
        this.primaryColor = parseColor(appColor.primaryColor);
        this.secondaryColor = parseColor(appColor.secondaryColor);
        this.tertiaryColor = parseColor(appColor.tertiaryColor);
        this.footerColor = parseColor(appColor.footerColor);
        this.primaryButtonColor = parseColor(appColor.primaryButtonColor);
        this.secondaryButtonColor = parseColor(appColor.secondaryButtonColor);
        this.loadingPageColor = parseColor(appColor.loadingPageColor);
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
        this.loadingPageColor = parseColor(color);
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