import React, {
  Component,
  PropTypes,
} from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';

import Video from 'react-native-video';

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  source: PropTypes.shape({
    uri: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8d8d8',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  closeButton: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    width: 40,
    textAlign: 'center',
  },
  controls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    bottom: 44,
    left: 4,
    right: 4,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2c2c2c',
  },
});

class NativeVideo extends Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onError = this.onError.bind(this);
    this.getCurrentTimePercentage = this.getCurrentTimePercentage.bind(this);
    this.onPressCloseBUtton = this.onPressCloseBUtton.bind(this);
    this.onPressVideo = this.onPressVideo.bind(this);
  }

  state = {
    rate: 1,
    volume: 1,
    muted: false,
    resizeMode: 'contain',
    fullScreen: false,
    duration: 0.0,
    currentTime: 0.0,
    paused: true,
  };

  onLoad(data) {
    this.setState({ duration: data.duration });
    this.setState({ paused: !this.state.paused });
  }

  onProgress(data) {
    this.setState({ currentTime: data.currentTime });
  }

  onError(error) {
    console.warn(`Video cannot be loaded ${error}`);
  }

  onPressCloseBUtton() {
    this.setState({
      paused: true,
      fullScreen: !this.state.fullScreen,
    });
  }

  onPressVideo() {
    this.setState({
      paused: !this.state.paused,
      fullScreen: true,
    });
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    }

    return 0;
  }


  render() {
    const { width, height } = this.props;

    const playableVideo = (
      <TouchableOpacity style={styles.fullScreen} onPress={this.onPressVideo}>
        <Video
          source={this.props.source}
          style={this.state.fullScreen ? styles.fullScreen : { width, height }}
          rate={this.state.rate}
          paused={this.state.paused}
          volume={this.state.volume}
          muted={this.state.muted}
          resizeMode={this.state.resizeMode}
          onLoad={this.onLoad}
          onError={this.onError}
          onProgress={this.onProgress}
          repeat
        />
      </TouchableOpacity>
    );

    if (this.state.fullScreen) {
      const flexCompleted = this.getCurrentTimePercentage() * 100;
      const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

      const closeButton = (
        <View style={styles.header}>
          <TouchableOpacity style={styles.fullScreen} onPress={this.onPressCloseBUtton}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
      );

      const controls = (
        <View style={styles.controls}>
          <View style={styles.trackingControls}>
            <View style={styles.progress}>
              <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
              <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
            </View>
          </View>
        </View>
       );

      return (
        <Modal>
          <View style={styles.container}>
            {playableVideo}
            {controls}
            {closeButton}
          </View>
        </Modal>
      );
    }

    return (
      <View >
        <View style={styles.container}>
          {playableVideo}
        </View>
      </View>
    );
  }
}

NativeVideo.propTypes = propTypes;

export { NativeVideo };
