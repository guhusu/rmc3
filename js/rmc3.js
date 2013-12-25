/*
 * name:	RMC
 * author:	guhusu
 * email:	guhusu@gmail.com
 * version:	3
 * description:開發對於cordoav執行的framework
 * 更新紀錄:
 * */
String.prototype.ReplaceAll = function (AFindText,ARepText)
{
  raRegExp = new RegExp(AFindText,"g");
  return this.replace(raRegExp,ARepText);
};
var RMC={
		_SH:0,//視窗寬度
		_SW:0,//視窗高度
		_NOWID:'',//現在使用的ID
		_PAGE_STORE:[],//頁的紀錄
		_CORDOVA_STATUS:false,//cordova status
		_PAGE_EVENT:{'hidebefore':{},'hide':{},'showbefore':{},'show':{}},//事件 
		_RUNING:false,//動畫移動中
		_TMP:'',//暫存
		init:function(fun){
			this._TMP=fun;
		},
		create:function(){
			RMC._SW=$(window).width();
			RMC._SH=$(window).height();
			var HP=false;//header position
			var FP=false;//footer position
			var i=0;
			var hash=window.location.hash;
			//設定overlay
			$('#pageoverlay').css({position:'absolute','z-index':'99','display':'none',width:RMC._SW+'px',height:RMC._SH+'px','overflow':'hidden'});
			//設定page
			$('.page').each(function(){
				var CH=RMC._SH;
				var chf=false;
				++i;
				//$(this).addClass("display-none");
				//$(this).attr('class','page display-none');
				$(this).css({'width':RMC._SW+'px','height':RMC._SH+'px','overflow':'hidden'});
				
				var content=$(this).find('.content');
				var header=$(this).find('.header');
				var footer=$(this).find('.footer');
				//HP=header.attr('data-position');
				if(header){
					HP=$(header).outerHeight(true);//alert('id='+this.id+' h='+HP);
					CH -=HP;
					chf=true;
				}
				//alert(footer.html());
				//for(var x in footer){
					//alert(x+' = '+footer[x]);
				//}
				if(footer.length>0){
					FP=footer.outerHeight(true);
					CH -=FP;
					//content.css('margin-bottom',FP+'px');
					FP=RMC._SH-FP;
					chf=true;
				}
				if(chf){
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}else{
					//上下頁面時使用
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}
				$(this).attr('class','page display-none');
				if(hash=='' && i==1) {
					RMC._NOWID=this.id;
					RMC._PAGE_STORE.push(this.id);
				}
			});
			if(hash!='')
			{
				RMC._NOWID=hash;
				RMC._PAGE_STORE.push(hash);
			}
			$('#'+RMC._NOWID).attr('class','page');
			//設定事件
			$('[tap]').each(function(){
				$(this).swipe( {
		            tap:function(event, target) {
		            	eval($(this).attr('tap'));
		            },
		            threshold:50
		          });
			});
			
			//設定down-list
			//var mar=RMC._SH-200;
			//$('.down-list').css({'padding-top':mar+'px'});
			//mar=RMC._SW-10;
			//$('.down-list .sel').css('width',mar+'px');
			
			RMC.runCordova();
			//專換上方位置
			var ww=this._SW-146;
			$('.header-nameb').each(function(){
				$(this).css('width',ww+'px');
			});
		},
		changePage:function(id){RMC.changepage(id);},
		//初始頁說定
		initload:function(){
			
		},
		changepage:function(id){
			if(!RMC._RUNING){
				RMC._RUNING=true;
				//隱藏前
				if(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]!=undefined){
					eval(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]+"();");
				}
				//顯示前
				if(RMC._PAGE_EVENT['showbefore'][id]!=undefined){
	                eval(RMC._PAGE_EVENT['showbefore'][id]+"();");
				}
				window.location.hash=id;
				this._PAGE_STORE.push(id);
				var hide_id=RMC._NOWID;
				var tmp='#'+RMC._NOWID;
				//$('#'+RMC._NOWID).attr('class','page display-none');
				$(tmp).attr('class','page');
				RMC._NOWID=id;
				//var nc=$('#'+id).attr('data-css');alert(nc);
				$('#'+id).attr('class','page-show slideInRight');
				setTimeout(function(){
					RMC._RUNING=false;
					//alert(id);
					//alert($('#'+id).outerWidth(true));
					//alert($('body').outerWidth(true));
					$('#'+id).attr('class','page'); 
					$(tmp).attr('class','page display-none');
					//顯示後
					if(RMC._PAGE_EVENT['show'][id]!=undefined){
	                    //alert(RMC._PAGE_EVENT['show'][id]);
	                    eval(RMC._PAGE_EVENT['show'][id]+"();");
					}
					//隱藏後
					if(RMC._PAGE_EVENT['hide'][hide_id]!=undefined){
	                    eval(RMC._PAGE_EVENT['hide'][hide_id]+"();");
					}
					//alert(RMC._PAGE_EVENT['show']);
				},1200);
			}
		},
		backPage:function(){RMC.backpage();},
		backpage:function(){
			if(!RMC._RUNING){
				if(this._PAGE_STORE.length>1){
					RMC._RUNING=true;
					//隱藏前
					if(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]!=undefined){
						eval(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]+"();");
					}
					var hide_id=RMC._NOWID;
					var tmp='#'+RMC._NOWID;
					$(tmp).attr('class','page-show rotateOutDownRight');
					//$('#'+RMC._NOWID).attr('class','page display-none');
					this._PAGE_STORE.pop();
					RMC._NOWID=this._PAGE_STORE[this._PAGE_STORE.length-1];//alert(RMC._NOWID);
					//顯示前
					if(RMC._PAGE_EVENT['showbefore'][RMC._NOWID]!=undefined){
		                eval(RMC._PAGE_EVENT['showbefore'][RMC._NOWID]+"();");
					}
					$('#'+RMC._NOWID).attr('class','page');
					window.location.hash=RMC._NOWID;
					setTimeout(function(){
						RMC._RUNING=false;
					//	$('#'+RMC._NOWID).attr('class','page display-now');
						//alert($(tmp).attr('class'));
						//$(tmp).attr('class','page display-hidden');
						$(tmp).attr('class','page display-none');
						//顯示後
						if(RMC._PAGE_EVENT['show'][RMC._NOWID]!=undefined){
		                    //alert(RMC._PAGE_EVENT['show'][id]);
		                    eval(RMC._PAGE_EVENT['show'][RMC._NOWID]+"();");
						}
						//隱藏後
						if(RMC._PAGE_EVENT['hide'][hide_id]!=undefined){
		                    eval(RMC._PAGE_EVENT['hide'][hide_id]+"();");
						}
					},1200);
					//var tmp=this._PAGE_STORE.pop();
					//alert(tmp);
				}else{
					if(this._CORDOVA_STATUS){
						navigator.app.exitApp();
					}
				}
			}
		},
		//載入html
		loadPage:function(file){RMC.loadpage(file);},
		loadpage:function(file){
			//alert($());
			$.get(file,function(data){
				//alert(data);
				data=data.ReplaceAll('class="page"','class="page-load"');
				$('body').append(data);
				RMC.pageset();
			},'text');
		},
		//執行page設定
		pageset:function(){
			var HP=false;//header position
			var FP=false;//footer position
			$('.page-load').each(function(){
				var CH=RMC._SH;
				var chf=false;
				$(this).css({'width':RMC._SW+'px','height':RMC._SH+'px','overflow':'hidden'});
				var content=$(this).find('.content');
				var header=$(this).find('.header');
				var footer=$(this).find('.footer');
				if(header){
					HP=$(header).outerHeight(true);
					CH -=HP;
					chf=true;
				}
				if(footer.length>0){
					FP=footer.outerHeight(true);
					CH -=FP;
					sFP=RMC._SH-FP;
					chf=true;
				}
				if(chf){
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}else{
					//上下頁面時使用
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}
				
				//設定事件
				$('#'+this.id+' [tap]').each(function(){
					$(this).swipe( {
			            tap:function(event, target) {
			            	eval($(this).attr('tap'));
			            },
			            threshold:50
			          });
				});
				
				//設定down-list
				//var mar=RMC._SH-200;
				//$('#'+this.id+' .down-list').css({'padding-top':mar+'px'});
				//mar=RMC._SW-10;
				//$('.down-list .con').css('width',mar+'px');
				//$('.down-list .sel').css('width',RMC._SW+'px');

				//專換上方位置
				var ww=this._SW-146;
				$('#'+this.id+' .header-nameb').each(function(){
					$(this).css('width',ww+'px');
				});
				
				$(this).attr('class','page display-none');
			});
		},
		//swipe event
		swipe:function(name,type,fn){
			if(type=='left'){alert('left');
				$('#'+name).on('swipeleft',function(e){
					alert('left');
				});
				//$('#'+name).swipe();
				/*if(document.getElementById(name)){
					$('#'+name).css({left:'-'+RMC._SW+'px','z-index':2,'display':''}).animate({left:'0px'},500);
					$('#'+RMC._NOWID).animate({left:RMC._SW+'px','z-index':1},500,function(){
						$(this).css('display','none');
					});
					RMC._BACKID=RMC._NOWID;
					RMC._NOWID=name;
				}*/
			}else{
				$('#'+name).on('swiperight',function(e){
					alert('right');
				});
			}
		},
		//執行cordova
		runCordova:function(){
			document.addEventListener("deviceready", RMC.deviceReady, false);
		},
		//cordova執行完成
		deviceReady:function(){
			RMC._CORDOVA_STATUS=true;
			document.addEventListener("backbutton", RMC.backDown, false);
		},
		//執行back按鈕時
		backDown:function(){
			RMC.backpage();
		},
		//提示訊息
		alert:function(msg,title,name){
			if(this._CORDOVA_STATUS){
				navigator.notification.alert(msg, RMC.alertCallback, title, name);
			}else{
				alert(msg);
			}
		},
		alertCallback:function(){
			
		},
		//加入事件
		add_evnet:function(type,id,fun){
			this._PAGE_EVENT[type][id]=fun;
		},
		on:function(id,type,fun){
			switch(type)
			{
				case 'tap'://點擊
				case 'click'://點擊 
					$('#'+id).swipe({
						tap:fun,threshold:50	
					});
					break;
				case 'swipe':
					$('#'+id).swipe({swipe:fun,threshold:0});
					break;
				case 'swipeleft'://左滑
				case 'swipeLeft'://左滑
					$('#'+id).swipe({swipeLeft:fun,threshold:0});
					break;
				case 'swiperight'://右滑
				case 'swipeRight'://右滑
					$('#'+id).swipe({swipeRight:fun,threshold:0});
					break;
				case 'swipedown'://右滑
				case 'swipeDown'://右滑
					$('#'+id).swipe({swipeDown:fun,threshold:0});
					break;
				case 'swipeup'://右滑
				case 'swipeUp'://右滑
					$('#'+id).swipe({swipeUp:fun,threshold:0});
					break;
				default:break;
			}

		},
		tap:function(id,fun){
			$('#'+id).swipe({
				tap:fun,
				threshold:50
			});
		},
		click:function(id,fun){
			$('#'+id).swipe({
				tap:fun,
				threshold:50
			});
		}
};
//cordova 參數
$(document).ready(function(){
	RMC.create();
	if(RMC._TMP!=''){
		(RMC._TMP)();
	}
});