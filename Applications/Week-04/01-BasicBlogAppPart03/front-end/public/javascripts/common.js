// common api functionality
let MyBlogApp = {};
MyBlogApp.apiUrl = 'http://localhost:3000/api';
MyBlogApp.request = function(method, url, payload, handler) {
    xhr = new XMLHttpRequest();
    if (!handler && typeof payload === 'function') {
        handler = payload;
        payload = null;
    }

    xhr.open(method, MyBlogApp.apiUrl + url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        handler(xhr.status, JSON.parse(xhr.responseText));
    };
    xhr.send(JSON.stringify(payload));
}

MyBlogApp.getFormInput = function(formEvent, name) {
    if (formEvent && formEvent.srcElement) {
        let elements = formEvent.srcElement;
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].name === name) {
                return elements[i].value;
            }
        }
        return null;
    } else {
        return null;
    }
}

MyBlogApp.toast = function(level, message) {
    let toast = document.createElement('div');
    let toastClose = document.createElement('button');
    let toastMessage = document.createElement('span');
    toast.setAttribute('role', 'alert');
    toast.className = `alert alert-${level} alert-dismissible fade show`;

    toastClose.textContent = "X";
    toastClose.className = "close";
    toastClose.setAttribute('data-dismiss', 'alert');
    toastClose.setAttribute('aria-label', 'Close');
    toast.appendChild(toastClose);

    toastMessage.textContent = message;
    toast.appendChild(toastMessage);

    document.querySelector("div[id='toasts']").appendChild(toast);
}