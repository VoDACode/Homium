(() => {
    const token = document.getElementById('token');
    const enableWebhook = document.getElementById('enable-webhook');
    const webhookSettings = document.getElementById('webhook-settings');
    const webhookHostName = document.getElementById('webhook-host');
    const save = document.getElementById('save');
    const close = document.getElementById('close');
    const restart = document.getElementById('restart');

    let data = {
        token: "",
        webhook: {
            enabled: false,
            host: "",
            certificate: ""
        }
    }

    fetch('/api/config/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then(res => {
        if(res && Object.keys(res).length > 0)
            data = res;
        token.value = res.token || "";
        enableWebhook.checked = res.webhook?.enabled || false;
        webhookHostName.value = res.webhook?.host || "";
        if (enableWebhook.checked == false) {
            webhookSettings.classList.add('hidden');
        }
    }).catch(error => {
        console.error('Error:', error);
    });

    enableWebhook.addEventListener('change', () => {
        data.webhook.enabled = enableWebhook.checked;
        if (enableWebhook.checked) {
            webhookSettings.classList.remove('hidden');
        } else {
            webhookSettings.classList.add('hidden');
        }
    });

    token.addEventListener('change', () => {
        data.token = token.value;
    });

    webhookHostName.addEventListener('input', () => {
        if(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d+)?$/.test(webhookHostName.value)) {
            data.webhook.host = webhookHostName.value;
            webhookHostName.classList.remove('error');
        } else if (/^([\da-z\.-]+)\.([a-z\.]{2,6})(?::\d+)?$/.test(webhookHostName.value)) {
            data.webhook.host = webhookHostName.value;
            webhookHostName.classList.remove('error');
        } else {
            webhookHostName.classList.add('error');
        }
    });

    save.addEventListener('click', () => {
        console.log(data);
        fetch('/api/config/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(res => {
            console.log('Success:', res);
        }).catch(error => {
            console.error('Error:', error);
        });
    });

    restart.addEventListener('click', () => {
        fetch('/api/status/restart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });

    close.addEventListener('click', () => {
        window.close();
    });

})();