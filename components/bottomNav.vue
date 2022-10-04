<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view slot="gBody" class="grace-body">
			<view style="height:1000px;"></view>
			<!-- 
	            按钮形式的底部演示 实际开发时请放进 gFooter 插槽 
	            去除 bottom 修饰 -->
			<view class="grace-footer grace-space-between" style="bottom:160rpx;">
				<view class="grace-grids" style="width:250rpx;">
					<view class="grace-grids-items grace-grids-items2 grace-relative">
						<text class="grace-grids-icon grace-grids-icon2 grace-icons icon-home"></text>
						<text class="grace-grids-text grace-grids-text2">首页</text>
					</view>
					<view class="grace-grids-items grace-grids-items2 grace-relative">
						<text class="grace-grids-icon grace-grids-icon2 grace-icons icon-shoucang"></text>
						<text class="grace-grids-text grace-grids-text2">收藏</text>
					</view>
				</view>
				<view class="grace-flex-end" style="width:460rpx;">
					<button type="warn" class="grace-footer-button" style="background:#E55D52;">立即购买</button>
					<button type="warn" class="grace-footer-button" style="background:#F37B1D;">加入购物车</button>
				</view>
			</view>
			<!-- 
	            如果您使用了底部导航需要在页面上加一个和底部等高的 view 
	            以免底部导航遮住页面主体 
	            -->
			<view style="width:100%; height:150rpx;"></view>
		</view>
		<!-- 底部导航 -->
		<view class="grace-footer grace-grids grace-nowrap" slot="gFooter">
			<view class="grace-grids-items grace-relative" v-for="(item, index) in footerItems" :key="index"
				@tap="changeFooter(index)">
				<text class="grace-grids-icon grace-icons"
					:class="[item[0], footerCurrent == index ? 'grace-footer-active' : '']"></text>
				<text class="grace-grids-text"
					:class="[footerCurrent == index ? 'grace-footer-active' : '']">{{item[1]}}</text>
				<view class="grace-badge grace-bg-red grace-badge-absolute grace-white" v-if="item[2] > 0"
					style="top:15rpx; right:15rpx;">8</view>
			</view>
		</view>
	</gracePage>
</template>

<script>
	import gracePage from '../graceUI/components/gracePage.vue';

	export default {
		name: "bottom_nav",
		data() {
			return {
				footerCurrent: 1,
				footerItems: [
					//数据格式
					// 图标样式 名称 消息数量
					['icon-wifi', 'wifi', 2],
					['icon-weibo', '微博', 0],
					['icon-weixin', '微信', 0],
					['icon-qq', 'QQ', 0],
					['icon-help1', '帮助', 0]
				]
			};
		},
		methods: {
			changeFooter: function(index) {
				this.footerCurrent = index;
			}
		},
		components: {
			gracePage
		}
	}
</script>

<style>
	/* 调整宫格大小 */
	.grace-grids-items {
		width: 150rpx;
	}

	.grace-grids-icon {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 50rpx;
		color: #6B7375;
	}

	.grace-grids-text {
		line-height: 30rpx;
		font-size: 20rpx;
		margin-top: 2px;
		color: #6B7375;
	}

	.grace-footer-active {
		color: #3688FF !important;
	}

	.grace-grids-items2 {
		padding: 6rpx 0;
		width: 120rpx;
	}

	.grace-grids-icon2 {
		height: 50rpx;
		line-height: 50rpx;
		font-size: 40rpx;
		color: #6B7375;
	}

	.grace-grids-text2 {
		line-height: 28rpx;
		font-size: 20rpx;
		margin-top: 2px;
		color: #6B7375;
	}
</style>
