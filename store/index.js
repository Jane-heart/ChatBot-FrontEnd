//demo中的数据是模拟状态数据，用于测试，实际使用中，请根据您自己的业务编写
 import Vue from 'vue'
 import Vuex from 'vuex'
 
 Vue.use(Vuex)

 const store = new Vuex.Store({
 	state: {

 		//对话
 		sessions: [{
			messages:[]
		}],
 		//记录当前聊天的会话号
 		sessionIndex: -1,
 	},
 	mutations: {
 		setSessionIndex(state, i) {
			console.log("sessionIndex:"+state.sessionIndex)
			console.log("i:"+i)
 			state.sessionIndex = i;
			console.log("sessionIndex:"+state.sessionIndex)
 		},
 		setSession(state, session) {
			console.log("state.session:"+state.session)
			console.log("session:"+session)
 			state.sessions = session;
 		}
 	},
 	actions: {
 		//发送消息
 		addMessage(context, data) {
 			console.log('this.state.sessions:'+this.state.sessions)
			if(this.state.sessions[0] === undefined){
				this.state.sessions[0] = [],
				this.state.sessions[0].messages = []
				
			}
			this.state.sessions[0].messages.push(data)
			console.log('this.state.sessions[0].message:'+this.state.sessions[0].message)
 			setTimeout(() => {
 				uni.pageScrollTo({
 					scrollTop: 99999999999, //滚动到页面的目标位置（单位px）
 				});
 			}, 10);
 		},
 	},
 	getters: {
 		sessionIndex(state) {
 			return state.sessionIndex;
 		},
 		sessions(state) {
			console.log('state.sessions:'+state.sessions)
			console.log(state.sessions)
			if(state.sessions === undefined){
				state.sessions = [],
				state.sessions[0] = [],
				state.sessions[0].messages = []
				
			}
			console.log('state.sessions:'+state.sessions)
			console.log(state.sessions)
 			return state.sessions;
 		},
		user(state){
			return state.userInfo;
		},
        id(state){
			return state.userInfo.loginId;
		},
		nickname(state){
			return state.userInfo.nickname;
		},
		avatar(state){
			return state.userInfo.avatar;
		},
		gender(state){
			return state.userInfo.gender;
		},
 	}
 })
 export default store
