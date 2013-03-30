var FbAutocomplete=new Class({Implements:[Options,Events],options:{menuclass:"auto-complete-container",classes:{ul:"results",li:"result"},url:"index.php",max:10,onSelection:Class.empty,autoLoadSingleResult:true},initialize:function(b,a){this.setOptions(a);this.options.labelelement=typeOf(document.id(b+"-auto-complete"))==="null"?document.getElement(b+"-auto-complete"):document.id(b+"-auto-complete");this.cache={};this.selected=-1;this.mouseinsde=false;document.addEvent("keydown",function(c){this.doWatchKeys(c)}.bind(this));this.element=typeOf(document.id(b))==="null"?document.getElement(b):document.id(b);this.buildMenu();if(!this.getInputElement()){fconsole("autocomplete didnt find input element");return}this.getInputElement().setProperty("autocomplete","off");this.getInputElement().addEvent("keyup",function(c){this.search(c)}.bind(this))},search:function(b){if(b.key==="tab"){this.closeMenu();return}if(b.key==="enter"){b.stop()}var a=this.getInputElement().get("value");if(a===""){this.element.value=""}if(a!==this.searchText&&a!==""){this.element.value=a;this.positionMenu();if(this.cache[a]){this.populateMenu(this.cache[a]);this.openMenu()}else{Fabrik.loader.start(this.getInputElement());if(this.ajax){this.closeMenu();this.ajax.cancel()}this.ajax=new Request({url:this.options.url,data:{value:a},onComplete:function(c){Fabrik.loader.stop(this.getInputElement());this.completeAjax(c,a)}.bind(this)}).send()}}else{if(b.key==="enter"){this.openMenu()}}this.searchText=a},completeAjax:function(b,a){b=JSON.decode(b);this.cache[a]=b;Fabrik.loader.stop(this.getInputElement());this.populateMenu(b);this.openMenu()},buildMenu:function(){this.menu=new Element("div",{"class":this.options.menuclass,styles:{position:"absolute"}}).adopt(new Element("ul",{"class":this.options.classes.ul}));this.menu.inject(document.body);this.menu.addEvent("mouseenter",function(){this.mouseinsde=true}.bind(this));this.menu.addEvent("mouseleave",function(){this.mouseinsde=false}.bind(this))},getInputElement:function(){return this.options.labelelement?this.options.labelelement:this.element},positionMenu:function(){var a=this.getInputElement().getCoordinates();var b=this.getInputElement().getPosition();this.menu.setStyles({left:a.left,top:(a.top+a.height)-1,width:a.width})},populateMenu:function(e){e.map(function(h,g){h.text=Encoder.htmlDecode(h.text);return h});this.data=e;var b=this.getListMax();var d=this.menu.getElement("ul");d.empty();if(e.length===1&&this.options.autoLoadSingleResult){this.element.value=e[0].value;this.fireEvent("selection",[this,this.element.value])}for(var c=0;c<b;c++){var f=e[c];var a=new Element("li",{"data-value":f.value,"class":"unselected "+this.options.classes.li}).set("text",f.text);a.inject(d);a.addEvent("click",function(g){this.makeSelection(g)}.bind(this))}if(e.length>this.options.max){new Element("li").set("text","....").inject(d)}},makeSelection:function(b){var a=b.target;if(typeOf(a)!=="null"){this.getInputElement().value=a.get("text");this.element.value=a.getProperty("data-value");this.closeMenu();this.fireEvent("selection",[this,this.element.value]);this.element.fireEvent("change",new Event.Mock(this.element,"change"),700);Fabrik.fireEvent("fabrik.autocomplete.selected",[this,this.element.value])}else{Fabrik.fireEvent("fabrik.autocomplete.notselected",[this,this.element.value])}},closeMenu:function(){if(this.shown){this.shown=false;this.menu.fade("out");this.selected=-1;document.removeEvent("click",function(a){this.doTestMenuClose(a)}.bind(this))}},openMenu:function(){if(!this.shown){this.shown=true;this.menu.setStyle("visibility","visible").fade("in");document.addEvent("click",function(a){this.doTestMenuClose(a)}.bind(this));this.selected=0;this.highlight()}},doTestMenuClose:function(){if(!this.mouseinsde){this.closeMenu()}},getListMax:function(){if(typeOf(this.data)==="null"){return 0}return this.data.length>this.options.max?this.options.max:this.data.length},doWatchKeys:function(b){var a=this.getListMax();if(!this.shown){if(b.code.toInt()===40&&document.activeElement===this.getInputElement()){this.openMenu()}}else{if(b.key==="enter"){window.fireEvent("blur")}switch(b.code){case 40:if(!this.shown){this.openMenu()}if(this.selected+1<a){this.selected++;this.highlight()}b.stop();break;case 38:if(this.selected-1>=-1){this.selected--;this.highlight()}b.stop();break;case 13:case 9:b.stop();this.makeSelection({},this.getSelected());this.closeMenu();break;case 27:b.stop();this.closeMenu();break}}},getSelected:function(){var b=this.menu.getElements("li").filter(function(a,c){return c===this.selected}.bind(this));return b[0]},highlight:function(){this.menu.getElements("li").each(function(a,b){if(b===this.selected){a.addClass("selected")}else{a.removeClass("selected")}}.bind(this))}});var FabCddAutocomplete=new Class({Extends:FbAutocomplete,search:function(d){var c;var b=this.getInputElement().get("value");if(b===""){this.element.value=""}if(b!==this.searchText&&b!==""){var a=document.id(this.options.observerid);if(typeOf(a)!=="null"){c=a.get("value")+"."+b}else{this.parent(d);return}this.positionMenu();if(this.cache[c]){this.populateMenu(this.cache[c]);this.openMenu()}else{Fabrik.loader.start(this.getInputElement());if(this.ajax){this.closeMenu();this.ajax.cancel()}this.ajax=new Request({url:this.options.url,data:{value:b,fabrik_cascade_ajax_update:1,v:document.id(this.options.observerid).get("value")},onSuccess:function(f){this.completeAjax(f)}.bind(this),onError:function(f,e){console.log(f,e)},onFailure:function(e){console.log(e)}}).send()}}this.searchText=b}});