import React, {Component} from 'react';
import {View, Text, Image, FlatList} from 'react-native';

export class WayToEarnScreen extends Component {
  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
      desc: -1,
    };
  }
  data = [
    {
      isVisibleOnPage: true,
      icon: '',
      title: 'Multiple Ways to Earn Points',
      description:
        'See how you can earn Entries & Bonus Entries quickly. --redeem Entries for inhouse gifts & rewards.Woohoo!',
      subtitle: "In the last year you've earned",
      point: '50',
    },
    {
      isVisibleOnPage: true,
      icon: 'https://alpha.roborewards.net/images/cashback.png',
      title: 'Earn unlimited point on all purchases',
      description:
        'Earn 1 Entries on all purchases - there is no limit to the amount you can earn!',
      subtitle: "In the last year you've earned",
      point: '40',
    },
    {
      isVisibleOnPage: true,
      icon: 'https://alpha.roborewards.net/images/socialshare.png',
      title: 'Earn points for each social share',
      description:
        'Earn Entries for each social share (excludes Pinterest). Each social share contains your referral link. If your friend joins the program through your link, you earn even more bonus Entries. Entries apply to cashback, gift cards, products, and The Leaderboard Competitions.',
      subtitle: 'Your social share bonus points',
      point: '10',
    },
    {
      isVisibleOnPage: true,
      icon: 'https://alpha.roborewards.net/images/cashback.png',
      title: 'Earn points for each verified referral',
      description:
        'Earn Entries for each verified referral. A verified referral occurs when a new member joins the program through your personal referral link on the Share Now or Refer Now pages. Entries apply to cashback, gift cards, products, and The Leaderboard Competitions.',
      subtitle: 'Your verified referral bonus points',
      point: '35',
    },
    {
      isVisibleOnPage: true,
      icon: 'https://alpha.roborewards.net/images/survey-icon.png',
      title: 'Earn points for each survey',
      description:
        'We appreciate your precious feedback & take it seriously. Earn Bonus Entry(s) for each completed survey.Entries are added to your Entry total for extra gifts & prizes!',
      subtitle: 'Your Surveys bonus points',
      point: '26',
    },
    {
      isVisibleOnPage: true,
      icon: 'https://alpha.roborewards.net/images/cashback.png',
      title: 'Earn points for completing your profile',
      description:
        'Simple & Easy. Complete your profile & earn 25 bonus Entries to get you started on the right path. Once completed, earn bonus Entries will be immediately added to your account. Profile completions do not add Entries to The Leaderboard Competitions.',
      subtitle: 'Your complete profile point',
      point: '11',
    },
  ];

  _showImageIcon = icon => {
    if (icon != '') {
      console.log('show Image : ' + icon);
      return (
        <Image
          style={styles.titleIcon}
          source={{
            uri: icon,
          }}
          resizeMode="cover"
        />
      );
    } else {
      console.log('not show Image : ' + icon);
    }
  };

  _showDescription = (index, text) => {
    if (this.state.desc == index) {
      return <Text style={styles.description}>{text}</Text>;
    }
  };

  _showExtraText = index => {
    if (this.state.desc != index) {
      return 'Read more...';
    } else {
      return '';
    }
  };

  _showRecentActivity = (index, item) => {
    if (index > 0) {
      return <Text style={styles.btnRecentActivity}>Recent Activity</Text>;
    }
  };

  _renderItem = (item, index) => {
    if (item.isVisibleOnPage) {
      return (
        <View
          style={{
            padding: 15,
            backgroundColor: index % 2 ? 'white' : 'rgba(153,153,153,0.2)',
          }}>
          <View style={styles.titleContainer}>
            {this._showImageIcon(item.icon)}
            <Text style={styles.titleBase}>
              <Text style={styles.title}>{item.title}</Text>
              <Text
                onPress={() => {
                  this.setState({
                    desc: index,
                  });
                }}
                style={{color: 'blue'}}>
                {' '}
                {this._showExtraText(index)}
              </Text>
            </Text>
          </View>
          {this._showDescription(index, item.description)}
          <Text style={styles.subTitle}>{item.subtitle}</Text>
          <View style={styles.footerContainer}>
            {this._showRecentActivity(index)}
            <Text style={styles.pointCount}>{item.point}</Text>
            <Text style={styles.pointTerm}>PTS</Text>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={{hegith: 150}}>
          <Image
            style={{height: 150}}
            source={{
              uri:
                'http://preview.byaviators.com/template/superlist/assets/img/tmp/agent-2.jpg',
            }}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={this.data.length > 3}
          data={this.data}
          renderItem={({item, index}) => this._renderItem(item, index)}
        />
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  imageOverlay: {
    height: 150,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  titleBase: {
    flex: 1,
    marginRight: 15,
  },
  titleIcon: {
    height: 50,
    width: 50,
    marginRight: 15,
  },
  title: {
    fontFamily: 'helvetica',
    fontSize: 22,
  },
  description: {
    marginTop: 10,
    textAlign: 'justify',
    fontSize: 16,
    fontFamily: 'helvetica',
  },
  subTitle: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'helvetica',
    fontSize: 15,
    paddingTop: 15,
  },
  btnRecentActivity: {
    padding: 5,
    backgroundColor: '#4b92d2',
    fontWeight: 'bold',
    color: 'white',
  },
  pointCount: {
    textAlign: 'right',
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    alignSelf: 'flex-end',
  },
  pointTerm: {
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingLeft: 5,
    fontSize: 15,
    color: 'green',
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
};
