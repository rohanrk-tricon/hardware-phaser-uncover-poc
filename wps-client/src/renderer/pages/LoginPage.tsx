import React from 'react';
import { Link } from 'react-router-dom';
import log from 'loglevel';
import LoginCard from 'renderer/components/LoginCard';

function LoginPage() {
  /** Test logging
   * log.trace('Test Trace');
   * log.debug('Test Debug');
   * log.info('Test Info');
   * log.warn('Test Warn');
   * log.error('Test Error');
   */
  function sendMessage() {
    // Synchronous message emmiter and handler
    log.debug(
      window.electron.ipcRenderer.sendMessage('test-message', ['sync ping'])
    );
  }

  return (
    <div>
      <h3>Login Page</h3>
      <div>
        <LoginCard />
      </div>
      <div>
        <button type="button" onClick={sendMessage}>
          Open Game
        </button>
      </div>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default LoginPage;
