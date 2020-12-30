package com.test;
import  android.util.Log;
import android.content.Context;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.estimote.proximity_sdk.api.*;
import com.estimote.proximity_sdk.*;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Nullable;

import io.reactivex.internal.queue.SpscArrayQueue;
import kotlin.Unit;
import kotlin.jvm.functions.Function1;

public class BeaconModule extends ReactContextBaseJavaModule {
    private Object cou;
    private Object cou1;
    private Object cou2;
    private ProximityObserver.Handler proximityObserverHandler;
    private ProximityObserver proximityObserver;
    private Context context = getReactApplicationContext();

    public BeaconModule(ReactApplicationContext reactApplicationContext){
        super(reactApplicationContext);
    }
    @Override
    public String getName(){
        return "Beaconconnect";
    }
    @Override
    public Map<String, Object> getConstants(){
       final Map<String, Object> constants =new HashMap<>();
       constants.put("initialCount", 0);
       return constants;
    }

    @ReactMethod
    public <ProximityContent> void beacon(Promise promise){
        try{
            EstimoteCloudCredentials cloudCredentials = new EstimoteCloudCredentials("jingram-roborewards-com-s--8ki", "03cec4f4b6eba05b2c72f09e82cb252e");
            this.proximityObserver =
                    new ProximityObserverBuilder(context.getApplicationContext(), cloudCredentials)
                            .onError(new Function1<Throwable, Unit>() {
                                @Override
                                public Unit invoke(Throwable throwable) {
                                    Log.e("app", "proximity observer error: " + throwable);
                                    return null;
                                }
                            })
                            .withBalancedPowerMode()
                            .withEstimoteSecureMonitoringDisabled()
                            .withTelemetryReportingDisabled()
                            .build();
            ProximityZone zone = new ProximityZoneBuilder()
                    .forTag("jingram-roborewards-com-s--8ki")
                    .inCustomRange(5)
                    .onEnter(new Function1<ProximityZoneContext, Unit>() {
                        @Override
                        public Unit invoke(ProximityZoneContext context) {
                            String deskOwner = context.getAttachments().get("jingram-roborewards-com-s--8ki/title");
                            Log.d("app", "Welcome to zone " + deskOwner );
                            String did = context.getDeviceId();
                            Log.d("app", "DeviceId " + did);
                            cou1=context;
                            // send callback to React-Native
                            WritableMap params = Arguments.createMap();
                            if(cou1!=null) params.putString("key1",cou1.toString());
                            sendEvent(getReactApplicationContext(), "onEnterZone", params);
                            return null;
                        }
                    })
                    .onExit(new Function1<ProximityZoneContext, Unit>() {
                        @Override
                        public Unit invoke(ProximityZoneContext context) {
                            Log.d("app", "Bye bye, come again!");
                            cou2=context;
                            WritableMap params = Arguments.createMap();
                            if(cou2!=null) params.putString("key2",cou2.toString());
                            sendEvent(getReactApplicationContext(), "onExitZone", params);
                            return null;
                        }
                    })
                    .onContextChange(new Function1<Set<? extends ProximityZoneContext>, Unit>() {
                        @Override
                        public Unit invoke(Set<? extends ProximityZoneContext> contexts) {

                            List<ProximityContent> nearbyContent = new ArrayList<>(contexts.size());
                            //arr.contains(contexts);

                            for (ProximityZoneContext proximityContext : contexts) {
                                String title = proximityContext.getAttachments().get("jingram-roborewards-com-s--8ki/title");
                                Log.d("app", "change context " + title );
                                cou=contexts;
                                WritableMap params = Arguments.createMap();
                                if(cou!=null) params.putString("key",cou.toString());
                                sendEvent(getReactApplicationContext(), "onContextChange", params);
                            }
                            return null;
                        }
                    })
                    .build();
            proximityObserverHandler = proximityObserver.startObserving(zone);
//            Log.d("observing", String.format(" beacon scan call 1 "));

        } catch (Exception e){
            promise.reject("VIEW_ERROR", e.getMessage());
        }
//        Log.d("observing", String.format(" beacon scan call 1 "));

    }
    private void sendEvent(
            ReactContext reactContext,
            String eventName,
            @Nullable WritableMap Params){
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, Params);
    }
}