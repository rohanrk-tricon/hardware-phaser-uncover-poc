import React from 'react';

function TestIframe() {

    function load() {

        // addEventListener support for IE8
        function bindEvent(element: any, eventName: any, eventHandler: any) {
            if (element.addEventListener) {
                element.addEventListener(eventName, eventHandler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventHandler);
            }
        }

        var iframeSource = 'file:///C:/Users/ajay.chandra/Downloads/http-call-file-protocol.html';

        // Create the iframe
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', iframeSource);
        iframe.setAttribute('id', 'the_iframe');
        iframe.style.width = 450 + 'px';
        iframe.style.height = 200 + 'px';
        document.body.appendChild(iframe);

        // Send a message to the child iframe
        var iframeEl = document.getElementById('the_iframe') as HTMLIFrameElement,
            messageButton = document.getElementById('message_button'),
            results = document.getElementById('results'),
            switchButton = document.getElementById('switch_to_game'),
            dontSwitchButton = document.getElementById('dont_switch_to_game');


        // Send a message to the child iframe
        var sendMessage = function (msg: any) {
            // Make sure you are sending a string, and to stringify JSON
            if (iframeEl && iframeEl.contentWindow) {
                iframeEl.contentWindow.postMessage(msg, '*');
            }
        };

        // Send random messge data on every button click
        bindEvent(dontSwitchButton, 'click', function (e: any) {
            sendMessage(
                {
                    data: 'Dashboard app sent a message without switching'
                }
            );
        });

        // Send random messge data on every button click
        bindEvent(switchButton, 'click', function (e: any) {
            iframeEl.style.width = '100%';
            iframeEl.style.height = '100%';
            iframeEl.style.position = 'absolute';
            iframeEl.style.margin = '0';
            iframeEl.style.top = '0px';
            iframeEl.style.backgroundColor = 'wheat';
            iframeEl.style.zIndex = '2';
            iframeEl.style.overflowX = 'hidden';
            iframeEl.style.overflowY = 'hidden';
            sendMessage(
                {
                    data: 'Dashboard app sent a message while switching'
                }
            );
        });

        // Listen to message from child window
        bindEvent(window, 'message', function (e: any) {
            if (results) {
                if (e.data.switch) {
                    iframeEl.style.width = '450px';
                    iframeEl.style.height = '200px';
                    iframeEl.style.position = 'relative';
                    iframeEl.style.margin = 'none';
                    iframeEl.style.top = 'none';
                    iframeEl.style.backgroundColor = 'white';
                    iframeEl.style.zIndex = 'auto';
                    iframeEl.style.overflowX = 'auto';
                    iframeEl.style.overflowY = 'auto';
                    console.log('Dahsboard app:', e.data.data);
                    results.innerHTML = e.data.data;
                } else {
                    console.log('Dahsboard app:', e.data.data);
                    results.innerHTML = e.data.data;
                }
            }
        });

    }

    return (
        <div style={{ border: "1px solid black" }}>
            <h3>
                Test IFrame
            </h3>
            <div>
                <h3>
                    Dashboard application
                </h3>
                <div id="results"></div>
                <div>
                    <button onClick={load}>
                        Initiate
                    </button>
                </div>
                <div>
                    <button id="switch_to_game">Switch to Game</button>
                </div>
                <div>
                    <button id="dont_switch_to_game">Don't Switch to Game, send only message</button>
                </div>
            </div>
            <div>
                {/* <iframe src='file:///E:/Projects/Learning/iframe-child.html'></iframe> */}
                {/* <iframe src='http://localhost:3001/'></iframe> */}
            </div>
        </div>
    )
}

export default TestIframe;
