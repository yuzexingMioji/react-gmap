const request = require('superagent');    //原地址
const api = window && window.apiConfig && window.apiConfig[window.location.hostname].php + '/common/global' || 'http://10.10.149.130:86/common/global';

// window.apiConfig[];

export default function postRequest(type, queryString) {

	if(!api) {
		console.log('无api地址');
		return;
	}
	const Auth = window.localStorage.getItem(name);
	const auth = Auth && JSON.parse(Auth) || {};
	const url = "maps/api/place/" + type + "/json?"+ queryString +"&lang=zh_cn";
	const innerQuery = {
		uriMiddle: url
	}
	const queryWrap = {
		type: 'gsv114',
		lang: 'zh_cn',
		ver: '',
		dev: 0,
		qid: Date.now(),
		net: 2,
		uid: '',
		ptid: auth.ptid,
		ccy: auth.ccy,
		csuid: auth.csuid,
		query: innerQuery ? JSON.stringify(innerQuery) : null
	};

	return request.post(api)
	.type('form')
	.set('Content-Type', 'application/x-www-form-urlencoded')
	.send(queryWrap);
}