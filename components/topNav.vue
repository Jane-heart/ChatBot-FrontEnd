<!-- 自定义导航栏样式来源：https://uniapp.dcloud.net.cn/component/uniui/uni-nav-bar.html -->
<template>
	<view class="box-bg">
		<uni-nav-bar shadow fixed="true" left-icon="left" right-icon="cart" title="标题" @clickLeft="back" @clickRight="showDetail" />
	</view>
</template>

<script>
	export default {
		name: "topNav",
		data() {
			return {

			};
		},
		methods: {
			back() {
				console.log('back')
				uni.navigateBack({
					delta: 1
				})
			},
			showDetail() {
				console.log('showDetail')
			},
		}
	}
</script>

<style lang="scss">
$nav-height: 30px;

	.box-bg {
		background-color: #F5F5F5;
		padding: 5px 0;
	}
</style>
