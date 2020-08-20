'use strict';

import * as RNEP from '@estimote/react-native-proximity';
import BackgroundTimer from 'react-native-background-timer';
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

  const zone1 = new RNEP.ProximityZone(5, 'green');
  zone1.onEnterAction = context => {
    startTimer();
    console.log('zone1 onEnter Timer Start', context);
  };
  zone1.onExitAction = context => {
    stopTimer(true);
    console.log('zone1 onExit Timer Stop', context);
  };
  zone1.onChangeAction = contexts => {
    console.log('zone1 onChange', contexts);
  };

  const zone2 = new RNEP.ProximityZone(5, 'conf-room');
  zone2.onEnterAction = context => {
    console.log('zone2 onEnter', context);
  };
  zone2.onExitAction = context => {
    console.log('zone2 onExit', context);
  };
  zone2.onChangeAction = contexts => {
    console.log('zone2 onChange', contexts);
  };

  RNEP.locationPermission.request().then(
    permission => {
      console.log(`location permission: ${permission}`);

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

        RNEP.proximityObserver.initialize(credentials, config);
        RNEP.proximityObserver.startObservingZones([zone1, zone2]);
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

export {startProximityObserver, stopProximityObserver};
