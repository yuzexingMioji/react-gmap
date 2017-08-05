'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = postRequest;
var request = require('superagent'); //原地址
var ADDRESS = '/common/global';
var api = (window && window.apiConfig && window.apiConfig[window.location.hostname].php || window.apiConfig.localhost.php) + ADDRESS;

function postRequest(type, queryString) {

	if (!api) {
		console.log('无api地址');
		return;
	}

	var Auth = window.localStorage.getItem('auth');
	var auth = Auth && JSON.parse(Auth) || {};
	var url = "maps/api/place/" + type + "/json?" + queryString + "&lang=zh_cn";
	var innerQuery = {
		uriMiddle: url
	};
	var queryWrap = {
		type: 'gsv114',
		lang: 'zh_cn',
		ver: '',
		dev: 0,
		qid: Date.now(),
		net: 2,
		uid: '',
		ptid: auth.ptid,
		ccy: auth.ccy || 'CNY',
		csuid: auth.csuid,
		query: innerQuery ? JSON.stringify(innerQuery) : null
	};

	return request.post(api).type('form').set('Content-Type', 'application/x-www-form-urlencoded').send(queryWrap);
}
module.exports = exports['default'];