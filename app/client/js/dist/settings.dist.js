"use strict";

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
			}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, l, l.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
		s(r[o]);
	}return s;
})({ 1: [function (require, module, exports) {
		function ToggleModal(id) {
			var elem = document.querySelector("#" + id);
			if (elem.className.indexOf('is-active') > -1) {
				elem.classList.remove('is-active');
			} else {
				elem.classList.add('is-active');
			}
		}
		function SendRequest(url, method, params, callback) {
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('load', function () {
				callback(xhr.responseText);
			});
			xhr.open(method, url);
			if (method === 'POST') {
				xhr.send(params);
			} else {
				xhr.send();
			}
		}

		var currentUsername = document.querySelector('#username-change').value;

		document.querySelector('#delete').addEventListener('mousedown', function () {
			ToggleModal('deleteModal');
		});
		document.querySelector('#deleteModal > .modal-background').addEventListener('mousedown', function () {
			ToggleModal('deleteModal');
		});
		document.querySelector('#deleteCancel').addEventListener('mousedown', function () {
			ToggleModal('deleteModal');
		});
		document.querySelector('#verifyPass').addEventListener('mousedown', function () {
			SendRequest('/checklogin', 'POST', "username=" + currentUsername + "&password=" + document.querySelector('#verifyPassText').value, function (resp) {
				if (resp === 'true') {
					document.querySelector('#deleteAction').disabled = false;
				} else {
					document.querySelector('#deleteAction').disabled = true;
				}
			});
		});
		document.querySelector('#deleteAction').addEventListener('mousedown', function () {
			SendRequest('/deleteaccount', 'POST', "username=" + currentUsername, function (resp) {
				ToggleModal('deleteModal');
				location.href = '/logout';
			});
		});

		document.querySelector('#update-username').addEventListener('mousedown', function () {
			if (document.querySelector('#username-change').value !== currentUsername) {
				console.log('a');
				SendRequest('/updateusername', 'POST', "oldUsername=" + currentUsername + "&newUsername=" + document.querySelector('#username-change').value, function (resp) {
					console.log(resp);
					if (resp === 'true') {
						document.querySelector('#username-change').classList.add('is-success');
						location.reload();
					} else {
						document.querySelector('#username-change').classList.add('is-danger');
					}
				});
			}
		});

		document.querySelector('#update-info').addEventListener('mousedown', function () {
			var currentPassword = document.querySelector('#current-password').value,
			    newPassword = document.querySelector('#password-change').value,
			    username = currentUsername;
			SendRequest('/changepassword', 'POST', "username=" + username + "&password=" + currentPassword + "&newPassword=" + newPassword, function (resp) {
				if (resp === 'true') {
					document.querySelector('#password-change').classList.add('is-success');
				} else if (resp === 'bad-login') {
					document.querySelector('#current-password').classList.add('is-danger');
				} else {
					document.querySelector('#password-change').classList.add('is-danger');
				}
				location.reload();
			});
		});

		document.querySelector('.navbar-burger').addEventListener('mousedown', function () {
			var elem = document.querySelector('.navbar-burger');
			if (elem.className.indexOf('is-active') > -1) {
				document.querySelector('.navbar-burger').classList.remove('is-active');
				document.querySelector('.navbar-menu').classList.remove('is-active');
			} else {
				document.querySelector('.navbar-burger').classList.add('is-active');
				document.querySelector('.navbar-menu').classList.add('is-active');
			}
		});

		document.querySelector('#beta-enable').checked = localStorage.getItem('beta');

		document.querySelector('#beta-enable').addEventListener('change', function () {
			var enabled = document.querySelector('#beta-enable').checked;
			localStorage.setItem('beta', enabled);
		});
	}, {}] }, {}, [1]);
