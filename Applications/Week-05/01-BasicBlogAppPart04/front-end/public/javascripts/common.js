// common api functionality

let MyBlogApp = {};
(function() {
    'use strict';
    MyBlogApp.apiUrl = 'http://localhost:3000/api';
    MyBlogApp.request = function(method, url, payload, handler) {
        const xhr = new XMLHttpRequest();
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

    /*************** spinner  *******************/
    MyBlogApp.spinnerCount = 0;
    MyBlogApp.spinnerOpts = {
        lines: 5, // The number of lines to draw
        length: 80, // The length of each line
        width: 2, // The line thickness
        radius: 22, // The radius of the inner circle
        scale: 1.3, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#2ef9a1', // CSS color or array of colors
        fadeColor: 'blue', // CSS color or array of colors
        opacity: 0.35, // Opacity of the lines
        rotate: 0, // The rotation offset
        direction: -1, // 1: clockwise, -1: counterclockwise
        speed: 1.6, // Rounds per second
        trail: 100, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: '10px', // Box-shadow for the lines
        position: 'absolute' // Element positioning
    };

    MyBlogApp.spinnerTarget = document.getElementById('main-content');
    MyBlogApp.loadingTarget = document.getElementById('loading-screen');
    MyBlogApp.spinner = new Spinner(MyBlogApp.spinnerOpts);

    MyBlogApp.spin = function() {
        MyBlogApp.spinnerCount++;
        if (MyBlogApp.spinnerCount === 1) {
            MyBlogApp.loadingTarget.style.display = 'block';
            MyBlogApp.spinner.spin(MyBlogApp.spinnerTarget);
        }
    }

    MyBlogApp.spinStop = function() {
        MyBlogApp.spinnerCount--;
        if (MyBlogApp.spinnerCount === 0) {
            MyBlogApp.loadingTarget.style.display = 'none';
            MyBlogApp.spinner.stop();
        }
    }

    MyBlogApp.setCookie = function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
    }

    MyBlogApp.clearCookie = function(cname) {
        document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    MyBlogApp.getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    MyBlogApp.checkCookie = function() {
        const cookie = MyBlogApp.getCookie("user");
        if (cookie != "") {
            MyBlogApp.user = JSON.parse(cookie);
            let userSpan = document.getElementById('username');
            userSpan.textContent = MyBlogApp.user.username;
            document.getElementById('userButton').classList.remove('hidden');
            document.getElementById('logoutButton').classList.remove('hidden');
            if (document.location.href.indexOf('/users/login') > -1 ||
                document.location.href.indexOf('/users/register') > -1) {
                document.location.href = '/';
            }
        } else {
            if (document.location.href.indexOf('/users/login') > -1 ||
                document.location.href.indexOf('/users/logout') > -1 ||
                document.location.href.indexOf('/users/register') > -1) {
                return;
            }
            document.location.href = '/users/login';
        }
    }

    MyBlogApp.login = function(user) {
        MyBlogApp.setCookie('user', JSON.stringify(user), 1);
    }

    MyBlogApp.logout = function() {
        MyBlogApp.clearCookie('user');
        setTimeout(function() {
            document.location.href = '/users/logout';
        }, 200);

    }







    // run startup functions
    MyBlogApp.checkCookie();
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        MyBlogApp.logout();
    });
}());