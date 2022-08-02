/* eslint-disable promise/always-return */
/* eslint-disable no-new */
/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import AudioControls2 from './components/AudioControls2';
import MicControls from './components/MicControls';
import StillPicture from './components/StillPicture';
import TakeVideo2 from './components/TakeVideo2';
import UncoverGame from './components/UncoverGame';
import UncoverGameWithScaling from './components/UncoverGameWithScaling';
// const navigate = useNavigate();

// Upload to local seaweedFS instance
const uploadImage = async (file: string | Blob) => {
  const formData = new FormData();
  formData.append('file', file);
};

const exitApplication = () => {
  console.log('exiting');
  window.electron.ipcRenderer.sendMessage('close_application', ['close_application']);
}

// const switchGame = () => {
//   console.log('switching to game');
//   window.electron.ipcRenderer.sendMessage('test-message', ['sync ping']);
// }

// const executePS = async () => {
//   // const ps = new PowerShell({
//   //   debug: true,
//   //   executableOptions: {
//   //     '-ExecutionPolicy': 'Bypass',
//   //     '-NoProfile': true,
//   //   },
//   // });

//   // try {
//   //   const message = 'hey from node-powershell <3';
//   //   const printCommand = PowerShell.command`Write-Host ${message} -ForegroundColor red -BackgroundColor white`;
//   //   await ps.invoke(printCommand);

//   //   const scriptCommand = PowerShell.command`. ./script.ps1 -message ${message}`;
//   //   const result = await ps.invoke(scriptCommand);
//   //   console.log(result);
//   // } catch (error) {
//   //   console.error(error);
//   // } finally {
//   //   await ps.dispose();
//   // }
// }

// const { status, startRecording, stopRecording, mediaBlobUrl } =
//     useReactMediaRecorder({ video: true });

const Hello = () => {
  return (
    <div className="App" style={{}}>
      <h2 style={{ color: '#009900', fontFamily: 'cursive', fontSize: '42px' }}>
        HARDWARE POC's V2
      </h2>
      <h3
        style={{
          color: '#009900',
          fontFamily: 'cursive',
          fontSize: '32px',
          marginTop: '-24px',
        }}
      >
        using web API's
      </h3>
      <div style={{marginBottom: '72px'}}>
        <Link
          to="/picture"
          style={{
            fontWeight: 'bold',
            fontFamily: 'cursive',
            fontSize: '20px',
            backgroundColor: '#e60000',
            color: 'white',
            height: '48px',
            outline: 'none',
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginRight: '15px',
            textDecoration: 'none'
          }}
        >
          CLICK PICTURES
        </Link>
        <Link
          to="/video"
          style={{
            fontWeight: 'bold',
            fontFamily: 'cursive',
            fontSize: '20px',
            backgroundColor: '#ffcc00',
            color: 'white',
            height: '48px',
            outline: 'none',
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginRight: '15px',
            textDecoration: 'none'
          }}
        >
          RECORD VIDEOS
        </Link>
        <Link
                    to="/audio"

          style={{
            fontWeight: 'bold',
            fontFamily: 'cursive',
            fontSize: '20px',
            backgroundColor: '#990099',
            color: 'white',
            height: '48px',
            outline: 'none',
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginRight: '15px',
            textDecoration: 'none'
          }}
        >
          AUDIO OUTPUT
        </Link>
        <Link
                   to="/mic"

          style={{
            fontWeight: 'bold',
            fontFamily: 'cursive',
            fontSize: '20px',
            backgroundColor: '#0066ff',
            color: 'white',
            height: '48px',
            outline: 'none',
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          MICROPHONE OUTPUT
        </Link>
      </div>

      <h2 style={{ color: '#009900', fontFamily: 'cursive', fontSize: '42px'}}>
        GAME POC's
      </h2>
      <h3
        style={{
          color: '#009900',
          fontFamily: 'cursive',
          fontSize: '32px',
          marginTop: '-24px',
        }}
      >
        using PhaserJS
      </h3>
      <div style={{marginBottom: '72px'}}>
        <Link
                   to="/uncover-game"

          style={{
            fontWeight: 'bold',
            fontFamily: 'cursive',
            fontSize: '20px',
            backgroundColor: '#e60000',
            color: 'white',
            height: '48px',
            outline: 'none',
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginRight: '15px',
            textDecoration: 'none'
          }}
        >
          UNCOVER
        </Link>

        <Link
          to="/uncover-game-with-scaling"
          style={{
          fontWeight: 'bold',
          fontFamily: 'cursive',
            fontSize: '20px',
            backgroundColor: '#ffcc00',
            color: 'white',
            height: '48px',
            outline: 'none',
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginRight: '15px',
            textDecoration: 'none'
          }}
        >
          UNCOVER With Scaling
        </Link>
      </div>

      {/* <div>
        {process.env.REACT_APP_ENV_TYPE}
        {process.env.REACT_APP_API_END_POINT}
      </div> */}
      {/* <StillPicture sendFile={uploadImage}></StillPicture>
      <TakeVideo></TakeVideo> */}
      {/* <AudioControls url='src/components/HeatWaves.mp3'></AudioControls> */}
      {/* <AudioControls url='http://streaming.tdiradio.com:8000/house.mp3'></AudioControls>
      <MicControls></MicControls>
      <TestIframe></TestIframe> */}
      <div>
        <button type='button' onClick={exitApplication}
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
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/" element={<App />} />
        <Route
          path="/picture"
          element={<StillPicture sendFile={uploadImage} />}
        />
        <Route path="/video" element={<TakeVideo2 />} />
        <Route
          path="/audio"
          element={
            <AudioControls2 url="http://streaming.tdiradio.com:8000/house.mp3" />
            // <AudioControls url="http://streaming.tdiradio.com:8000/house.mp3" />
          }
        />
        <Route path="/mic" element={<MicControls />} />
        <Route path="/uncover-game" element={<UncoverGame />} />
        <Route path="/uncover-game-with-scaling" element={<UncoverGameWithScaling />} />
      </Routes>
    </Router>
  );
}
