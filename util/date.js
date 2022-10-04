// const myDate = new Date();
export default {
	getTimeNow(){ 
		 let myDate = new Date();
		 let year = myDate.getFullYear();   //获取系统的年；
		 let nowMonth = myDate.getMonth() + 1;
		 let strDate = myDate.getDate(); // 获取系统日，
		 let hour = myDate.getHours(); //获取系统时，
		 let minute = myDate.getMinutes(); //分
		 let second = myDate.getSeconds(); //秒
		 nowMonth = nowMonth<10?'0' + nowMonth:nowMonth;
		 strDate = strDate < 10? '0' +strDate:strDate;
		 hour = hour < 10? '0' +hour:hour;
		 minute = minute < 10? '0' +minute:minute;
		 second = second < 10? '0' +second:second;
		 return year + '-' + nowMonth + '-' + strDate + ' ' + hour + ':' + minute+":"+second;
	},
	
	TimeDifference(time1, time2) {
	   //定义两个变量time1,time2分别保存开始和结束时间
	    var stime =new Date(time1.substring(0,10)).getTime();
	    var etime = new Date(time2.substring(0,10)).getTime();
	    var usedTime = etime - stime;  //两个时间戳相差的毫秒数
	    return Math.floor(usedTime / (24 * 3600 * 1000))
	},
	
	//间隔秒数
	TimeDifferenceSeconds(time1, time2){
		//定义两个变量time1,time2分别保存开始和结束时间
		    var stime =new Date(time1).getTime();
		    var etime = new Date(time2).getTime();
		    var usedTime = etime - stime;  //两个时间戳相差的毫秒数
		    return Math.floor(usedTime/1000)
	}
	
	
}