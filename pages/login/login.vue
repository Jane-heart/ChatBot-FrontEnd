<template>
	<view class="nvue-page-root">
		<view class="page-title">
			<view class="page-title__wrapper">
				<text class="page-title__text">ChatBot登录</text>
			</view>
		</view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="" style="padding-left: 26rpx;"><text class="uni-form-item__title">国家/地区</text></view>
				<view class="uni-input-wrapper" style="justify-content: flex-start;">
					<text class="uni-form-item__title" style="color:#55aaff;font-weight: bold;">中国大陆</text>
				</view>
			</view>
			<view class="uni-form-item uni-column border">
				<view class="title"><text class="uni-form-item__title">账号</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="text" confirm-type="done" v-model="phone" placeholder="请输入您的登录账号" />
				</view>
			</view>
			<view class="uni-form-item uni-column border">
				<view class="title"><text class="uni-form-item__title">密码</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="text" v-model="password" placeholder="请输入您的密码"
						:password="showPassword" />
					<text class="uni-icon" :class="[!showPassword ? 'uni-eye-active' : '']"
						@click="changePassword">👁</text>
				</view>
			</view>
		</view>
		<view class="button">
			<view class="submit" @click="submit()">
				<text class="submit-text">登录</text>
			</view>
		</view>
		<view class="footer">
			<text class="footer-text">找回密码</text>
			<text @tap="toRegister()" class="footer-text">账号注册</text>
			<text class="footer-text">投诉建议</text>
		</view>
	</view>
</template>

<script>
	import WebSocket from '@/common/websocket.js';
	import {
		login,
		getUserInfo
	} from '@/common/user.js';
	import {
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				phone: '',
				password: '',
				showPassword: true,
			}
		},
		onLoad() {

		},
		methods: {
			...mapActions(['setUserInfo', 'setAndStoreToken']),
			changePassword: function() {
				this.showPassword = !this.showPassword;
			},
			async submit() {
				uni.hideKeyboard();
				if (!this.phone || !this.password) {
					uni.showToast({
						title: "请输入账号和密码",
						icon: 'none',
						duration: 2000
					})
					return;
				}
				uni.showLoading({
					title: '登录中...'
				})
				const res = await login({
					phone: this.phone,
					password: this.password,
					verificationCode: "aaa"
				})
				// .then(res => {
				// 	console.log("登录信息：")
				// 	console.log(res)
					
				// }).catch(err => {
				// 	console.log("登陆失败")
				// });
				console.log("登录信息：")
				console.log(res)
				//    this.setAndStoreToken(res.token);
				await this.setUserInfo(res.data);
				uni.switchTab({
					url: '../index/index'
				})
				console.log("进入ws")
				WebSocket.connectSocketInit();
			},
			toRegister: function() {
				uni.navigateTo({
					url: '../register/register'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.nvue-page-root {
		background-color: #fffffe;
		padding-bottom: 40rpx;
	}

	.page-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 35rpx;
	}

	.page-title__wrapper {
		/* padding: 30rpx 26rpx; */
		padding: 0rpx 50rpx 40rpx 50rpx;
	}

	.page-title__text {
		font-size: 58rpx;
		height: 96rpx;
		line-height: 96rpx;
		font-weight: bold;
		color: black;
	}

	.title {
		padding: 10rpx 26rpx 10rpx 26rpx;
		flex: 1
	}

	.border {
		border-bottom-width: 1px;
		border-bottom-color: #ededed;
	}

	.uni-common-mt {
		padding: 0rpx 26rpx 0rpx 26rpx;

	}

	.uni-form-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20rpx 0rpx 20rpx 0rpx;
	}

	.uni-form-item__title {
		font-size: 32rpx;
		line-height: 48rpx;
	}

	.uni-input-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		padding: 16rpx 26rpx;
		border-radius: 10rpx;
		flex-direction: row;
		flex-wrap: nowrap;
		/* background-color: #FFFFFF; */
		flex: 4
	}

	.uni-input {
		height: 56rpx;
		line-height: 56rpx;
		font-size: 30rpx;
		padding: 0px;
		flex: 1;
		/*  background-color: #FFFFFF; */
	}

	.uni-icon {
		font-family: uniicons;
		font-size: 48rpx;
		font-weight: normal;
		font-style: normal;
		width: 48rpx;
		height: 48rpx;
		line-height: 48rpx;
		color: #999999;
	}

	.uni-eye-active {
		color: #007AFF;
	}

	.button {
		margin-top: 40rpx;
		justify-content: center;
		text-align: center;
		height: 100rpx;
		padding: 10rpx;
	}

	.submit {
		display: flex;
		margin-left: 20rpx;
		margin-right: 20rpx;
		height: 100%;
		// width: 100%;
		text-align: center;
		// width: 700rpx;
		background-color: #55aaff;
		justify-content: center;
		align-items: center;
		border-radius: 10rpx;
	}

	.submit-text {
		color: white;
		// padding: 30rpx;
	}

	.submit:active {
		background-color: green;
		opacity: 0.5;
	}

	.footer {
		flex-direction: row;
		justify-content: center;
		text-align: center;
		align-items: center;
		margin-top: 100rpx;
	}

	.footer-text {
		font-size: 28rpx;
		color: #296db5;
		padding: 30rpx;
	}
</style>
