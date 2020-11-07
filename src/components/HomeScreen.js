import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, TouchableWithoutFeedback, Image, Text, StyleSheet, Animated, ScrollView} from 'react-native';
import {
    Container,
    Button,
    Icon,
    InputGroup,
    Content,
    Card,
    CardItem,
    Body
} from 'native-base';
import * as Progress from 'react-native-progress';
import moment from 'moment';

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');
// custom components & styles
import {
    getLists as getListsAction
} from '../states/inventory-actions.js';

class HomeScreen extends React.Component {
    static propTypes = {
        plantList: PropTypes.array,
        userInfo: PropTypes.object
    };

    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='home'
                style={{color: tintColor}}
            />
        )
        //
    };

    constructor(props) {
        super(props);

        this.state = {
            fadeAnim: new Animated.Value(0),
            d: new moment()
        };

        this.circleProgress = this.circleProgress.bind(this);
        this.waterNotice = this.waterNotice.bind(this);
    }

    componentDidMount() {
        const {userInfo, dispatch} = this.props;

        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 3000,              // Make it take a while
            }
        ).start();                        // Starts the animation

        dispatch(getListsAction(userInfo.googleId));
        setInterval(() => {
            this.setState(previousState => {
                return { d: previousState.d + 1000 };
            });
        }, 1000);
    }

    waterNotice() {
        var PushNotification = require('react-native-push-notification');
        PushNotification.localNotificationSchedule({
            bigText: "Water Time!!",
            userInteraction: false,
            message: "Your Plants Need Your Attention", // (required)
            date: new Date(Date.now())
        });
    }

    render() {
        const {plantList, userInfo, dispatch} = this.props;
        const {d} = this.state;
        var firstWaterEvent
        var firstWateringPlant;

        if(plantList) {
            if(plantList.length > 0) {
                for(let i=0; i<plantList.length-1 ; i++) {
                    for(let j=plantList.length-1 ; j>0 ; j--) {
                        if(plantList[j].waterevent < plantList[j-1].waterevent) {
                            let t = plantList[j-1];
                            plantList[j-1] = plantList[j];
                            plantList[j] = t;
                        }
                    }
                }

                for(let i=0 ; i<plantList.length ; i++) {
                    if(plantList[i].waterevent*1000 > d) {
                        firstWaterEvent = plantList[i];
                        break;
                    } else {
                        firstWaterEvent = null;
                    }
                }
                if(firstWaterEvent) {
                    if(((firstWaterEvent.waterevent*1000 - d)/86400000) > 0 && ((firstWaterEvent.waterevent*1000 - d)/86400000) < 1) {
                        firstWateringPlant = (
                            moment((firstWaterEvent.waterevent * 1000 - d)).utc().format('HH:mm:ss')
                        )
                        if((firstWaterEvent.waterevent*1000 - d) > 0 && (firstWaterEvent.waterevent*1000 - d) < 1000) {
                            this.waterNotice();
                        }
                    } else {
                        firstWateringPlant = ('24:00+')
                    }
                } else {
                    firstWateringPlant = ('Your Plants Need Your Attention')
                }
            } else {
                firstWateringPlant = (
                    'Go\nAdd Some Plants'
                )
            }

            var threeDaysList = plantList.map(function(p) {
                if(p.waterevent*1000 > d) {
                    if(((p.waterevent*1000 - d)/86400000) >= 1 && ((p.waterevent*1000 - d)/86400000) < 3) {
                        return(
                            <View key={p.id} >
                                <Text style={styles.content}>{p.plantname}:
                                    {moment(p.waterevent*1000).format(' M')}/
                                    {moment(p.waterevent*1000).format('D ')}
                                    {moment(p.waterevent*1000).format('H')}:
                                    {moment(p.waterevent*1000).format('mm')}
                                </Text>
                            </View>
                        );
                    }
                }
            });

            var todayList = plantList.map(function(p) {
                if(p.waterevent*1000 > d) {
                    if(((p.waterevent*1000 - d)/86400000) > 0 && ((p.waterevent*1000 - d)/86400000) < 1) {
                        return(
                            <View key={p.id}>
                                <Text>{p.plantname}:
                                    {moment(p.waterevent*1000).format(' M')}/
                                    {moment(p.waterevent*1000).format('D ')}
                                    {moment(p.waterevent*1000).format('H')}:
                                    {moment(p.waterevent*1000).format('mm')}
                                </Text>
                            </View>
                        );
                    }
                }
            });

            var beforeList = plantList.map(function(p) {
                if(p.waterevent*1000 < d ) {
                    return(
                        <View key={p.id} >
                            <Text style={styles.content}>{p.plantname}</Text>
                        </View>
                    );
                }
            });
        } else {
            firstWateringPlant = 'HI\nAdd Some Plant';
        }

        return (
            <Image
                source={require('../../images/bg-inapp1.png')}
                style={{height: window.height, width: window.width}}
            >
                <Container>
                    <View style={{flex: 1}}>
                        {firstWaterEvent ? <Text style={styles.currentTime}>Next Up</Text> : <Text> </Text>}
                        <Animated.View style={{flex: 1, justifyContent: 'center', alignItems: 'center', opacity: this.state.fadeAnim}}>
                            <Progress.Circle
                                borderWidth={5}
                                thickness={12}
                                showsText={true}
                                color={'white'}
                                direction={'counter-clockwise'}
                                progress={this.circleProgress(firstWaterEvent)}
                                textStyle={{fontSize: 38, textAlign: 'center', fontWeight: '900'}}
                                size={240}
                                formatText={function(){
                                    return(
                                        firstWateringPlant
                                    )}}/>
                            <Text style={styles.countDownPlant}>{firstWaterEvent ? firstWaterEvent.plantname : ''}</Text>
                        </Animated.View>
                    </View>
                    <ScrollView style={{flex: 1}}>
                        <Content>
                            <View style={styles.card}>
                                <Card>
                                    <CardItem>
                                      <Body>
                                        <View>
                                            <View >
                                                <Text style={styles.title, {color: '#ad1818'}}>Overdue</Text>
                                            </View>
                                            <View style={{marginLeft: 20}}>
                                                {beforeList}
                                            </View>
                                        </View>
                                      </Body>
                                    </CardItem>
                                </Card>
                            </View>
                        </Content>
                        <Content>
                            <View style={styles.card}>
                                <Card >
                                    <CardItem>
                                      <Body >
                                        <View>
                                            <View>
                                                <Text style={styles.title}>In 24 Hours</Text>
                                            </View>
                                            <View style={{marginLeft: 20}}>
                                                {todayList}
                                            </View>
                                        </View>
                                      </Body>
                                    </CardItem>
                                </Card>
                            </View>
                        </Content>
                        <Content>
                            <View style={styles.card}>
                                <Card>
                                    <CardItem>
                                      <Body>
                                        <View>
                                            <View>
                                                <Text style={styles.title}>In 3 Days</Text>
                                            </View>
                                            <View style={{marginLeft: 20}}>
                                                {threeDaysList}
                                            </View>
                                        </View>
                                    </Body>
                                  </CardItem>
                              </Card>
                          </View>
                      </Content>
                    </ScrollView>
                </Container>
            </Image>
        );
    }

    circleProgress(firstWaterEvent) {
        const {d} = this.state;

        if(firstWaterEvent) {
            if(((firstWaterEvent.waterevent*1000 - d)/86400000) > 0 && ((firstWaterEvent.waterevent*1000 - d)/86400000) < 1) {
                return ((firstWaterEvent.waterevent*1000 - d)/86400000);
            } else {
                return 1;
            }
        } else {
            return 0;
        }
        return 0;
    }

}

export default connect(state => ({
    ...state.inventory,
    ...state.profile
}))(HomeScreen)

var styles = StyleSheet.create({
    image:{
        height: window.width * 0.5,
        width: window.width * 0.5
    },
    card:{
        paddingHorizontal: 40
    },
    title:{
        color: '#232323',
        fontSize: 13
    },
    currentTime: {
        top: window.height * 0.01,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',

        color: 'white'
    },
    countDownPlant: {
        position: 'absolute',
        top: window.height * 0.25,
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white'
    }
});
