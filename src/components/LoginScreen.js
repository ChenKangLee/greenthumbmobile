import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Container, Card, CardItem} from 'native-base';
import {Col, Row, Grid} from "react-native-easy-grid";
import {
    GoogleSignin,
    GoogleSigninButton
} from 'react-native-google-signin';

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

// custom components & styles

// import actions
import {
    registLogin as registLoginAction,
    setInfo as setInfoAction
} from '../states/profile-actions.js';
import {
    getLists as getListsAction
} from '../states/inventory-actions.js';

class LoginScreen extends React.Component {
    static propTypes = {
        userInfo: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.onLoginPress = this.onLoginPress.bind(this);
    }

    render() {
        return (
            <Image source={require('../../images/bg.png')} style={{height: window.height, width: window.width}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <Container style={{alignItems: 'center', backgroundColor: 'transparent'}}>
                        <Image source={require('../../images/mjLogo.png')} style={styles.logoIcon}></Image>
                        <Text style={styles.textLogo}>GreenThumb</Text>

                        <View style={styles.loginItem}>
                            <GoogleSigninButton
                                style={{width: 150, height: 48}}
                                size={GoogleSigninButton.Size.Standard}
                                color={GoogleSigninButton.Color.Light}
                                onPress={this.onLoginPress} />
                        </View>
                    </Container>
                </View>
            </Image>
        );
    }

    componentDidMount() {
        GoogleSignin.configure({
            iosClientId: "588853791489-gpqtreb991bme0q5fpqnk30a4e6gk4s6.apps.googleusercontent.com"
        }).then(() => {
            console.log('configure complete');
        })
    }

    onLoginPress() {
        const {dispatch, userInfo} = this.props;

        GoogleSignin.signIn().then((user) => {
            console.log(user.id);
            console.log(user.name);

            dispatch(setInfoAction(user.id, user.name));
            dispatch(registLoginAction(user.id, user.name));

            this.props.navigation.navigate('WateringHelper');
        }).catch((err) => {
            console.log('WRONG SIGNIN', err);
        });
    }
}

const styles = StyleSheet.create({
    logoIcon: {
        height: window.width * 0.5,
        width: window.width * 0.5,
        marginTop: 150
    },
    cardRow: {
        alignItems: 'center'
    },
    textLogo: {
        fontSize: 52,
        fontFamily: 'Roboto',
        color: 'white'
    },
    text2: {
      marginTop: 15,
      fontSize: 25,
    },
    loginItem: {
        marginTop: 20
    }

});

export default connect(state => ({
    ...state.profile
}))(LoginScreen);
