/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import path from 'path';
import React from 'react';
import { Link } from 'react-router-dom';
// import ReactAudioPlayer from 'react-audio-player';
// import testAudio from '../assets/audios/HeatWaves.mp3';

interface Props {
  url: string;
}

class AudioControls2 extends React.Component<Props, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      play: false,
    };
    this.setVolume = this.setVolume.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  audio = new Audio('../../../public/assets/audios/HeatWaves.mp3');

  componentDidMount() {
    this.audio.addEventListener('ended', () => this.setState({ play: false }));
  }

  componentWillUnmount() {
    this.audio.pause();
  }

  exitApplication = () => {
    console.log('exiting');
    this.audio.pause();
    window.electron.ipcRenderer.sendMessage('close_application', [
      'close_application',
    ]);
  };

  togglePlay = (status: string) => {
    if (status !== 'play') {
      this.audio.pause();
    }
    console.log('last', status);
    this.setState({ play: status === 'play' }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  };

  setVolume = (volume: number): any => {
    this.audio.volume = volume;
  };

  getInitialState = () => {
    return { value: 0.5 };
  };

  handleChange = (event: any) => {
    this.setVolume(event.target.value);
  };

  playAudio = () => {
    const x = document.getElementById('myAudio') as HTMLMediaElement;
    x?.play();
  };

  pauseAudio = () => {
    const x = document.getElementById('myAudio') as HTMLMediaElement;
    x?.pause();
  };

  render() {
    return (
      <div style={{}} className="App">
        <Link
          to="/"
          className="btn btn-primary homeButton"
          onClick={() => this.togglePlay('pause')}
        >
          {`< `}HOME
        </Link>
        <h3 className="pageHeader" style={{ color: '#990099' }}>
          Audio Output
        </h3>
        <button
          type="button"
          onClick={() => this.togglePlay(this.state.play ? 'pause' : 'play')}
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
          {this.state.play ? 'Pause' : 'Play'}
        </button>
        <div>
          <input
            id="typeinp"
            type="range"
            min="0"
            max="1"
            value={this.state.value}
            onChange={this.handleChange}
            step="0.1"
            style={{
              marginTop: '40px',
              width: '312px',
              height: '20px',
            }}
          />
        </div>
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
        <audio id="myAudio">
          <source
            src="../../../public/assets/audios/HeatWaves.mp3"
            type="audio/mpeg"
          />
        </audio>
        {/* <img src={imag} alt="test" /> */}
        {/* <button onClick={this.playAudio} type="button">
          Play Audio
        </button>
        <button onClick={this.pauseAudio} type="button">
          Pause Audio
        </button>
        <ReactAudioPlayer src="HeatWaves.mp3" autoPlay controls />
        <ReactAudioPlayer
          src="/assets/audios/HeatWaves.mp3"
          autoPlay
          controls
        />
        <ReactAudioPlayer
          src="../../../assets/audios/HeatWaves.mp3"
          autoPlay
          controls
        /> */}
      </div>
    );
  }
}

export default AudioControls2;
