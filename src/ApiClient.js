const request = require('superagent');    //原地址
const ADDRESS = '/common/global';
if(!window.apiConfig) {
	window.apiConfig = {
		localhost: {
			php: 'http://10.10.149.130'
		}
	}
}
const api = (window.apiConfig && window.apiConfig[window.location.hostname] && window.apiConfig[window.location.hostname].php || window.apiConfig.localhost.php) + ADDRESS;

export default function postRequest(type, queryString) {

	if(!api) {
		console.log('无api地址');
		return;
	}

	const Auth = window.localStorage.getItem('auth');
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
		ccy: auth.ccy || 'CNY',
		csuid: auth.csuid,
		query: innerQuery ? JSON.stringify(innerQuery) : null
	};

	return request.post(api)
	.type('form')
	.set('Content-Type', 'application/x-www-form-urlencoded')
	.send(queryWrap);
}