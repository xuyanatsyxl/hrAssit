/**
 * 班组管理
 * 
 * @author xuyan
 * @since 2015-03-28
 */
Ext
		.onReady(function() {

			var param_deptid, param_deptname, param_groupid

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

			// 人员明细的GRID
			var sm_mx = new Ext.grid.CheckboxSelectionModel();
			var cm_mx = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(),
					sm_mx, {
						header : '员工编号',
						dataIndex : 'code',
						width : 100
					}, {
						header : '姓名',
						dataIndex : 'name',
						width : 120
					}, {
						dataIndex : 'oid',
						hidden : true
					}, {
						dataIndex : 'empid',
						hidden : true
					}, {
						dataIndex : 'group_id',
						hidden : true
					} ]);

			/**
			 * 数据存储
			 */
			var store_mx = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftgroup.do?reqCode=queryAdcShiftGroupDetailItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'oid'
						}, {
							name : 'empid'
						}, {
							name : 'code'
						}, {
							name : 'name'
						}, {
							name : 'group_id'
						} ])
					});

			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm,
					{
						header : '分组ID',
						dataIndex : 'group_id',
						width : 90
					}, {
						header : '分组名称',
						dataIndex : 'group_name',
						width : 120
					}, {
						id : 'deptname',
						header : '所属部门',
						dataIndex : 'deptname',
						width : 150
					}, {
						header : '是否启用',
						dataIndex : 'enabled',
						width : 60,
						renderer : ENABLEDRender
					}, {
						id : 'remark',
						header : '备注',
						dataIndex : 'remark'
					}, {
						id : 'deptid',
						header : '所属部门编号',
						dataIndex : 'deptid',
						hidden : true
					} ]);

			// 翻页排序时带上查询条件
			store_mx.on('beforeload', function() {
				this.baseParams = {
						group_id : param_groupid
				}
			});
			
			var pagesize_combo_mx = new Ext.form.ComboBox({
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

			var number_mx = parseInt(pagesize_combo_mx.getValue());
			pagesize_combo_mx.on("select", function(comboBox) {
				bbar_xm.pageSize = parseInt(comboBox.getValue());
				number_mx = parseInt(comboBox.getValue());
				store_mx.reload({
					params : {
						start : 0,
						limit : bbar_mx.pageSize
					}
				});
			});

			var bbar_mx = new Ext.PagingToolbar({
				pageSize : number_mx,
				store : store_mx,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo_mx ]
			});

			var grid_mx = new Ext.grid.GridPanel({
				title : '<span class="commoncss">小组人员列表</span>',
				autoScroll : true,
				margins : '3 3 3 3',
				store : store_mx,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				cm : cm_mx,
				sm : sm_mx,
				tbar : [ {
					text : '添加人员',
					iconCls : 'page_addIcon',
					handler : function() {
						addEmplInit();
					}
				}, '-', {
					text : '删除人员',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteAdcShiftGroupEmpl();
					}
				}, '->', new Ext.form.TextField({
					id : 'queryParam',
					name : 'queryParam',
					emptyText : '代码或姓名',
					enableKeyEvents : true,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								queryUserItem();
							}
						}
					},
					width : 130
				}) ],
				bbar : bbar_mx
			});

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftgroup.do?reqCode=queryAdcShiftGroupItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'group_id'
						}, {
							name : 'group_name'
						}, {
							name : 'deptid'
						}, {
							name : 'deptname'
						}, {
							name : 'enabled'
						}, {
							name : 'remark'
						} ])
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
				title : '<span class="commoncss">分组列表(单击可以查看包含人员)</span>',
				height : 500,
				// width:600,
				autoScroll : true,
				margins : '3 3 3 3',
				store : store,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				// autoExpandColumn : 'remark',
				cm : cm,
				sm : sm,
				tbar : [ {
					text : '新增',
					iconCls : 'page_addIcon',
					handler : function() {
						addGroupInit();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editGroupInit();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteAdcShiftGroup();
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
				editGroupInit();
			});

			grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
				var store = grid.getStore();
				var record = store.getAt(rowIndex);
				param_deptid = record.get('deptid');
				param_deptname = record.get('deptname');
				param_groupid = record.get('group_id');
				var groupId = record.get('group_id');
				store_mx.load({
					params : {
						start : 0,
						limit : bbar_mx.pageSize,
						group_id : groupId
					}
				});
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
				Ext.getCmp("addAdcShiftGroupPanel").findById('deptid')
						.setValue(node.attributes.id);
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

			var enabledCombo = new Ext.form.ComboBox({
				name : 'enabled',
				hiddenName : 'enabled',
				store : ENABLEDStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '是否启用',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

			var addAdcShiftGroupPanel = new Ext.form.FormPanel({
				id : 'addAdcShiftGroupPanel',
				name : 'addAdcShiftGroupPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [ {
					fieldLabel : '分组名称',
					name : 'group_name',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				}, comboxWithTree, {
					fieldLabel : '备注',
					name : 'remark',
					allowBlank : true,
					anchor : '99%'
				}, enabledCombo, {
					id : 'windowmode',
					name : 'windowmode',
					hidden : true
				}, {
					id : 'deptid',
					name : 'deptid',
					hidden : true
				}, {
					id : 'deptid_old',
					name : 'deptid_old',
					hidden : true
				}, {
					id : 'group_id',
					name : 'group_id',
					hidden : true
				}, {
					id : 'updatemode',
					name : 'updatemode',
					hidden : true
				} ]
			});

			var addAdcShiftGroupWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 400,
						height : 200,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增分组</span>',
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
						items : [ addAdcShiftGroupPanel ],
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
										var mode = Ext.getCmp('windowmode')
												.getValue();
										if (mode == 'add')
											saveAdcShiftGroupItem();
										else
											updateUserItem();
									}
								},
								{
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(addAdcShiftGroupPanel
												.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcShiftGroupWindow.hide();
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
				}, {
					region : 'east',
					layout : 'fit',
					border : false,
					split : true,
					width : 350,
					margins : '3 3 3 3',
					items : [ grid_mx ]
				} ]
			});

			/**
			 * 新增分组初始化
			 */
			function addGroupInit() {
				Ext.getCmp('btnReset').hide();
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					addAdcShiftGroupPanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcShiftGroupPanel.getForm());
				}
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				addAdcShiftGroupWindow.show();
				addAdcShiftGroupWindow
						.setTitle('<span class="commoncss">新增分组</span>');
				Ext.getCmp('windowmode').setValue('add');
				comboxWithTree.setDisabled(false);
				// Ext.getCmp('btnReset').show();
				enabledCombo.setValue('1');
			}

			/**
			 * 保存分班数据
			 */
			function saveAdcShiftGroupItem() {
				if (!addAdcShiftGroupPanel.form.isValid()) {
					return;
				}
				addAdcShiftGroupPanel.form.submit({
					url : './adcshiftgroup.do?reqCode=saveAdcShiftGroupItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftGroupWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '分班数据保存失败:<br>' + msg);
					}
				});
			}

			/**
			 * 删除分组
			 */
			function deleteAdcShiftGroup() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'group_id');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>删除分组将同时删除该分组下的人员,请慎重.</span><br>继续删除吗?',
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
													url : './adcshiftgroup.do?reqCode=deleteAdcShiftGroupItem',
													success : function(response) {
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														store.reload();
														store_mx.reload();
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

			/**
			 * 修改分组初始化
			 */
			function editGroupInit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
					return;
				}
				comboxWithTree.setDisabled(true);
				addAdcShiftGroupPanel.getForm().loadRecord(record);
				addAdcShiftGroupWindow.show();
				addAdcShiftGroupWindow
						.setTitle('<span class="commoncss">修改分组</span>');
				Ext.getCmp('windowmode').setValue('edit');
				Ext.getCmp('deptid_old').setValue(record.get('deptid'));
				Ext.getCmp('btnReset').hide();

			}

			/**
			 * 修改人员数据
			 */
			function updateUserItem() {
				if (!addAdcShiftGroupPanel.form.isValid()) {
					return;
				}
				var deptid = Ext.getCmp('deptid').getValue();
				var deptid_old = Ext.getCmp('deptid_old').getValue();
				if (deptid != deptid_old) {
					Ext.Msg.confirm('确认', '修改所属部门将导致该分组下的人员全部丢失! 继续保存吗?',
							function(btn, text) {
								if (btn == 'yes') {
									updateAdcShiftGroup();
								} else {
									return;
								}
							});
					return;
				} else {
					updateAdcShiftGroup();
				}
			}

			/**
			 * 更新分组信息
			 */
			function updateAdcShiftGroup() {
				addAdcShiftGroupPanel.form.submit({
					url : './adcshiftgroup.do?reqCode=updateAdcShiftGroupItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftGroupWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '分组数据修改失败:<br>' + msg);
					}
				});
			}

			/**
			 * 删除分组人员
			 */
			function deleteAdcShiftGroupEmpl() {
				var rows = grid_mx.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'oid');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>您确要从这个分组中删除选中的人员吗？</span>',
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
													url : './adcshiftgroup.do?reqCode=deleteAdcShiftGroupEmplItem',
													success : function(response) {
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														store_mx.reload();
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

			/*
			 * 选择人员窗口开始定义 徐岩
			 */
			var store_empl = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftgroup.do?reqCode=queryUnIntoGroupEmplItemForManage'
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
						} ])
					});

			/**
			 * 翻页查询带上条件
			 */
			store_empl.on('beforeload', function() {
				var deptid = Ext.getCmp('deptid').getValue();
				this.baseParams = {
					deptid : param_deptid
				};
			});

			var pagesize_combo_empl = new Ext.form.ComboBox({
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

			var number_empl = parseInt(pagesize_combo.getValue());
			pagesize_combo_empl.on("select", function(comboBox) {
				bbar_empl.pageSize = parseInt(comboBox.getValue());
				number_empl = parseInt(comboBox.getValue());
				store_empl.reload({
					params : {
						start : 0,
						limit : bbar_empl.pageSize
					}
				});
			});

			var bbar_empl = new Ext.PagingToolbar({
				pageSize : number_empl,
				store : store_empl,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo_empl ]
			});

			var sm_empl = new Ext.grid.CheckboxSelectionModel();
			var cm_empl = new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer(), sm_empl, {
						header : 'empid',
						dataIndex : 'empid',
						hidden : true
					}, {
						header : '员工编码',
						dataIndex : 'code',
						width : 80
					}, {
						header : '姓名',
						dataIndex : 'name',
						width : 100
					}, {
						header : '所属部门',
						dataIndex : 'deptname',
						width : 120
					}, {
						header : '岗位',
						dataIndex : 'jobname',
						width : 100
					} ]);

			var grid_empl = new Ext.grid.GridPanel({
				title : '<span class="commoncss">人员列表</span>',
				height : 500,
				// width:600,
				autoScroll : true,
				margins : '3 3 3 3',
				region : 'center',
				store : store_empl,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				// autoExpandColumn : 'remark',
				cm : cm_empl,
				sm : sm_empl,
				tbar : [ {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store_empl.reload();
					}
				} ],
				bbar : bbar_empl
			});

			var deptTree1 = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : '../user.do?reqCode=departmentTreeInit'
				}),
				// root : root_empl,
				title : '',
				// applyTo : 'deptTreeDiv1',
				width : 200,
				region : 'west',
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});

			deptTree1.on('click', function(node) {
				deptid = node.attributes.id;
				store_empl.load({
					params : {
						start : 0,
						limit : bbar_empl.pageSize,
						deptid : deptid,
						group_id : param_groupid
					}
				});
			});

			/*
			 * 定义窗口
			 */
			var addAdcShiftGroupEmplWindow = new Ext.Window(
					{
						layout : 'border',
						width : 700,
						height : 500,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增人员</span>',
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
						items : [ deptTree1, grid_empl ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										var rows = grid_empl
												.getSelectionModel()
												.getSelections();
										if (Ext.isEmpty(rows)) {
											Ext.Msg.alert('提示', '没有选择任何人员!');
											return;
										}
										var strChecked = jsArray2JsString(rows,
												'empid');
										showWaitMsg();
										Ext.Ajax
												.request({
													url : './adcshiftgroup.do?reqCode=saveAdcShiftGroupEmplItem',
													success : function(response) {
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														store_mx.reload();
														addAdcShiftGroupEmplWindow
																.hide();
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
														group_id : param_groupid
													}
												});
									}

								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcShiftGroupEmplWindow.hide();
									}
								} ]
					});

			function addEmplInit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择增加人员的分组!');
					return;
				}

				store_empl.reload({
					params : {
						start : 0,
						limit : bbar_empl.pageSize,
						deptid : param_deptid,
						group_id : param_groupid
					}
				});

				var root_empl = new Ext.tree.AsyncTreeNode({
					text : param_deptname,
					expanded : true,
					id : param_deptid
				});
				deptTree1.setRootNode(root_empl);
				addAdcShiftGroupEmplWindow.show();
			}
			
			function queryUserItem() {
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				var deptid = selectNode.attributes.id;
				store_mx.load({
							params : {
								start : 0,
								limit : bbar_mx.pageSize,
								queryParam : Ext.getCmp('queryParam').getValue(),
								group_id : param_groupid
							}
						});
			}

		});