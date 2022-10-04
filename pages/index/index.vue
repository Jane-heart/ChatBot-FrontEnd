<template>

	<!-- <bottom-nav></bottom-nav> -->
	<!-- <view>
		<view class="header">头部</view>
		<view class="container">
			<scroll-view class="scrool-more" style="height: 100%" scroll-y="true" scroll-with-animation="true">
				<view lass="list" v-for="(item,index) in list" :key="index">
					{{item.cont}}
				</view>
			</scroll-view>
		</view>

		<view class="footer">
			<button type="primary">提交</button>
		</view> -->
	<view>
<!-- 		<top-nav></top-nav>
		<send-message></send-message> -->
	</view>
</template>

<script>
	// import bottomNav from '../../components/bottomNav.vue'
	import cuCustom from '../../colorui/components/cu-custom.vue'
	import topNav from '../../components/topNav.vue'
	import sendMessage from '../../components/sendMessage.vue'
	export default {
		data() {
			return {
				list: [{
						cont: "张三"
					},
					{
						cont: "张三"
					}
				]
			}
		},
		components: {
			// bottomNav
			cuCustom,
			topNav,
			sendMessage,
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	page {
		width: 100%;
		height: 100%;
	}


	.scrool-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.header {
		width: 100%;
		height: 110rpx;
		line-height: 100rpx;
		text-align: center;
		background: red;
	}

	.container {
		flex: 1;
		position: relative;

		.scrool-more {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}

		.list {
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: #e0e0e0;

		}
	}


	.footer {
		color: #fff;
		line-height: 100rpx;
		flex: 0 0 100rpx;
		/* 不放大不缩小固定100rpx */
	}
</style>
