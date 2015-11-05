/**
 * 班次设置
 * 
 * @author xuyan
 * @since 2015-02-06
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
			var contextMenu = new Ext.menu.Menu({
				id : 'deptTreeContextMenu',
				items : [ {
					text : '新增人员',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, {
					text : '刷新节点',
					iconCls : 'page_refreshIcon',
					handler : function() {
						var selectModel = deptTree.getSelectionModel();
						var selectNode = selectModel.getSelectedNode();
						if (selectNode.attributes.leaf) {
							selectNode.parentNode.reload();
						} else {
							selectNode.reload();
						}
					}
				} ]
			});
			deptTree.on('contextmenu', function(node, e) {
				e.preventDefault();
				deptid = node.attributes.id;
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						deptid : deptid
					},
					callback : function(r, options, success) {
						for (var i = 0; i < r.length; i++) {
							var record = r[i];
							var deptid_g = record.data.deptid;
							if (deptid_g == deptid) {
								grid.getSelectionModel().selectRow(i);
							}
						}
					}
				});
				node.select();
				contextMenu.showAt(e.getXY());
			});

			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm, {
				header : '班次明细',
				dataIndex : 'entry_person',
				renderer : function(value, cellmeta, record) {
					return '<a href="javascript:void(0);"><img src="../resource/image/ext/edit1.png"/></a>';
				},
				width : 35
			}, {
						header : '班次ID',
						dataIndex : 'shift_id',
						width : 100
					}, {
						header : '班次名称',
						dataIndex : 'shift_name',
						width : 120
					}, {
						id : 'deptname',
						header : '所属部门',
						dataIndex : 'deptname',
						width : 160
					}, {
						header : '录入人',
						dataIndex : 'entry_person_name',
						width : 100
					}, {
						header : '录入时间',
						dataIndex : 'entry_time',
						width : 150
					}, {
						header : '是否启用',
						dataIndex : 'enabled',
						width : 60,
						renderer : ENABLEDRender
					}, {
						header : '人员编号',
						dataIndex : 'entry_person',
						hidden : true
					}, {
						id : 'remark',
						header : '备注',
						dataIndex : 'remark'
					}, {
						id : 'deptid',
						dataIndex : 'deptid',
						hidden : true
					} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './adcshift.do?reqCode=queryAdcShiftItemForManage'
				}),
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'shift_id'
				}, {
					name : 'shift_name'
				}, {
					name : 'deptid'
				}, {
					name : 'deptname'
				}, {
					name : 'entry_person'
				}, {
					name : 'entry_person_name'
				}, {
					name : 'entry_time'
				}, {
					name : 'remark'
				}, {
					name : 'enabled'
				} ])
			});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('queryParam').getValue()
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
				title : '<span class="commoncss">班次列表</span>',
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
				autoExpandColumn : 'remark',
				cm : cm,
				sm : sm,
				tbar : [ {
					text : '新增',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editInit();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteAdcShiftItem();
					}
				}, '->', new Ext.form.TextField({
					id : 'queryParam',
					name : 'queryParam',
					emptyText : '请输入人员名称',
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
				editInit();
			});
			grid.on('sortchange', function() {
				// grid.getSelectionModel().selectFirstRow();
			});
			grid.on("cellclick",
							function(grid, rowIndex, columnIndex, e) {
								var store = grid.getStore();
								var record = store.getAt(rowIndex);
								var fieldName = grid.getColumnModel()
										.getDataIndex(columnIndex);
								if (fieldName == 'entry_person' && columnIndex == 2) {
									var shiftId = record.get('shift_id');
									Ext.getCmp('shift_id_new').setValue(shiftId);
									shiftDetailInit(shiftId);
								}
							});

			bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();
			});

			var sm_mx = new Ext.grid.CheckboxSelectionModel();
			var cm_mx = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(),
					sm_mx, {
						dataIndex : 'shift_id',
						hidden : true
					}, {
						header : '子班次名称',
						dataIndex : 'c_shift_name',
						width : 170
					}, {
						header : '班次类型',
						dataIndex : 'shift_type',
						width : 130,
						renderer : SHIFT_TYPERender
					}, {
						header : '上班时间',
						dataIndex : 'work_time',
						width : 80
					}, {
						header : '下班时间',
						dataIndex : 'off_time',
						width : 80
					}, {
						header : '周休日',
						dataIndex : 'rest_day',
						width : 100
					}, {
						dataIndex : 'item_id',
						hidden : true
					} ]);

			/**
			 * 数据存储
			 */
			var store_mx = new Ext.data.Store(
					{
						id : 'store_mx',
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshift.do?reqCode=queryAdcShiftDetailItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'item_id'
						}, {
							name : 'shift_id'
						}, {
							name : 'c_shift_name'
						}, {
							name : 'shift_type'
						}, {
							name : 'work_time'
						}, {
							name : 'off_time'
						}, {
							name : 'rest_day'
						} ])
					});

			// 翻页排序时带上查询条件
			store_mx.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('queryParam').getValue()
				};
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
				bbar_mx.pageSize = parseInt(comboBox.getValue());
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
				title : '<span class="commoncss">班次明细</span>',
				height : 500,
				// width:600,
				autoScroll : true,
				//region : 'center',
				margins : '3 3 3 3',
				store : store_mx,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				// autoExpandColumn : 'remark',
				cm : cm_mx,
				sm : sm_mx,
				tbar : [ {
					text : '新增',
					iconCls : 'page_addIcon',
					handler : function() {
						addDetailInit();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editDetailInit();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteAdcShiftItem();
					}
				} ],
				bbar : bbar_mx
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
				Ext.getCmp("addUserFormPanel").findById('deptid').setValue(
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
				allowBlank : false,
				labelStyle : micolor,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});
			
			var shift_typeCombo = new Ext.form.ComboBox({
				name : 'shift_type',
				hiddenName : 'shift_type',
				store : SHIFT_TYPEStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '班次类型',
				emptyText : '请选择...',
				allowBlank : false,
				labelStyle : micolor,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

			var addAdcShiftFormPanel = new Ext.form.FormPanel({
				id : 'addAdcShiftFormPanel',
				name : 'addAdcShiftFormPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [ {
					fieldLabel : '班次名称',
					name : 'shift_name',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				}, comboxWithTree, enabledCombo, {
					fieldLabel : '备注',
					name : 'remark',
					allowBlank : true,
					anchor : '99%'
				}, {
					id : 'windowmode',
					name : 'windowmode',
					hidden : true
				}, {
					id : 'shift_id',
					name : 'shift_id',
					hidden : true
				}, {
					id : 'updatemode',
					name : 'updatemode',
					hidden : true
				}, {
					id : 'deptid',
					name : 'deptid',
					hidden : true
				} ]
			});

			var addAdcShiftWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 400,
						height : 200,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增班次</span>',
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
						items : [ addAdcShiftFormPanel],
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
											saveAdcShiftItem();
										else
											updateAdcShiftItem();
									}
								},
								{
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(addAdcShiftDetailFormPanel.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcShiftDetailWindow.hide();
									}
								} ]
					});
			
			
			var addAdcShiftDetailFormPanel = new Ext.form.FormPanel({
				id : 'addAdcShiftDetailFormPanel',
				name : 'addAdcShiftDetailFormPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [ {
					fieldLabel : '子班次名称',
					name : 'c_shift_name',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				}, shift_typeCombo, {
					fieldLabel : '上班时间',
					name : 'work_time',
					allowBlank : false,
					labelStyle : micolor,
					format : 'H:i',
					xtype : 'timefield',
					anchor : '60%'
				}, {
					fieldLabel : '下班时间',
					name : 'off_time',
					allowBlank : false,
					labelStyle : micolor,
					format : 'H:i',
					xtype : 'timefield',
					anchor : '60%'
				}, {
					fieldLabel : '周休日',
					name : 'rest_day',
					allowBlank : true,
					anchor : '60%'
				}, {
					id : 'windowmode_detail',
					name : 'windowmode',
					hidden : true
				}, {
					id : 'shift_id_detail',
					name : 'shift_id',
					hidden : true
				}, {
					id : 'updatemode_detail',
					name : 'updatemode',
					hidden : true
				}, {
					name : 'item_id',
					hidden : true
				} ]
			});

			var addAdcShiftDetailWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 400,
						height : 260,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增明细班次</span>',
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
						items : [ addAdcShiftDetailFormPanel],
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
										var mode = Ext.getCmp('windowmode_detail')
												.getValue();
										if (mode == 'add')
											saveAdcShiftDetailItem();
										else
											updateAdcShiftDetailItem();
									}
								},
								{
									text : '重置',
									id : 'btnDetailReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(addAdcShiftDetailFormPanel.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcShiftDetailWindow.hide();
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
						queryParam : Ext.getCmp('queryParam').getValue(),
						deptid : deptid
					}
				});
			}

			/**
			 * 新增考勤班次初始化
			 */
			function addInit() {
				Ext.getCmp('btnReset').hide();
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					addAdcShiftFormPanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcShiftFormPanel.getForm());
				}
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				addAdcShiftWindow.show();
				addAdcShiftWindow.setTitle('<span class="commoncss">新增班次</span>');
				Ext.getCmp('windowmode').setValue('add');
				enabledCombo.setValue('1');
				comboxWithTree.setDisabled(false);
			}
			
			/**
			 * 新增考勤班次明细初始化
			 */
			function addDetailInit() {
				Ext.getCmp('btnDetailReset').hide();
				var flag = Ext.getCmp('windowmode_detail').getValue();
				if (typeof (flag) != 'undefined') {
					addAdcShiftDetailFormPanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcShiftDetailFormPanel.getForm());
				}
				addAdcShiftDetailWindow.show();
				addAdcShiftDetailWindow.setTitle('<span class="commoncss">新增明细班次</span>');
				Ext.getCmp('windowmode_detail').setValue('add');
				var shiftid = Ext.getCmp('shift_id_new').getValue();
				Ext.getCmp('shift_id_detail').setValue(shiftid);
			}

			/**
			 * 保存班次数据
			 */
			function saveAdcShiftItem() {
				if (!addAdcShiftFormPanel.form.isValid()) {
					return;
				}

				addAdcShiftFormPanel.form.submit({
					url : './adcshift.do?reqCode=saveAdcShiftItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '班次数据保存失败:<br>' + msg);
					}
				});
			}
			
			/**
			 * 保存明细班次数据
			 */
			function saveAdcShiftDetailItem() {
				if (!addAdcShiftDetailFormPanel.form.isValid()) {
					return;
				}

				addAdcShiftDetailFormPanel.form.submit({
					url : './adcshift.do?reqCode=saveAdcShiftDetailItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftDetailWindow.hide();
						store_mx.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '班次明细数据保存失败:<br>' + msg);
					}
				});
			}

			/**
			 * 删除班次（连带删除子班次）
			 */
			function deleteAdcShiftItem() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'shift_id');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>删除班次将连带删除该班次所有子班次定议,请慎重.</span><br>继续删除吗?',
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
													url : './adcshift.do?reqCode=deleteAdcShiftItem',
													success : function(response) {
														var resultArray = Ext.util.JSON.decode(response.responseText);
														store.reload();
														Ext.Msg.alert('提示', resultArray.msg);
													},
													failure : function(response) {
														var resultArray = Ext.util.JSON.decode(response.responseText);
														Ext.Msg.alert('提示', resultArray.msg);
													},
													params : {
														strChecked : strChecked
													}
												});
									}
								});
			}

			/**
			 * 修改班次初始化
			 */
			function editInit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
					return;
				}
				
				addAdcShiftFormPanel.getForm().loadRecord(record);
				addAdcShiftWindow.show();
				addAdcShiftWindow.setTitle('<span class="commoncss">修改班次</span>');
				Ext.getCmp('windowmode').setValue('edit');
				comboxWithTree.setDisabled(true)
				Ext.getCmp('btnReset').hide();

			}

			/**
			 * 修改明细班次初始化
			 */
			function editDetailInit() {
				var record = grid_mx.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
					return;
				}
				
				addAdcShiftDetailFormPanel.getForm().loadRecord(record);
				addAdcShiftDetailWindow.show();
				addAdcShiftDetailWindow.setTitle('<span class="commoncss">修改明细</span>');
				Ext.getCmp('windowmode_detail').setValue('edit');
				Ext.getCmp('btnDetailReset').hide();

			}
			/**
			 * 修改班次数据
			 */
			function updateAdcShiftItem() {
				if (!addAdcShiftFormPanel.form.isValid()) {
					return;
				}
				update();
			}

			/**
			 * 更新
			 */
			function update() {
				addAdcShiftFormPanel.form.submit({
					url : './adcshift.do?reqCode=updateAdcShiftItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '班次数据修改失败:<br>' + msg);
					}
				});
			}
			
			/**
			 * 修改明细班次数据
			 */
			function updateAdcShiftDetailItem() {
				if (!addAdcShiftDetailFormPanel.form.isValid()) {
					return;
				}
				addAdcShiftDetailFormPanel.form.submit({
					url : './adcshift.do?reqCode=updateAdcShiftDetailItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftDetailWindow.hide();
						store_mx.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '班次明细数据修改失败:<br>' + msg);
					}
				});
				
			}


			
			var shiftDetailWindow = new Ext.Window({
				layout : 'fit',
				width : 700,
				height : 500,
				closeable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">班次明细</span>',
				iconCls : 'group_linkIcon',
				modal : true,
				pageY : 15,
				pageX : document.body.clientWidth / 2 - 420 / 2,
				collapsible : true,
				maximizable : false,
				animateTarget: document.body,
				// //如果使用autoLoad,建议不要使用动画效果
				buttonAlign : 'right',
				constrain : true,
				items : [ grid_mx,{
					id : 'shift_id_new',
					xtype : 'textfield',
					hidden : false
				} ],
				buttons : [ {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						shiftDetailWindow.hide();
					}
				} ]
			});

			/**
			 * 班次明细定义窗口初始化
			 */
			function shiftDetailInit(shiftid) {
				shiftDetailWindow.show();
				store_mx.load({
					params : {
						shift_id : shiftid,
						start : 0,
						limit : bbar_mx.pageSize
					}
				});
			}

		});