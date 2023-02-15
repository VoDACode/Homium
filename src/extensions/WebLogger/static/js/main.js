(async () => {
    let selfPaths = {
        api: '',
        static: ''
    };
    let logElement = document.getElementById('log');

    let response = await fetch('/extension-info');
    selfPaths = await response.json();

    let log = (data) => {
        logElement.innerHTML += `<div class="item" data-type="${levelToText(data.level)}">
        <div class="time">
            <span>${data.timestamp}</span>
        </div>
        <div class="type">
            <span>${levelToText(data.level)}</span>
        </div>
        <div class="service">
            <span>${data.serviceName}</span>
        </div>
        <div class="message">
            <span>${data.message}</span>
        </div>
    </div>`;
        window.scrollTo(0, document.body.scrollHeight);
    };

    let socket = new WebSocket(`ws://${location.host}${selfPaths.api}/log/stream`);
    socket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if(data.error){
            console.error(data.error);
            return;
        }
        log(data);
    };

    fetch('/api/log/list')
    .then(response => response.json())
    .then(data => {
        data.forEach(log);
    });

    function levelToText(level){
        switch(level){
            case 0:
                return 'DEBUG';
            case 1:
                return 'INFO';
            case 2:
                return 'WARNING';
            case 3:
                return 'ERROR';
            case 4:
                return 'FATAL';
        }
    }

})();