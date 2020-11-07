import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Image, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {
    Container, Body,
    Button,
    InputGroup,
    Form, Item, Input, Label,
    Header, Title, Left, Right
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class PlantPick extends React.Component {
    static propTypes = {
        handlePick: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {handlePick} = this.props;

        return (
            <Grid style={styles.grid}>
                <ScrollView>
                    <Row size={1} style={styles.title}>
                        <View>
                            <Text style={{fontSize: 20}}>Pick A Plant Type</Text>
                        </View>
                    </Row>
                    <Row size={3}>
                        <Col style={StyleSheet.flatten(styles.iconCol)}>
                            <TouchableOpacity onPress={() => {
                                handlePick('Cactus');
                            }}>
                                <Image
                                    source={require('../../images/cactus.png')}
                                    style={styles.pickPlantImage}
                                />
                                <Text style={styles.typeText}>Cactus</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col style={StyleSheet.flatten(styles.iconCol)}>
                            <TouchableOpacity onPress={() => {
                                handlePick('Beans');
                            }}>
                                <Image
                                    source={require('../../images/beans.png')}
                                    style={styles.pickPlantImage}
                                />
                                <Text style={styles.typeText}>Beans</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col style={StyleSheet.flatten(styles.iconCol)}>
                            <TouchableOpacity onPress={() => {
                                handlePick('Orchid');
                            }}>
                                <Image
                                    source={require('../../images/orchid.png')}
                                    style={styles.pickPlantImage}
                                />
                                <Text style={styles.typeText}>Orchid</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <Row size={3}>
                        <Col style={StyleSheet.flatten(styles.iconCol)}>
                            <TouchableOpacity onPress={() => {
                                handlePick('Tomato');
                            }}>
                                <Image
                                    source={require('../../images/tomato.png')}
                                    style={styles.pickPlantImage}
                                />
                                <Text style={styles.typeText}>Tomato</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col style={StyleSheet.flatten(styles.iconCol)}>
                            <TouchableOpacity onPress={() => {
                                handlePick('Basil');
                            }}>
                                <Image
                                    source={require('../../images/basil.png')}
                                    style={styles.pickPlantImage}
                                />
                                <Text style={styles.typeText}>Basil</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col style={StyleSheet.flatten(styles.iconCol)}>
                            <TouchableOpacity onPress={() => {
                                handlePick('Demo');
                            }}>
                                <Image
                                    source={require('../../images/demo.png')}
                                    style={styles.pickPlantImage}
                                />
                                <Text style={styles.typeText}>Demo</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </ScrollView>
            </Grid>
        );
    }
}

var styles = StyleSheet.create({
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    grid: {
        backgroundColor: 'white',
        marginTop: 40
    },
    pickPlantImage: {
        height: 60,
        width: 60,
        backgroundColor: 'transparent'
    },
    iconCol: {
        height: 150,
        alignItems: 'center'
    },
    typeText: {
        marginTop: 5,
        alignSelf: 'center'
    }
});
