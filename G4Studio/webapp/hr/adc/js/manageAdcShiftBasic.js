/**
 * 基本班次管理
 * 
 * @author xuyan
 * @since 2015-03-25
 */
Ext
		.onReady(function() {

			var typeStore = new Ext.data.Store(
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

			var typeCombo = new Ext.form.ComboBox({
				hiddenName : 'adc',
				fieldLabel : '关联出勤',
				emptyText : '请选择主类型...',
				triggerAction : 'all',
				store : typeStore,
				displayField : 'type_name',
				valueField : 'type_id',
				loadingText : '正在加载数据...',
				mode : 'remote',
				forceSelection : true,
				typeAhead : true,
				resizable : true,
				editable : false,
				anchor : '100%'
			});

			typeCombo.on('select', function() {
				adcCombo.reset();
				var value = typeCombo.getValue();
				adcStore.load({
					params : {
						type_id : value
					}
				});
			});

			var adcStore = new Ext.data.Store(
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

			var adcCombo = new Ext.form.ComboBox({
				name : 'adc_id',
				hiddenName : 'adc_id',
				fieldLabel : '之中的',
				emptyText : '请选择...',
				triggerAction : 'all',
				store : adcStore,
				displayField : 'type_name',
				valueField : 'type_id',
				loadingText : '正在加载数据...',
				mode : 'local',
				forceSelection : true,
				typeAhead : true,
				resizable : true,
				editable : false,
				anchor : '100%'
			});

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
						header : '班次编号',
						dataIndex : 'shift_id',
						width : 80
					}, {
						header : '班次名称',
						dataIndex : 'basic_shift_name',
						width : 140
					}, {
						id : 'deptname',
						header : '影响部门',
						dataIndex : 'deptname',
						width : 130
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
					}, {
						header : '考勤类型',
						dataIndex : 'type_name',
						width : 60
					}, {
						header : '操作人',
						dataIndex : 'operator_name',
						width : 80
					}, {
						header : '操作时间',
						dataIndex : 'operate_time',
						format : 'Y-m-d',
						width : 120
					}, {
						header : '备注',
						dataIndex : 'remark'
					}, {
						id : 'deptid',
						header : '所属部门编号',
						dataIndex : 'deptid',
						hidden : true
					}, {
						dataIndex : 'operator',
						hidden : true
					}, {
						dataIndex : 'adc_id',
						hidden : true
					} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftbasic.do?reqCode=queryAdcShiftBasicItemForManage'
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
						}, {
							name : 'type_name'
						}, {
							name : 'adc_id'
						}, {
							name : 'interval_start_time'
						}, {
							name : 'interval_end_time'
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
				title : '<span class="commoncss">基本班次表</span>',
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
						deleteAdcShiftBasicItems();
					}
				}, '->', new Ext.form.TextField({
					id : 'queryParam',
					name : 'queryParam',
					emptyText : '请输入基本班次编号或名称',
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

			bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();
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
				Ext.getCmp("addAdcShiftBasicPanel").findById('deptid')
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
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

			var addAdcShiftBasicPanel = new Ext.form.FormPanel({
				id : 'addAdcShiftBasicPanel',
				name : 'addAdcShiftBasicPanel',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 120,
				items : [ {
					fieldLabel : '班次名称',
					name : 'basic_shift_name',
					allowBlank : false,
					labelStyle : micolor,
					xtype : 'textfield',
					anchor : '99%'
				}, comboxWithTree, shift_typeCombo, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '上班时间',
							name : 'work_time',
							format : 'H:i',
							xtype : 'timefield',
							labelStyle : micolor,
							allowBlank : false,
							anchor : '99%'
						}, typeCombo, {
							fieldLabel : '间休时间',
							name : 'interval_start_time',
							format : 'H:i',
							xtype : 'timefield',
							allowBlank : true,
							anchor : '99%'
						} ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '下班时间',
							name : 'off_time',
							format : 'H:i',
							xtype : 'timefield',
							labelStyle : micolor,
							allowBlank : false,
							anchor : '99%'
						}, adcCombo, {
							fieldLabel : '到',
							name : 'interval_end_time',
							format : 'H:i',
							xtype : 'timefield',
							allowBlank : true,
							anchor : '99%'
						} ]
					} ]
				}, {
					fieldLabel : '备注',
					name : 'remark',
					maxLength : 20,
					xtype : 'textfield',
					allowBlank : true,
					anchor : '100%'
				}, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							id : 'windowmode',
							name : 'windowmode',
							hidden : true
						}, {
							id : 'updatemode',
							name : 'updatemode',
							hidden : true
						}, {
							name : 'operator',
							hidden : true
						} ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							id : 'deptid',
							name : 'deptid',
							hidden : true
						}, {
							id : 'shift_id',
							name : 'shift_id',
							hidden : true
						}, {
							name : 'operate_time',
							hidden : true
						} ]
					} ]
				} ]
			});

			var addAdcShiftBasicWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 400,
						height : 260,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增基本班次</span>',
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
						items : [ addAdcShiftBasicPanel ],
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
											saveAdcShiftBasicItem();
										else
											updateAdcShiftBasicItem();
									}
								},
								{
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(addAdcShiftBasicPanel
												.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcShiftBasicWindow.hide();
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
			 * 根据条件查询班次信息
			 */
			function queryAdcShiftBasicItem() {
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
			 * 新增基本班次初始化
			 */
			function addInit() {
				Ext.getCmp('btnReset').hide();
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					addAdcShiftBasicPanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcShiftBasicPanel.getForm());
				}
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				addAdcShiftBasicWindow.show();
				addAdcShiftBasicWindow
						.setTitle('<span class="commoncss">新增基本班次</span>');
				Ext.getCmp('windowmode').setValue('add');
				comboxWithTree.setDisabled(false);
			}

			/**
			 * 保存基本班次数据
			 */
			function saveAdcShiftBasicItem() {
				if (!addAdcShiftBasicPanel.form.isValid()) {
					return;
				}
				addAdcShiftBasicPanel.form.submit({
					url : './adcshiftbasic.do?reqCode=saveAdcShiftBasicItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftBasicWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '基本班次数据保存失败:<br>' + msg);
					}
				});
			}

			/**
			 * 删除基本班次
			 */
			function deleteAdcShiftBasicItems() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'shift_id');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>删除基本班次信息将不能恢复,请慎重.</span><br>继续删除吗?',
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
													url : './adcshiftbasic.do?reqCode=deleteAdcShiftBasicItem',
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

			/**
			 * 修改基本班次初始化
			 */
			function editInit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
					return;
				}

				addAdcShiftBasicPanel.getForm().loadRecord(record);
				addAdcShiftBasicWindow.show();
				addAdcShiftBasicWindow
						.setTitle('<span class="commoncss">修改基本班次</span>');
				Ext.getCmp('windowmode').setValue('edit');
				var firstAdcId = record.get('adc_id').substr(1, 2);
				typeStore.load();
				adcStore.load();
				typeCombo.setValue(firstAdcId);
				Ext.getCmp('shift_id').setValue(record.get('shift_id'));
				Ext.getCmp('btnReset').hide();

			}

			/**
			 * 修改基本班次数据
			 */
			function updateAdcShiftBasicItem() {
				if (!addAdcShiftBasicPanel.form.isValid()) {
					return;
				}
				update();
			}

			/**
			 * 更新
			 */
			function update() {
				addAdcShiftBasicPanel.form.submit({
					url : './adcshiftbasic.do?reqCode=updateAdcShiftBasicItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftBasicWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '基本班次数据修改失败:<br>' + msg);
					}
				});
			}
		});

	/**
	 * 根据条件查询
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