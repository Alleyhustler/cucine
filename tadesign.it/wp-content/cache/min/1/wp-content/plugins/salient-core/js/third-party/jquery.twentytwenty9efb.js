(function(module){if(typeof define==='function'&&define.amd){define(['jquery'],module)}else{module(jQuery)}})(function(jQuery,undefined){var
threshold=6,add=jQuery.event.add,remove=jQuery.event.remove,trigger=function(node,type,data){jQuery.event.trigger(type,data,node)},requestFrame=(function(){return(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(fn,element){return window.setTimeout(function(){fn()},25)})})(),ignoreTags={textarea:!0,input:!0,select:!0,button:!0},mouseevents={move:'mousemove',cancel:'mouseup dragstart',end:'mouseup'},touchevents={move:'touchmove',cancel:'touchend',end:'touchend'};function Timer(fn){var callback=fn,active=!1,running=!1;function trigger(time){if(active){callback();requestFrame(trigger);running=!0;active=!1}else{running=!1}}
this.kick=function(fn){active=!0;if(!running){trigger()}};this.end=function(fn){var cb=callback;if(!fn){return}
if(!running){fn()}else{callback=active?function(){cb();fn()}:fn;active=!0}}}
function returnTrue(){return!0}
function returnFalse(){return!1}
function preventDefault(e){e.preventDefault()}
function preventIgnoreTags(e){if(ignoreTags[e.target.tagName.toLowerCase()]){return}
e.preventDefault()}
function isLeftButton(e){return(e.which===1&&!e.ctrlKey&&!e.altKey)}
function identifiedTouch(touchList,id){var i,l;if(touchList.identifiedTouch){return touchList.identifiedTouch(id)}
i=-1;l=touchList.length;while(++i<l){if(touchList[i].identifier===id){return touchList[i]}}}
function changedTouch(e,event){var touch=identifiedTouch(e.changedTouches,event.identifier);if(!touch){return}
if(touch.pageX===event.pageX&&touch.pageY===event.pageY){return}
return touch}
function mousedown(e){var data;if(!isLeftButton(e)){return}
data={target:e.target,startX:e.pageX,startY:e.pageY,timeStamp:e.timeStamp};add(document,mouseevents.move,mousemove,data);add(document,mouseevents.cancel,mouseend,data)}
function mousemove(e){var data=e.data;checkThreshold(e,data,e,removeMouse)}
function mouseend(e){removeMouse()}
function removeMouse(){remove(document,mouseevents.move,mousemove);remove(document,mouseevents.cancel,mouseend)}
function touchstart(e){var touch,template;if(ignoreTags[e.target.tagName.toLowerCase()]){return}
touch=e.changedTouches[0];template={target:touch.target,startX:touch.pageX,startY:touch.pageY,timeStamp:e.timeStamp,identifier:touch.identifier};add(document,touchevents.move+'.'+touch.identifier,touchmove,template);add(document,touchevents.cancel+'.'+touch.identifier,touchend,template)}
function touchmove(e){var data=e.data,touch=changedTouch(e,data);if(!touch){return}
checkThreshold(e,data,touch,removeTouch)}
function touchend(e){var template=e.data,touch=identifiedTouch(e.changedTouches,template.identifier);if(!touch){return}
removeTouch(template.identifier)}
function removeTouch(identifier){remove(document,'.'+identifier,touchmove);remove(document,'.'+identifier,touchend)}
function checkThreshold(e,template,touch,fn){var distX=touch.pageX-template.startX,distY=touch.pageY-template.startY;if((distX*distX)+(distY*distY)<(threshold*threshold)){return}
triggerStart(e,template,touch,distX,distY,fn)}
function handled(){this._handled=returnTrue;return!1}
function flagAsHandled(e){e._handled()}
function triggerStart(e,template,touch,distX,distY,fn){var node=template.target,touches,time;touches=e.targetTouches;time=e.timeStamp-template.timeStamp;template.type='movestart';template.distX=distX;template.distY=distY;template.deltaX=distX;template.deltaY=distY;template.pageX=touch.pageX;template.pageY=touch.pageY;template.velocityX=distX/time;template.velocityY=distY/time;template.targetTouches=touches;template.finger=touches?touches.length:1;template._handled=handled;template._preventTouchmoveDefault=function(){e.preventDefault()};trigger(template.target,template);fn(template.identifier)}
function activeMousemove(e){var timer=e.data.timer;e.data.touch=e;e.data.timeStamp=e.timeStamp;timer.kick()}
function activeMouseend(e){var event=e.data.event,timer=e.data.timer;removeActiveMouse();endEvent(event,timer,function(){setTimeout(function(){remove(event.target,'click',returnFalse)},0)})}
function removeActiveMouse(event){remove(document,mouseevents.move,activeMousemove);remove(document,mouseevents.end,activeMouseend)}
function activeTouchmove(e){var event=e.data.event,timer=e.data.timer,touch=changedTouch(e,event);if(!touch){return}
e.preventDefault();event.targetTouches=e.targetTouches;e.data.touch=touch;e.data.timeStamp=e.timeStamp;timer.kick()}
function activeTouchend(e){var event=e.data.event,timer=e.data.timer,touch=identifiedTouch(e.changedTouches,event.identifier);if(!touch){return}
removeActiveTouch(event);endEvent(event,timer)}
function removeActiveTouch(event){remove(document,'.'+event.identifier,activeTouchmove);remove(document,'.'+event.identifier,activeTouchend)}
function updateEvent(event,touch,timeStamp,timer){var time=timeStamp-event.timeStamp;event.type='move';event.distX=touch.pageX-event.startX;event.distY=touch.pageY-event.startY;event.deltaX=touch.pageX-event.pageX;event.deltaY=touch.pageY-event.pageY;event.velocityX=0.3*event.velocityX+0.7*event.deltaX/time;event.velocityY=0.3*event.velocityY+0.7*event.deltaY/time;event.pageX=touch.pageX;event.pageY=touch.pageY}
function endEvent(event,timer,fn){timer.end(function(){event.type='moveend';trigger(event.target,event);return fn&&fn()})}
function setup(data,namespaces,eventHandle){add(this,'movestart.move',flagAsHandled);return!0}
function teardown(namespaces){remove(this,'dragstart drag',preventDefault);remove(this,'mousedown touchstart',preventIgnoreTags);remove(this,'movestart',flagAsHandled);return!0}
function addMethod(handleObj){if(handleObj.namespace==="move"||handleObj.namespace==="moveend"){return}
add(this,'dragstart.'+handleObj.guid+' drag.'+handleObj.guid,preventDefault,undefined,handleObj.selector);add(this,'mousedown.'+handleObj.guid,preventIgnoreTags,undefined,handleObj.selector)}
function removeMethod(handleObj){if(handleObj.namespace==="move"||handleObj.namespace==="moveend"){return}
remove(this,'dragstart.'+handleObj.guid+' drag.'+handleObj.guid);remove(this,'mousedown.'+handleObj.guid)}
jQuery.event.special.movestart={setup:setup,teardown:teardown,add:addMethod,remove:removeMethod,_default:function(e){var event,data;if(!e._handled()){return}
function update(time){updateEvent(event,data.touch,data.timeStamp);trigger(e.target,event)}
event={target:e.target,startX:e.startX,startY:e.startY,pageX:e.pageX,pageY:e.pageY,distX:e.distX,distY:e.distY,deltaX:e.deltaX,deltaY:e.deltaY,velocityX:e.velocityX,velocityY:e.velocityY,timeStamp:e.timeStamp,identifier:e.identifier,targetTouches:e.targetTouches,finger:e.finger};data={event:event,timer:new Timer(update),touch:undefined,timeStamp:undefined};if(e.identifier===undefined){add(e.target,'click',returnFalse);add(document,mouseevents.move,activeMousemove,data);add(document,mouseevents.end,activeMouseend,data)}else{e._preventTouchmoveDefault();add(document,touchevents.move+'.'+e.identifier,activeTouchmove,data);add(document,touchevents.end+'.'+e.identifier,activeTouchend,data)}}};jQuery.event.special.move={setup:function(){add(this,'movestart.move',jQuery.noop)},teardown:function(){remove(this,'movestart.move',jQuery.noop)}};jQuery.event.special.moveend={setup:function(){add(this,'movestart.moveend',jQuery.noop)},teardown:function(){remove(this,'movestart.moveend',jQuery.noop)}};add(document,'mousedown.move',mousedown);add(document,'touchstart.move',touchstart);if(typeof Array.prototype.indexOf==='function'){(function(jQuery,undefined){var props=["changedTouches","targetTouches"],l=props.length;while(l--){if(jQuery.event.props.indexOf(props[l])===-1){jQuery.event.props.push(props[l])}}})(jQuery)}});(function($){$.fn.twentytwenty=function(options){var options=$.extend({default_offset_pct:0.5,orientation:'horizontal'},options);return this.each(function(){var sliderPct=options.default_offset_pct;var container=$(this);var sliderOrientation=options.orientation;var beforeDirection=(sliderOrientation==='vertical')?'down':'left';var afterDirection=(sliderOrientation==='vertical')?'up':'right';container.wrap("<div class='twentytwenty-wrapper twentytwenty-"+sliderOrientation+"'></div>");container.append("<div class='twentytwenty-overlay'></div>");var beforeImg=container.find("img:first");var afterImg=container.find("img:last");container.append("<div class='twentytwenty-handle'></div>");var slider=container.find(".twentytwenty-handle");slider.append("<span class='twentytwenty-"+beforeDirection+"-arrow'></span>");slider.append("<span class='twentytwenty-"+afterDirection+"-arrow'></span>");container.addClass("twentytwenty-container");beforeImg.addClass("twentytwenty-before");afterImg.addClass("twentytwenty-after");var overlay=container.find(".twentytwenty-overlay");overlay.append("<div class='twentytwenty-before-label'></div>");overlay.append("<div class='twentytwenty-after-label'></div>");var calcOffset=function(dimensionPct){var w=beforeImg.width();var h=beforeImg.height();return{w:w+"px",h:h+"px",cw:(dimensionPct*w)+"px",ch:(dimensionPct*h)+"px"}};var adjustContainer=function(offset){if(sliderOrientation==='vertical'){beforeImg.css("clip","rect(0,"+offset.w+","+offset.ch+",0)")}else{beforeImg.css("clip","rect(0,"+offset.cw+","+offset.h+",0)")}
container.css("height",offset.h)};var adjustSlider=function(pct){var offset=calcOffset(pct);slider.css((sliderOrientation==="vertical")?"top":"left",(sliderOrientation==="vertical")?offset.ch:offset.cw);adjustContainer(offset)}
$(window).on("resize.twentytwenty",function(e){adjustSlider(sliderPct)});var offsetX=0;var imgWidth=0;slider.on("movestart",function(e){if(((e.distX>e.distY&&e.distX<-e.distY)||(e.distX<e.distY&&e.distX>-e.distY))&&sliderOrientation!=='vertical'){e.preventDefault()}else if(((e.distX<e.distY&&e.distX<-e.distY)||(e.distX>e.distY&&e.distX>-e.distY))&&sliderOrientation==='vertical'){e.preventDefault()}
container.addClass("active");offsetX=container.offset().left;offsetY=container.offset().top;imgWidth=beforeImg.width();imgHeight=beforeImg.height()});slider.on("moveend",function(e){container.removeClass("active")});slider.on("move",function(e){if(container.hasClass("active")){sliderPct=(sliderOrientation==='vertical')?(e.pageY-offsetY)/imgHeight:(e.pageX-offsetX)/imgWidth;if(sliderPct<0){sliderPct=0}
if(sliderPct>1){sliderPct=1}
adjustSlider(sliderPct)}});container.find("img").on("mousedown",function(event){event.preventDefault()});$(window).trigger("resize.twentytwenty")})}})(jQuery)