//ui-search 定义
$.fn.UiSearch = function(){
	var ui = $(this);
	//debugger;

	//在元素ui中查找到.ui-search-selected元素，并绑定click事件
	$('.ui-search-selected',ui).on('click',function(){
		$('.ui-search-select-list').show();
		return false;//遇到return后，函数不再往下执行，防止触发body上的事件
	});

	$('.ui-search-select-list a',ui).on('click',function(){
		$('.ui-search-selected').text($(this).text());
		$('.ui-search-select-list').hide();
		return false;
	});

	$('body').on('click',function(){
		$('.ui-search-select-list').hide();
	});
};

//ui-tab
//header参数为字符串，TAB组件,的所有选项卡 item
//content参数为字符串，TAB组件,的所有内容区域 item
//focus_prefix参数为字符串，选项卡高亮样式前缀，可选参数
$.fn.UiTab=function(header,content,focus_prefix){

	var ui =$(this);
	var tabs =$(header,ui);
	var cons =$(content,ui)
	var focus_prefix = focus_prefix || '';
	tabs.on('click',function(){
		//index表示当前元素是父元素中的第几个
		var index =$(this).index();
		tabs.removeClass(focus_prefix+'item_focus').eq(index).addClass(focus_prefix+'item_focus');
		cons.hide().eq(index).show();
		return false;
	});
}

//回到顶部
//ui-backTop
$.fn.UiBackTop = function(){
	var ui = $(this);
	var el = $('<a class="ui-backTop" href="#"></a>');
	ui.append(el);

	var windowHeight = $(window).height();//浏览器窗口高度
	$(window).on('scroll',function(){
		
		var top = $('body').scrollTop() || document.documentElement.scrollTop;
		//scrollTop() 方法设置或返回被选元素的垂直滚动条位置。当滚动条位于最顶部时，位置是 0。
		//console.log('距顶部距离'+top);
		
		if(top > windowHeight){
			//
			el.show();
		}else{
			el.hide();
		}
	});
	el.on('click',function(){
		$(window).scrollTop(0);
	});
}


//ui-slider
//1.左右箭头控制翻页
//2.翻页的时候，进度点，同步focus
//3.翻到第三页时，下一页回到第一页....
//4.进度点，点击时切换到对应页面
//5.没有点击时，自动滚动
//6.滚动过程中，屏蔽其他操作（自动滚动、翻页、进度点点击）
$.fn.UiSlider=function(){
	var ui=$(this)
	var wrap=$('.ui-slider-wrap');
	var items=$('.ui-slider-wrap .item',ui);

	var btn_prev=$('.ui-slider-arrow .left',ui);
	var btn_next=$('.ui-slider-arrow .right',ui);

	var tips=$('.ui-slider-process .item',ui);

	//
	var current=0;
	var size=items.size();
	var width=items.eq(0).width();
	var enableAuto=true;
	//设置自动滚动感应（如果鼠标在滚动窗口中，不自动滚动）
	//用ui绑定，注意prev、next等按钮不在wrap内（不是其元素）
	ui.on('mouseover',function(){
		enableAuto=false;
	});
	ui.on('mouseout',function(){
		enableAuto=true;
	});

	wrap.on('move_prev',function(){
		if(current<=0){
			current = size-1;
		}else{
			current--;
		}
		
		wrap.triggerHandler('move_to',current);
	});

	wrap.on('move_next',function(){
		if(current>=size-1){
			current = 0;
		}else{
			current++;
		}
		wrap.triggerHandler('move_to',current);
	});

	wrap.on('move_to',function(evt,index){
		wrap.css('left',index*width*-1);
		tips.removeClass('item_focus').eq(index).addClass('item_focus');
		//index难道不是未定义？no,index在这里是形参
	});

	wrap.on('auto_move',function(){
		//
		setInterval(function(){
			 enableAuto && wrap.triggerHandler('move_next');
		},5000);
	});
	wrap.triggerHandler('auto_move');//给一个auto_move事件

	//事件
	btn_prev.on('click',function(){
		wrap.triggerHandler('move_prev');
	});
	btn_next.on('click',function(){
		wrap.triggerHandler('move_next');
	});
	tips.on('click',function(){
		var index=$(this).index();
		wrap.triggerHandler('move_to',index);
	});
};

//脚本逻辑，网页加载完才执行
$(function(){
	$('.ui-search').UiSearch();
	$('.content-tab').UiTab('.caption > .item','.block > .item');
	$('.content-tab .block .item').UiTab('.block-caption > a','.block-content > .block-wrap','.block-caption-');
	$('body').UiBackTop();

	$('.ui-slider').UiSlider();
});