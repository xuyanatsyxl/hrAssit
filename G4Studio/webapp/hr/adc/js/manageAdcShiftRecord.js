/**
 * 排班记录管理
 * 
 * @author xuyan
 * @since 2015-03-27
 */
Ext.onReady(function() {

			var qForm = new Ext.form.FormPanel({
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 160,
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '起始日期',
							id : 'start_date',
							name : 'start_date',
							xtype : 'datefield', 
							format : 'Y-m-d',
							labelStyle : micolor,
							allowBlank : false,
							anchor : '100%'
						}, new Ext.form.Checkbox({
								id : 'musted',
								name : 'musted',
								checked: false,
								boxLabel: '覆盖已存在排班'
						})
						]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							id : 'end_date',
							fieldLabel : '结束日期', // 标签
							name : 'end_date', // name:后台根据此name属性取值
							xtype : 'datefield',
							format : 'Y-m-d',
							labelStyle : micolor,
							allowBlank : false, // 是否允许为空
							anchor : '100%' // 宽度百分比
						}]
					}, {
						columnWidth : .99,
						layout : 'form',
						labelWidth : 60,
						border : false,
						items : [{
							fieldLabel : '排班原则',
							xtype : 'textarea',
							disabled : true,
							value : '1、排班优先级：个人  > 分组  > 小部门 > 大部门。2、同优先级的排班，后生成的排班会覆盖已经生成的当日及当日以后的排班。',
							anchor : '100%'
						}]
					}, {
						id : 'dirtydata',
						name : 'dirtydata',
						xtype : 'textfield',
						hidden : true
					} ]
				}]
			});

			var qWindow = new Ext.Window({
				title : '<span class="commoncss">选择条件</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 400, // 窗口宽度
				height : 200, // 窗口高度
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
					text : '生成',
					iconCls : 'previewIcon',
					handler : function() {
						if (!qForm.form.isValid()){
							return;
						}
						
						qForm.form.submit({
							url : './adcshiftscheduling.do?reqCode=makeSchedulingByStartAndEndDate',
							waitTitle : '提示',
							method : 'POST'
						});
						Ext.Msg.alert('提示', '排班表生成工作已经提交，请等待后台生成排班表！');
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
						dataIndex : 'rec_id',
						hidden : true
					}, {
						dataIndex : 'pattern_id',
						hidden : true
					}, {
						dataIndex : 'apply_id',
						hidden : true
					}, {
						header : '排班类型',
						dataIndex : 'record_type',
						width : 100,
						renderer : RECORD_TYPERender
					}, {
						header : '规律班次名称',
						dataIndex : 'pattern_shift_name',
						width : 130
					}, {
						id : 'deptname',
						header : '所属部门',
						dataIndex : 'deptname',
						width : 130
					}, {
						header : '所属分组',
						dataIndex : 'group_name',
						width : 80
					}, {
						header : '人员姓名',
						dataIndex : 'empname',
						width : 80
					}, {
						header : '初始日期',
						dataIndex : 'init_date',
						width : 100
					}, {
						header : '初始位置',
						dataIndex : 'init_position',
						width : 100
					}, {
						header : '可否节休',
						dataIndex : 'holiable',
						renderer : HOLIABLERender
					}, {
						header : '操作人',
						dataIndex : 'operator_name',
						width : 100
					}, {
						header : '操作时间',
						dataIndex : 'operate_time',
						width : 120
					}, {
						dataIndex : 'operator',
						hidden : true
					}, {
						id : 'deptid',
						header : '所属部门编号',
						dataIndex : 'deptid',
						hidden : true
					}, {
						dataIndex : 'group_id',
						hidden : true
					}, {
						header : '优先级',
						dataIndex : 'priority',
						hidden : false
					}, {
						dataIndex : 'start_shift_id',
						hidden : true
					} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftrecord.do?reqCode=queryAdcShiftRecordItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'rec_id'
						}, {
							name : 'apply_id'
						}, {
							name : 'record_type'
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
							name : 'pattern_id'
						}, {
							name : 'pattern_shift_name'
						}, {
							name : 'init_date'
						}, {
							name : 'init_position'
						}, {
							name : 'operator'
						}, {
							name : 'operator_name'
						}, {
							name : 'operate_time'
						}, {
							name : 'priority'
						}, {
							name : 'holiable'
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
			var grid = new Ext.grid.GridPanel(
					{
						title : '<span class="commoncss">排班记录  班次生成原则：个人 > 分组 > 部门 </span>',
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
							text : '新建排班',
							iconCls : 'page_addIcon',
							handler : function() {
								addInit();
							}
						}, '-', {
							text : '删除',
							iconCls : 'page_delIcon',
							handler : function() {
								deleteAdcShiftRecordItems();
							}
						}, '-', {
							text : '生成排班表',
							iconCls : 'page_delIcon',
							handler : function() {
								var rows = grid.getSelectionModel().getSelections();
								if (Ext.isEmpty(rows)) {
									Ext.Msg.alert('提示', '请先选中要生成排班表的项目!');
									return;
								}
								
								var jsonArray = [];			
								Ext.each(rows, function(item) {
									jsonArray.push(item.data);
								});
								
								Ext.getCmp('dirtydata').setValue(Ext.encode(jsonArray));
								/**
								 * 只有developer用户可以强制更新班次
								 */
								if (login_account != parent.DEFAULT_DEVELOP_ACCOUNT){
									Ext.getCmp('musted').setVisible(false);
								}
								qWindow.show();
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
				Ext.getCmp("addAdcShiftRecordPanel").findById('deptid')
						.setValue(node.attributes.id);
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

			var store_apply = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftapply.do?reqCode=queryAdcShiftApplyItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'apply_id'
						}, {
							name : 'record_type'
						}, {
							name : 'deptname'
						}, {
							name : 'group_name'
						}, {
							name : 'empname'
						}, {
							name : 'pattern_id'
						} ])
					});

			var cm_apply = new Ext.grid.ColumnModel([ {
				header : '排班类型',
				dataIndex : 'record_type',
				width : 80,
				renderer : RECORD_TYPERender
			}, {
				header : '部门',
				dataIndex : 'deptname',
				width : 100
			}, {
				header : '分组',
				dataIndex : 'group_name',
				width : 130
			}, {
				header : '姓名',
				dataIndex : 'empname',
				width : 100
			}, {
				dataIndex : 'pattern_id',
				hidden : true
			}, {
				dataIndex : 'apply_id',
				hidden : true
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
				var deptid = Ext.getCmp('deptid').getValue();
				store_emp.reload({
					params : {
						deptid : deptid,
						start : 0,
						limit : bbar_emp.pageSize
					}
				});
			});

			var bbar_emp = new Ext.PagingToolbar({
				pageSize : number_emp,
				store : store_apply,
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
				store : store_apply,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				cm : cm_apply,
				bbar : bbar_emp
			});

			grid_emp.on("cellclick", function(grid, rowIndex, columnIndex, e) {
				var store = grid.getStore();
				var record = store.getAt(rowIndex);
				var i = record.get('record_type');
				if (i == '1') {
					Ext.getCmp('empname').setValue(
							'[部门排班]' + record.get('deptname'));
				} else if (i == '2') {
					Ext.getCmp('empname').setValue(
							'[分组排班]' + record.get('deptname') + ' '
									+ record.get('group_name'));
				} else if (i == '3') {
					Ext.getCmp('empname').setValue(
							'[个人排班]' + record.get('deptname') + ' '
									+ record.get('empname'));
				}

				Ext.getCmp('apply_id').setValue(record.get('apply_id'));
				var patternId = record.get('pattern_id');
				comboxDetail.reset();
				store_detail.reload({
					params : {
						pattern_id : patternId
					}
				});

				Ext.getCmp('pattern_id').setValue(patternId);
				comboxEmp.collapse();
			});

			var comboxEmp = new Ext.form.ComboBox(
					{
						id : 'empname',
						name : 'empname',
						store : new Ext.data.SimpleStore({
							fields : [],
							data : [ [] ]
						}),
						editable : false,
						value : ' ',
						emptyText : '请选择...',
						fieldLabel : '班次应用',
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
				var deptid = Ext.getCmp('deptid').getValue();
				grid_emp.render('addEmpDiv');
				store_apply.reload({
					params : {
						deptid : deptid,
						start : 0,
						limit : bbar_emp.pageSize
					}
				});

			});

			/**
			 * 循环开始点
			 */
			var store_detail = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftpattern.do?reqCode=queryAdcShiftPatternDetailItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'position_id'
						}, {
							name : 'pattern_id'
						}, {
							name : 'shift_id'
						}, {
							name : 'shift_name'
						} ])
					});

			var cm_detail = new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer(), {
						header : '顺序号',
						dataIndex : 'position_id',
						width : 80
					}, {
						dataIndex : 'pattern_id',
						hidden : true
					}, {
						dataIndex : 'shift_id',
						hidden : true
					}, {
						header : '基本班次',
						dataIndex : 'shift_name',
						width : 160
					} ]);

			var grid_detail = new Ext.grid.GridPanel({
				height : 400,
				width : 280,
				autoScroll : true,
				region : 'center',
				margins : '3 3 3 3',
				store : store_detail,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : false,
				cm : cm_detail
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
						fieldLabel : '起始顺序',
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
				grid_detail.render('addDetailDiv');
				store_detail.reload();

			});

			grid_detail.on("cellclick",
					function(grid, rowIndex, columnIndex, e) {
						var store = grid.getStore();
						var record = store.getAt(rowIndex);
						var i = record.get('record_type');
						Ext.getCmp('detailname').setValue(
								'[顺序号' + record.get('position_id') + ']'
										+ record.get('shift_name'));
						Ext.getCmp('init_position').setValue(
								record.get('position_id'));
						comboxDetail.collapse();
					});
			
			
			var holiableCombo = new Ext.form.ComboBox({
				name : 'holiable',
				hiddenName : 'holiable',
				store : HOLIABLEStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '可否节休',
				emptyText : '请选择...',
				allowBlank : false,
				labelStyle : micolor,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

			var addAdcShiftRecordPanel = new Ext.form.FormPanel({
				id : 'addAdcShiftRecordPanel',
				name : 'addAdcShiftRecordPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [ comboxEmp, {
					fieldLabel : '起始日期',
					name : 'init_date',
					allowBlank : false,
					xtype : 'datefield',
					format : 'Y-m-d',
					labelStyle : micolor,
					anchor : '99%'
				}, comboxDetail, holiableCombo, {
					id : 'windowmode',
					name : 'windowmode',
					hidden : true
				}, {
					id : 'deptid',
					name : 'deptid',
					hidden : true
				}, {
					id : 'apply_id',
					name : 'apply_id',
					hidden : true
				}, {
					id : 'init_position',
					name : 'init_position',
					hidden : true
				}, {
					id : 'updatemode',
					name : 'updatemode',
					hidden : true
				}, {
					id : 'pattern_id',
					name : 'pattern_id',
					hidden : true
				} ]
			});

			var addAdcShiftRecordWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 600,
						height : 330,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增排班初始数据</span>',
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
						items : [ addAdcShiftRecordPanel ],
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
										saveAdcShiftRecordItem();
									}
								},
								{
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(addAdcShiftRecordPanel
												.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcShiftRecordWindow.hide();
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
			 * 新增初始化
			 */
			function addInit() {
				Ext.getCmp('btnReset').hide();
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					addAdcShiftRecordPanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcShiftRecordPanel.getForm());
				}
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				addAdcShiftRecordWindow.show();
				addAdcShiftRecordWindow.setTitle('<span class="commoncss">新增排班数据</span>');
				holiableCombo.setValue('1');
				Ext.getCmp('windowmode').setValue('add');
			}

			/**
			 * 保存排班数据数据
			 */
			function saveAdcShiftRecordItem() {
				if (!addAdcShiftRecordPanel.form.isValid()) {
					return;
				}
				addAdcShiftRecordPanel.form.submit({
					url : './adcshiftrecord.do?reqCode=saveAdcShiftRecordItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftRecordWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '新增排班数据保存失败:<br>' + msg);
					}
				});
			}

			/**
			 * 删除排班记录
			 */
			function deleteAdcShiftRecordItems() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'rec_id');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>删除排班初始化信息吗?</span><br>',
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
													url : './adcshiftrecord.do?reqCode=deleteAdcShiftRecordItem',
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
			 * 生成排班表
			 */
			function makeShiftScheduling() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请选择要指定需要生成排班表的记录!');
					return;
				}

				var values = record.data;
				showWaitMsg();
				Ext.Ajax
						.request({
							url : './adcshiftscheduling.do?reqCode=makeShiftScheduling',
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
							params : values
						});

			}

		});