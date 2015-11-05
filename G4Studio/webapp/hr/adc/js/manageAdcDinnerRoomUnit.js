/**
 * 长期就餐单位管理
 * 
 * @author xuyan
 * @since 2015-07-16
 */
Ext
		.onReady(function() {
			var addRoot1 = new Ext.tree.AsyncTreeNode({
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});
			var addDeptTree1 = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : '../user.do?reqCode=departmentTreeInit'
				}),
				root : addRoot1,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});
			// 监听下拉树的节点单击事件
			addDeptTree1.on('click', function(node) {
				comboxWithTree1.setValue(node.text);
				Ext.getCmp('deptid').setValue(node.id);
				comboxEmp.reset();
				store_emp.reload({
					params : {
						deptid : node.attributes.id,
						start : 0,
						limit : bbar_emp.pageSize
					}
				});
				Ext.getCmp('empid').setValue(null);
				groupCombo.reset();
				store_group.reload({
					params : {
						deptid : node.attributes.id,
						start : 0,
						limit : bbar_emp.pageSize
					}
				});
				comboxWithTree1.collapse();
			});
			
			var comboxWithTree1 = new Ext.form.ComboBox({
				id : 'deptname1',
				store : new Ext.data.SimpleStore({
							fields : [],
							data : [ [] ]
				}),
				editable : false,
				value : ' ',
				width : 230,
				emptyText : '请选择...',
				fieldLabel : '所属部门',
				labelStyle : micolor,
				anchor : '100%',
				mode : 'local',
				triggerAction : 'all',
				maxHeight : 390,
				// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
				tpl : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv1'></div></div></tpl>",
				allowBlank : false,
				onSelect : Ext.emptyFn
			});
			
			// 监听下拉框的下拉展开事件
			comboxWithTree1.on('expand', function() {
				// 将UI树挂到treeDiv容器
				addDeptTree1.render('addDeptTreeDiv1');
				addDeptTree1.root.reload(); // 每次下拉都会加载数据
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
				var deptid = node.attributes.id;
				store_room.load({ 
					params : { 
						deptid : deptid,
						start : 0, 
						limit : bbar_room.pageSize
					} 
				});
				store.removeAll();
				comboxWithTree.collapse();
			});
			
			var comboxWithTree = new Ext.form.ComboBox({
										id : 'deptname',
						store : new Ext.data.SimpleStore({
							fields : [],
							data : [ [] ]
						}),
						editable : false,
						value : ' ',
						width : 230,
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
			
			var cm_room = new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer(), {
						header : '食堂编号',
						dataIndex : 'room_id',
						width : 80
					}, {
						header : '食堂名称',
						dataIndex : 'room_name',
						width : 180
					} ]);

			/**
			 * 数据存储
			 */
			var store_room = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcdinnerroom.do?reqCode=queryAdcDinnerRoomItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'room_id'
						}, {
							name : 'room_name'
						} ])
					});

			var pagesize_combo_room = new Ext.form.ComboBox({
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
			var number_room = parseInt(pagesize_combo_room.getValue());
			pagesize_combo_room.on("select", function(comboBox) {
				bbar_room.pageSize = parseInt(comboBox.getValue());
				number_room = parseInt(comboBox.getValue());
				store_room.reload({
					params : {
						start : 0,
						limit : bbar_room.pageSize
					}
				});
			});

			var bbar_room = new Ext.PagingToolbar({
				pageSize : number_room,
				store : store_room,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo_room ]
			});

			var grid_room = new Ext.grid.GridPanel({
				title : '<span class="commoncss">食堂列表</span>',
				frame : true,
				height : 500,
				width : 320,
				autoScroll : true,
				region : 'west',
				margins : '3 3 3 3',
				store : store_room,
				split : true,
				collapsible : true,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				cm : cm_room,
				tbar : [ '<span class="commoncss">选择企业:</span>', comboxWithTree ],
				bbar : bbar_room
			});
			

			
			

			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm,
					{
						header : '流水号',
						dataIndex : 'id',
						width : 35,
						hidden : true
					}, {
						header : '食堂编号',
						dataIndex : 'room_id',
						width : 80
					}, {
						header : '食堂名称',
						dataIndex : 'room_name',
						width : 130
					}, {
						header : '就餐类型',
						dataIndex : 'unit_type',
						renderer : UNIT_TYPERender
					}, {
						id : 'deptname',
						header : '就餐部门',
						dataIndex : 'deptname',
						width : 130
					}, {
						header : '分组号',
						dataIndex : 'group_id',
						width : 80
					}, {
						header : '分组名称',
						dataIndex : 'group_name',
						width : 150
					}, {
						header : '人员编号',
						dataIndex : 'empid',
						width : 80,
						sortable : true
					}, {
						header : '人员名称',
						dataIndex : 'empname',
						width : 80,
						sortable : true
					}, {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '起始有效期',
						dataIndex : 'valid_start_date',
						width : 120
					}, {
						header : '结束有效期',
						dataIndex : 'valid_end_date',
						width : 120						
					}, {
						header : '操作员',
						dataIndex : 'operator_name',
						width : 100
					}, {
						header : '操作时间',
						dataIndex : 'operate_time',
						width : 160
					}, {
						header : '所属部门编号',
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
									url : './adcdinnerroom.do?reqCode=queryAdcDinnerRoomUnitItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'id'
						}, {
							name : 'room_id'
						}, {
							name : 'room_name'
						}, {
							name : 'deptid'
						}, {
							name : 'deptname'
						}, {
							name : 'group_id'
						}, {
							name : 'group_name'
						}, {
							name : 'empid'
						}, {
							name : 'empname'
						}, {
							name : 'unit_type'
						}, {
							name : 'valid_start_date' 
						}, {
							name : 'valid_end_date'
						}, {
							name : 'operator'
						}, {
							name : 'operator_name'
						}, {
							name : 'operate_time'
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

			var contextmenu = new Ext.menu.Menu({
				items : [{
							text : '固定就餐人员',
							iconCls : 'previewIcon',
							handler : function() {
								addInit();
							}
						}, {
							text : '临时就餐人员',
							iconCls : 'page_excelIcon',
							handler : function() {
								Ext.Msg.alert('提示', item.text);
							}
						}]
			});
			
			var grid = new Ext.grid.GridPanel({
				title : '<span class="commoncss">就餐单位列表</span>',
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
					menu : contextmenu 
				}, '-',  {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteAdcDinnerRoomUnitItems();
					}
				}],
				bbar : bbar
			});
			
			grid.on('sortchange', function() {
				// grid.getSelectionModel().selectFirstRow();
			});

			bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();
			});
			
			
			/**
			 * 添加就餐单元部份
			 */
			/**
			 * 分组store
			 */
			var store_group = new Ext.data.Store(
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
						}])
					});
			
			var groupCombo = new Ext.form.ComboBox({
				hiddenName : 'group_id',
				fieldLabel : '分组',
				emptyText : '请选择分组...',
				triggerAction : 'all',
				store : store_group,
				displayField : 'group_name',
				valueField : 'group_id',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				forceSelection : true,
				typeAhead : true,
				resizable : true,
				editable : false,
				anchor : '100%'
			});
			
			var store_emp = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
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
						}])
					});
			
			var cm_emp = new Ext.grid.ColumnModel([
					{
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
				bbar : bbar_emp
			});		
			
			grid_emp.on("cellclick", function(grid, rowIndex, columnIndex, e){
				var store = grid_emp.getStore();
				var record = store.getAt(rowIndex);
				Ext.getCmp('empname').setValue('[' + record.get('code') + ']' + record.get('name'));
				Ext.getCmp('empid').setValue(record.get('empid'));
				comboxEmp.collapse();
			}); 
			
			var comboxEmp = new Ext.form.ComboBox({
				id : 'empname',
				name : 'empname',
				store : new Ext.data.SimpleStore({
							fields : [],
							data : [[]]
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
				tpl : "<tpl for='.'><div style='height:390px'><div id='addEmpDiv'></div></div></tpl>",
				allowBlank : true,
				onSelect : Ext.emptyFn
			});
			
			// 监听下拉框的下拉展开事件
			comboxEmp.on('expand', function() {
						// 将UI树挂到treeDiv容器
						grid_emp.render('addEmpDiv');
						store_emp.reload();

					});
			
			var addAdcShiftApplyPanel = new Ext.form.FormPanel({
				id : 'addAdcShiftApplyPanel',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 3 3', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				region : 'north',
				height : 80,
				items : [ comboxWithTree1, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ groupCombo, {
							id : 'windowmode',
							name : 'windowmode',
							hidden : true
						}, {
							id : 'deptid',
							name : 'deptid',
							hidden : true
						}, {
							id : 'unit_type',
							name : 'unit_type',
							hidden : true
						}]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [  comboxEmp, {
							id : 'empid',
							name : 'empid',
							hidden : true
						}, {
							id : 'room_id',
							name : 'room_id',
							hidden : true
						} ]
					} ]
				} ]
			});

			var addAdcShiftApplyWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 600,
						height : 140,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增就餐单元</span>',
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
						items : [ addAdcShiftApplyPanel],
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
										saveAdcDinnerRoomUnitItem();
									}
								},
								{
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(addAdcShiftApplyPanel
												.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcShiftApplyWindow.hide();
									}
								} ]
					});
			
			grid_room.on("cellclick", function(grid, rowIndex, columnIndex, e) {
				var store_tmp = grid.getStore();
				var record = store_tmp.getAt(rowIndex);
				var roomId = record.get('room_id');
				Ext.getCmp('room_id').setValue(roomId);
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						room_id : roomId
					}
				});	
			});			

			/**
			 * 布局
			 */
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ grid_room, grid ]
			});

			/**
			 * 新增初始化
			 */
			function addInit() {
				//先检查是否选中了食堂
				var record = grid_room.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.Msg.alert('提示', '请先选择要添加就餐单元的食堂!');
					return;
				}
				
				Ext.getCmp('btnReset').hide();
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					addAdcShiftApplyPanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcShiftApplyPanel.getForm());
				}
				addAdcShiftApplyWindow.show();
				addAdcShiftApplyWindow.setTitle('<span class="commoncss">添加就餐单元</span>');
				Ext.getCmp('windowmode').setValue('add');
				Ext.getCmp('room_id').setValue(record.get('room_id'));
				Ext.getCmp('unit_type').setValue('0');
				comboxWithTree1.setDisabled(false);
			}

			/**
			 * 保存数据
			 */
			function saveAdcDinnerRoomUnitItem() {
				if (!addAdcShiftApplyPanel.form.isValid()) {
					return;
				}

				addAdcShiftApplyPanel.form.submit({
					url : './adcdinnerroom.do?reqCode=saveAdcDinnerRoomUnitItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftApplyWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '数据保存失败:<br>' + msg);
					}
				});
			}

			/**
			 * 删除
			 */
			function deleteAdcDinnerRoomUnitItems() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'id');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b></span><br>继续删除吗?',
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
													url : './adcdinnerroom.do?reqCode=deleteAdcDinnerRoomUnitItem',
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