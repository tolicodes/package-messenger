import React from 'react';
import styled from 'styled-components';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, Permissions, ImagePicker } from 'expo';
import autoBind from 'react-autobind';
import Button from 'react-native-button'

import vision from "react-cloud-vision-api";

import { GOOGLE_API_KEY } from './.env.json';

vision.init({ auth: GOOGLE_API_KEY });

export default class CameraApp extends React.Component {
  state = {
    hasCameraPermission: null,
  }

  constructor() {
    super();
    autoBind(this); 
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  async recognizeText() {
    try {
      const { base64 } = await this.camera.takePictureAsync({ base64: true });

      const { responses } = await vision.annotate(new vision.Request({
        image: new vision.Image({
          base64,
        }),
        features: [
          new vision.Feature('TEXT_DETECTION'), 
        ]
      })) 

      if(!responses) return;

      console.log(responses[0].textAnnotations.map(annotation => annotation.description));
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const { hasCameraPermission, packageScanned, packageCode } = this.state;

    if (packageScanned) {
      return (
        <View style={{ flex: 1 }}>
         <Text>Scanned {packageCode}</Text>
        </View>);
    }

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return ( 
        <View style={{ flex: 1 }} >
          <Camera
            ref={ref => { this.camera = ref }}
            autoFocus={Camera.Constants.AutoFocus.off}
            focusDepth={.7}
            onBarCodeRead={this._handleBarCodeRead}
            flashMode={Camera.Constants.FlashMode.torch}
            style={StyleSheet.absoluteFill}
          />
          <Button
            containerStyle={{ position: 'absolute', bottom: 0, padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'orange'}}
            disabledContainerStyle={{backgroundColor: 'grey'}}
            style={{fontSize: 20, color: 'white'}}
            onPress={this.recognizeText}
            color="#841584"
          >
            Take Photo of Label
          </Button>
        </View>
      );
    }
  }

  _handleBarCodeRead = ({ data }) => { 
    this.setState({
      packageScanned: true,
      packageCode: data
    });
  }
}