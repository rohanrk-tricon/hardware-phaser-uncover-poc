/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable func-names */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/sort-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  sendFile: any;
}

// const ExternalWebcamString = 'webcam c170';

class StillPicture extends Component<Props, any> {
  canvas: any;

  videoPlayer: any;

  stream: any;

  constructor(props: any) {
    super(props);
    this.state = {
      captureReady: true,
      cameras: [],
    };
  }

  exitApplication = () => {
    console.log('exiting');
    window.electron.ipcRenderer.sendMessage('close_application', [
      'close_application',
    ]);
  };

  /**
   * Processes available devices and identifies one by the label
   * @memberof CameraFeed
   * @instance
   */
  processDevices(devices: any) {
    devices.forEach((device: any) => {
      if (device.kind === 'videoinput') {
        console.log(device);
        this.setDevice(device);
      }
    });
  }

  /**
   * Sets the active device and starts playing the feed
   * @memberof CameraFeed
   * @instance
   */
  async setDevice(device: any) {
    const { deviceId } = device;
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId },
    });
    this.videoPlayer.srcObject = this.stream;
    this.videoPlayer.play();
  }

  /**
   * On mount, grab the users connected devices and process them
   * @memberof CameraFeed
   * @instance
   * @override
   */
  async componentDidMount() {
    // const cameras = await navigator.mediaDevices.enumerateDevices();
    // this.processDevices(cameras);
  }

  getMediaDevices = () => {
    const cameras: any = [];
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach(function (device) {
          // console.log(device)
          if (device.kind === 'videoinput') {
            cameras.push(device);
          }
        });
        this.setState(
          {
            cameras: Array.from(
              new Set(cameras.map((a: any) => a.groupId))
            ).map((id) => {
              return cameras.find((a: any) => a.groupId === id);
            }),
          },
          () => {
            console.log(this.state.cameras);
          }
        );
      })
      .catch(function (err) {
        console.log(`${err.name}: ${err.message}`);
      });
  };

  /**
   * Handles taking a still image from the video feed on the camera
   * @memberof CameraFeed
   * @instance
   */
  takePhoto = () => {
    const { sendFile } = this.props;
    const context = this.canvas.getContext('2d');
    context.drawImage(this.videoPlayer, 0, 0, 250, 180);
    this.canvas.toBlob(sendFile);
  };

  enableCamera = (): void => {
    this.setState({
      captureReady: true,
    });
  };

  disableCamera = (): void => {
    this.setState({
      captureReady: false,
    });
  };

  stopCamera = () => {
    if (this.stream) {
      this.stream.getTracks().forEach((track: any) => {
        track.stop();
      });
    }
  };

  render() {
    return (
      <div style={{}} className="App">
        <Link
          to="/"
          className="btn btn-primary homeButton"
          onClick={this.stopCamera}
        >
          {`< `}HOME
        </Link>
        <h3 className="pageHeader" style={{ color: '#e60000' }}>
          Click Pictures
        </h3>
        <div>
          {/* <button onClick={this.enableCamera}>Enable Still Picture</button>
                    <button onClick={this.disableCamera}>Disable Still Picture</button> */}
          <button
            onClick={this.getMediaDevices}
            style={{
              fontWeight: '500',
              fontFamily: 'cursive',
              fontSize: '20px',
              backgroundColor: '#009900',
              color: 'white',
              height: '38px',
              outline: 'none',
              border: 'none',
              borderRadius: '10px',
              padding: '0px 20px',
              cursor: 'pointer',
            }}
          >
            Get Media Devices
          </button>
        </div>
        <div>
          {this.state.cameras.map((camera: any) => (
            <button
              key={camera.label}
              onClick={() => this.setDevice(camera)}
              style={{
                fontWeight: '500',
                fontFamily: 'cursive',
                fontSize: '20px',
                backgroundColor: '#009900',
                color: 'white',
                height: '38px',
                outline: 'none',
                border: 'none',
                borderRadius: '10px',
                padding: '0px 20px',
                cursor: 'pointer',
                marginTop: '20px',
                marginLeft: '10px',
              }}
            >
              {camera.label}
            </button>
          ))}
        </div>
        {this.state.captureReady ? (
          <div>
            <div style={{ marginTop: '30px' }}>
              <video
                ref={(ref) => (this.videoPlayer = ref)}
                width="250"
                height="180"
                style={{
                  border: '5px solid #009900',
                  borderRadius: '20px',
                }}
              />
            </div>
            {this.state.cameras.length > 0 ? (
              <button
                onClick={this.takePhoto}
                style={{
                  fontWeight: '500',
                  fontFamily: 'cursive',
                  fontSize: '20px',
                  backgroundColor: '#009900',
                  color: 'white',
                  height: '38px',
                  outline: 'none',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0px 20px',
                  cursor: 'pointer',
                  marginTop: '20px',
                }}
              >
                Take photo!
              </button>
            ) : (
              <></>
            )}
            <div style={{ marginTop: '30px' }}>
              <canvas
                ref={(ref) => (this.canvas = ref)}
                width="250"
                height="180"
                style={{
                  border: '5px solid #0066ff',
                  borderRadius: '20px',
                }}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div>
          <button
            type="button"
            onClick={this.exitApplication}
            style={{
              fontWeight: 'bold',
              fontFamily: 'cursive',
              fontSize: '20px',
              backgroundColor: 'white',
              color: '#e60000',
              height: '48px',
              outline: 'none',
              border: '1px solid #e60000',
              borderRadius: '24px',
              padding: '10px 20px',
              cursor: 'pointer',
              marginRight: '15px',
              textDecoration: 'none',
              position: 'fixed',
              bottom: '8%',
              right: '4%',
            }}
          >
            EXIT APPLICATION
          </button>
        </div>
      </div>
    );
  }
}

export default StillPicture;
