<template>
	<view>
		<!-- 顶部导航栏 -->
		<view class="box-bg">
			<uni-nav-bar shadow fixed="true" left-icon="left" right-icon="cart" :title="title" @clickLeft="back"
				@clickRight="showDetail" />
		</view>
		<!-- 聊天内容 -->
		<view class="content">
			<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollToView">
				<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
					<view class="chat-ls">
						<!-- <view>{{sessions[index]===undefined}}</view>
						<view>{{index}}</view> -->
						<view v-for="(msg,i) in sessions[index].message" :key="i">
							<view class="chat-time"
								v-show="i==0 || btwnSeconds(sessions[index].message[i-1].createTime,sessions[index].message[i].createTime) > 300">
								{{btwnDays(msg.createTime,getNowTime())==0?msg.createTime.substr(11,5):msg.createTime.substr(0,16)}}
							</view>
							<view :class="['msg-m',msg.senderId===user.id?'msg-right':'msg-left']">
								<image class="user-img"
									:src="msg.senderId===user.id?user.avatar:sessions[index].targetUrl">
								</image>
								<view class="message">
									<!-- 文字 -->
									<view class="msg-text">
										<rich-text class="rich-text" v-text="msg.content"></rich-text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

		</view>
		<!-- 消息发送栏 -->
		<view class="footer" ref="footer" id="footer">
			<view class="content-wrap">
				<textarea class="content" @keyup.enter="sendMessge()" v-model="textMsg" maxlength="-1" auto-height />
			</view>
			<view class="btn-wrap">
				<button class="btn" :disabled="disable" :class="{'disabled': disable}" @click="sendMessge()">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from '../../common/chatApi.js';
	import dateUtil from 'util/date';
	import WebSocket from '@/common/websocket.js';
	import { mapGetters, mapActions, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				// text: 'hello',
				textMsg: '',
				disable: true, //控制发送键能够按下
				inputh: '60',
				scrollToView: '',
				title: '',
			};
		},
		computed: {
			//这里可以通过这种方式引用相应模块的state数据，其中sessions是变量名。在代码的其他部分可以使用this.sessions访问数据
			...mapGetters(['user', 'sessions', 'sessionIndex']),
		},
		watch: {
			//监听text，当他有值时发送按钮才可以点击
			textMsg(newVal) {
				if (newVal.trim() != '') {
					this.disable = false
				} else {
					this.disable = true
				}
			}
		},
		onLoad(options) {
			// this.setSessionIndex(options.index);
			// this.index = options.index;
			// let that = this;
			// uni.setNavigationBarTitle({
			// 	title: that.sessions[options.index].name
			// });
			// setTimeout(()=>{
			// 	uni.pageScrollTo({
			// 		scrollTop: 99999999999,    //滚动到页面的目标位置（单位px）
			// 		duration:0
			// 	 });
			// },10);
			// ///清空未读消息
			// this.sessions[this.index].unchecked = 0;
			console.log("打印获取options")
			console.log(options);
			console.log(options.userId); //打印出上个页面传递的参数。
			console.log(options.friendName); //打印出上个页面传递的参数。
			console.log(options.currentIndex); //打印出上个页面传递的参数。
			console.log("打印获取option结束")
			
			

			// 获取对应的聊天窗口的页面
			this.setSessionIndex(options.currentIndex);

			this.index = options.currentIndex;
			
			console.log("打印获取get")
			console.log(this.index)
			console.log(this.user)
			console.log(this.sessions)
			console.log(this.sessionIndex)
			console.log("打印获取get结束")
			this.title = options.friendName
			// uni.setNavigationBarTitle({
			// 	title: '机器人聊天室'
			// });
			setTimeout(() => {
				uni.pageScrollTo({
					scrollTop: 99999999999, //滚动到页面的目标位置（单位px）
					duration: 0
				});
			}, 10);
		},
		onUnload() {
			// this.reRangeSession(this.index);		
			// this.setSessionIndex(-1);
			// this.reRangeSession(0);
			this.setSessionIndex(-1);
		},
		methods: {
			/*这里是导入模块的actions，其中setSessionIndex是我们在mutations中定义的。
			注意，中括号是必须的。当要导入多个的时候可以在中括号中添加，以数组的形式传给mapMutations。
			在代码中我们就可以this.setSessionIndex的方式访问在vuex中的函数。
			mapActions同理*/
			...mapMutations(['setSessionIndex']),
			...mapActions(['getMessage', 'reRangeSession']),
			//发送消息
			sendMessge() {
				//#ifdef APP-PLUS
				//去除回车
				for (let i = 0; i < this.textMsg.length;) {
					if (this.textMsg[i] == '\n') {
						this.textMsg = this.textMsg.substring(0, i) + this.textMsg.substring(i + 1, this.textMsg.length);
						continue;
					}
					i++;
				}
				//#endif
				//#ifdef H5
				this.textMsg = this.textMsg.replaceAll('\n', '');
				//#endif 
				console.log('判断前')
				if (this.textMsg.length > 100) {
					uni.showToast({
						title: '内容不能超过100个字哦~',
						icon: 'none',
						mask: false,
						duration: 1000
					})
				} else {
					console.log('发送服务器前')
					let time = dateUtil.getTimeNow();
					console.log('时间')
					console.log(time)
					console.log(this.index)
					//封装数据
					let outMessage = {
						code: 200,
						type: 'friend-message',
						content:{
							type: 0, //内容类型，文本0-图片1-视频2
							createTime:time,
							content:this.textMsg,
							senderId:this.user.id,
							receiverId:this.sessions[this.index].targetId
						}
					}
					//添加进sessions
					var that = this;
					
					//发送请求前
					console.log('发送请求前')
					
					WebSocket.sendMessage(outMessage);
					//发送请求后
					console.log('发送请求后')
					//重新请求数据
					this.getMessage(outMessage);
					
					this.texted = true;
					this.textMsg = '';
					this.goPageBottom();
					
					//处理强制处理
					this.$forceUpdate();
					// axios({
					// 	methods: 'get',
					// 	url: '/chat/chat/' + this.textMsg
					// }).then(res => {
					// 	console.log("res")
					// 	console.log(res)
					// 	//获取数据成功添加进session
					// 	that.addMessage({
					// 		data: res.data,
					// 		to: 'in',
					// 		time: dateUtil.getTimeNow()
					// 	})
					// }).catch(err => {
					// 	console.log('错误前')
					// 	console.log(err.data)
					// 	console.log('错误后')
					// }).finally(e => {
					// 	console.log('finally')
					// 	//不管成功与否都重置
					// 	that.textMsg = '';
					// 	that.texted = true;
					// 	that.goPageBottom();
					// })

				}
			},
			back(){
				//返回上一级页面
				uni.navigateBack({
					delta: 1,
					success() {
						console.log("返回上一级页面成功")
					},
					fail() {
						console.log("返回上一级页面失败")
					}
				});
			},
			//划到底部
			goPageBottom() {
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 99999999999, //滚动到页面的目标位置（单位px）
					});
				}, 50);
			},
			btwnSeconds(time1, time2) {
				return dateUtil.TimeDifferenceSeconds(time1, time2);
			},
			btwnDays(time1, time2) {
				return dateUtil.TimeDifference(time1, time2);
			},
			getNowTime() {
				return dateUtil.getTimeNow();
			}
		},
	}
</script>

<style>
	page {
		height: 100%;
		background-color: rgba(244, 244, 244, 1);
	}

	.text-show {
		/* padding: 10p;
			display: flex;
			align-items: center;
			word-wrap:break-word; */
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-box-orient: vertical;
	}

	.user-img {
		flex: none;
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
	}

	.chat-time {
		font-size: 24rpx;
		color: rgba(39, 40, 50, 0.3);
		line-height: 34rpx;
		padding: 10rpx 0rpx;
		text-align: center;
	}

	.content {
		height: 100%;
		background-color: rgba(244, 244, 244, 1);
	}

	.chat-main {
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 20rpx;
		// padding-bottom: 120rpx;  //获取动态高度
		display: flex;
		flex-direction: column;
	}

	.message {
		flex: none;
		max-width: 480rpx;
	}

	.msg-text {
		font-size: 32rpx;
		color: rgba(39, 40, 50, 1);
		line-height: 44rpx;
		padding: 18rpx 24rpx;

	}




	.msg-left .msg-text {
		flex-direction: row;
		margin-left: 16rpx;
		background-color: #fff;
		border-radius: 0rpx 20rpx 20rpx 20rpx;
	}

	.msg-left .msg-img {
		flex-direction: row;
		margin-left: 16rpx;
	}

	.msg-right {
		flex-direction: row-reverse;
	}

	.msg-right .msg-text {
		flex-direction: row-reverse;
		margin-right: 16rpx;
		background-color: rgba(85, 170, 255, 0.8);
		border-radius: 20rpx 0rpx 20rpx 20rpx;
	}

	.msg-right .msg-img {
		flex-direction: row-reverse;
		margin-right: 16rpx;
	}

	.chat {
		height: 100%;
	}

	.chat-ls .msg-m {
		display: flex;
		padding: 20rpx 0;
	}

	.chat-ls .msg-img {
		max-width: 400rpx;
		border-radius: 20rpx;
	}


	.emoji-table {
		/*开启弹性布局*/
		display: flex;
		/*wrap：换行，第一行在上方。*/
		flex-wrap: wrap;
		/*居中对齐 每个项目两侧的间隔相等*/
		/* justify-content:space-around; */
		/*或者使用 两端对齐，项目之间的间隔都相等。*/
		justify-content: space-between;
		max-width: 500rpx;
		max-height: 300rpx;
		position: fixed;
		z-index: 10;
		background-color: #f8fff2;
		padding: 5rpx;
		border-radius: 10rpx;
		bottom: 100rpx;
		left: 130rpx;
	}

	.btns {
		display: flex;
	}

	.btn {
		background-color: #55aaff;
		color: white;
		padding: 5rpx;
		font-size: small;
		margin-left: 10rpx;
		border-radius: 10rpx;
	}

	.emoji {
		width: 50rpx;
		height: 50rpx;
		margin: 2rpx;
	}

	.icon {
		width: 80rpx;
		height: 70rpx;
		margin-left: 10rpx;
		margin-top: auto;
		margin-bottom: 14rpx;
	}

	.selecting-image {
		width: 500rpx;
		height: 600rpx;
	}

	.image-table {
		/*开启弹性布局*/
		display: flex;
		/*wrap：换行，第一行在上方。*/
		flex-wrap: wrap;
		/*居中对齐 每个项目两侧的间隔相等*/
		/* justify-content:space-around; */
		/*或者使用 两端对齐，项目之间的间隔都相等。*/
		justify-content: space-between;
		max-width: 400rpx;
		max-height: 500rpx;
		position: fixed;
		z-index: 10;
		background-color: #f8fff2;
		padding: 5rpx;
		border-radius: 10rpx;
		bottom: 100rpx;
		left: 130rpx;
	}

	.footer {
		width: 100%;
		background-color: #E9EDF4;
		display: flex;
		position: fixed;
		bottom: 0;
	}

	.footer .content-wrap {
		width: 78%;
		margin-left: 2%;
	}

	.footer .content {
		width: 100%;
		box-sizing: border-box;
		margin: 14rpx 0;
		background-color: #FFFFFF;
		border-radius: 30rpx;
		padding: 16rpx;
		caret-color: #01B4FE;
		text-align: left;
	}

	.footer .btn-wrap {
		width: 18%;
		margin-right: 5%;
	}

	.footer .btn {
		width: 15%;
		height: 65rpx;
		font-size: 26rpx;
		margin-left: 2%;
		background-color: #01B4FE;
		color: #FFFFFF;
		position: fixed;
		bottom: 14rpx;
		border: 0;
		outline: none;
	}

	.footer .btn-wrap .disabled {
		background-color: #aae8f5;
	}

	/* ----------------------- */
	.content {
		height: 100%;
		background-color: rgba(244, 244, 244, 1);
	}

	.footer {
		width: 100%;
		background-color: #E9EDF4;
		display: flex;
		position: fixed;
		bottom: 0;
	}

	.footer .content-wrap {
		width: 78%;
		margin-left: 2%;
	}

	.footer .content {
		width: 100%;
		box-sizing: border-box;
		margin: 14rpx 0;
		background-color: #FFFFFF;
		border-radius: 30rpx;
		padding: 16rpx;
		caret-color: #01B4FE;
		text-align: left;
		color: #000;
	}

	.footer .btn-wrap {
		width: 18%;
		margin-right: 5%;
	}

	.footer .btn {
		width: 15%;
		height: 65rpx;
		font-size: 26rpx;
		margin-left: 2%;
		background-color: #01B4FE;
		color: #FFF;
		position: fixed;
		bottom: 14rpx;
		border: 0;
		outline: none;
	}

	.footer .btn-wrap .disabled {
		background-color: #aae8f5;
	}
</style>
