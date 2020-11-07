import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Image, Text, StatusBar, StyleSheet, ScrollView, ListView, RefreshControl, Animated} from 'react-native';
import {
    Container,
    Button,
    Fab
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import SwipeitemView from 'react-native-swipe-left';
import { Col, Row, Grid } from "react-native-easy-grid";
import moment from 'moment'

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

import InventoryItem from './InventoryItem.js'
import {
    getLists as getListsAction,
    deletePlant as deletePlantAction,
    popUpCon
} from '../states/inventory-actions.js';
import {
    completeWaterEvent as completeWaterEventApi
} from '../api/waterEventApi.js';

class InventoryScreen extends React.Component {
    static propTypes = {
        plantList: PropTypes.array,
        userInfo: PropTypes.object,
        popPlantId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        popPlantname: PropTypes.string,
        popPlanttype: PropTypes.string,
        popPlantstatus: PropTypes.string,
        popCreatedTime:  PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        popWaterEvents:  PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        dispatch: PropTypes.func
    };

    //

    static navigationOptions = {
        tabBarIcon: ({tintColor}) => (
            <Icon name='archive' style={{color: tintColor, fontSize: 20}} />
        )
    };

    constructor(props) {
        super(props);

        this._dataRow = {};
        this.openRowId = '';
        this.timer;

        this.rightBtn = [{
            id: 1,
        	text: 'Remove',
        	width: 80,
        	bgColor: 'red',
        	underlayColor: '#ffffff',
            onPress: () => {
                this.props.dispatch(deletePlantAction(this.openRowId, this.props.userInfo.googleId)).then(() => {
                    this.handleRefresh();
                });
            }
        }];

        this.state = {
            fabActive: false,
            scrollEnable: true,
            hasIdOpen: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2)
            }),
            loading: false
        };
        this.springValue = new Animated.Value(1);

        this.handleRefresh = this.handleRefresh.bind(this);
        this.timerStart = this.timerStart.bind(this);
        this.timerCancel = this.timerCancel.bind(this);
        this.handlePopUp = this.handlePopUp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {plantList, dispatch} = this.props;

        if (plantList !== nextProps.plantList) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.plantList)
            });

            this.forceUpdate();
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        const {plantList, plantListIsLoading, popPlantId, popPlantname, popPlanttype, popPlantstatus, popCreatedTime, popWaterEvents} = this.props;

        const imgRequirePath = imgMap[popPlanttype];

        console.log('popWaterEvents: ', popWaterEvents);

        return (
            <Image
                source={require('../../images/bg-inapp2.png')}
                style={{height: window.height, width: window.width, alignItems: 'center'}}
            >
                <View style={{flex :1, width: window.width}}>
                    <StatusBar barStyle='light-content'/>
                    <View style={styles.bar}>
                        <View></View>
                        <Button transparent onPress={() => {this.props.navigation.navigate('PlantForm')}}>
                            <Icon name='plus-circle'
                                style={StyleSheet.flatten(styles.menuIcon)}/>
                        </Button>
                    </View>
                    <ListView
                        refreshControl={
                            <RefreshControl refreshing={this.state.loading} onRefresh={this.handleRefresh} />
                        }
                        renderScrollComponent={props => <ScrollView scrollEnabled={this.state.scrollEnable} {...props} />}
                        dataSource={this.state.dataSource}
                        renderRow={(p) => {
                            return (
                                <SwipeitemView
                                    root={this}
                                    ref={(row)=>this._dataRow[p.id] = row}
                                    id={p.id}
                                    rightBtn={this.rightBtn}
                                >
                                    <View style={{height: 100, marginTop: 2}}>
                                        <InventoryItem {...p} popUp={() =>{this.handlePopUp();}}/>
                                    </View>
                                </SwipeitemView>
                            );
                        }}
                        ref={(el) => this.listEl = el}
                        style={styles.listBlock}
                        >
                    </ListView>
                    <PopupDialog
                        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                        onDismissed={() =>{this.timerCancel();}}
                        width={300}
                        height={360}
                        overlayOpacity={0.5}
                    >
                        <View style={{flex: 2.8, backgroundColor: '#c7ad5d', alignItems: 'center', justifyContent: 'center'}}>
                            <Animated.Image source={imgRequirePath} style={{height: 90, width: 90, transform: [{scale: this.springValue}]}}/>
                        </View>
                        <View style={{flex: 5, justifyContent: 'center'}}>
                            <View style={{flex: 3, marginBottom: 5}}>
                                <Grid style={{marginTop: 20}}>
                                    <Row style={{marginLeft: 20}}>
                                        <Col style={{alignItems: 'flex-end', justifyContent: 'center'}}><Text style={styles.text_title1}>Plant Name: </Text></Col>
                                        <Col style={{alignItems: 'flex-start', justifyContent: 'center'}}><Text style={styles.text_content1}>{popPlantname}</Text></Col>
                                    </Row>
                                    <Row style={{marginLeft: 20}}>
                                        <Col style={{alignItems: 'flex-end', justifyContent: 'center'}}><Text style={styles.text_title1}>Plant Type: </Text></Col>
                                        <Col style={{alignItems: 'flex-start', justifyContent: 'center'}}><Text style={styles.text_content1}>{popPlanttype}</Text></Col>
                                    </Row>
                                    <Row style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={styles.status}>{popPlantstatus}</Text>
                                    </Row>
                                </Grid>
                            </View>
                            <View style={{flex: 2, alignItems: 'center'}}>
                                <Text style={styles.text_title2}>It's grown since <Text style={styles.text_content2}>{moment(popCreatedTime*1000).format('YYYY/MM/DD')}</Text></Text>
                                <Text style={styles.text_title2}>And it need to be watered at</Text>
                                <Text style={styles.text_content2}>{moment(popWaterEvents * 1000).format('MMM Do, H : mm')}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, marginBottom: 10}}>
                            <Button rounded
                                style={{flex: 1, backgroundColor: '#617cb5', alignSelf: 'center'}}
                                onPress={() => {
                                    console.log('Watering: ', popPlantId);

                                    completeWaterEventApi(popPlantId, moment().unix()).then((res) => {
                                        this.popupDialog.dismiss();
                                        this.handleRefresh();
                                    });
                                }}
                            >
                                <Text style={styles.waterBtnText}>Water</Text>
                            </Button>
                        </View>
                    </PopupDialog>
                </View>
            </Image>
        );
    }

    handleRefresh() {
        const {userInfo, dispatch, plantList} = this.props;

        this.setState({loading: true});

        dispatch(getListsAction(userInfo.googleId)).then(() => {

            // initializing
            this._dataRow = {};
            this.openRowId = '';

            this.setState({loading: false});
        });
    }

    spring () {
      this.springValue.setValue(0.8)
      Animated.spring(
        this.springValue,
        {
          toValue: 1,
          friction: 1
        }
      ).start()
    }

    timerStart() {
        this.timer = setInterval(this.spring.bind(this), 4000);
    }

    timerCancel() {
        clearInterval(this.timer);
    }

    handlePopUp() {
        this.popupDialog.show();
        this.timerStart();
    }
}

export default connect(state => ({
    ...state.inventory,
    ...state.profile
}))(InventoryScreen);

const imgMap = {
    '': require('../../images/plant-pot.png'),
    'Cactus': require('../../images/cactus.png'),
    'Beans': require('../../images/beans.png'),
    'Orchid': require('../../images/orchid.png'),
    'Tomato': require('../../images/tomato.png'),
    'Jasmine': require('../../images/jasmine.png'),
    'Basil': require('../../images/basil.png'),
    'Demo': require('../../images/demo.png')
};

const styles = StyleSheet.create({
    bar: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent'
    },
    menuIcon: {
        marginLeft: 'auto',
        alignSelf: 'flex-end',
        color: 'white',
        fontSize: 28
    },
    listBlock: {
        top: 70,
        height: 100,
        backgroundColor: 'transparent'
    },
    text_title1:{
        fontSize: 16,
        fontFamily: 'serif',
        marginLeft: 40
    },
    text_title2:{
        fontSize: 15,
        fontFamily: 'sans-serif-condensed'
    },
    text_content1:{
        fontSize: 18,
        fontFamily: 'sans-serif-medium'
    },
    text_content2:{
        fontSize: 15,
        fontFamily: 'sans-serif-medium'
    },
    status:{
        fontSize: 20,
        fontFamily: 'monospace',
        color: '#218e1f'
    },
    waterBtnText:{
        color: '#d5decf',
        fontSize: 15
    }
});
