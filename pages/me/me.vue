<template>
	<view>
		<view>
			<uni-card title="基础卡片" sub-title="副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题" extra="额外信息" :thumbnail="avatar" @click="enterChat(i)">
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
			enterChat(e) {
				console.log("on enterChat...")
				console.log(e) //默认传的是title，需要自己指定传入的东西
			},
		}
	}
</script>

<style>

</style>
