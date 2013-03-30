Fabrik.getWindow=function(b){if(Fabrik.Windows[b.id]){if(b.visible!==false){Fabrik.Windows[b.id].open()}Fabrik.Windows[b.id].setOptions(b)}else{var a=b.type?b.type:"";switch(a){case"redirect":Fabrik.Windows[b.id]=new Fabrik.RedirectWindow(b);break;case"modal":Fabrik.Windows[b.id]=new Fabrik.Modal(b);break;case"":default:Fabrik.Windows[b.id]=new Fabrik.Window(b);break}}return Fabrik.Windows[b.id]};Fabrik.Window=new Class({Implements:[Events,Options],options:{id:"FabrikWindow",title:"&nbsp;",container:false,loadMethod:"html",contentURL:"",createShowOverLay:false,width:300,height:300,loadHeight:100,expandable:true,offset_x:null,offset_y:null,visible:true,onClose:function(){},onContentLoaded:function(){this.fitToContent()},destroy:true},modal:false,classSuffix:"",expanded:false,initialize:function(a){this.setOptions(a);this.makeWindow()},deleteButton:function(){var a=function(d){this.close(d)}.bind(this);var b;if(Fabrik.bootstrapped){b=new Element("a",{href:"#","class":"closeFabWin",events:{click:a}});b.adopt(new Element("i.icon-cancel"))}else{b=new Element("a",{href:"#","class":"close",events:{click:a}});var c=Fabrik.iconGen.create(icon.cross);c.inject(b)}return b},center:function(){var a=this.window.getStyle("width")===null?this.options.width:this.window.getStyle("width");var b=this.window.getStyle("height")===null?this.options.height+10:this.window.getStyle("width");var e={width:a+"px",height:b+"px"};e.margin=0;if(!(Fabrik.bootstrapped&&this.modal)){var f=window.getSize().y/2+window.getScroll().y-(b.toInt()/4);e.top=typeOf(this.options.offset_y)!=="null"?window.getScroll().y+this.options.offset_y:f;var c=window.getSize().x/2+window.getScroll().x-a.toInt()/2;e.left=typeOf(this.options.offset_x)!=="null"?window.getScroll().x+this.options.offset_x:c}this.window.setStyles(e)},makeWindow:function(){var f,c,d,e,i,l;var o=[];this.window=new Element("div",{id:this.options.id,"class":"fabrikWindow "+this.classSuffix+" modal"});this.center();this.contentWrapperEl=this.window;del=this.deleteButton();var g="handlelabel";if(!this.modal){g+=" draggable";var h=Fabrik.bootstrapped?"bottomBar BootStrapped":"bottomBar";f=new Element("div",{"class":"bottomBar modal-footer"});c=new Element("div",{"class":"dragger"});if(Fabrik.bootstrapped){i=new Element("i.icon-expand")}else{i=Fabrik.iconGen.create(icon.resize,{scale:0.8,rotate:0,shadow:{color:"#fff",translate:{x:0,y:1}},fill:{color:["#999","#666"]}})}i.inject(c);f.adopt(c)}if(Fabrik.bootstrapped){e=new Element("i.icon-out-2");l=new Element("h3",{"class":g}).set("text",this.options.title)}else{e=Fabrik.iconGen.create(icon.expand,{scale:0.4,fill:{color:["#666666","#999999"]}});l=new Element("span",{"class":g}).set("text",this.options.title)}o.push(l);if(this.options.expandable&&this.modal===false){d=new Element("a",{href:"#","class":"expand",events:{click:function(p){this.expand(p)}.bind(this)}}).adopt(e);o.push(d)}o.push(del);this.handle=this.getHandle().adopt(o);var n=15;var k=15;var m=this.options.height-n-k;if(m<this.options.loadHeight){m=this.options.loadHeight}this.contentWrapperEl=new Element("div.contentWrapper",{styles:{height:m+"px"}});var j=new Element("div",{"class":"itemContent"});this.contentEl=new Element("div",{"class":"itemContentPadder"});j.adopt(this.contentEl);this.contentWrapperEl.adopt(j);if(this.modal){var b=this.options.height-30;cw=this.options.width;this.contentWrapperEl.setStyles({height:b+"px",width:cw+"px"});this.window.adopt([this.handle,this.contentWrapperEl])}else{this.window.adopt([this.handle,this.contentWrapperEl,f]);this.window.makeResizable({handle:c,onDrag:function(){Fabrik.fireEvent("fabrik.window.resized",this.window);this.drawWindow()}.bind(this)});var a={handle:this.handle};a.onComplete=function(){Fabrik.fireEvent("fabrik.window.moved",this.window);this.drawWindow()}.bind(this);a.container=this.options.container?document.id(this.options.container):null;this.window.makeDraggable(a)}if(!this.options.visible){this.window.fade("hide")}document.id(document.body).adopt(this.window);this.loadContent()},expand:function(c){c.stop();if(!this.expanded){this.expanded=true;var b=window.getSize();this.unexpanded=this.window.getCoordinates();var a=window.getScroll();this.window.setPosition({x:a.x,y:a.y}).setStyles({width:b.x,height:b.y})}else{this.window.setPosition({x:this.unexpanded.left,y:this.unexpanded.top}).setStyles({width:this.unexpanded.width,height:this.unexpanded.height});this.expanded=false}this.drawWindow()},getHandle:function(){var a=this.handleClass();return new Element("div",{"class":"draggable "+a})},handleClass:function(){return Fabrik.bootstrapped?"modal-header":"handle"},loadContent:function(){var b;window.fireEvent("tips.hideall");switch(this.options.loadMethod){case"html":if(typeOf(this.options.content)==="null"){fconsole("no content option set for window.html");this.close();return}if(typeOf(this.options.content)==="element"){this.options.content.inject(this.contentEl.empty())}else{this.contentEl.set("html",this.options.content)}this.fireEvent("onContentLoaded",[this]);break;case"xhr":b=this.window.getElement(".itemContent");b=this.contentEl;Fabrik.loader.start(b);new Request.HTML({url:this.options.contentURL,data:{fabrik_window_id:this.options.id},update:b,onSuccess:function(){Fabrik.loader.stop(b);this.fireEvent("onContentLoaded",[this])}.bind(this)}).post();break;case"iframe":var c=this.options.height-40;var a=this.contentEl.getScrollSize().x+40<window.getWidth()?this.contentEl.getScrollSize().x+40:window.getWidth();b=this.window.getElement(".itemContent");Fabrik.loader.start(b);if(this.iframeEl){this.iframeEl.dispose()}this.iframeEl=new Element("iframe",{id:this.options.id+"_iframe",name:this.options.id+"_iframe","class":"fabrikWindowIframe",src:this.options.contentURL,marginwidth:0,marginheight:0,frameBorder:0,scrolling:"auto",styles:{height:c+"px",width:a}}).inject(this.window.getElement(".itemContent"));this.iframeEl.hide();this.iframeEl.addEvent("load",function(d){Fabrik.loader.stop(this.window.getElement(".itemContent"));this.iframeEl.show();this.fireEvent("onContentLoaded",[this])}.bind(this));break}},drawWindow:function(){var a=this.window.getElement("."+this.handleClass());a=a?a.getSize().y:25;var b=this.window.getElement(".bottomBar").getSize().y;this.contentWrapperEl.setStyle("height",this.window.getDimensions().height-(a+b));this.contentWrapperEl.setStyle("width",this.window.getDimensions().width-2);if(this.options.loadMethod==="iframe"){this.iframeEl.setStyle("height",this.contentWrapperEl.offsetHeight-40);this.iframeEl.setStyle("width",this.contentWrapperEl.offsetWidth-10)}},fitToContent:function(g){g=g===undefined?true:g;if(this.options.loadMethod!=="iframe"){var b=this.window.getElement(".itemContent");var d=this.window.getElement(".itemContentPadder");var f=this.window.getElement("."+this.handleClass());f=f?f.getSize().y:25;var i=this.window.getElement(".bottomBar").getSize().y;var a=b.getScrollSize().y+f+i;var e=a<window.getHeight()?a:window.getHeight();var j=b.getScrollSize().x+17<window.getWidth()?b.getScrollSize().x+17:window.getWidth();this.window.setStyle("height",e);this.window.setStyle("width",j)}this.drawWindow();this.center();if(!this.options.offset_y&&g){var c=new Fx.Scroll(window).toElement(this.window)}},close:function(a){if(a){a.stop()}if(this.options.destroy){this.window.destroy();delete (Fabrik.Windows[this.options.id])}else{this.window.fade("hide")}this.fireEvent("onClose",[this])},open:function(a){if(a){a.stop()}this.window.fade("show")}});Fabrik.Modal=new Class({Extends:Fabrik.Window,modal:true,classSuffix:"fabrikWindow-modal",getHandle:function(){var a=this.handleClass();return new Element("div",{"class":a})}});Fabrik.RedirectWindow=new Class({Extends:Fabrik.Window,initialize:function(c){var a={id:"redirect",title:c.title?c.title:"",loadMethod:b,width:c.width?c.width:300,height:c.height?c.height:320,minimizable:false,collapsible:true};a.id="redirect";c=Object.merge(a,c);var b;c.loadMethod="xhr";if(!c.contentURL.contains(Fabrik.liveSite)&&(c.contentURL.contains("http://")||c.contentURL.contains("https://"))){c.loadMethod="iframe"}else{if(!c.contentURL.contains("tmpl=component")){c.contentURL+=c.contentURL.contains("?")?"&tmpl=component":"?tmpl=component"}}this.setOptions(c);this.makeWindow()}});