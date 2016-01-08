/**
 * 排班明细管理
 * 
 * @author xuyan
 * @since 2015-04-03
 */
Ext
		.onReady(function() {

			var jsonArray = [];

			var addRoot = new Ext.tree.AsyncTreeNode({
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});

			var addDeptTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : '../user.do?reqCode=departmentTreeInit'
				}),
				root : addRoot,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});

			var comboxWithTree = new Ext.form.ComboBox(
					{
						id : 'deptname',
						store : new Ext.data.SimpleStore({
							fields : [],
							data : [ [] ]
						}),
						editable : false,
						value : ' ',
						emptyText : '请选择...',
						fieldLabel : '所属部门',
						labelStyle : micolor,
						anchor : '100%',
						mode : 'local',
						triggerAction : 'all',
						maxHeight : 390,
						// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
						tpl : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
						allowBlank : false,
						onSelect : Ext.emptyFn
					});

			// 监听下拉树的节点单击事件
			addDeptTree.on('click', function(node) {
				comboxWithTree.setValue(node.text);
				Ext.getCmp("qForm").findById('deptid').setValue(
						node.attributes.id);
				comboxWithTree.collapse();
			});

			// 监听下拉框的下拉展开事件
			comboxWithTree.on('expand', function() {
				// 将UI树挂到treeDiv容器
				addDeptTree.render('addDeptTreeDiv');
				// addDeptTree.root.expand(); //只是第一次下拉会加载数据
				addDeptTree.root.reload(); // 每次下拉都会加载数据

			});

			var qForm = new Ext.form.FormPanel({
				id : 'qForm',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 120,
				items : [ comboxWithTree, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '员工编码',
							name : 'code',
							anchor : '100%'
						}, {
							fieldLabel : '起始日期',
							name : 'start_date',
							xtype : 'datefield', // 设置为数字输入框类型
							anchor : '100%',
							format : 'Y-m-d'
						}, {
							id : 'deptid',
							name : 'deptid',
							hidden : true
						} ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '员工姓名',
							name : 'name',
							anchor : '100%'
						}, {
							fieldLabel : '结束日期', // 标签
							name : 'end_date',
							xtype : 'datefield',
							anchor : '100%',
							format : 'Y-m-d'
						} ]
					} ]
				} ]
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
				items : [ qForm ],
				buttons : [ {
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
				} ]
			});

			qWindow.show(); // 显示窗口

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

			// 定义列模型
			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ rownum, sm, {
				header : '日期',
				dataIndex : 'sch_date',
				width : 100,
				sortable : true
			}, {
				header : '星期',
				dataIndex : 'weeks',
				width : 80,
				sortable : true
			}, {
				header : '出勤类型',
				dataIndex : 'adc_name',
				width : 80,
				sortable : true
			}, {
				header : '考勤符号',
				dataIndex : 'shift_symbol',
				width : 80,
				sortable : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname',
				sortable : true,
				width : 120,
				sortable : true
			}, {
				header : '员工编码',
				dataIndex : 'code',
				width : 80,
				sortable : true
			}, {
				header : '姓名',
				dataIndex : 'empname',
				width : 100,
				sortable : true
			}, {
				header : '参考班次',
				dataIndex : 'shift_name',
				width : 180,
				sortable : true
			}, {
				header : '参考上班时间',
				dataIndex : 'work_time',
				width : 100,
				sortable : true
			}, {
				header : '参考下班时间',
				dataIndex : 'off_time',
				width : 100,
				sortable : true
			}, {
				header : '实上班时间',
				dataIndex : 'actual_work_time',
				width : 100,
				sortable : true
			}, {
				header : '实下班时间',
				dataIndex : 'actual_off_time',
				width : 100,
				sortable : true
			}, {
				header : '上班打卡地点',
				dataIndex : 'deptname_work',
				width : 100,
				sortable : true
			}, {
				header : '下班打卡地点',
				dataIndex :  'deptname_off',
				width : 100,
				sortable : true
			}, {
				header : '出勤类型',
				dataIndex : 'adc_id',
				hidden : true
			}, {
				dataIndex : 'id',
				hidden : true
			} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy(
								{
									url : 'adcshiftscheduling.do?reqCode=queryAdcShiftSchedulingItemForManage'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT', // 记录总数
							root : 'ROOT' // Json中的列表数据根节点
						}, [ {
							name : 'id' // Json中的属性Key值
						}, {
							name : 'sch_date'
						}, {
							name : 'weeks'
						}, {
							name : 'deptid'
						}, {
							name : 'deptname'
						}, {
							name : 'empid'
						}, {
							name : 'code'
						}, {
							name : 'empname'
						}, {
							name : 'shift_id'
						}, {
							name : 'shift_name'
						}, {
							name : 'work_time'
						}, {
							name : 'actual_work_time'
						}, {
							name : 'off_time'
						}, {
							name : 'actual_off_time'
						}, {
							name : 'adc_id'
						}, {
							name : 'adc_name'
						}, {
							name : 'shift_symbol'
						}, {
							name : 'deptname_work'
						}, {
							name : 'deptname_off'
						} ])
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
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
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
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});

			var contextmenu = new Ext.menu.Menu({
				items : [ {
					text : '周休',
					iconCls : 'previewIcon',
					handler : function(item) {
						setWeekEnd('0201');
					}
				}, {
					text : '节休',
					iconCls : 'page_excelIcon',
					handler : function(item) {
						setWeekEnd('0202');
					}
				}, {
					text : '宿休',
					iconCls : 'page_excelIcon',
					handler : function(item) {
						setWeekEnd('0203');
					}
				} ]
			});

			var contextmenu_other = new Ext.menu.Menu({
				items : [ {
					text : '调出',
					iconCls : 'previewIcon',
					handler : function(item) {
						setWeekEnd('0313')
					}
				}, {
					text : '离职',
					iconCls : 'previewIcon',
					handler : function(item) {
						setWeekEnd('0314')
					}
				} ]
			});

			// 表格工具栏
			var tbar = new Ext.Toolbar({
				items : [ {
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
				}, '-', {
					text : '考勤计画',
					iconCls : 'wrenchIcon',
					handler : function() {
						editInit();
					}
				} ]
			});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				// collapsible : true,
				border : true,
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">排班明细表</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				sm : sm,
				tbar : tbar,
				bbar : bbar,// 分页工具栏
				viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
					forceFit : false
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

			// 布局
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ grid ]
			});

			// 查询表格数据
			function queryBalanceInfo(pForm) {
				var params = pForm.getValues();
				params.start = 0;
				params.limit = bbar.pageSize;
				store.load({
					params : params
				});
			}

			var sm_basic = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
			var cm_basic = new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer(), sm_basic, {
						header : '班次编号',
						dataIndex : 'shift_id',
						width : 80
					}, {
						header : '班次名称',
						dataIndex : 'basic_shift_name',
						width : 140
					}, {
						header : '上班时间',
						dataIndex : 'work_time',
						width : 80
					}, {
						header : '下班时间',
						dataIndex : 'off_time',
						width : 80
					}, {
						header : '班次类型',
						dataIndex : 'shift_type',
						width : 120,
						renderer : SHIFT_TYPERender
					} ]);

			/**
			 * 数据存储
			 */
			var store_basic = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftscheduling.do?reqCode=queryAdcShiftBasicItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'shift_id'
						}, {
							name : 'basic_shift_name'
						}, {
							name : 'deptid'
						}, {
							name : 'deptname'
						}, {
							name : 'work_time'
						}, {
							name : 'off_time'
						}, {
							name : 'shift_type'
						}, {
							name : 'remark'
						}, {
							name : 'operator'
						}, {
							name : 'operator_name'
						}, {
							name : 'operate_time'
						} ])
					});

			// 翻页排序时带上查询条件
			store_basic.on('beforeload', function() {
				this.baseParams = {

				// queryParam : Ext.getCmp('queryParam').getValue()
				};
			});

			var pagesize_combo_basic = new Ext.form.ComboBox({
				name : 'pagesize_basic',
				hiddenName : 'pagesize_basic',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : '50',
				editable : false,
				width : 85
			});

			var number_basic = parseInt(pagesize_combo_basic.getValue());
			pagesize_combo_basic.on("select", function(comboBox) {
				bbar_basic.pageSize = parseInt(comboBox.getValue());
				number_basic = parseInt(comboBox.getValue());
				store_basic.reload({
					params : {
						start : 0,
						limit : bbar_basic.pageSize
					}
				});
			});

			var bbar_basic = new Ext.PagingToolbar({
				pageSize : number_basic,
				store : store_basic,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo_basic ]
			});

			var grid_basic = new Ext.grid.GridPanel({
				title : '<span class="commoncss">基本班次表，单击所在行选择</span>',
				height : 500,
				width : 600,
				region : 'east',
				autoScroll : true,
				margins : '3 3 3 3',
				store : store_basic,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : false,
				split : true,
				cm : cm_basic,
				sm : sm_basic,
				bbar : bbar_basic
			});

			store_basic.load({
				params : {
					start : 0,
					limit : bbar_basic.pageSize,
					firstload : 'true'
				}
			});

			grid_basic.on('rowdblclick', function(grid, rowIndex, event) {
				var store = grid.getStore();
				var count = store.getCount();
				var shiftId = store.getAt(rowIndex).get('shift_id');
				var shiftName = store.getAt(rowIndex).get('basic_shift_name');
				if (count > 0) {
					var rows = grid_detail.getSelectionModel().getSelections();
					if (Ext.isEmpty(rows)) {
						Ext.Msg.alert('提示', '请先在左边表格选中要指定班次的日期!');
						return;
					}

					// 开始指定日期
					for (var i = 0; i < rows.length; i++) {
						rows[i].set('shift_id', shiftId);
						rows[i].set('shift_name', shiftName);
					}
				}
			});

			var comboxDetail = new Ext.form.ComboBox(
					{
						id : 'detailname',
						name : 'detailname',
						store : new Ext.data.SimpleStore({
							fields : [],
							data : [ [] ]
						}),
						editable : false,
						value : ' ',
						emptyText : '请选择...',
						fieldLabel : '人员',
						anchor : '100%',
						mode : 'local',
						triggerAction : 'all',
						maxHeight : 390,
						// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
						tpl : "<tpl for='.'><div style='height:390px'><div id='addDetailDiv'></div></div></tpl>",
						allowBlank : true,
						onSelect : Ext.emptyFn
					});

			// 监听下拉框的下拉展开事件
			comboxDetail.on('expand', function() {
				// 将UI树挂到treeDiv容器
				grid_basic.render('addDetailDiv');
				store_basic.reload();

			});

			// 设置值班值宿
			var store_duty = new Ext.data.SimpleStore({
				fields : [ 'name', 'code' ],
				data : [ [ '值班', '0104' ], [ '值宿', '0105' ] ]
			});

			var store_type = new Ext.data.SimpleStore({
				fields : [ 'name', 'code' ],
				data : [ [ '同一天', '0104' ], [ '下一天', '0105' ] ]
			});

			var dutyForm = new Ext.form.FormPanel({
				id : 'dutyForm',
				border : false,
				labelWidth : 100, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				defaultType : 'textfield',
				height : 120,
				items : [ new Ext.form.ComboBox({
					hiddenName : 'adc_id',
					fieldLabel : '修改类型为',
					triggerAction : 'all',
					store : store_duty,
					displayField : 'name',
					valueField : 'code',
					mode : 'local',
					forceSelection : true,
					typeAhead : true,
					labelStyle : micolor,
					allowBlank : false,
					resizable : true,
					anchor : '100%'
				}), comboxDetail, {
					id : 'shift_id',
					name : 'shift_id',
					hidden : false
				} ]
			});

			// 设置周休节休
			function setWeekEnd(value) {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要修改的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'id');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>您确定修改这些项目吗.</span>?',
								function(btn, text) {
									if (btn == 'yes') {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
										showWaitMsg();
										Ext.Ajax
												.request({
													url : './adcshiftscheduling.do?reqCode=updateAdcShiftSchedulingForWeekEnd',
													success : function(response) {
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														store.reload();
														Ext.Msg
																.alert(
																		'提示',
																		resultArray.msg);
													},
													failure : function(response) {
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														Ext.Msg
																.alert(
																		'提示',
																		resultArray.msg);
													},
													params : {
														strChecked : strChecked,
														adc_id : value
													}
												});
									}
								});
			}
			
			var countCombo = new Ext.form.ComboBox({
				name : 'count',
				hiddenName : 'count',
				store : COUNTStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '影响范围',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

			var firstStore = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcattendtype.do?reqCode=queryAdcAttendTypeItemsForCombox'
								}),
						reader : new Ext.data.JsonReader({}, [ {
							name : 'type_id'
						}, {
							name : 'type_name'
						} ]),
						baseParams : {
							level : '1'
						}
					});
			firstStore.load();

			var firstCombo = new Ext.form.ComboBox({
				hiddenName : 'first',
				fieldLabel : '选择类型',
				emptyText : '请选择...',
				triggerAction : 'all',
				store : firstStore,
				displayField : 'type_name',
				valueField : 'type_id',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				forceSelection : true,
				allowBlank : false,
				typeAhead : true,
				resizable : true,
				editable : false,
				labelStyle : micolor,
				anchor : '100%'
			});

			firstCombo.on('select', function() {
				secondCombo.reset();
				var value = firstCombo.getValue();
				secondStore.load({
					params : {
						type_id : value
					}
				});
			});
					

			/**
			 * 自动更换考勤符号
			 */
			function changeShiftSymbol(){
				var value = secondCombo.getValue();
				Ext.Ajax.request({
					url : './adcattendtype.do?reqCode=queryAdcAttendTypeSymbolForPaint',
					success : function(response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						var symbol = resultArray[0].symbol;
						
						var affect = countCombo.getValue();
						if (affect == '-0.5'){
							symbol = symbol + '/';
						}else if (affect == '0.5'){
							symbol = '/' + symbol;
						}
						Ext.getCmp('shift_symbol').setValue(symbol);
					},
					failure : function(response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					params : {
						adc_id : value
					}
				});
			}
			
			var secondStore = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcattendtype.do?reqCode=queryAdcAttendTypeItemsForCombox'
								}),
						reader : new Ext.data.JsonReader({}, [ {
							name : 'type_id'
						}, {
							name : 'type_name'
						} ]),
						baseParams : {
							level : '2'
						}
					});

			var secondCombo = new Ext.form.ComboBox({
				name : 'adc_id',
				hiddenName : 'adc_id',
				fieldLabel : '具体原因',
				emptyText : '请选择...',
				triggerAction : 'all',
				store : secondStore,
				displayField : 'type_name',
				valueField : 'type_id',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				forceSelection : true,
				typeAhead : true,
				allowBlank : false,
				resizable : true,
				editable : false,
				labelStyle : micolor,
				anchor : '100%'
			});

			var modifyPanel = new Ext.form.FormPanel({
				id : 'modifyPanel',
				name : 'modifyPanel',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 120,
				items : [  {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [firstCombo ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ secondCombo ]
					} ]
				}, countCombo, {
					id : 'shift_symbol',
					fieldLabel : '计画符号',
					name : 'shift_symbol',
					maxLength : 20,
					xtype : 'textfield',
					labelStyle : micolor,
					allowBlank : false,
					anchor : '99%'
				}, {
					id : 'strChecked',
					name : 'strChecked',
					xtype : 'textfield',
					hidden : true
				}]
			});

			var dutyWindow = new Ext.Window(
					{
						title : '<span class="commoncss">考勤计画</span>', // 窗口标题
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
						items : [ modifyPanel ],
						buttons : [
								{
									text : '确定',
									iconCls : 'previewIcon',
									handler : function() {
										modifyPanel.form.submit({
											url : './adcshiftscheduling.do?reqCode=updateAdcShiftSchedulingFromPaint',
											waitTitle : '提示',
											method : 'POST',
											waitMsg : '正在处理数据,请稍候...',
											success : function(form, action) {
												dutyWindow.hide();
												store.reload();
												form.reset();
												Ext.MessageBox.alert('提示', action.result.msg);
											},
											failure : function(form, action) {
												var msg = action.result.msg;
												Ext.MessageBox.alert('提示', '考勤计画失败:<br>' + msg);
											}
										});
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										dutyWindow.hide();
									}
								} ]
					});
			
			/**
			 * 考勤计画初始化
			 */
			function editInit() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中计画考勤的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'id');
				Ext.getCmp('strChecked').setValue(strChecked);
				dutyWindow.show();
				dutyWindow.setTitle('<span class="commoncss">考勤计画</span>');
				countCombo.setValue('1');				
			}
			
			secondCombo.on('select', function(){
				changeShiftSymbol();
			});
			countCombo.on('select', function(){
				changeShiftSymbol();	
			});

		});