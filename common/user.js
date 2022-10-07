import request from './chatApi.js';

/**
 *   登录 获取token
 */
export function login(data) {
	return request({
		url: '/login',
		method: 'POST',
		data,
	});
}

/**
 * 获取用户基本信息
 */
export function getUserInfo(data) {
	return request({
		url: '/user/getUserInfo/' + data.userId,
		method: 'GET',
	});
}

/**
 * 更新用户基本信息
 */
export function updateUserInfo(data) {
	return request({
		url: '/user/updateUserInfo',
		method: 'POST',
		data,
	});
}

/**
 * 获取好友列表
 */
export function getFriendList(data) {
	console.log("data")
	console.log(data)
	return request({
		url: '/friends/getFriendList',
		method: 'POST',
		data,
	});
}

/**
 * 获取所有聊天记录
 */
export function listFriendMessage(data) {
	return request({
		url: '/friends/listFriendMessage',
		method: 'POST',
		data,
	});
}

/**
 * 注册新用户
 */
export function register(data) {
	return request({
		url: '/register',
		method: 'POST',
		data,
	});
}


/**
 * 查找用户
 */
export function findUser(data) {
	return request({
		url: '/user/findUser',
		method: 'POST',
		data,
	});
}

/**
 * 根据用户id查找用户具体信息
 */
export function findUserById(data) {
	return request({
		url: '/findUserById',
		method: 'POST',
		data,
	});
}

/**
 * 获取会话列表信息
 */
export function getSessionList(data) {
	return request({
		url: '/sessions/list/' + data,
		method: 'GET'
	});
}

/**
 *搜群
 */
// export function findGroup(data) {
//   return request({
//     url: '/findGroup',
//     method: 'POST',
//     data,
//   });
// }
/**
 * 根据创建群聊
 */
// export function createGroup(data) {
//   return request({
//     url: '/createGroup',
//     method: 'POST',
//     data,
//   });
// }

/**
 * 根据用户查找群聊
 */
// export function getGroup(data) {
//   return request({
//     url: '/getGroup',
//     method: 'POST',
//     data,
//   });
// }


/**
 * 查找群用户
 */
// export function getMember(data) {
//   return request({
//     url: '/getMember',
//     method: 'POST',
//     data,
//   });
// }

/**
 * 更新群信息
 */
// export function updateGroup(data){
// 	return request({
// 	  url: '/updateGroup',
// 	  method: 'POST',
// 	  data,
// 	});
// }

/**
 * 上传说说
 */
// export function postBlog(data){
// 	return request({
// 	  url: '/blog/deliver',
// 	  method: 'POST',
// 	  data,
// 	});
// }

/**
 * 获取说说
 */
// export function getBlog(data){
// 	return request({
// 	  url: '/blog/get',
// 	  method: 'POST',
// 	  data,
// 	});
// }
/**
 * 获取说说
 */
// export function getBlogById(data){
// 	return request({
// 	  url: '/blog/getOne',
// 	  method: 'POST',
// 	  data,
// 	});
// }
//给说说点赞
// export function likeBlog(data){
// 	return request({
// 	  url: '/blog/like',
// 	  method: 'POST',
// 	  data,
// 	});
// }

//获取说说的点赞详情
// export function getLikes(data){
// 	return request({
// 	  url: '/blog/getLikes',
// 	  method: 'POST',
// 	  data,
// 	});
// }
//给说说评论
// export function commentBlog(data){
// 	return request({
// 	  url: '/blog/comment',
// 	  method: 'POST',
// 	  data,
// 	});
// }

//获取说说的评论
// export function getComments(data){
// 	return request({
// 	  url: '/blog/getComments',
// 	  method: 'POST',
// 	  data,
// 	});
// }

//删除说说
// export function deleteBlog(data){
// 	return request({
// 	  url: '/blog/delete',
// 	  method: 'POST',
// 	  data,
// 	});
// }

//删除评论
// export function deleteComment(data){
// 	return request({
// 	  url: '/blog/deleteComment',
// 	  method: 'POST',
// 	  data,
// 	});
// }

//获取说说详情

// export function getDetail(data){
// 	return request({
// 	  url: '/blog/getDetail',
// 	  method: 'POST',
// 	  data,
// 	});
// }
