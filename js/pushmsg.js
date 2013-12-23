if(localStorage["is_reg_push"]==undefined || localStorage["is_reg_push"]==''){
	localStorage["is_reg_push"]=false;//是否已在google play或apple store 註冊
}
if(localStorage["not_read_count"]==undefined || localStorage["not_read_count"]==''){
	localStorage["not_read_count"]=0;//未讀的數量
}
if(localStorage['pushmsg_data']==undefined) localStorage['pushmsg_data']='';//已儲存
if(localStorage['pushmsg_tmp']==undefined) localStorage['pushmsg_tmp']='';//末顯示儲存的
if(localStorage['pushmsg_bugnum']==undefined) localStorage['pushmsg_bugnum']='';

var cid="21";
var pid="167";
var pushNotification;

//推播設定開始
function push_start()
{
	try 
    { 
		pushNotification = window.plugins.pushNotification;
		if(device.platform == 'android' || device.platform == 'Android') {
		    //localStorage["appname"]
			pushNotification.register(successHandler, errorHandler, {"senderID":"754846154787","ecb":"onNotificationGCM"});                // required!
		} else {
			pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});        // required!
		}
	}
    catch(err) 
    { 
            txt="有一個錯誤 \n\n";//"There was an error on this page.\n\n"; 
            txt+=err.message;//"Error description: " + err.message + "\n\n"; 
            RMC.alert(txt,"推播錯誤提示","確認");
    } 
}

function tokenHandler (result) {
	localStorage["is_reg_push"]=true;
}

function successHandler (result) {
	localStorage["is_reg_push"]=true;
}

function errorHandler (error) {
    RMC.alert(error,"推播錯誤提示","確認");
}

//handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
         $("#pushul").append('<li>push-notification: ' + e.alert + '</li>');
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
	switch( e.event )
	{
		case 'registered':
			if ( e.regid.length > 0 )
			{
				var url="http://www.app4u.tw/sendpush/reice_regid";
				$.post(url,{regid:e.regid,cid:cid,pid:pid},function(data){
					if(data.status=='y' || data.status=='n3'){
						localStorage["is_reg_push"]=true;
					}//alert(data.status);
				},"json");
			}
		break;

		case 'message':
			var msg='<li>'+e.payload.message+'</li>';
			if (e.foreground)
			{
				//執行中
				//$("#pushul").append('<li>--INLINE NOTIFICATION--' + '</li>');
				//alert('fg');
				// if the notification contains a soundname, play it.
				if(msg!=localStorage['pushmsg_bugnum']){
					var aid = RMC._NOWID//$.mobile.activePage.attr("id");
					//alert(aid);
					if(aid=='pushmsg'){
						//直撫更新資料
						$('#pushmsgul').prepend(msg);//alert(msg);
						//$('#pushmsgul').listview('refresh');
						//寫入暫存
						localStorage['pushmsg_data']=$('#pushmsgcc').html();
						//alert('o
						//alert($('#pushmsgcc').html());
					}else{
						//寫入未更新之暫存
						localStorage['pushmsg_tmp']=msg+localStorage['pushmsg_tmp'];
						localStorage["not_read_count"]++;
						
						if(aid=='main'){
							$('#pushmsgcount').html(localStorage["not_read_count"]);
							$('#pushmsgcount').css('display','');
						}
					}
				}
				localStorage['pushmsg_bugnum']=msg;
				
				var my_media = new Media("/android_asset/www/"+e.soundname);
				my_media.play();
			}
			else
			{        // otherwise we were launched because the user touched a notification in the notification tray.
				if(e.coldstart){
					//alert('cn');
					//未執行
					//寫入未更新之暫存
					if(localStorage['pushmsg_bugnum']!=msg){
						localStorage['pushmsg_tmp']=msg+localStorage['pushmsg_tmp'];
						localStorage["not_read_count"]++;
					}
					localStorage['pushmsg_bugnum']=msg;
					
					//$("#pushul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
					//alert(localStorage['pushmsg_tmp']);
				}else{
					//執行中在背景
					//alert('br');
					//寫入未更新之暫存
					//localStorage['pushmsg_tmp']=msg+localStorage['pushmsg_tmp'];
					//localStorage["not_read_count"]++;
					if(localStorage['pushmsg_bugnum']!=msg){
						localStorage['pushmsg_tmp']=msg+localStorage['pushmsg_tmp'];
						localStorage["not_read_count"]++;
					}
					localStorage['pushmsg_bugnum']=msg;
					
					/*if(localStorage['pushmsg_bugnum']==''){
						localStorage['pushmsg_bugnum']=msg;
						localStorage['pushmsg_tmp']=msg+localStorage['pushmsg_tmp'];
						localStorage["not_read_count"]++;
					}else{
						if(msg!=localStorage['pushmsg_bugnum']){
							localStorage['pushmsg_tmp']=msg+localStorage['pushmsg_tmp'];
							localStorage["not_read_count"]++;
						}else localStorage['pushmsg_bugnum']=''; 
					}*/
					
					
					//alert(localStorage['pushmsg_tmp']);
					
					//$("#pushul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
				}
			}
			/**var aid = $.mobile.activePage.attr("id");
			if(aid=='paeg1' || aid="pushmsg"){
				localStorage['pushmsg_page']='<li >'+localStorage['pushmsg']+'</li>'+localStorage['pushmsg_page'];
				$('#pushul')
				//$('#pushul').append();
			}else{
				if(localStorage["pushmsg"]=='') localStorage["pushmsg"]=e.playload.message;
			}
			else localStorage["pushmsg"] +='|!|'+e.playload.message;*/
						
			//localStorage["pushmsg"].push(e.payload.message);
			//$("#pushul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
			//$("#pushul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
			break;
	
		case 'error':
			//$("#pushul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
			break;
		default:
			//$("#pushul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
			break;
	}
}

