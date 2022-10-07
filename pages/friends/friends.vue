<template>
	<view>
		<!-- 顶部导航栏 -->
		<view class="box-bg">
			<uni-nav-bar shadow fixed="true" right-icon="plus" title="好友列表" @clickRight="showDetail" />
		</view>
		<view v-for="i in 20" :key="i">
			<uni-card title="好友列表" padding="0px" :is-full="true" :thumbnail="avatar" @click="enterChat(i)">
			</uni-card>
		</view>
	</view>
</template>

<script>
		import uniCard from '../../uni_modules/uni-card/components/uni-card/uni-card.vue'
	export default {
		data() {
			return {
				avatar: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png',
			}
		},
		components: {
			uniCard
		},
		methods: {
			showDetail() {
				console.log("on showDetail...")
			},
			enterChat(e) {
				console.log("on enterChat...")
				console.log(e) //默认传的是title，需要自己指定传入的东西
			},
		}
	}
</script>

<style>

</style>
