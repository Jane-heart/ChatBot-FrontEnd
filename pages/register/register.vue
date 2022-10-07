<template>
	<view class="nvue-page-root">

		<view class="upload">

			<!-- <text class="upload-box-text">默认头像(注册后可上传自定义头像)</text> -->
			<image class="upload-image-box"  src="https://s2.loli.net/2022/05/04/gWjFMmZxJIbsz7G.png" mode="aspectFill"></image>
		</view>
		<text  class="warn">默认头像(注册后可上传自定义头像)</text>
		<view class="uni-common-mt"> 

			<view class="uni-form-item uni-column border">
				<view class="title"><text class="uni-form-item__title">昵称</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="text" v-model="nickname" placeholder="请输入您的昵称" />
				</view>
			</view>
			<text class="warn">账号是您唯一认定的登录账号,不可更改！</text>
			<view class="uni-form-item uni-column border">
				<view class="title"><text class="uni-form-item__title">账号</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="text" v-model="username" placeholder="请输入您的登录账号" />
				</view>
			</view>
			<view class="uni-form-item uni-column border">
				<view class="title"><text class="uni-form-item__title">密码</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="text" v-model="password" placeholder="请输入您的密码" :password="showPassword" />
					<text class="uni-icon" :class="[!showPassword ? 'uni-eye-active' : '']" @click="changePassword">👁</text>
				</view>
			</view>
			<view class="service">
				<checkbox-group @change="checkboxChange">
					<checkbox value="service" color="#29c160" :checked="false" />
				</checkbox-group>

				<view class="service-text-box">
					<text class="service-text">勾选代表同意本软件的</text><text @click="serviceBox" class="service-text" style="color: #2979FF;">版权协议及服务协议</text>
				</view>
			</view> 
		</view>
		<view class="button" @click="submit()">
			<view class="submit">
				<text class="submit-text">注册</text>
			</view>
		</view>
	</view>
</template>
<script>
	import { login,getUserInfo } from '@/common/user.js';
	export default {
		data() {
			return {
				username: '',
				password: '',
				showPassword: true,
				nickname: '',
				service:false,
				// isSubmit:false,
			}
		},
		methods: {
			 async submit() {
				if (!this.username || !this.password || !this.nickname) {
					uni.showToast({
						title: "请输入账号、密码、昵称",
						icon: 'none',
						duration: 2000
					})
					return;
				} 
				
				if (!this.service) {
					uni.showToast({
						title: "请阅读服务协议并确认勾选",
						icon: 'none',
						duration: 2000
					})
					return;
				}
				
				const { content: res } = await register({
				  loginId:this.username,
				  nickname:this.nickname,
				  password:this.password
				});
				
				uni.showToast({
					title:'注册成功！',
					icon:'success',
					duration:1000
				})
				
			},
			
			checkboxChange: function(e) {
				let values = e.detail.value;
				if (values.includes('service')) {
					this.service = true;
				}else{
					this.service = false;
				}
			},
			serviceBox: function() {
				uni.showModal({
					showCancel: false,
					content: '此项目仅供技术学习交流使用，禁止将其用于违法犯罪活动，如作它用所承受的法律责任一概与作者无关'
				});
			},
			changePassword: function() {
				this.showPassword = !this.showPassword;
			},
		},
	}
</script>

<style scoped>
	.warn{
		margin-left: 100rpx;
		font-size: smaller;
		color: #ff0000;
	}
	.nvue-page-root {
		background-color: #fffffe;
		padding-bottom: 40rpx;
	}

	.upload {
	
		flex-direction: row;
		justify-content: center;
		padding: 35rpx;
	}

	.upload-box {
		height: 160rpx;
		width: 160rpx;
		border-radius: 10rpx;
		background-color: #ededed;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.upload-image-box {
		height: 160rpx;
		width: 160rpx;
		border-radius: 10rpx;
	}

	.upload-box-icon {}

	.upload-box-text {
		font-size: 28rpx;
		padding: 10rpx;

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

	.service {
		flex-direction: row;
		padding: 66rpx 26rpx 26rpx 26rpx;
		justify-content: center;
		align-items: center;
		text-align: center;
	} 
	.service-text {
		font-size: 28rpx;
	}
	.service-text-box {
		flex-direction: row;
		flex: 5
	}
	.button{
		margin-top: 40rpx;
		justify-content: center;
		align-items: center
	}
	.submit{
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
	.submit-text{
		color: white;
		padding: 30rpx;
	}
	.submit:active {
		background-color: green;
		opacity: 0.5;
	}
</style>
