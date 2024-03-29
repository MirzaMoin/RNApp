package com.test;

import android.content.Context;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.test.BeaconPackage;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BeaconPackage implements ReactPackage {
    @Override
    public  List<ViewManager> createViewManagers(ReactApplicationContext reactContext){
            return Collections.emptyList();
    }
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext){
        List<NativeModule> Modules =new ArrayList<>();
        Modules.add(new BeaconModule(reactContext));
        return Modules;
    }
}