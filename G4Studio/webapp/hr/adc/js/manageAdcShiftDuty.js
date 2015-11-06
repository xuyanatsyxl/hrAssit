/**
 * 值班管理
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
						dataIndex : 'dutyid',
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
						width : 180
					}, {
						header : '备注',
						dataIndex : 'remark'
					}, {
						id : 'deptid',
						dataIndex : 'deptid',
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
									url : './adcshiftduty.do?reqCode=queryAdcShiftDutyItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'dutyid'
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
				title : '<span class="commoncss">值班表管理</span>',
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
						deleteadcshiftdutyItems();
					}
				}, '-', {
					text : 'Excel空表导出',
					iconCls : 'page_excelIcon',
					handler : function() {
						exportExcel('adcshiftduty.do?reqCode=exportExcel');
					}
				}, '-', {
					text : '导入Excel文件',
					iconCls : 'page_excelIcon',
					handler : function() {
						window.show();
					}
				}, {
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
				editInit();
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
					xtype : 'datefield',
					format : 'Ym',
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
										var selectModel = deptTree
												.getSelectionModel();
										var selectNode = selectModel
												.getSelectedNode();
										Ext.getCmp('import_deptid').setValue(
												selectNode.attributes.id);

										formpanel.form
												.submit({
													url : './adcshiftduty.do?reqCode=importExcel',
													waitTitle : '提示',
													method : 'POST',
													waitMsg : '正在处理数据,请稍候...',
													success : function(form,
															action) {
														store.reload();
														window.hide();
													},
													failure : function(form,
															action) {
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
				name : 'xid',
				type : 'string'
			}, {
				name : 'dutyid',
				type : 'string'
			}, {
				name : 'deptid',
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
				name : 'shift_id',
				type : 'string'
			}, {
				name : 'shift_name',
				type : 'string'
			}, {
				name : 'work_time',
				type : 'string'
			}, {
				name : 'off_time',
				type : 'string'
			}, {
				name : 'jobname',
				type : 'string'
			} ]);

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
						width : 120
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
					}, {
						dataIndex : 'deptid',
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
						}, {
							name : 'deptid'
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
						tbar : [
								{
									text : '新增员工',
									iconCls : 'page_addIcon',
									handler : function() {
										var deptid = Ext.getCmp(
												"addadcshiftdutyPanel")
												.findById('deptid').getValue();
										store_emp.load({
											params : {
												deptid : deptid,
												start : 0,
												limit : bbar_emp.pageSize
											}
										});
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
				Ext.getCmp("addadcshiftdutyPanel").findById('deptid').setValue(
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
				}, {
					name : 'deptname'
				}, {
					name : 'deptid'
				} ])
			});

			var sm_emp = new Ext.grid.CheckboxSelectionModel();
			var cm_emp = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(),
					sm_emp, {
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
				var deptid = Ext.getCmp("addadcshiftdutyPanel").findById(
						'deptid').getValue();
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
										Ext.each(rows, function(item) {
											var rec = new MyRecord();
											rec.set('empid', item.get('empid'));
											rec.set('deptid', item.get('deptid'));
											rec.set('code', item.get('code'));
											rec.set('name', item.get('name'));
											rec.set('jobname', item.get('jobname'));
											store_pattern.insert(0,	rec);
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

			var addadcshiftdutyPanel = new Ext.form.FormPanel({
				id : 'addadcshiftdutyPanel',
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
							xtype : 'datefield',
							format : 'Ym',
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
						title : '<span class="commoncss">新增值班表</span>',
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
										saveadcshiftdutyItem();
									}
								},
								{
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(addadcshiftdutyPanel.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addadcshiftdutyWindow.hide();
									}
								} ]
					});

			/**
			 * 布局
			 */
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ {
					title : '<span class="commoncss">组织机构</span>',
					iconCls : 'chart_organisationIcon',
					tools : [ {
						id : 'refresh',
						handler : function() {
							deptTree.root.reload()
						}
					} ],
					collapsible : true,
					width : 210,
					minSize : 160,
					maxSize : 280,
					split : true,
					region : 'west',
					autoScroll : true,
					margins : '3 3 3 3',
					// collapseMode:'mini',
					items : [ deptTree ]
				}, {
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
					addadcshiftdutyPanel.form.getEl().dom.reset();
				} else {
					clearForm(addadcshiftdutyPanel.getForm());
				}
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				addadcshiftdutyWindow.show();
				addadcshiftdutyWindow
						.setTitle('<span class="commoncss">新增值班表</span>');
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
					Ext.MessageBox.alert('提示',
							'值班表已经审核，不能修改!，如一定要修改值班排定，请到排班明细中直接修改！');
					return;
				}

				addadcshiftdutyPanel.getForm().loadRecord(record);
				var dutyid = record.get('dutyid');
				store_pattern.load({
					params : {
						dutyid : dutyid,
						start : 0,
						limit : bbar_pattern.pageSize
					}
				});
				comboxWithTree.setDisabled(true);
				addadcshiftdutyWindow.show();
				addadcshiftdutyWindow
						.setTitle('<span class="commoncss">修改值班表</span>');
				Ext.getCmp('windowmode').setValue('edit');
				Ext.getCmp('dutyid').setValue(dutyid);
				Ext.getCmp('btnReset').hide();
			}

			/**
			 * 保存班次应用数据
			 */
			function saveadcshiftdutyItem() {
				var count = store_pattern.getCount();
				if (count == 0) {
					Ext.Msg.alert('提示', '没有需要保存的明细数据!');
					return;
				}

				if (!addadcshiftdutyPanel.form.isValid()) {
					return;
				}

				var jsonArray = [];
				store_pattern.each(function(item) {
					jsonArray.push(item.data);
				});

				Ext.getCmp('dirtydata').setValue(Ext.encode(jsonArray));

				var windowmode = Ext.getCmp('windowmode').getValue();
				if (windowmode == 'add') {
					addadcshiftdutyPanel.form.submit({
						url : './adcshiftduty.do?reqCode=saveAdcShiftDutyItem',
						waitTitle : '提示',
						method : 'POST',
						waitMsg : '正在处理数据,请稍候...',
						success : function(form, action) {
							addadcshiftdutyWindow.hide();
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
					addadcshiftdutyPanel.form.submit({
						url : './adcshiftduty.do?reqCode=updateAdcShiftDutyItem',
						waitTitle : '提示',
						method : 'POST',
						waitMsg : '正在处理数据,请稍候...',
						success : function(form, action) {
							addadcshiftdutyWindow.hide();
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
			function deleteadcshiftdutyItems() {
				var rows = grid.getSelectionModel().getSelections();
				var fields = '';
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].get('rpt_state') == '2') {
						fields = fields + rows[i].get('dutyid') + '<br>';
					}
				}
				if (fields != '') {
					Ext.Msg.alert('提示', '<b>您选中的项目中包含已经审核的值班表</b><br>' + fields
									+ '<font color=red>已经审核的值班表不能删除!</font>');
					return;
				}
				
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'dutyid');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>删除值班表将不能恢复,请慎重.</span><br>继续删除吗?',
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
													url : './adcshiftduty.do?reqCode=deleteAdcShiftDutyItems',
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