import React from 'react';
import styled from 'styled-components';
import { StyleSheet, Text, View , Image} from 'react-native';
import { BarCodeScanner, Camera, Permissions } from 'expo';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import DocumentScanner from 'react-native-document-scanner';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
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
        <View>
          <DocumentScanner
            useBase64
            onPictureTaken={data => this.setState({
              image: data.croppedImage,
              initialImage: data.initialImage,
              rectangleCoordinates: data.rectangleCoordinates,
            })}
            overlayColor="rgba(255,130,0, 0.7)"
            enableTorch={false}
            brightness={0.3}
            saturation={1}
            contrast={1.1}
            quality={0.5}
            onRectangleDetect={({ stableCounter, lastDetectionType }) => this.setState({ stableCounter, lastDetectionType })}
            detectionCountBeforeCapture={5}
            detectionRefreshRateInMS={50}
          />
          <Image source={{ uri: `data:image/jpeg;base64,${this.state.image}`}} resizeMode="contain" />
        </View>
      );

      return (
        <View style={{ flex: 1 }} >
          <Camera
            ref={ref => { this.camera = ref }}
            focusDepth={0}
            onBarCodeRead={this._handleBarCodeRead}
            flashMode={Camera.Constants.FlashMode.torch}
            style={StyleSheet.absoluteFill}
          />
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