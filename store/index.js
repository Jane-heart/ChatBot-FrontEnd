//demo中的数据是模拟状态数据，用于测试，实际使用中，请根据您自己的业务编写
import Vue from 'vue'
import Vuex from 'vuex'
import {
	login,
	getUserInfo,
	updateUserInfo,
	getFriendList,
	getSessionList,
	listUnCheckFriendMessage,
	listFriendMessage
} from '@/common/user.js'

const USER_KEY = 'userInfo';

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		//会话列表
		sessions: uni.getStorageSync('sessions') || [{
			messages: []
		}],
		//好友消息
		friendMessageList: uni.getStorageSync('friendMessageList') || [],
		userInfo: uni.getStorageSync(USER_KEY) || {},
		//记录当前聊天的会话号
		sessionIndex: -1,
		//好友列表
		friendList: uni.getStorageSync('friendList') || [],
		///申请列表
		applyList: uni.getStorageSync('applyList') || [],
		//weoskcet状态
		webSocket: {
			isSocketOpen: false, //连接状态
			url: '47.106.69.245:5000', //服务器地址
			// url: '127.0.0.1:5000', //服务器地址
			pingpongTime: '', //心跳
		},
	},
	mutations: {
		setSessionIndex(state, i) {
			console.log("sessionIndex:" + state.sessionIndex)
			console.log("i:" + i)
			state.sessionIndex = i;
			console.log("sessionIndex:" + state.sessionIndex)
		},
		setFriendMessageList(state, friendMessageList) {
			state.setFriendMessageList = friendMessageList;
		},
		setSession(state, session) {
			console.log("state.session:" + state.session)
			console.log("session:" + session)
			state.sessions = session;
		},
		setUserInfo(state, user) {
			state.userInfo = user;
		},
		setFriendList(state, list) {
			state.friendList = list;
		},
	},
	actions: {
		//发送消息
		async getMessage(context, data) {
			console.log('this.state.sessions:' + this.state.sessions)
			console.log(data)
			const index = this.state.sessionIndex
			// this.state.sessions[index]
			//senderId:this.user.id,
			// receiverId:this.sessions[this.index].targetId
			const senderId = data.content.senderId
			const receiverId = data.content.receiverId
			var message = await listFriendMessage({
				senderId,
				receiverId
			})
			message = message.data
			console.log('打印出来的message')
			console.log(message)
			this.state.sessions[index].message = message;
			console.log('this.state.sessions[index].message:')
			console.log(this.state.sessions[index].message)

			setTimeout(() => {
				uni.pageScrollTo({
					scrollTop: 99999999999, //滚动到页面的目标位置（单位px）
				});
			}, 10);
		},
		// 登录
		async setUserInfo(context, userInfo) {
			console.log("getUserInfo:")
			console.log(userInfo)
			const data = await getUserInfo({
				userId: userInfo.id
			})
			// data = data.data
			console.log("data:")
			console.log(data)
			console.log(data.data.id)
			// 解析后端传送过来的json对象
			// 保存到vuex中，通过commit
			const user = {
				id: data.data.id,
				userName: data.data.userName,
				gender: data.data.gender || '未设置',
				signature: data.data.signature || '未设置',
				avatar: data.data.avatar ||
					'https://tuanzi-images.oss-cn-guangzhou.aliyuncs.com/IMAGES/robot.png',
				register_time: '2022-10-05'
			}
			console.log("user:")
			console.log(user)
			//本地保存用户信息
			uni.setStorage({
				key: USER_KEY,
				data: user
			})
			this.commit('setUserInfo', user);
			console.log('获取user信息')
			console.log(this.getters.user)
			// 获取好友列表
			this.dispatch('setFriendList', user);
			//获取群聊列表
			// this.dispatch('getGroupList');

			uni.setStorage({
				key: 'lastUser',
				data: user.id
			})
			//获取会话信息
			const sessions = await (await getSessionList(user.id)).data

			//如果不是上次登录的用户的话 需要替换会话
			if (user.id != this.state.lastUserId) {
				console.log(user.id + "<----" + this.state.lastUserId + '\n用户变更,替换本地记录')
				// let sessions = [];
				//本地保存会话
				uni.setStorage({
					key: 'sessions',
					data: sessions
				})
				this.commit('setSession', sessions);
				//清空
				this.state.applyList = [];
				uni.setStorage({
					key: 'applyList',
					data: []
				})
				//覆盖记录
				uni.setStorage({
					key: 'friendList',
					data: this.state.friendList
				})
			}
			///连接websokct
			//WebSocket.connectSocketInit();

		},
		//获取最新的会话列表信息
		async getNewSessionList(){
			//获取当前用户的id
			const id = this.getters.id;
			console.log('id:')
			console.log(id)
			//获取当前用户的最新的会话信息
			const sessions = await (await getSessionList(id)).data
			
			//本地保存会话
			uni.setStorage({
				key: 'sessions',
				data: sessions
			})
			this.commit('setSession', sessions);
		},
		// 获取好友列表
		async setFriendList(context, userInfo) {
			console.log("userInfo")
			console.log(userInfo)
			const res = await getFriendList({
				userId: userInfo.id
			})
			// 解析后端传送过来的json对象
			// console.log(res);
			// 保存到vuex中，通过commit
			//本地保存用户信息
			uni.setStorage({
				key: 'friendList',
				data: res
			})
			this.commit('setFriendList', res);
		},
		//根据用户id查询好友的信息
		getFriendInfoById(context, id) {
			let list = this.state.friendList;
			for (let i = 0; i < list.length; i++) {
				if (list[i].id == id) {
					return list[i];
				}
			}
			return 'not found';
		},
		//以用户id获取对话的房间号
		getRoomIndex(context, id) {
			let sessions = this.getters.sessions;
			for (let i = 0; i < sessions.length; i++) {
				if (sessions[i].id == id) {
					return i;
				}
			}
			return -1;
		},
		//创建新的会话
		async createNewChatRoom(context, data) {
			let sessions = this.getters.sessions;
			let session = {
				id: data.id,
				unchecked: 0,
				name: data.nickname,
				messages: [],
				avatar: data.avatar,
				lastTime: data.time,
				lastMessage: ''
			}
			sessions.push(session);
			this.commit('setSession', sessions);
			await this.dispatch('sortSessionByTime');
		},
		//收到消息
		receiveMessage(context, data) {
			let index = data.index;
			let content = data.content;
			let type = data.type;
			let time = data.time;
			let message = {
				content: content,
				type: type,
				time: time,
				to: 'in',
				from: data.from,
				avatar: data.avatar,
				nickname: data.nickname
			}
			this.state.sessions[index].messages.push(message);
			this.state.sessions[index].lastTime = time;
			if (data.msgType == 'group') {
				this.state.sessions[index].lastMessage = type == 'text' ? data.nickname + ':' + data.content :
					data.nickname + ':' + '【图片】';
			} else {
				this.state.sessions[index].lastMessage = type == 'text' ? content : '【图片】';
			}
			//如果用户不在当前房间 则未读消息++
			if (this.state.sessionIndex != index) {
				this.state.sessions[index].unchecked++;
			} else {
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 999999999999999
					})
				}, 50)
			}

			if (this.state.sessionIndex == -1) {
				this.dispatch('sortSessionByTime');
			}
			this.dispatch('saveMessage');
		},
		//聊天排序
		sortSessionByTime() {
			let sessions = this.getters.sessions;
			for (let i = 0; i < sessions.length - 1; i++) {
				for (let j = i + 1; j < sessions.length; j++) {
					if (new Date(sessions[i].lastTime) < new Date(sessions[j].lastTime)) {
						let t = sessions[i];
						sessions[i] = sessions[j];
						sessions[j] = t;
					}
				}
			}
			this.commit('setSession', sessions);
			//本地保存会话
			uni.setStorage({
				key: 'sessions',
				data: sessions
			})
		},
		//保存聊天记录
		saveMessage() {
			let sessions = this.getters.sessions;
			//本地保存会话
			uni.setStorage({
				key: 'sessions',
				data: sessions
			})
		},
	},
	getters: {
		sessionIndex(state) {
			return state.sessionIndex;
		},
		sessions(state) {
			console.log('state.sessions:' + state.sessions)
			console.log(state.sessions)
			if (state.sessions === undefined) {
				state.sessions = [],
					state.sessions[0] = [],
					state.sessions[0].messages = []

			}
			console.log('state.sessions:' + state.sessions)
			console.log(state.sessions)
			return state.sessions;
		},
		applyList(state) {
			return state.applyList;
		},
		friends(state) {
			return state.friendList;
		},
		user(state) {
			return state.userInfo;
		},
		id(state) {
			return state.userInfo.id;
		},
		userName(state) {
			return state.userInfo.userName;
		},
		avatar(state) {
			return state.userInfo.avatar;
		},
		gender(state) {
			return state.userInfo.gender;
		},
	}
})
export default store
