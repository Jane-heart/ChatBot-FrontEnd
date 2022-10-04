<template>
	<!-- <view class="text-box" scroll-y="true">
		<text v-model="text">{{text}}</text>
	</view> -->
	<!-- <view class="cu-bar search bg-white" style="position: fixed;left: 0;bottom: 0;width: 100%;z-index: 9999;" >
		<view class="search-form">
			<input :adjust-position="true" type="text" placeholder=" 请输入信息"  v-model="my_say_text"></input>
			<button @click="to_send" type="primary" style="height: 64upx;line-height: 64upx;margin-left: 16upx;background: #FF5959;">发送</button>
		</view>
	</view> -->
	<view class="footer" ref="footer" id="footer">
		<view class="content-wrap">
			<textarea class="content" @keyup.enter="sendMessge()" v-model="textMsg" maxlength="-1" auto-height />
		</view>
		<view class="btn-wrap">
			<button class="btn" :disabled="disable" :class="{'disabled': disable}" @tap="sendMessge()">发送</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: "sendMessage",
		data() {
			return {
				// text: 'hello',
				textMsg: '',
				disable: true, //控制发送键能够按下
			};
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
		methods: {
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
				if (this.showEmoji) {
					this.turnEmojiShow();
				}
				if (this.showImage) {
					this.imageCancel();
				}
				if (this.textMsg.length > 100) {
					uni.showToast({
						title: '内容不能超过100个字哦~',
						icon: 'none',
						mask: false,
						duration: 1000
					})
				} else {
					let time = dateUtil.getTimeNow();
					//先发往服务器
					let outMessage = {
						type: 'person_message',
						to: this.sessions[this.index].id, //发给谁呢
						msgType: 'text', //消息类型
						time: time,
						content: this.textMsg,
						from: this.user.id
					}

					let success = WebSocket.sendMessage(outMessage);

					if (success) {
						let message = {
							index: this.index,
							content: this.textMsg,
							type: 'text',
							time: time
						}
						this.sendMessageOut(message);
						this.textMsg = '';
						this.texted = true;
						this.goPageBottom();
					}
				}
			}
		},
	}
</script>

<style>
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
