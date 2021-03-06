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
		function ShowError(text, name) {
			document.querySelector('form[action="/signup"]').querySelector('*[name="' + name + '"]').classList.add('is-danger');
			document.getElementById(name + '-error').innerText = text;
		}
		function ResetForm() {
			document.querySelector('form[action="/signup"]').querySelector('*[name="username"]').classList.remove('is-danger');
			document.getElementById('username-error').innerText = '';
			document.querySelector('form[action="/signup"]').querySelector('*[name="password"]').classList.remove('is-danger');
			document.getElementById('password-error').innerText = '';
			document.querySelector('form[action="/signup"]').querySelector('*[name="confirm_password"]').classList.remove('is-danger');
			document.getElementById('confirm_password-error').innerText = '';
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
		document.querySelector('form[action="/signup"]').onsubmit = function (e) {
			ResetForm();
			e.preventDefault();
			var hit = false;
			SendRequest('/usernametaken', 'POST', "username=" + document.querySelector('form[action="/signup"]').querySelector('*[name="username"]').value, function (resp) {
				if (resp === 'true') {
					hit = true;
					ShowError('Username already in use', 'username');
					e.preventDefault();
				}

				if (!hit) {
					document.querySelector('form[action="/signup"]').onsubmit = function () {};
					document.querySelector('form[action="/signup"]').submit();
				}
			});
			if (document.querySelector('form[action="/signup"]').querySelector('*[name="password"]').value !== document.querySelector('form[action="/signup"]').querySelector('*[name="confirm_password"]').value) {
				ShowError('Passwords do not match', 'confirm_password');
				hit = true;
				e.preventDefault();
				return false;
			}
		};
	}, {}] }, {}, [1]);
