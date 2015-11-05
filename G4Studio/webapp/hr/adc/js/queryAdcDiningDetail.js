/**
 * 加班申请单管理
 * 
 * @author xuyan
 * @since 2015-03-27
 */
Ext
		.onReady(function() {
			var root = new Ext.tree.AsyncTreeNode({
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});
			var deptTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : '../user.do?reqCode=departmentTreeInit'
				}),
				root : root,
				title : '',
				applyTo : 'deptTreeDiv',
				autoScroll : false,
				animate : false,
				useArrows : false,
				border : false
			});
			deptTree.root.select();
			deptTree.on('click', function(node) {
				deptid = node.attributes.id;
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						deptid : deptid
					}
				});
			});

			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm,
					{
						header : '单号',
						dataIndex : 'over_code',
						width : 80
					}, {
						header : '所属部门',
						dataIndex : 'deptname',
						width : 200
					}, {
						header : '单据状态',
						dataIndex : 'rpt_state',
						renderer : RPT_STATERender,
						width : 130
					}, {
						header : '操作员',
						dataIndex : 'operator_name',
						width : 60
					}, {
						header : '操作时间',
						dataIndex : 'operate_time',
						width : 120
					}, {
						header : '备注',
						dataIndex : 'remark'
					}, {
						id : 'deptid',
						dataIndex : 'deptid',
						hidden : true
					}, {
						dataIndex : 'group_id',
						hidden : true
					}, {
						dataIndex : 'operator',
						hidden : true
					} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcovertime.do?reqCode=queryAdcOvertimeItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'over_code'
						}, {
							name : 'yearmonth'
						}, {
							name : 'deptid'
						}, {
							name : 'deptname'
						}, {
							name : 'operator'
						}, {
							name : 'operator_name'
						}, {
							name : 'operate_time'
						}, {
							name : 'rpt_state'
						}, {
							name : 'remark'
						} ])
					});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('start_month').getValue()
				};
			});

			var pagesize_combo = new Ext.form.ComboBox({
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
			var number = parseInt(pagesize_combo.getValue());
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

			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});
			var grid = new Ext.grid.GridPanel({
				title : '<span class="commoncss">加班申请单</span>',
				height : 500,
				// width:600,
				autoScroll : true,
				region : 'center',
				margins : '3 3 3 3',
				store : store,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				cm : cm,
				sm : sm,
				tbar : [ {
					text : '新建',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_addIcon',
					handler : function() {
						editInit();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteAdcOvertimeItems();
					}
				}, '-', {
					text : 'Excel空表导出',
					iconCls : 'page_excelIcon',
					handler : function(){
						exportExcel('adcovertime.do?reqCode=exportExcel');
					}
				}, '-', {
					text : '导入Excel文件',
					iconCls : 'page_excelIcon',
					handler : function() {
						window.show();
					}
				}, '->', new Ext.form.TextField({
					id : 'start_month',
					name : 'start_month',
					emptyText : '开始年月',
					width : 130
				}), new Ext.form.TextField({
					id : 'end_month',
					name : 'end_month',
					emptyText : '结束年月',
					width : 130
				}), {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryUserItem();
					}
				}, '-', {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				} ],
				bbar : bbar
			});
			store.load({
				params : {
					start : 0,
					limit : bbar.pageSize,
					firstload : 'true'
				}
			});
			grid.on('rowdblclick', function(grid, rowIndex, event) {

			});
			grid.on('sortchange', function() {
				// grid.getSelectionModel().selectFirstRow();
			});

			bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();
			});

			var formpanel = new Ext.form.FormPanel({
				id : 'formpanel',
				name : 'formpanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 99,
				frame : true,
				fileUpload : true,
				items : [ {
					fieldLabel : '年月',
					name : 'yearmonth',
					xtype : 'numberfield',
					allowblank : false,
					anchor : '99%'
				}, {
					fieldLabel : '请选择导入文件',
					name : 'theFile',
					id : 'theFile',
					inputType : 'file',
					allowBlank : true,
					anchor : '99%'
				}, {
					name : 'deptid',
					id : 'import_deptid',
					hidden : true
				} ]
			});

			var window = new Ext.Window(
					{
						layout : 'fit',
						width : 380,
						height : 150,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						title : '导入Excel',
						modal : false,
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ formpanel ],
						buttons : [
								{
									text : '导入',
									iconCls : 'acceptIcon',
									handler : function() {
										var theFile = Ext.getCmp('theFile')
												.getValue();
										if (Ext.isEmpty(theFile)) {
											Ext.Msg.alert('提示',
													'请先选择您要导入的xls文件...');
											return;
										}
										if (theFile.substring(
												theFile.length - 4,
												theFile.length) != ".xls") {
											Ext.Msg.alert('提示',
													'您选择的文件格式不对,只能导入.xls文件!');
											return;
										}
										var selectModel = deptTree.getSelectionModel();
										var selectNode = selectModel.getSelectedNode();
										Ext.getCmp('import_deptid').setValue(selectNode.attributes.id);
										
										formpanel.form
												.submit({
													url : './adcovertime.do?reqCode=importExcel',
													waitTitle : '提示',
													method : 'POST',
													waitMsg : '正在处理数据,请稍候...',
													success : function(form, action) {
														store.reload();
														window.hide();
													},
													failure : function(form, action) {
														var msg = action.result.msg;
														Ext.MessageBox.alert(
																'提示',
																'数据保存失败:<br>'
																		+ msg);
													}
												});

									}
								}, {
									text : '关闭',
									id : 'btnReset',
									iconCls : 'deleteIcon',
									handler : function() {
										window.hide();
									}
								} ]
					});

			/*
			 * 规律班次选择网格
			 */
			// 定义一个Record
			var MyRecord = Ext.data.Record.create([ {
				name : 'id',
				type : 'string'
			}, {
				name : 'over_code',
				type : 'string'
			}, {
				name : 'empid',
				type : 'string'
			}, {
				name : 'code',
				type : 'string'
			}, {
				name : 'name',
				type : 'string'
			}, {
				name : 'days_normal',
				type : 'string'
			}, {
				name : 'hours_normal',
				type : 'string'
			}, {
				name : 'days_weekend',
				type : 'string'
			}, {
				name : 'hours_weekend',
				type : 'string'
			}, {
				name : 'days_holiday',
				type : 'string'
			}, {
				name : 'hours_holiday',
				type : 'string'
			} ]);

			var group_pattern = [ {}, {
				header : '员工编号',
				rowmerge : true,
				domid : 'code',
				align : 'center'
			}, {
				header : '姓名',
				rowmerge : true,
				domid : 'name',
				align : 'center'
			}, {
				header : '平时加班',
				colspan : 2,
				align : 'center'
			}, {
				header : '假日加班',
				colspan : 2,
				align : 'center'
			}, {
				header : '节日加班',
				colspan : 2,
				align : 'center'
			} ];

			var group = new Ext.ux.plugins.GroupHeaderGrid({
				rows : [ group_pattern ]
			});

			var sm_pattern = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
			var cm_pattern = new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer(),
					sm_pattern,
					{
						header : '员工编号',
						dataIndex : 'code',
						width : 80
					},
					{
						header : '姓名',
						dataIndex : 'name',
						width : 100
					},
					{
						header : '天数',
						dataIndex : 'days_normal',
						editor : new Ext.grid.GridEditor(
								new Ext.form.NumberField({})),
						width : 80
					},
					{
						header : '小时数',
						dataIndex : 'hours_normal',
						editor : new Ext.grid.GridEditor(
								new Ext.form.NumberField({})),
						width : 80
					},
					{
						header : '天数',
						dataIndex : 'days_weekend',
						editor : new Ext.grid.GridEditor(
								new Ext.form.NumberField({})),
						width : 80
					},
					{
						header : '小时数',
						dataIndex : 'hours_weekend',
						editor : new Ext.grid.GridEditor(
								new Ext.form.NumberField({})),
						width : 80
					},
					{
						header : '天数',
						dataIndex : 'days_holiday',
						editor : new Ext.grid.GridEditor(
								new Ext.form.NumberField({})),
						width : 80
					},
					{
						header : '小时数',
						dataIndex : 'hours_holiday',
						editor : new Ext.grid.GridEditor(
								new Ext.form.NumberField({})),
						width : 80
					}, {
						dataIndex : 'empid',
						hidden : true
					}, {
						dataIndex : 'over_code',
						hidden : true
					}, {
						dataIndex : 'id',
						hidden : true
					} ]);

			var store_pattern = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcovertime.do?reqCode=queryAdcOvertimeDetailItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'id'
						}, {
							name : 'over_code'
						}, {
							name : 'empid'
						}, {
							name : 'code'
						}, {
							name : 'name'
						}, {
							name : 'days_normal'
						}, {
							name : 'hours_normal'
						}, {
							name : 'days_weekend'
						}, {
							name : 'hours_weekend'
						}, {
							name : 'days_holiday'
						}, {
							name : 'hours_holiday'
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
			var grid_pattern = new Ext.grid.EditorGridPanel(
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
						bbar : bbar_pattern,
						clicksToEdit : 1,
						plugins : group,
						tbar : [
								{
									text : '新增员工',
									iconCls : 'page_addIcon',
									handler : function() {
										queryEmplWindow.show();
									}
								},
								'-',
								{
									text : '删除员工',
									iconCls : 'page_delIcon',
									handler : function() {
										var rows = grid_pattern
												.getSelectionModel()
												.getSelections();
										if (Ext.isEmpty(rows)) {
											Ext.Msg.alert('提示', '请先选中要删除的项目!');
											return;
										}
										for (var i = 0, len = rows.length; i < len; i++) {
											grid_pattern.getStore().remove(
													rows[i]);
										}
									}
								} ]
					});

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
				Ext.getCmp("addAdcOvertimePanel").findById('deptid').setValue(
						node.attributes.id);
				comboxWithTree.collapse();
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
			// 监听下拉框的下拉展开事件
			comboxWithTree.on('expand', function() {
				// 将UI树挂到treeDiv容器
				addDeptTree.render('addDeptTreeDiv');
				// addDeptTree.root.expand(); //只是第一次下拉会加载数据
				addDeptTree.root.reload(); // 每次下拉都会加载数据

			});

			var store_emp = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './empl.do?reqCode=queryEmployeesForManage&dqzt=2'
				}),
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'empid'
				}, {
					name : 'code'
				}, {
					name : 'name'
				}, {
					name : 'jobname'
				} ])
			});

			var sm_emp = new Ext.grid.CheckboxSelectionModel();
			var cm_emp = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(),
					sm, {
						header : '编号',
						dataIndex : 'code',
						width : 80
					}, {
						header : '姓名',
						dataIndex : 'name',
						width : 100
					}, {
						header : '所属部门',
						dataIndex : 'deptname',
						width : 130
					}, {
						header : '岗位',
						dataIndex : 'jobname',
						width : 120
					}, {
						dataIndex : 'deptid',
						hidden : false
					} ]);

			var pagesize_combo_emp = new Ext.form.ComboBox({
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

			var number_emp = parseInt(pagesize_combo_emp.getValue());
			pagesize_combo_emp.on("select", function(comboBox) {
				bbar_emp.pageSize = parseInt(comboBox.getValue());
				number_emp = parseInt(comboBox.getValue());
				store_emp.reload({
					params : {
						start : 0,
						limit : bbar_emp.pageSize
					}
				});
			});

			var bbar_emp = new Ext.PagingToolbar({
				pageSize : number_emp,
				store : store_emp,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo_emp ]
			});

			var grid_emp = new Ext.grid.GridPanel({
				height : 500,
				// width:600,
				autoScroll : true,
				region : 'center',
				margins : '3 3 3 3',
				store : store_emp,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				cm : cm_emp,
				sm : sm_emp,
				tbar : [ new Ext.form.TextField({
					id : 'queryEmplParam',
					name : 'queryEmplParam',
					emptyText : '请输入姓名或者编码',
					enableKeyEvents : true,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								queryUserItem();
							}
						}
					},
					width : 130
				}), {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryEmplItem();
					}
				}, '-', {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store_emp.reload();
					}
				} ],
				bbar : bbar_emp
			});

			function queryEmplItem() {
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				var deptid = selectNode.attributes.id;
				store_emp.load({
					params : {
						start : 0,
						limit : bbar_emp.pageSize,
						queryParam : Ext.getCmp('queryEmplParam').getValue(),
						deptid : deptid
					}
				});
			}

			var queryEmplWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 600,
						height : 500,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">选择人员</span>',
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
						items : [ grid_emp ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
										var rows = grid_emp.getSelectionModel()
												.getSelections();
										if (Ext.isEmpty(rows)) {
											Ext.Msg.alert('提示', '请先选中要添加的人员!');
											return;
										}
										grid_pattern.stopEditing();
										Ext
												.each(
														rows,
														function(item) {
															if (store_pattern
																	.findExact(
																			'empid',
																			item
																					.get('empid')) == -1) {
																var rec = new MyRecord();
																rec
																		.set(
																				'empid',
																				item
																						.get('empid'));
																rec
																		.set(
																				'code',
																				item
																						.get('code'));
																rec
																		.set(
																				'name',
																				item
																						.get('name'));
																store_pattern
																		.insert(
																				0,
																				rec);
															}
														});
										grid_pattern.startEditing(0, 3);
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										queryEmplWindow.hide();
									}
								} ]
					});

			var addAdcOvertimePanel = new Ext.form.FormPanel({
				id : 'addAdcOvertimePanel',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 3 3', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				region : 'north',
				height : 80,
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
							name : 'yearmonth',
							fieldLabel : '月份',
							allowBlank : false,
							labelStyle : micolor,
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
							id : 'over_code',
							name : 'over_code',
							hidden : true
						}, {
							id : 'dirtydata',
							name : 'dirtydata',
							hidden : true
						} ]
					} ]
				} ]
			});

			var addAdcOvertimeWindow = new Ext.Window(
					{
						layout : 'border',
						width : 600,
						height : 500,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增加班申请单</span>',
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
						items : [ addAdcOvertimePanel, grid_pattern ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
										saveAdcOvertimeItem();
									}
								},
								{
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(addAdcOvertimePanel.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcOvertimeWindow.hide();
									}
								} ]
					});

			/**
			 * 布局
			 */
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ {
					region : 'center',
					layout : 'fit',
					border : false,
					margins : '3 3 3 3',
					items : [ grid ]
				} ]
			});

			/**
			 * 根据条件查询人员
			 */
			function queryUserItem() {
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				var deptid = selectNode.attributes.id;
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						start_month : Ext.getCmp('start_month').getValue(),
						end_month : Ext.getCmp('end_month').getValue(),
						deptid : deptid
					}
				});
			}

			/**
			 * 新增初始化
			 */
			function addInit() {
				Ext.getCmp('btnReset').hide();
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					addAdcOvertimePanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcOvertimePanel.getForm());
				}
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				addAdcOvertimeWindow.show();
				addAdcOvertimeWindow
						.setTitle('<span class="commoncss">新增加班数据</span>');
				Ext.getCmp('windowmode').setValue('add');
				comboxWithTree.setDisabled(false);
			}

			/**
			 * 编辑初始化
			 */
			function editInit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
					return;
				}
				if (record.get('rpt_state') == '2') {
					Ext.MessageBox.alert('提示', '加班申请单已经审核，不能修改!');
					return;
				}

				addAdcOvertimePanel.getForm().loadRecord(record);
				var overCode = record.get('over_code');
				store_pattern.load({
					params : {
						over_code : overCode,
						start : 0,
						limit : bbar_pattern.pageSize
					}
				});
				comboxWithTree.setDisabled(true);
				addAdcOvertimeWindow.show();
				addAdcOvertimeWindow
						.setTitle('<span class="commoncss">修改加班申请单</span>');
				Ext.getCmp('windowmode').setValue('edit');
				Ext.getCmp('over_code').setValue(overCode);
				Ext.getCmp('btnReset').hide();
			}

			/**
			 * 保存班次应用数据
			 */
			function saveAdcOvertimeItem() {
				var count = store_pattern.getCount();
				if (count == 0) {
					Ext.Msg.alert('提示', '没有需要保存的明细数据!');
					return;
				}

				if (!addAdcOvertimePanel.form.isValid()) {
					return;
				}

				var jsonArray = [];
				store_pattern.each(function(item) {
					jsonArray.push(item.data);
				});

				Ext.getCmp('dirtydata').setValue(Ext.encode(jsonArray));

				var windowmode = Ext.getCmp('windowmode').getValue();
				if (windowmode == 'add') {
					addAdcOvertimePanel.form.submit({
						url : './adcovertime.do?reqCode=saveAdcOvertimeItem',
						waitTitle : '提示',
						method : 'POST',
						waitMsg : '正在处理数据,请稍候...',
						success : function(form, action) {
							addAdcOvertimeWindow.hide();
							store.reload();
							form.reset();
							Ext.MessageBox.alert('提示', action.result.msg);
						},
						failure : function(form, action) {
							var msg = action.result.msg;
							Ext.MessageBox.alert('提示', '新增数据保存失败:<br>' + msg);
						}
					});
				} else {
					addAdcOvertimePanel.form.submit({
						url : './adcovertime.do?reqCode=updateAdcOvertimeItem',
						waitTitle : '提示',
						method : 'POST',
						waitMsg : '正在处理数据,请稍候...',
						success : function(form, action) {
							addAdcOvertimeWindow.hide();
							store.reload();
							form.reset();
							Ext.MessageBox.alert('提示', action.result.msg);
						},
						failure : function(form, action) {
							var msg = action.result.msg;
							Ext.MessageBox.alert('提示', '新增数据保存失败:<br>' + msg);
						}
					});
				}
			}

			/**
			 * 删除加班申请单
			 */
			function deleteAdcOvertimeItems() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'over_code');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>删除加班申请单将不能恢复,请慎重.</span><br>继续删除吗?',
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
													url : './adcovertime.do?reqCode=deleteAdcOvertimeItems',
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
														strChecked : strChecked
													}
												});
									}
								});
			}
		});