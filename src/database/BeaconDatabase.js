import { openDatabase } from 'react-native-sqlite-storage';

function openDB() {
    return openDatabase({ name: 'RRBeacon.db' });
}

/**
 * Create beacon databsed
 */
export async function createBeaconTable() {
    var db = openDB();
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='beacon'",
            [],
            function (txn, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS beacon', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS beacon(beaconId INTEGER(100) PRIMARY KEY,deviceId INTEGER(100),deviceTag VARCHAR(100),priority INTEGER(20))',
                        [],
                        (success) => {
                            console.log("success in create beacon " + success);
                        },
                        (error) => {
                            console.log("error beacon " + error);
                        }
                    );
                }
            }
        );
    });
}

/**
 * Insert Beacon
 */
export async function insertBeaconData(beaconData) {
    var db = openDB();
    db.transaction((tx) => {
        tx.executeSql(
            'INSERT INTO beacon(beaconId,deviceId,deviceTag,priority) VALUES (?,?,?,?)',
            beaconData,
            (tx, result) => {
                console.log("data inserted in beacon"+beaconData[0])
            },
            (error) => {
                console.log("error in insert beacon " + JSON.stringify(error));
            }
        );
    });
}

/**
 * updating message prority
 * @param {String} beaconID to fetch beacon data
 * @param {Number} newPriority next message occurance priority
 */
export async function updateMessagePriority(beaconID, newPriority) {
    var db = openDB();
    db.transaction((txx) => {
        txx.executeSql(
            'update beacon set next_delay = ? where beacon_id = ?',
            [newPriority, beaconID],
            (tx, res) => {
                console.log('Results', res.rowsAffected);
                if (res.rowsAffected > 0) {
                    Alert.alert(
                        'Success',
                        results.rows.item(newVal)['message'],
                        [
                            {
                                text: 'Ok',
                                onPress: () => console.log("msg receive " + results.rows.item(newVal)['message']),
                            },
                        ],
                        { cancelable: false }
                    );
                } else alert('Updation Failed');
            },
            (error) => {
                console.log("error in update " + JSON.stringify(error))
            }
        );
    })
}
/**
 * select beacon
 */
export async function selectBeacon() {
    var db = openDB();
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM beacon', [], (tx, results) => {
            if (results.rows.length == 0) {
                return 0
            } else {
                var temp = [];
                if (results.rows.length)
                    for (let i = 0; i <= results.rows.length; i++)
                        temp.push(results.rows.item(i));
                console.log("select " + JSON.stringify(temp))
                return temp;
            }
        });
    });
}

/**
 * Get Beacon message priority from Beacon Id
 * @param {String} beaconID 
 */
export async function getBeaconMessagePriority(beaconID) {
    var db = openDB();
    (await db).transaction((tx) => {
        tx.executeSql('SELECT priority FROM beacon where beaconId = ?', [beaconID], (tx, result) => {
            if (result.rows.length > 0) {
                // Return local stored priority
                return result.rows.item(0)['priority'];
            } else {
                // Return default priority
                return 1;
            }
        })
    })
}
export async function clearDatabase() {
    var db = openDB();
    (await db).transaction((tx) => {
        tx.executeSql('delete from beacon', [], (tx, res) => {
            console.log("All old data of beacon deleted")
            return
        })
    })
}