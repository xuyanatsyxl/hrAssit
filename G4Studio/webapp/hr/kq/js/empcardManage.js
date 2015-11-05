/**
 * 综合实例：查询1
 * 
 * @author XiongChun
 * @since 2010-11-20
 */
Ext.onReady(function() {
			var qForm = new Ext.form.FormPanel({
						border : false,
						labelWidth : 60, // 标签宽度
						labelAlign : 'right', // 标签对齐方式
						bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
						buttonAlign : 'center',
						height : 120,
						items : [{
									layout : 'column',
									border : false,
									items : [{
												columnWidth : .5,
												layout : 'form',
												labelWidth : 60, // 标签宽度
												defaultType : 'textfield',
												border : false,
												items : [{
															fieldLabel : '员工编码',
															name : 'c_code',
															xtype : 'textfield', 
															anchor : '100%'
														}, {
															fieldLabel : '企业',
															name : 'c_orgname',
															xtype : 'textfield',
															anchor : '100%'
														}]
											}, {
												columnWidth : .5,
												layout : 'form',
												labelWidth : 60, // 标签宽度
												defaultType : 'textfield',
												border : false,
												items : [{
															fieldLabel : '姓名', // 标签
															id : 'c_name',
															name : 'c_name', // name:后台根据此name属性取值
															allowBlank : true, // 是否允许为空
															maxLength : 6, // 可输入的最大文本长度,不区分中英文字符
															anchor : '100%' // 宽度百分比
														}, {
															fieldLabel : '部门',
															name : 'c_unitname',
															xtype : 'textfield', 
															anchor : '100%'
														}]
											}]
								}, {
									fieldLabel : '身份证号', // 标签
									name : 'c_idcard', // name:后台根据此name属性取值
									maxLength : 20, // 可输入的最大文本长度,不区分中英文字符
									xtype : 'textfield',
									allowBlank : true,
									anchor : '100%'// 宽度百分比
								}]
					});

			var qWindow = new Ext.Window({
						title : '<span class="commoncss">查询条件</span>', // 窗口标题
						layout : 'fit', // 设置窗口布局模式
						width : 400, // 窗口宽度
						height : 160, // 窗口高度
						closable : false, // 是否可关闭
						closeAction : 'hide', // 关闭策略
						collapsible : true, // 是否可收缩
						maximizable : false, // 设置是否可以最大化
						border : true, // 边框线设置
						constrain : true,
						titleCollapse : true,
						animateTarget : Ext.getBody(),
						pageY : 30, // 页面定位Y坐标
						pageX : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
						// 设置窗口是否可以溢出父容器
						buttonAlign : 'right',
						items : [qForm],
						buttons : [{
									text : '查询',
									iconCls : 'previewIcon',
									handler : function() {
										queryBalanceInfo(qForm.getForm());
										qWindow.hide();
									}
								}, {
									text : '重置',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										qForm.getForm().reset();
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										qWindow.hide();
									}
								}]
					});
			qWindow.show(); // 显示窗口

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
						header : 'NO',
						width : 28
					});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([rownum, {
				header : 'id', // 列标题
				dataIndex : 'c_employeeid', // 数据索引:和Store模型对应
				hidden : true
				}, {
				header : '员工编码',
				dataIndex : 'c_code',
				sortable : true
			}, {
				header : '姓名',
				dataIndex : 'c_name'
			}, {
				header : '性别',
				dataIndex : 'XB',
				renderer : XBRender
			}, {
				header : 'c_orgcode',
				dataIndex : 'c_orgcode',
				hidden : true
			}, {
				header : '企业',
				dataIndex : 'c_orgname'
			}, {
				header : '部门',
				dataIndex : 'c_unitname'
			}, {
				header : '岗位',
				dataIndex : 'c_jobname'
			}, {
				header : '身份证号',
				dataIndex : 'c_idcard'
			}]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
						// 获取数据的方式
				        id : 'store',
						proxy : new Ext.data.HttpProxy({
									url : 'nusoft.do?reqCode=queryEmplFromNusoftForManage'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'c_employeeid' // Json中的属性Key值
										}, {
											name : 'c_code'
										}, {
											name : 'c_name'
										}, {
											name : 'c_gender'
										}, {
											name : 'c_orgcode'
										}, {
											name : 'c_orgname'
										}, {
											name : 'c_unitname'
										}, {
											name : 'c_jobname'
										}, {
											name : 'c_idcard'
										}])
					});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
						this.baseParams = qForm.getForm().getValues();
					});
			// 每页显示条数下拉选择框
			var pagesize_combo = new Ext.form.ComboBox({
						name : 'pagesize',
						triggerAction : 'all',
						mode : 'local',
						store : new Ext.data.ArrayStore({
									fields : ['value', 'text'],
									data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'], [100, '100条/页'], [250, '250条/页'], [500, '500条/页']]
								}),
						valueField : 'value',
						displayField : 'text',
						value : '20',
						editable : false,
						width : 85
					});

			// 改变每页显示条数reload数据
			pagesize_combo.on("select", function(comboBox) {
						bbar.pageSize = parseInt(comboBox.getValue());
						number = parseInt(comboBox.getValue());
						store.reload({
									params : {
										start : 0,
										limit : bbar.pageSize
									}
								});
					});
			var number = parseInt(pagesize_combo.getValue());
			// 分页工具栏
			var bbar = new Ext.PagingToolbar({
						pageSize : number,
						store : store,
						displayInfo : true,
						displayMsg : '显示{0}条到{1}条,共{2}条',
						plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
						emptyMsg : "没有符合条件的记录",
						items : ['-', '&nbsp;&nbsp;', pagesize_combo]
					});

			// 表格工具栏
			var tbar = new Ext.Toolbar({
						items : [{
									text : '查询',
									iconCls : 'previewIcon',
									handler : function() {
										qWindow.show();
									}
								}, {
									text : '刷新',
									iconCls : 'arrow_refreshIcon',
									handler : function() {
										store.reload();
									}
								}, {
									text : '发卡',
									iconCls : 'userIcon',
									handler : function() {
										var record = grid.getSelectionModel().getSelected();
										if (Ext.isEmpty(record)) {
											Ext.MessageBox.alert('提示', '请先选择要发卡的人员!');
											return;
										}
										cardForm.getForm().loadRecord(record);
										Ext.getCmp('code').setReadOnly(true);
										Ext.getCmp('name').setReadOnly(true);
										Ext.getCmp('upmode').setValue('single');
										cardWindow.show();
									}
								},  {
									text : '批量发卡',
									iconCls : 'groupIcon',
									handler : function() {
										store.each(function(record){
											cardForm.getForm().loadRecord(record);
											cardWindow.show();
										})
									}
								}]
					});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
						region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
						margins : '3 3 3 3',
						// collapsible : true,
						border : true,
						// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
						title : '<span class="commoncss">人力软件IC卡发卡</span>',
						// height : 500,
						autoScroll : true,
						frame : true,
						store : store, // 数据存储
						stripeRows : true, // 斑马线
						cm : cm, // 列模型
						tbar : tbar,
						bbar : bbar,// 分页工具栏
						viewConfig : {
							// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
							forceFit : true
						},
						loadMask : {
							msg : '正在加载表格数据,请稍等...'
						}
					});

			// 布局
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
					});

			// 查询表格数据
			function queryBalanceInfo(pForm) {
				var params = pForm.getValues();
				params.start = 0;
				params.limit = bbar.pageSize;
				store.load({
							params : params
						});
			};
			
			function batchCard(){
				
			};
			
			var cardForm = new Ext.form.FormPanel({
				id : 'cardForm',
				name : 'cardForm',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [{
					id : 'code',
					name : 'c_code',
					fieldLabel : '员工编号',
					anchor : '99%'
				},{
					id : 'name',
					name : 'c_name',
					fieldLabel : '员工姓名',
					anchor : '99%'
				},{
					id : 'icard',
					name : 'cardid',
					fieldLabel : 'IC卡号',
					anchor : '99%',
					labelStyle : micolor, 
					allowBlank : false,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								saveCardItem();
							}
						}
					}
				},{
					name : 'c_employeeid',
					hidden : true
				},{
					id : 'upmode',
					hidden : true
				}]
			})
			
			var cardWindow = new Ext.Window({
				layout : 'fit',
				width : 300,
				height : 330,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				modal : true,
				title : '<span class="commoncss">发卡</span>',
				// iconCls : 'page_addIcon',
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				pageY : 20,
				pageX : document.body.clientWidth / 2 - 420 / 2,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [cardForm],
				buttons : [{
					text : '保存',
					iconCls : 'acceptIcon',
					handler : function() {
						if (runMode == '0') {
							Ext.Msg.alert('提示',
									'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
							return;
						}
						saveCardItem();
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						cardWindow.hide();
					}
				}]
			});
			
			cardWindow.on('show', function() {
				setTimeout(function() {
							Ext.getCmp('icard').focus();
						}, 200);
			}, this);
			
			function saveCardItem(){
				if (!cardForm.form.isValid()) {
					return;
				}
				
				cardForm.form.submit({
					url : './nusoft.do?reqCode=saveEmpcardItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						cardWindow.hide();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '发卡失败:<br>' + msg);
						var card = Ext.getCmp('icard');
						card.focus();
						card.setValue('');
					}
				});
			}

		});