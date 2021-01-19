import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'RRBeacon.db' });
export function createTableBeacon(){
        var that = this;
        // debugger;
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='beacon'",
                [],
                function (txn, res) {
                    // console.log('Inside the select statement');
                    if (res.rows.length == 0) {
                        console.log('Inside the select statement row count');
                        // debugger;
                        txn.executeSql('DROP TABLE IF EXISTS beacon', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS beacon(b_id INTEGER PRIMARY KEY AUTOINCREMENT, beacon_id VARCHAR(20), uuid VARCHAR(20), major VARCHAR(20),minor VARCHAR(20),delay_time VARCHAR(20),check_in_time VARCHAR(20),welcome_order VARCHAR(20),delay_order VARCHAR(20),check_in_count_type VARCHAR(20),welcome_jackpot_count INT(20),delay_jackpot_count INT(20),next_welcome INT(20),next_welcome_jackpot INT(20),next_delay INT(20),next_delay_jackpot INT(20),is_allow_welcome VARCHAR(20),is_ok_popup VARCHAR(10),location_name VARCHAR(10))',
                            [],
                            (success) => {
                                console.log("success in create beacon " + success);
                                that.createTableMsg();
                            },
                            (error) => {
                                console.log("error beacon " + error);
                            }
                        );
                    } else {
                        that.createTableMsg();
                        // console.log('Beacon table is already created');
                    }
                }
            );
            // debugger;
        });
    
}
export function createTableMsg() {
    var that = this;
    db.transaction(function (txn) {
        // debugger
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='message'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS message', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS message(m_id INTEGER PRIMARY KEY AUTOINCREMENT, message_id VARCHAR(20), beacon_id VARCHAR(10), offer_id VARCHAR(20),message VARCHAR(20),message_title VARCHAR(10),point_to_add VARCHAR(20),image VARCHAR(50),notification_type VARCHAR(10),is_jackpot_type VARCHAR(20),issue_count VARCHAR(20),is_welcome VARCHAR(10))',
                        [],
                        (success) => {
                            console.log("success in create message " + success);
                            that.insertData();
                        },
                        (error) => {
                            console.log("error message " + error);
                        }
                    );
                } else {
                    that.insertData();
                    // console.log('Message table is already created');
                }
            }
        );
        // debugger;
    });
}

export function insertData ()  {
    // for (let index = 0; index < apidata.Response.length; index++) {
    // console.log("check " + apidata['Response'][index]['timedelayList'][0]['message'])
    // console.log('Start data insertion');
    var that = this;
    for (let index = 0; index < apidata.Response.length; index++) {
        // console.log(`Inserted data ${apidata.Response}`);
        for (let i = 0; i < apidata['Response'][index]['timedelayList'].length; i++) {

            db.transaction(function (tx) {
                // debugger;
                tx.executeSql(
                    'SELECT * FROM message where message_id = ?',
                    [apidata['Response'][index]['timedelayList'][i]['MessageID']],
                    (txx, results) => {
                        var len = results.rows.length;
                        if (len == 0) {
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'INSERT INTO message (m_id,message_id,beacon_id,offer_id,message,message_title,point_to_add,image,notification_type,is_jackpot_type,issue_count,is_welcome) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                                    [null, apidata['Response'][index]['timedelayList'][i]['MessageID'], apidata['Response'][index]['BeaconID'], apidata['Response'][index]['timedelayList'][i]['OfferID'], apidata['Response'][index]['timedelayList'][i]['message'], apidata['Response'][index]['timedelayList'][i]['MessageTitle'], apidata['Response'][index]['timedelayList'][i]['PointsToAdd'], apidata['Response'][index]['timedelayList'][i]['image'], apidata['Response'][index]['timedelayList'][i]['NotificationPreview'], apidata['Response'][index]['timedelayList'][i]['IsJackpotOffer'], apidata['Response'][index]['timedelayList'][i]['IssueEveryJackpot'], false],
                                    (tx, results) => {
                                        console.log(` ${results.insertId} === ${JSON.stringify(results.rows)} Added ${JSON.stringify([null, apidata['Response'][index]['timedelayList'][i]['MessageID'], apidata['Response'][index]['BeaconID'], apidata['Response'][index]['timedelayList'][i]['OfferID'], apidata['Response'][index]['timedelayList'][i]['message'], apidata['Response'][index]['timedelayList'][i]['MessageTitle'], apidata['Response'][index]['timedelayList'][i]['PointsToAdd'], apidata['Response'][index]['timedelayList'][i]['image'], apidata['Response'][index]['timedelayList'][i]['NotificationPreview'], apidata['Response'][index]['timedelayList'][i]['IsJackpotOffer'], apidata['Response'][index]['timedelayList'][i]['IssueEveryJackpot'], false])}  `, JSON.stringify(results.rowsAffected) + ' - ' + JSON.stringify(tx));
                                    },
                                    (error) => {
                                        console.log("error in insert message " + JSON.stringify(error))
                                        console.log("error in insert Message 2 " + error.executeSql.name);
                                        // debugger;
                                    }
                                );
                            });
                        } else { console.log('data available') }

                    }
                );
            });


            // debugger;
        }
        /*db.transaction(function (tx) {
          // debugger;
          tx.executeSql(
            'SELECT * FROM message where message_id = ?',
            [apidata['Response'][index]['timedelayList'][0]['MessageID']],
            (txx, results) => {
              var len = results.rows.length;
              // console.log('len', len);
              if (len > 0) {
                console.log('Data allready Exist');
                // console.log("already inserted...")
              } else {
                console.log('Message data adding');
                // alert('No user found');
                // debugger;
                
                tx.executeSql(
                  'INSERT INTO beacon (beacon_id,uuid,major,minor,delay_time,check_in_time,welcome_order,delay_order,check_in_count_type,welcome_jackpot_count,delay_jackpot_count,next_welcome,next_welcome_jackpot,next_delay,next_delay_jackpot,is_allow_welcome,is_ok_popup) VALUES (?,?,?)',
                  [apidata['Response'][index]['BeaconID'], apidata['Response'][index]['UUID'], apidata['Response'][index]['Major'], apidata['Response'][index]['Minor'], apidata['Response'][index]['DelayTime'], apidata['Response'][index]['CheckInTime'], apidata['Response'][index]['WelcomeMessageSendOrder'], apidata['Response'][index]['DelayTime'], apidata['Response'][index]['CheckInCountType'], apidata['Response'][index]['WelcomeMessageSendOrder'], apidata['Response'][index]['DelayTime'], apidata['Response'][index]['BeaconName'], apidata['Response'][index]['WelcomeMessageSendOrder'], apidata['Response'][index]['DelayTime'], apidata['Response'][index]['DelayTime'], apidata['Response'][index]['IsWelcomeAllow'], apidata['Response'][index]['IsOkPopup'], apidata['Response'][index]['LocationName']],
                  (tx, results) => {
                    console.log('Results beacon ', JSON.stringify(results.rows));
                  },
                  (error) => {
                    console.log("error in insert beacon " + error.executeSql.name);
                  }
                );
                // debugger
              }
            }
          );
        });*/
    }
}