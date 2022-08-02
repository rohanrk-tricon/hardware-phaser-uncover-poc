/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable promise/always-return */
/* eslint-disable react/sort-comp */
/* eslint-disable prettier/prettier */
import { Component } from 'react';
import './css2.css';
import { Link } from 'react-router-dom';
// import VideoRecorder from 'react-video-recorder';


interface State {
  selectedVideoId: number;
  mediaDevices: any[];
  selectedDeviceId: string;
  reload: boolean;
}

export class TakeVideo2 extends Component<any, State> {

  mediaRecorder: any = undefined;

  mediaStream1: any = undefined;

  showData: boolean = false;

  navigatorObject: any = undefined;

  nameOfDevice: string = '';

  constructor(props: any) {
    super(props);

    this.state = {
      selectedVideoId: -1,
      mediaDevices: [],
      selectedDeviceId: '',
      reload: false,
    };
    this.getMediaDevices = this.getMediaDevices.bind(this);
  }

  getMediaDevices = () => {
    const cameras: any = [];
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach(function (device) {
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

  componentDidMount() {}

  setDevice = (mic: any): any => {
    console.log(mic.deviceId);
    this.nameOfDevice = mic.label;
    this.showData = true;
    this.setState(
      {
        selectedDeviceId: mic.deviceId,
      },
      () => {
      }
    );
  };

  startRecording = (): any => {

    // this.stopRecording();
    console.log(this.navigatorObject)

    // document.getElementById('vid-recorder')?.remove();

    // This array stores the recorded media data
    let chunks: any = [];
    // const webCamContainer =
	  // document.getElementById("web-cam-container");
    const videoMediaConstraints = {
      video: {
        deviceId: this.state.selectedDeviceId
      },
      audio: {
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
      },
    }

    // Access the camera and microphone
    this.navigatorObject = navigator.mediaDevices.getUserMedia(videoMediaConstraints)
      .then((mediaStream) => {


        this.mediaRecorder = null;
      // Create a new MediaRecorder instance
      this.mediaRecorder =
        new MediaRecorder(mediaStream);

        this.mediaStream1 = null;
      // Make the mediaStream global
      this.mediaStream1 = mediaStream;
      // Make the mediaRecorder global
      // window.MediaRecorder = this.mediaRecorder;

      this.mediaRecorder.start();

      // Whenever (here when the recorder
      // stops recording) data is available
      // the MediaRecorder emits a "dataavailable"
      // event with the recorded media data.
      this.mediaRecorder.ondataavailable = (e: any) => {

        // Push the recorded media data to
        // the chunks array
        chunks.push(e.data);
      };

      // When the MediaRecorder stops
      // recording, it emits "stop"
      // event
      this.mediaRecorder.onstop = () => {

        /* A Blob is a File like object.
        In fact, the File interface is
        based on Blob. File inherits the
        Blob interface and expands it to
        support the files on the user's
        systemThe Blob constructor takes
        the chunk of media data as the
        first parameter and constructs
        a Blob of the type given as the
        second parameter */
        const blob = new Blob(
          chunks, {
            type: "video/mp4"
          });
        chunks = [];

        // Create a video or audio element
        // that stores the recorded media
        const recordedMedia = document.createElement("video");
        recordedMedia.controls = true;

        // You can not directly set the blob as
        // the source of the video or audio element
        // Instead, you need to create a URL for blob
        // using URL.createObjectURL() method.
        const recordedMediaURL = URL.createObjectURL(blob);

        // Now you can use the created URL as the
        // source of the video or audio element
        recordedMedia.src = recordedMediaURL;

        // Create a download button that lets the
        // user download the recorded media
        // const downloadButton = document.createElement("a");

        // // Set the download attribute to true so that
        // // when the user clicks the link the recorded
        // // media is automatically gets downloaded.
        // downloadButton.download = "Recorded-Media";

        // downloadButton.href = recordedMediaURL;
        // downloadButton.innerText = "Download it!";

        // downloadButton.onclick = () => {

        //   /* After download revoke the created URL
        //   using URL.revokeObjectURL() method to
        //   avoid possible memory leak. Though,
        //   the browser automatically revokes the
        //   created URL when the document is unloaded,
        //   but still it is good to revoke the created
        //   URLs */
        //   URL.revokeObjectURL(recordedMedia);
        // };

        if (document.getElementById('vid-recorder')) {
          document.getElementById('vid-recorder')
          .append(recordedMedia);
        }
      };

      // if (selectedMedia === "vid") {

        // Remember to use the srcObject
        // attribute since the src attribute
        // doesn't support media stream as a value
        // if (webCamContainer) {
        //   webCamContainer.srcObject = mediaStream;
        // }
      // }
      if (document.getElementById('vid-record-status')) {
        document.getElementById('vid-record-status').innerText = "Recording";
      }
    });

  }

  stopRecording = (): any => {
    // Stop the recording
    console.log(this.mediaRecorder)
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }

    // Stop all the tracks in the
    // received media stream
    if (this.mediaStream1) {
      this.mediaStream1.getTracks()
      .forEach((track: any) => {
        track.stop();
      });
    }
    if (document.getElementById('vid-record-status')) {
      document.getElementById('vid-record-status').innerText = "Recording done!";
    }
  }

  exitApplication = () => {
    console.log('exiting');
    window.electron.ipcRenderer.sendMessage('close_application', ['close_application'])
  }

  rereload = () => {
    window.location.reload();
  }

  refreshPage = () => {
    this.showData = false;
    this.setState(
      {reload: true},
      () => this.setState({reload: false})
    )
  }

  componentWillUnmount() {
    // this.stopRecording();
  }

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
        <div className="recording"
              style={{
                fontWeight: '500',
                fontFamily: 'cursive',
                fontSize: '20px',
                backgroundColor: 'white',
                color: 'rgb(0, 102, 255)',
                marginTop: '25px'
              }}>
                Selected deivce: {this.nameOfDevice}
              </div>
        <div>
          {this.state.selectedDeviceId === '' || !this.showData ? (
            <></>
          ) : (
            <div className="display-none"
              style={{
                width: '100%',
                height: '450px',
                overflowX: 'hidden',
                overflowY: 'scroll',
              }}
            >
              {/* <h3>Record Video </h3> */}
              {/* <video autoPlay id="web-cam-container"
                style={{backgroundColor: 'black'}}>
                Your browser doesnt support
                the video tag
              </video> */}

              <div className="recording" id="vid-record-status"
              style={{
                fontWeight: '500',
                fontFamily: 'cursive',
                fontSize: '20px',
                backgroundColor: 'white',
                color: 'rgb(153, 0, 153)',
                marginTop: '25px'
              }}>
                {/* Click the Start video Recording
                button to start recording */}
              </div>

              {/* <!-- This button will start the video recording --> */}
              <button type="button" id="start-vid-recording"
                onClick={this.startRecording}
                style={{
                  fontWeight: '500',
                  fontFamily: 'cursive',
                  fontSize: '20px',
                  backgroundColor: 'white',
                  color: '#009900',
                  height: '38px',
                  outline: 'none',
                  border: '1px solid #009900',
                  borderRadius: '10px',
                  padding: '0px 20px',
                  cursor: 'pointer',
                  marginTop: '20px',
                  marginRight: '10px'
                }}>
                Start video recording
              </button>

              {/* <!-- This button will stop the video recording --> */}
              <button type="button" id="stop-vid-recording"
                onClick={this.stopRecording}
                style={{
                  fontWeight: '500',
                  fontFamily: 'cursive',
                  fontSize: '20px',
                  backgroundColor: 'white',
                  color: '#e60000',
                  height: '38px',
                  outline: 'none',
                  border: '1px solid #e60000',
                  borderRadius: '10px',
                  padding: '0px 20px',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}>
                Stop video recording
              </button>

              {/* <!--The video element will be created using
                JavaScript and contains recorded video-->
              <!-- <video id="recorded-video" controls>
                Your browser doesn't support the video tag
              </video> -->

              <!-- The below link will let the
                users download the recorded video -->
              <!-- <a href="" > Download it! </a> --> */}
              <div id="vid-recorder"
              style={{
                // width: '240px',
                // height: '180px',
                // float: 'left'
              }}>
              </div>
            </div>
          )}
        </div>
        <div>
          <button type='button' onClick={this.exitApplication}
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
          }}>
            EXIT APPLICATION
          </button>
        </div>
      </div>
    );
  }
}

export default TakeVideo2;
