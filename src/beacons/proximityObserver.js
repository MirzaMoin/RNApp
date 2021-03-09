'use strict';

// import * as RNEP from '@estimote/react-native-proximity';
import BackgroundTimer from 'react-native-background-timer';
// import SpinWheelScreen from '../screen/SpinWheelScreen';
// import { Alert } from 'react-native';
let countTimer = 0;
let intervalCount = 0;
let timeoutId;
let intervalId;

const manageTimer = () => {
  timeoutId = BackgroundTimer.setTimeout(() => {
    stopTimer();
    countTimer++;
    console.log('tac timer complete ' + countTimer);
    startTimer(false);
  }, 10000);

  intervalId = BackgroundTimer.setInterval(() => {
    // this will be executed every 200 ms
    // even when app is the the background
    intervalCount++;
    console.log('tic interval ' + intervalCount);
  }, 1000);
};

const startTimer = () => {
  manageTimer();
  BackgroundTimer.start();
};

const stopTimer = checkTimeout => {
  if (intervalId != undefined) {
    BackgroundTimer.clearInterval(intervalId);
  } else {
    console.log('====================================');
    console.log('Interval ID not defined when stop');
    console.log('====================================');
  }

  if (checkTimeout && timeoutId != undefined) {
    BackgroundTimer.clearTimeout(timeoutId);
  } else {
    console.log('====================================');
    console.log('Timeout ID not defined when stop');
    console.log('====================================');
  }
  BackgroundTimer.stop();
};



const startProximityObserver = () => {
  const ESTIMOTE_APP_ID = 'react-native-487';
  const ESTIMOTE_APP_TOKEN = '19f431b9c2e6f26e68f34ca67d5344f3';

  console.log('Starting observers');
  const zone1 = new RNEP.ProximityZone(5, 'White');
  zone1.onEnterAction = context => {
    // startTimer();
    debugger
    alert('divce connected successfully')
    console.log('zone1 onEnter', context);
  };
  zone1.onExitAction = context => {
    // stopTimer(true);
    debugger
    alert('Divce disconnected successfully')
    console.log('zone1 onExit', context);
  };
  zone1.onChangeAction = contexts => {
    debugger
    //console.log('zone1 onChange', contexts);
    var data = contexts.map(function (item) {
      return {
        key: item.deviceIdentifier,
        value: item.tag
      };
    })

    console.log('value :' + JSON.stringify(data));
    console.log('zone1 onChange', contexts);
  };


  RNEP.locationPermission.request().then(
    permission => {
      console.log(`location permission: ${permission}`);
      debugger
      if (permission !== RNEP.locationPermission.DENIED) {
        const credentials = new RNEP.CloudCredentials(
          ESTIMOTE_APP_ID,
          ESTIMOTE_APP_TOKEN,
        );

        const config = {
          notification: {
            title: 'Exploration mode is on',
            text: "We'll notify you when you're next to something interesting.",
            channel: {
              id: 'exploration-mode',
              name: 'Exploration Mode',
            },
          },
        };
        debugger
        RNEP.proximityObserver.initialize(credentials, config);
        debugger
        console.log('Proximity Observer - ',RNEP.proximityObserver.isObserving);
        RNEP.proximityObserver.isObserving == false ? RNEP.proximityObserver.startObservingZones([zone1]) : null
        // RNEP.proximityObserver.startObservingZones([zone1,zone2]
        console.log('Proximity Observer after - ',RNEP.proximityObserver.isObserving);
        // RNEP.startProximityObserver.startObservingZones([RNEP.proximityObserver(5,'blue')])

        console.log('zone1 value:' + JSON.stringify(zone1))
        // console.log('zone2 value:' + JSON.stringify(zone2))

        debugger
      }
    },
    error => {
      console.error('Error when trying to obtain location permission', error);
    },
  );
};

const stopProximityObserver = () => {
  RNEP.proximityObserver.stopObservingZones();
};

export { startProximityObserver, stopProximityObserver };