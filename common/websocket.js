// 进入这个页面的时候创建websocket连接[整个页面随时使用]
import $store from '@/store/index.js';
import Vue from 'vue';	
import dateUtil from '@/util/date.js';

//重连次数ok
let reconnectTime;

// 断线重连提示ok
function reconnectConfirm() {
		connectSocketInit()
		reconnectTime = 0
	}
// 断线重连ok
function reconnect() {
		console.log("进入reconnect准备重新连接")
		if ($store.state.webSocket.isSocketOpen) {
			return
		}
		if (reconnectTime >= 3) {
			return reconnectConfirm()
		}
		reconnectTime += 1
		console.log("重新链接")
		connectSocketInit();
	}

//处理好友信息2
async function handleFriendMessage(infos){
	let id = infos.from.id;//发送人的id
	let index =await $store.dispatch('getRoomIndex',id);//获取房间号
	//如果房间号不存在 则创建新的会话
	if(index == -1){
		//先找到好友的信息
		let friend = await $store.dispatch('getFriendInfoById',id);
		console.log(friend)
		if(friend=='not found') return;  //没有找到好友信息什么也不做
		
		let data = {
			id : friend.id,
			nickname : friend.nickname,
			avatar: friend.avatar,
			time: dateUtil.getTimeNow()
		}
		await $store.dispatch('createNewChatRoom',data);
		index = await $store.dispatch('getRoomIndex',id);//获取房间号
	}
	//构造消息
	let message = {
		index:index,
		content:infos.content,
		time:infos.time,
		type:infos.msgType
	};
	$store.dispatch('receiveMessage',message);
}

////处理收到好友申请1
async function handlePersonApply(infos){
	//构造申请
	let apply = {
		type:'person-apply',
		from:infos.from,
		time:infos.time
	}
	uni.showToast({
		title:'你收到一个好友请求',
		icon:'none',
		duration:1000
	})
	$store.dispatch('receiveApply',apply);
}

////处理收到入群申请
async function handleGroupApply(infos){
	//构造申请
	let apply = {
		type:'group-apply',
		from:infos.from,
		time:infos.time,
		group:infos.group
	}
	uni.showToast({
		title:'你收到一个入群请求',
		icon:'none',
		duration:1000
	})
	$store.dispatch('receiveApply',apply);
}

////处理收到同意好友申请信息1
async function handlePersonApplyAgree(infos){
	let from = infos.from;
	uni.showToast({
		title:infos.from.nickname+'同意了您好友请求',
		icon:'success',
		duration:1000
	})
	let person = infos.from;
	$store.dispatch('addFriend',person);
	// /创建一个新的会话
	let session = {
		id:from.id,
		avatar:from.avatar,
		nickname:from.nickname,
		time:dateUtil.getTimeNow()
	}
	$store.dispatch('createNewChatRoom',session);
	//初始化消息
	let index =await $store.dispatch('getRoomIndex',from.id);//获取房间号
	//构造消息
	let message = {
		index:index,
		content:'我已经同意你的申请了,快和我聊天吧',
		time:dateUtil.getTimeNow(),
		type:'text'
	};
	$store.dispatch('receiveMessage',message);
}
///收到同意入群申请信息
async function handleGroupApplyAgree(infos){
	let group = infos.group;
	uni.showToast({
		title:infos.group.name+'的管理员同意了你的入群申请',
		icon:'success',
		duration:1000
	})
	///重新获取群列表
	$store.dispatch('getGroupList');
}
async function handleGroupMessage(infos){
	///保存群消息
	let id = infos.to;//发送人的id
	let index =await $store.dispatch('getRoomIndex',id);//获取房间号
	//如果房间号不存在 则创建新的会话
	if(index == -1){
		//先找到群的信息
		let group = await $store.dispatch('getGroupInfoById',id);
		
		let time = dateUtil.getTimeNow();
		let data = {
			id:group.id,
			nickname:group.name,
			avatar:group.avatar,
			time:time
		}
		await $store.dispatch('createNewChatRoom',data);
		index = await $store.dispatch('getRoomIndex',id);//获取房间号
	}
	//构造消息
	let message = {
		index:index,
		content:infos.content,
		time:infos.time,
		type:infos.msgType,
		msgType:'group',
		from:infos.from,
		avatar:infos.avatar,
		nickname:infos.nickname
	};
	$store.dispatch('receiveMessage',message);
}

async function handleQuitGroup(infos){
	uni.showToast({
		title:infos.content,
		icon:'none'
	})
	//删除会话
	$store.dispatch('removeSessionById',infos.id);
	//重新获取一遍群聊
	$store.dispatch('getGroupList');
}

async function handleInvited(infos){
	//构造申请
	let apply = {
		type:'invite-group',
		from:infos.from,
		time:infos.time,
		group:infos.group
	}
	uni.showToast({
		title:'你收到一个入群邀请',
		icon:'none',
		duration:1000
	})
	$store.dispatch('receiveApply',apply);
}

function connectSocketInit(){
	let user = $store.getters.user;
	
	if(user==null||user=={}){
		console.log('未登录,取消连接websocket');
		return;
	}
	console.log(user)
    var url = 'ws://' + $store.state.webSocket.url + '/websocket/' + user.id;
	// // #ifdef APP-PLUS
	// 	url = url+'/APP'
	// // #endif
	// // #ifdef H5
	// 	url = url+'/H5'
	// // #endif
	
   // uni.closeSocket()  //创建新的socket连接前确保旧的已关闭
    //创建一个socket连接
    uni.connectSocket({
        url:url,
        success: res=>{},
		fail(res){
			console.log("创建连接失败")
			console.log(res)
		}
    })
    //监听socket打开
    uni.onSocketOpen(()=>{
        $store.state.webSocket.isSocketOpen=true
        console.log('WebSocket连接已打开！');
    })
	
    //监听socket关闭
    uni.onSocketClose(()=>{
       $store.state.webSocket.isSocketOpen=false
        console.log('WebSocket连接已关闭！');
    })
    //监听socket错误
    uni.onSocketError(()=>{
        $store.state.webSocket.isSocketOpen=false
        console.log('WebSocket连接打开失败');
		// 用户下线
		$store.state.webSocket.isSocketOpen = false;
		console.log('socket连接错误')
		if (!$store.state.webSocket.isSocketOpen) {
			setTimeout(function() {
				reconnect();
			}, 3000);
		}
    })
    //监听socket消息
    uni.onSocketMessage((res)=>{
        let infos=JSON.parse(res.data)  //socket信息是字符串，需要先转成json形式再去解析内容

		
		switch(infos.type){
			case 'kicked': //账号在别的地方登录了
				uni.showToast({
					title:'您的账户已别处登录',
					icon:'error',
					duration:1000
				})
				setTimeout(function() {
					$store.dispatch('clearUserInfo');
					uni.reLaunch({
						url:'../pages/login/login'
					})
				}, 1000);
				break;
			case 'pong':
				console.log("心跳保持成功") //判断消息类型是否为用来监听链接的ping，如果是则不继续执行只是控制台显示
				break;
			case 'friend_message':
				handleFriendMessage(infos);
				break;	
			case 'apply-friend-fail':
				console.log('好友添加失败')
				uni.showToast({
					title:infos.content,
					icon:'none',
					duration:1000,
					mask:false
				})
				break;
			case 'apply-friend':  //收到了好友申请
				handlePersonApply(infos);
				break;
			case 'success-message'://不清楚干嘛的
				uni.showToast({
					title:infos.content,
					icon:'success',
					duration:1000,
					mask:false
				})
				break;
			case 'apply-friend-agree'://收到了好友好友同意请求的消息
				handlePersonApplyAgree(infos);
				break;
			case 'delete-friend': //被删除消息
				$store.dispatch('deleteFriendById',infos.from);
				break;
			case 'rejected':
				uni.showToast({
					title:'连接websocket被拒！',
					icon:'error',
					duration:1000
				})
				setTimeout(function() {
					$store.dispatch('clearUserInfo');
					uni.reLaunch({
						url:'../index/login'
					})
				}, 1000);
				break;
			case 'group_message':
				handleGroupMessage(infos);
				break;
			case 'apply-group':
				handleGroupApply(infos);
				break;
			case 'apply-group-agree':
				handleGroupApplyAgree(infos);
				break;
			case 'quit-group':
				handleQuitGroup(infos);
				break;
			case 'invite-people':
				handleInvited(infos);
				break;
			case 'check'://暂时不知道干嘛的
				let message={
					type:'check-response',
					id:$store.state.user.id
				}
				sendMessage(message);
				break;
		}
    })
	
	
    //先确保清除了之前的心跳定时器
    clearInterval($store.state.webSocket.pingpongTimes)
    //每过一段时间发送一次心跳，发送Ping,服务器会反馈pong，这样操作以保持socket一直是连接状态，防止断开连接，心跳停止
    $store.state.webSocket.pingpongTimes=setInterval(()=>{
        uni.sendSocketMessage({
            data: "{'type':'ping'}",
            success:(res)=>{
				
			},
            fail:()=>{
				uni.showToast({
					title:'断线重连···',
					icon:'error'
				})
                $store.state.webSocket.isSocketOpen=false;
            }
        });
    },60000)
}

//发送消息ok
function sendMessage(message){
	
	if(!$store.state.webSocket.isSocketOpen){
		connectSocketInit();
	}
	if(!$store.state.webSocket.isSocketOpen){
		uni.showToast({
			title:'发送失败！websocket已断开！',
			icon:'error',
			duration:1000
		})
	}
	
	uni.sendSocketMessage({
		data:JSON.stringify(message),
		success() {
			//发送消息成功
			console.log('发送消息成功')
		},
		fail(res) {
			reSend(1,message);	
		}
	})
	return true;
}

//失败重发ok
async function reSend(times,message){
	uni.showToast({
		title:'已断开,尝试重发'+times+'次',
		icon:'none'
	})
	await connectSocketInit();
	setTimeout(()=>{
		uni.sendSocketMessage({
			data:JSON.stringify(message),
			success() {
			
			},
			fail(res) {
				console.log(res)
				if(times>=5){
					uni.showToast({
						title:'重发失败,请重启app',
						icon:'error'
					})
				}else{
					times++;
					reSend(times,message);	
				}
			}
		})
	},500);
	
}


module.exports = {
	connectSocketInit : connectSocketInit,
	sendMessage:sendMessage,
}