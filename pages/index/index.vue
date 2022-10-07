<template>
	<view>
		<!-- 顶部导航栏 -->
		<view class="box-bg">
			<uni-nav-bar shadow fixed="true" right-icon="plus" title="ChatBot" @clickRight="showDetail" />
		</view>
		<view v-for="(session,index) in this.sessions" :key="session.id">
			<uni-card :title="session.targetName" padding="0px" :border="false" :sub-title="session.content"
				:is-full="true" :extra="updateTime(session.lastTime)" :thumbnail="session.targetUrl"
				@click="()=>enterChat(session,index)">
			</uni-card>
			<!-- 	<uni-card title="基础卡片" padding="0px" :border="false" sub-title="副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题" :is-full="true" extra="额外信息" :thumbnail="avatar" @click="enterChat(i)">
			</uni-card> -->
		</view>
	</view>
</template>

<script>
	// import bottomNav from '../../components/bottomNav.vue'
	import cuCustom from '../../colorui/components/cu-custom.vue'
	import topNav from '../../components/topNav.vue'
	import sendMessage from '../../components/sendMessage.vue'
	import uniCard from '../../uni_modules/uni-card/components/uni-card/uni-card.vue'
	import {
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex';
	import dateUtil from '@/util/date.js'
	export default {
		data() {
			return {
				avatar: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png',
			}
		},
		components: {
			uniCard
		},
		computed: {
			//这里可以通过这种方式引用相应模块的state数据，其中sessions是变量名。在代码的其他部分可以使用this.sessions访问数据
			...mapGetters(['user', 'sessions', 'sessionIndex']),
		},
		onShow() {
			//每次展示界面时加载一次会话信息
			this.getNewSessionList()
		},
		onLoad() {
			//加载会话，正确的
			console.log("加载会话")
			console.log(this.sessions)
			console.log(this.sessionIndex)
			console.log(this.user)
			//每次刷新界面时加载一次会话信息
			// this.getNewSessionList()
			// this.find(2)
			// this.find(3)
		},
		onPullDownRefresh() { //开启下拉刷新的生命周期函数
			//每次刷新界面时加载一次会话信息
			this.getNewSessionList()
			setTimeout(function() {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
			}, 1000);
		},
		methods: {
			/*这里是导入模块的actions，其中setSessionIndex是我们在mutations中定义的。
			注意，中括号是必须的。当要导入多个的时候可以在中括号中添加，以数组的形式传给mapMutations。
			在代码中我们就可以this.setSessionIndex的方式访问在vuex中的函数。
			mapActions同理*/
			...mapMutations(['setSessionIndex']),
			...mapActions(['addMessage', 'reRangeSession', 'getNewSessionList']),
			showDetail() {
				console.log("on showDetail...")
			},
			enterChat(e, index) {
				console.log("on enterChat...")
				console.log(e) //默认传的是title，需要自己指定传入的东西
				console.log(index) //默认传的是title，需要自己指定传入的东西
				var userId = e.targetId
				var friendName = e.targetName
				var url = '/pages/chat/chat?userId=' + userId + '&friendName=' + friendName + '&currentIndex=' + index;
				console.log(url)
				//在起始页面跳转到chat.vue页面并传递参数
				uni.navigateTo({
					url,
					success() {
						console.log("跳转成功")
					},
					fail() {
						console.log("跳转失败")
					}
				});
			},
			updateTime(time) {
				return dateUtil.updateTimeShow(time)
			}
		}
	}
</script>

<style>
	page {
		width: 100%;
		height: 100%;
	}

	uni-card {
		/* 文本强制不换行； */
		white-space: nowrap;
		/* 文本溢出显示省略号； */
		text-overflow: ellipsis;
		/* 溢出的部分隐藏； */
		overflow: hidden;
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
