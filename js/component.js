(function($){
	$.fn.extend({
		htTable: function(tData) {
			var _eleThis = this;
			var httbl = {
				$ele: _eleThis,

				size: {
					tbodyH: 0,
					thColW: [] //每列的宽度
				},

				tData: tData, 

				//选择框选中状态,第一项是全选框
				checkState: [],

				init: function() {
					this.renderHtml();
					this.setSize();
					this.bindEvent();
				},

				bindEvent: function() {
					var _this = this;
					this.$ele.find(".ht-tcheck-all, .ht-tcheck-row").change(function() {
						_this.toggleCheckbox($(this));
					})
				},

				//切换checkbox状态
				toggleCheckbox: function($e) {  
					var checkboxNode = this.$ele.find(".ht-tcheck-row");
					var checkboxNodeLen = checkboxNode.length;
					var checkboxIndex = this.$ele.find(".ht-table-view table input[type=checkbox]").index($e);
					var checkedNum = 0;

					if ($e.prop("checked")) {
						this.checkState[checkboxIndex] = true;
					}
					else {
						this.checkState[checkboxIndex] = false;
					}

					for (var i = 0; i < checkboxNodeLen+1; i++) {
						if ($e.hasClass("ht-tcheck-all") && this.checkState[0]) {
							this.checkState[i] = true;
							this.$ele.find(".ht-table-view table input[type=checkbox]")[i].checked=true;
						}
						else if (($e.hasClass("ht-tcheck-all") && !this.checkState[0]) || !this.checkState[i]) {
							this.checkState[i] = false;
							this.$ele.find(".ht-table-view table input[type=checkbox]")[i].checked = this.checkState[i];
						}
						if (i!= 0 && this.checkState[i] == true) {
							checkedNum++;
						}
					}

					//判断是否是全部选中状态
					if (checkedNum == checkboxNodeLen) {
						this.checkState[0] = true;
						this.$ele.find(".ht-tcheck-all")[0].checked=true;
					}
					else {
						this.checkState[0] = false;
						this.$ele.find(".ht-tcheck-all")[0].checked=false;
					}
				},

				//改变宽高
				setSize: function() { 
					this.setColW();
					var containerH = $(".ht-table-wrap").height()-101;
					this.$ele.find(".ht-table-content").height(containerH);
					var thNode = this.$ele.find(".ht-table-head table th");
					var thLen  = thNode.length;
					for (var i = thLen-1; i >= 0; i--) {
						this.size.thColW[i] = $(thNode[i]).width();
						this.$ele.find(".ht-table-body table tr:eq(0) td")[i].style.width = this.size.thColW[i] + 'px';
					}
					this.size.tbodyH = containerH - (this.$ele.find(".ht-table-body").offset().top - this.$ele.find(".ht-table-content").offset().top);
					this.$ele.find(".ht-table-body").css("max-height", this.size.tbodyH);

					this.setStyle();
				},

				//改变最外层宽高
				resizeWrap: function() {
					if (tData.width) {
						this.$ele.width(tData.width);
					}
					if (tData.minWidth) {
						this.$ele.find(".ht-table-view").css({"min-width": tData.minWidth})
					}
					if (tData.height) {
						this.$ele.height(tData.height);
					}
				},

				//改变样式
				setStyle: function() {
					if (this.$ele.find(".ht-table-body table").height() > this.size.tbodyH) {
						this.$ele.find(".ht-table-body").css({"margin-right": "0"});
					}
					else {
						this.$ele.find(".ht-table-body").css({"margin-right": "17px"});
					};

					this.$ele.find(".ht-table-body table tr:odd").css({"background-color": "#FAFAFA"})
				},

				//渲染表格
				renderHtml: function() {
					var allText = '<div class="ht-table-content">';
						allText += this.addToolBar();
						allText += this.addTableContent();
						allText += this.addFooter();
						allText += '</div>';

					this.$ele.html(allText);
				},

				//计算用户设置宽度
				setColW: function() {
					this.resizeWrap();
					var totleWidth = this.$ele.width();
					var thNode = this.$ele.find(".ht-table-head table th");
					var utw = 0; //用户设置总宽度
					if (this.tData.hasCheckbox) {
						totleWidth = this.$ele.width()-50;
						thNode[0].style.width = 50+'px';
					}
					for (var m = 0; m < this.tData.tcol.length; m++) {
						utw += this.tData.tcol[m].width;
					}

					for (var i = 0; i < this.tData.tcol.length; i++) {
						if (this.tData.hasCheckbox) {
							var j = i+1;
						}
						else {
							var j = i;
						}
						thNode[j].style.width = (this.tData.tcol[i].width/utw)*totleWidth+ 'px';
						j++;
					}
				},

				//获取toolbar的html
				addToolBar: function() {
					var toolText = '';
					if (this.tData.ttool) {
					    toolText += '<div class="ht-table-toolbar">';
					    for (var tt in this.tData.ttool) {
					    	toolText += '<span><i class="fa fa-'+tt+'"></i>'+this.tData.ttool[tt]+'</span>';
					    }
						toolText += '</div>';
					}

					return toolText;
				},

				//获取表格的html
				addTableContent: function() {
					var tContentText = '';
						tContentText += '<div class="ht-table-block">';
						tContentText += '<div class="ht-table-view">';
							tContentText += '<div class="ht-table-head">';
								tContentText += '<table cellspacing="0" cellpadding="0" border="0">';
									tContentText += '<thead><tr>';
										if (this.tData.hasCheckbox) {
											tContentText += '<th><input type="checkbox" class="ht-tcheck-all"></th>';
										}
										for (var j = 0; j < this.tData.tcol.length; j++) {
											tContentText += '<th>'+this.tData.tcol[j].title+'</th>';
										}
									tContentText += '</tr></thead>';
								tContentText += '</table>';
							tContentText += '</div>';
							tContentText += '<div class="ht-table-body">';
								tContentText += '<table cellspacing="0" cellpadding="0" border="0"><tbody>';
									for (var k = 0; k < this.tData.tdData.rows.length; k++) {
										tContentText += '<tr id = "'+this.tData.tdData.rows[k].id+'">';
											if (this.tData.hasCheckbox) {
												tContentText += '<td><input type="checkbox" class="ht-tcheck-row" ></td>';
											}
											for (var tc in this.tData.tdData.rows[k]) {
												if (tc != 'id') {
													tContentText += '<td>'+this.tData.tdData.rows[k][tc]+'</td>';
												}
											}
										tContentText += '</tr>';
									}
								tContentText += '</tbody></table>';
							tContentText += '</div>';
						tContentText += '</div>';
						tContentText += '</div>';

					return tContentText;
				},

				//获取分页的html
				addFooter: function() {
					var footerText = '';
						footerText += '<div class="ht-table-footer">';
						    footerText += '<div class="ht-table-pagination">';
								footerText += '<a class="ht-pagination-btn" href="###">首页</a>';
								footerText += '<a class="ht-pagination-btn" href="###">上一页</a>';
								footerText += '<a class="ht-pagination-btn" href="###">下一页</a>';
								footerText += '共<span class = "ht-totle-page">5</span>页转到第<input type="text" class="ht-pagination-input">页';
								footerText += '<a class="ht-pagination-btn" href="###">确定</a>';
							footerText += '</div>';
						footerText += '</div>';

					return footerText;
				}
			}

			httbl.init();
			window.onresize = function() {
				httbl.setSize();
			}
		},
	})
})(jQuery);