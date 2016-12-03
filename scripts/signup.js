$(document).ready(function() {
	$("#returnToSignin").click(function() {
		window.location = "../index.html"
	});

	var EventUtil={
		
	   addHandler:function(element,type,handler){ //添加事件
	      if(element.addEventListener){ 
	         element.addEventListener(type,handler,false);  //使用DOM2级方法添加事件
	      }else if(element.attachEvent){                    //使用IE方法添加事件
	         element.attachEvent("on"+type,handler);
	      }else{
	         element["on"+type]=handler;          //使用DOM0级方法添加事件
	      }
	   },  

	   removeHandler:function(element,type,handler){  //取消事件
	      if(element.removeEventListener){
	         element.removeEventListener(type,handler,false);
	      }else if(element.detachEvent){
	         element.detachEvent("on"+type,handler);
	      }else{
	         element["on"+type]=null;
	      }
	   },

	   getEvent:function(event){  //使用这个方法跨浏览器取得event对象
	      return event?event:window.event;
	   },
		
	   getTarget:function(event){  //返回事件的实际目标
	      return event.target||event.srcElement;
	   },
		
	   preventDefault:function(event){   //阻止事件的默认行为
	      if(event.preventDefault){
	         event.preventDefault(); 
	      }else{
	         event.returnValue=false;
	      }
	   }
			
	};


	EventUtil.addHandler($("#signup"), "submit", function(event) {
		//获取事件对象
		event = EventUtil.getEvent(event);
	});
});