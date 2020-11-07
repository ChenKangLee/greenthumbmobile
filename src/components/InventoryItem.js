import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Image, Text, StyleSheet} from 'react-native';
import {
    Button,
    Container
} from 'native-base';
import {popUpCon} from '../states/inventory-actions.js'

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

class InventoryItem extends React.Component {
    static propTypes = {
        id: PropTypes.number,
        plantname: PropTypes.string,
        planttype: PropTypes.string,
        plantstatus: PropTypes.string,
        createdtime: PropTypes.string,
        waterevent: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.handleBtnClick = this.handleBtnClick.bind(this);
    }

    handleBtnClick(){
        this.props.dispatch(popUpCon(true, this.props.id, this.props.plantname, this.props.planttype, this.props.plantstatus, this.props.createdtime, this.props.waterevent));
        this.props.popUp();
    }

    render() {
        const {id, plantname, planttype, createdtime, plantstatus, waterevents} = this.props;
        const imgRequirePath = imgMap[planttype];

        return (
            <Container>
                <Button style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}} onPress={() => this.handleBtnClick()}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                          <Image source={imgRequirePath} style={styles.image}/>
                      </View>
                      <View style={{flex: 3, justifyContent: 'center'}}>
                          <Text style={styles.plantname}>{plantname}</Text>
                      </View>
                  </View>
                </Button>
            </Container>
        );
    }
}

var styles = StyleSheet.create({
    image:{
        height: window.width * 0.14,
        width: window.width * 0.14,
        position: 'absolute',
        right: 10
    },
    plantname: {
        fontSize: 20,
        marginLeft: 10
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

export default connect(state => ({}))(InventoryItem);
