import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Image, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Keyboard, ScrollView, KeyboardAvoidingView} from 'react-native';
import {
    Container, Body,
    Button,
    InputGroup,
    Form, Item, Input, Label,
    Header, Title, Left, Right
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import Spinner from 'react-native-spinkit';
// import components
import PlantPick from './PlantPick.js';

// import actions

import {
    createPlant as createPlantAction
} from '../states/inventory-actions.js';

class PlantFormScreen extends React.Component {
    static propTypes = {
        userInfo: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            nameValue: '',
            typeValue: '',
            areaValue: '',
            volumeValue: '',
            loading: false
        };

        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePickPlant = this.handlePickPlant.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    render() {
        const {userInfo, dispatch} = this.props;
        let imgRequirePath = imgMap[this.state.typeValue];

        if(this.state.loading) {
            return (
                <View style={styles.loadingContainer}>
                    <View style={{marginTop: 200}}>
                        <View style={{alignSelf: 'center'}}>
                            <Spinner
                                type='WanderingCubes'
                                color='#ffffff'
                                size={100}
                            />
                        </View>
                        <Text style={styles.loadingText}>Working On It...</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <Container>
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                        }}
                        activeOpacity={1}
                        style={{flex: 1}}
                    >
                        <View style={styles.bar}>
                            <Left><Button transparent
                                onPress={this.handleGoBack}>
                                <Icon name='angle-left'  style={{fontSize: 24}} />
                            </Button></Left>
                            <Right><Button transparent onPress={this.handleSubmit}>
                                <Icon name='paper-plane'  style={{fontSize: 24}} />
                            </Button></Right>
                        </View>
                        <KeyboardAvoidingView
                            style={StyleSheet.flatten(styles.container)}
                            behavior="padding"
                        >
                            <TouchableOpacity
                                activeOpacity={0.2}
                                style={{alignSelf: 'center'}}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    this.popupDialog.show();
                                }}
                            >
                                <Image
                                    source={imgRequirePath}
                                    style={styles.pickPlantImage}
                                />
                            </TouchableOpacity>
                            <View style={{marginTop: 30}}>
                                <Item floatingLabel style={{marginLeft: 0}}>
                                    <Label style={StyleSheet.flatten(styles.label)}>Plant Name</Label>
                                    <Input autoFocus
                                        value={this.state.nameValue}
                                        onChange={this.handleNameChange}
                                        style={StyleSheet.flatten(styles.inputField)}
                                    />
                                </Item>
                                <Item floatingLabel style={{marginLeft: 0}}>
                                    <Label style={StyleSheet.flatten(styles.label)}>Pot Area</Label>
                                    <Input autoFocus
                                        value={this.state.areaValue}
                                        onChange={this.handleAreaChange}
                                        style={StyleSheet.flatten(styles.inputField)}
                                    />
                                </Item>
                                <Item floatingLabel style={{marginLeft: 0}}>
                                    <Label style={StyleSheet.flatten(styles.label)}>Pot Volume</Label>
                                    <Input autoFocus
                                        value={this.state.volumeValue}
                                        onChange={this.handleVolumeChange}
                                        style={StyleSheet.flatten(styles.inputField)}
                                    />
                                </Item>
                            </View>
                        </KeyboardAvoidingView>
                        <PopupDialog
                            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                            dialogAnimation = { new SlideAnimation({ slideFrom: 'bottom' }) }
                            width={350}
                            height={400}
                            overlayOpacity={0.8}
                        >
                            <PlantPick handlePick={this.handlePickPlant}/>
                        </PopupDialog>
                    </TouchableOpacity>
                </Container>
            );
        }
    }

    handleGoBack() {
        this.props.navigation.goBack();
    }

    handleSubmit() {
        const {nameValue, typeValue, areaValue, volumeValue} = this.state;
        const {userInfo, dispatch} = this.props;

        this.setState({
            loading: true
        });

        dispatch(createPlantAction(nameValue, typeValue, areaValue, volumeValue, userInfo.googleId)).then(() => {
            this.props.navigation.goBack();

            this.setState({
                loading: false
            })
        });
    }

    handlePickPlant(typeString) {
        this.setState({
            typeValue: typeString
        });

        this.popupDialog.dismiss();
    }

    handleNameChange(e) {
        const inputValue = e.nativeEvent.text;
        this.setState({
            nameValue: inputValue
        });
    }

    handleAreaChange(e) {
        const inputValue = e.nativeEvent.text;
        this.setState({
            areaValue: inputValue
        });
    }

    handleVolumeChange(e) {
        const inputValue = e.nativeEvent.text;
        this.setState({
            volumeValue: inputValue
        });
    }
}

var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 50,
        flex: 1
    },
    bar: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1
    },
    grid: {
        backgroundColor: 'white'
    },
    pickPlantImage: {
        height: 175,
        width: 175,
        backgroundColor: 'transparent',
    },
    inputField: {
        fontFamily: 'sans-serif',
        height: 70
    },
    label: {
        fontFamily: 'sans-serif-light',
        color: '#999694'
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#c7ad5d',
        alignItems: 'center'
    },
    loadingText: {
        fontSize: 24,
        color: '#ffffff',
        marginTop: 40
    }
});

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

export default connect(state => ({
    ...state.profile
}))(PlantFormScreen);
