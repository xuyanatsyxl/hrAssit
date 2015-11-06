/**
 * 加班上报单：上报
 * 
 * @author xuyan
 * @since 2015-05-13
 */
Ext
		.onReady(function() {
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
			// 监听下拉树的节点单击事件
			addDeptTree.on('click', function(node) {
				comboxWithTree.setValue(node.text);
				Ext.getCmp("qForm").findById('deptid').setValue(
						node.attributes.id);
				comboxWithTree.collapse();
			});

			var comboxWithTree = new Ext.form.ComboBox({
				id : 'deptname',
				store : new Ext.data.SimpleStore({
							fields : [],
							data : [[]]
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
			// 监听下拉框的下拉展开事件
			comboxWithTree.on('expand', function() {
						// 将UI树挂到treeDiv容器
						addDeptTree.render('addDeptTreeDiv');
						// addDeptTree.root.expand(); //只是第一次下拉会加载数据
						addDeptTree.root.reload(); // 每次下拉都会加载数据

					});
			

			var rptStateCombo = new Ext.form.ComboBox({
				name : 'rpt_state',
				hiddenName : 'rpt_state',
				store : RPT_STATEStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				fieldLabel : '上报状态',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

			var qForm = new Ext.form.FormPanel({
				id : 'qForm',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 150,
				items : [comboxWithTree, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '值班表号',
							name : 'dutyid',
							xtype : 'textfield', // 设置为数字输入框类型
							anchor : '100%'
						}, {
							fieldLabel : '起始月份',
							name : 'start_month',
							xtype : 'datefield', // 设置为数字输入框类型
							format : 'Ym',
							anchor : '100%'
						} ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ rptStateCombo, {
							fieldLabel : '结束月份',
							name : 'end_month',
							xtype : 'datefield', // 设置为数字输入框类型
							format : 'Ym',
							anchor : '100%'
						}, {
							id : 'deptid',
							name : 'deptid',
							hidden : true
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
				header : '值班表号', // 列标题
				dataIndex : 'dutyid', // 数据索引:和Store模型对应
				width : 80,
				sortable : true
			// 是否可排序
			}, {
				header : '年月',
				dataIndex : 'yearmonth',
				sortable : true,
				width : 80
			}, {
				header : '部门编码',
				dataIndex : 'deptid',
				width : 180,
				sortable : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname',
				width : 200,
				sortable : true
			}, {
				header : '上报状态',
				dataIndex : 'rpt_state',
				renderer : RPT_STATERender,
				sortable : true
			}, {
				header : '起始日期',
				dataIndex : 'qsrq',
				sortable : true
			}, {
				header : '结束日期',
				dataIndex : 'jsrq',
				sortable : true
			}, {
				header : '人数',
				dataIndex : 'rs',
				width : 60,
				sortable : true
			}, {
				header : '操作员',
				dataIndex : 'operator_name',
				width : 60,
				sortable : true
			}, {
				header : '操作时间',
				dataIndex : 'operate_time',
				width : 160,
				sortable : true
			}]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftduty.do?reqCode=queryAdcShiftDutyItemForCheck'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT', // 记录总数
							root : 'ROOT' // Json中的列表数据根节点
						}, [ {
							name : 'dutyid' // Json中的属性Key值
						}, {
							name : 'yearmonth'
						}, {
							name : 'deptid'
						}, {
							name : 'deptname'
						}, {
							name : 'rpt_state'
						}, {
							name : 'operator'
						}, {
							name : 'operate_time'
						}, {
							name : 'operator_name'
						}, {
							name : 'qsrq'
						}, {
							name : 'jsrq'
						}, {
							name : 'rs'
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

			// 表格工具栏
			var tbar = new Ext.Toolbar({
				items : [ {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						qWindow.show();
					}
				}, '-', {
					text : '单据查看',
					iconCls : 'tableIcon',
					handler : function(){
						viewInit();
					}
				}, '-', {
					text : '确认',
					iconCls : 'uploadIcon',
					handler : function(){
						var rows = grid.getSelectionModel().getSelections();
						if (Ext.isEmpty(rows)) {
							Ext.Msg.alert('提示', '请先选中要审核的单据!');
							return;
						}
						var strChecked = jsArray2JsString(rows, 'dutyid');
						Ext.Msg.confirm('请确认', '<span style="color:red"><b>提示:</b>审核后单据将无法修改，请仔细检查后再上报.</span><br>继续吗?',
								function(btn, text) {
									if (btn == 'yes') {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
										showWaitMsg();
										Ext.Ajax.request({
											url : './adcshiftduty.do?reqCode=updateAdcShiftDutyRptstate',
											success : function(response) {
												var resultArray = Ext.util.JSON
														.decode(response.responseText);
												store.reload();
												Ext.Msg.alert('提示', resultArray.msg);
											},
											failure : function(response) {
												var resultArray = Ext.util.JSON
														.decode(response.responseText);
												Ext.Msg.alert('提示', resultArray.msg);
											},
											params : {
												strChecked : strChecked
											}
										});
									}
								});
					}
				}, '-',  {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
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
				title : '<span class="commoncss">加班上报单列表</span>',
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
			grid.on('rowdblclick', function(grid, rowIndex, event) {
				viewInit();
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

			function viewInit(){
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要查看的单据!');
					return;
				}
				addadcshiftdutyPanel.getForm().loadRecord(record);
				addadcshiftdutyWindow.show();
				addadcshiftdutyWindow.setTitle('<span class="commoncss">查看值班表</span>');
				var dutyid = record.get('dutyid');
				store_pattern.load({
					params : {
						dutyid : dutyid,
						start : 0,
						limit : bbar_pattern.pageSize
					}
				});
			}
			
			//明细单据查看
			var sm_pattern = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
			var cm_pattern = new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer(), sm_pattern, {
						header : '值班日期',
						dataIndex : 'dutydate',
						editor : new Ext.grid.GridEditor(
								new Ext.form.DateField({
		
								})),
						renderer: Ext.util.Format.dateRenderer('Y-m-d'),
						width : 80
					}, {
						header : '员工编号',
						dataIndex : 'code',
						width : 80
					}, {
						header : '姓名',
						dataIndex : 'name',
						width : 80
					}, {
						header : '岗位',
						dataIndex : 'jobname',
						width : 80
					}, {
						header : '班次ID',
						dataIndex : 'shift_id',
						editor: new Ext.grid.GridEditor(
								new Ext.form.TextField({

								})),
						width : 80
					}, {
						header : '班次名称',
						dataIndex : 'shift_name',
						width : 200
					}, {
						header : '上班时间',
						dataIndex : 'work_time',
						width : 80
					}, {
						header : '下班时间',
						dataIndex : 'off_time',
						width : 80
					}, {
						dataIndex : 'empid',
						hidden : true
					}, {
						dataIndex : 'dutyid',
						hidden : true
					}, {
						dataIndex : 'xid',
						hidden : true
					} ]);

			var store_pattern = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftduty.do?reqCode=queryAdcShiftDutyDetailItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'xid'
						}, {
							name : 'dutyid'
						}, {
							name : 'dutydate'
						}, {
							name : 'empid'
						}, {
							name : 'code'
						}, {
							name : 'name'
						}, {
							name : 'shift_id'
						}, {
							name : 'shift_name'
						}, {
							name : 'work_time'
						}, {
							name : 'off_time'
						}, {
							name : 'jobname'
						} ])
					});

			var pagesize_combo_pattern = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
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

			var number_pattern = parseInt(pagesize_combo_pattern.getValue());
			pagesize_combo_pattern.on("select", function(comboBox) {
				bbar_pattern.pageSize = parseInt(comboBox.getValue());
				number_pattern = parseInt(comboBox.getValue());
				store_pattern.reload({
					params : {
						start : 0,
						limit : bbar_pattern.pageSize
					}
				});
			});

			var bbar_pattern = new Ext.PagingToolbar({
				pageSize : number_pattern,
				store : store_pattern,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo_pattern ]
			});
			
			var grid_pattern = new Ext.grid.GridPanel(
					{
						title : '<span class="commoncss">包含人员</span>',
						height : 500,
						// width:600,
						autoScroll : true,
						region : 'center',
						margins : '3 3 3 3',
						store : store_pattern,
						loadMask : {
							msg : '正在加载表格数据,请稍等...'
						},
						stripeRows : true,
						frame : true,
						sm : sm_pattern,
						cm : cm_pattern,
						bbar : bbar_pattern
					});
			
			var addadcshiftdutyPanel = new Ext.form.FormPanel({
				id : 'addadcshiftdutyPanel',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 3 3', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				region : 'north',
				height : 60,
				items : [  {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							name : 'deptname',
							fieldLabel : '部门名称',
							xtype : 'textfield',
							disabled : true,
							anchor : '99%'
						}, {
							id : 'windowmode',
							name : 'windowmode',
							hidden : true
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
							name : 'yearmonth',
							fieldLabel : '月份',
							allowBlank : false,
							xtype : 'datefield',
							format : 'Ym',
							disabled : true,
							labelStyle : micolor,
							anchor : '99%'
						}, {
							id : 'dutyid',
							name : 'dutyid',
							hidden : true
						}, {
							id : 'dirtydata',
							name : 'dirtydata',
							hidden : true
						} ]
					} ]
				} ]
			});

			var addadcshiftdutyWindow = new Ext.Window(
					{
						layout : 'border',
						width : 600,
						height : 500,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">查看值班表</span>',
						// iconCls : 'page_addIcon',
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						pageY : 20,
						pageX : document.body.clientWidth / 2 - 820 / 2,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ addadcshiftdutyPanel, grid_pattern ],
						buttons : [{
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addadcshiftdutyWindow.hide();
									}
								} ]
					});

		});