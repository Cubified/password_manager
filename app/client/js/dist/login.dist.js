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
		function ResetForm() {
			document.querySelector('article').classList.add('is-hidden');
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
		document.querySelector('form').onsubmit = function (e) {
			ResetForm();
			e.preventDefault();
			var hit = false,
			    elem = document.querySelector('form');
			SendRequest('/checklogin', 'POST', "username=" + document.getElementsByName('username')[0].value + "&password=" + document.getElementsByName('password')[0].value, function (resp) {
				if (resp !== 'true') {
					hit = true;
				}

				if (!hit) {
					elem.onsubmit = function () {};
					elem.submit();
				} else {
					document.querySelector('article').classList.remove('is-hidden');
				}
			});
		};
	}, {}] }, {}, [1]);
