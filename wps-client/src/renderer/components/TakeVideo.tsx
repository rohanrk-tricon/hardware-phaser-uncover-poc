/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable promise/always-return */
/* eslint-disable react/sort-comp */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { ReactMediaRecorder, useReactMediaRecorder } from 'react-media-recorder';
import { Link } from 'react-router-dom';

interface State {
  selectedVideoId: number;
  mediaDevices: any[];
  selectedDeviceId: string;
}

export class TakeVideo extends Component<any, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      selectedVideoId: -1,
      mediaDevices: [],
      selectedDeviceId: '',
    };
    this.getMediaDevices = this.getMediaDevices.bind(this);
  }


  // getMediaDevices = (): any => {
  //     let cameras: any[] = [];
  //     navigator.mediaDevices.enumerateDevices()
  //     .then((devices) => {
  //         devices.forEach(function(device) {
  //             console.log(device)
  //             if (device.kind === 'videoinput') {
  //                 cameras.push(device);
  //             }
  //         });
  //         this.setState({
  //             mediaDevices: cameras
  //         }, () => {
  //             console.log(this.state.mediaDevices);
  //         });
  //     }).catch(function(err) {
  //         console.log(err.name + ": " + err.message);
  //     });
  // }

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
            mediaDevices: Array.from(
              new Set(cameras.map((a: any) => a.groupId))
            ).map((id) => {
              return cameras.find((a: any) => a.groupId === id);
            }),
          },
          () => {
            console.log(this.state.mediaDevices);
          }
        );
      })
      .catch(function (err) {
        console.log(`${err.name}: ${err.message}`);
      });
  };

  recordVideo = (deviceId: number): any => {
    this.setState(
      {
        selectedVideoId: deviceId,
      },
      () => {
        console.log(this.state.mediaDevices[this.state.selectedVideoId]);
      }
    );
  };

  componentDidMount() {}

  setDevice = (mic: any): any => {
    console.log(mic.deviceId);
    this.setState(
      {
        selectedDeviceId: mic.deviceId,
      },
      () => {
        // this.startMicWithBar();
      }
    );
  };

  render() {
    return (
      <div style={{}} className="App">
        <Link to="/" className="btn btn-primary homeButton">
          {`< `}HOME
        </Link>
        <h3 className="pageHeader" style={{ color: '#ffcc00' }}>
          Record Videos
        </h3>
        <div>
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
          <div>
            {/* {
                            this.state.mediaDevices.length > 0 ?
                            this.state.mediaDevices.map((device: any) =>
                                <div key={device.deviceId}>{device.label}</div>
                            ) : (<></>)
                        } */}
          </div>
        </div>
        <div>
          {this.state.mediaDevices.map((camera: any) => (
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
        <div>
          {this.state.selectedDeviceId === '' ? (
            <></>
          ) : (
            <ReactMediaRecorder
              video={{
                deviceId: this.state.selectedDeviceId,
              }}
              audio={{
                autoGainControl: true,
                echoCancellation: true,
                noiseSuppression: true,
              }}
              askPermissionOnMount
              blobPropertyBag={{
                type: 'video/mp4',
              }}
              render={({
                status,
                startRecording,
                stopRecording,
                mediaBlobUrl,
              }) => (
                <div>
                  <p
                    style={{
                      color: '#990099',
                      fontFamily: 'cursive',
                      textTransform: 'capitalize',
                    }}
                  >
                    Status: {status}
                  </p>
                  <button
                    onClick={startRecording}
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
                      marginRight: '10px',
                    }}
                  >
                    Start Recording
                  </button>
                  <button
                    onClick={stopRecording}
                    style={{
                      fontWeight: '500',
                      fontFamily: 'cursive',
                      fontSize: '20px',
                      backgroundColor: '#e60000',
                      color: 'white',
                      height: '38px',
                      outline: 'none',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0px 20px',
                      cursor: 'pointer',
                      marginRight: '10px',
                      marginTop: '20px',
                    }}
                  >
                    Stop Recording
                  </button>
                  {mediaBlobUrl ? (
                    <video
                      src={mediaBlobUrl}
                      controls
                      autoPlay
                      loop
                      width="250"
                      height="180"
                      style={{
                        border: '5px solid #0066ff',
                        borderRadius: '20px',
                        position: 'absolute',
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              )}
            />
          )}
        </div>
        {/* <div>
                    <button onClick={() => this.recordVideo(0)}>External Cam</button>
                    <button onClick={() => this.recordVideo(1)}>Integrated Cam</button>
                </div> */}
        {/* <div>
                    {this.state.selectedVideoId === 0 ?
                        (
                            <ReactMediaRecorder
                                video = {{
                                    deviceId: this.state.mediaDevices[0].deviceId
                                }}
                                audio = {{
                                    autoGainControl: true,
                                    echoCancellation: true,
                                    noiseSuppression: true,
                                }}
                                askPermissionOnMount = {
                                    true
                                }
                                blobPropertyBag = {{
                                    type: 'video/mp4'
                                }}
                                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                                    <div>
                                    <p>{status}</p>
                                        <button onClick={startRecording}>Start Recording</button>
                                        <button onClick={stopRecording}>Stop Recording</button>
                                        <video src={mediaBlobUrl} controls autoPlay loop />
                                    </div>
                                )}
                            />
                        ) : this.state.selectedVideoId === 1 ? (
                            <ReactMediaRecorder
                                video = {{
                                    deviceId: this.state.mediaDevices[1].deviceId
                                }}
                                askPermissionOnMount = {
                                    true
                                }
                                blobPropertyBag = {{
                                    type: 'video/mp4'
                                }}
                                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                                    <div>
                                    <p>{status}</p>
                                        <button onClick={startRecording}>Start Recording</button>
                                        <button onClick={stopRecording}>Stop Recording</button>
                                        <video src={mediaBlobUrl} controls autoPlay loop />
                                    </div>
                                )}
                            />
                        ) : (<></>)
                    }
                </div> */}
      </div>
    );
  }
}

export default TakeVideo;
