document.addEventListener('DOMContentLoaded', function () {
    let currentSessionId = 0;

    document.getElementById('startSessionBtn').addEventListener('click', function(){
        startSession();
    })
    document.getElementById('stopSessionBtn').addEventListener('click', function(){
        stopSession();
    })

    function startSession() {
        currentSessionId = currentSessionId + 1;
        console.log('Session started with sessionId:', currentSessionId);
        chrome.runtime.sendMessage({ id: currentSessionId });
        document.getElementById('sessionSpan').textContent = currentSessionId;
    }

    function stopSession() {
        console.log('Session stopped');
        chrome.runtime.sendMessage({ id: null });
        document.getElementById('sessionSpan').textContent = -1;
    }
});