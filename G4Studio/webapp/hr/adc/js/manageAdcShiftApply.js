/**
 * 班次应用管理
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
						dataIndex : 'apply_id',
						hidden : true
					}, {
						header : '应用类型',
						dataIndex : 'record_type',
						width : 80,
						renderer : RECORD_TYPERender
					}, {
						id : 'deptname',
						header : '所属部门',
						dataIndex : 'deptname',
						width : 180
					},  {
						header : '所属分组',
						dataIndex : 'group_name',
						width : 80
					}, {
						header : '员工编码',
						dataIndex : 'code',
						width : 80
					}, {
						header : '人员姓名',
						dataIndex : 'empname',
						width : 80
					}, {
						header : '规律班次名称',
						dataIndex : 'pattern_shift_name',
						width : 130
					}, {
						header : '优先级',
						dataIndex : 'priority',
						width : 60
					}, {
						header : '是否启用',
						dataIndex : 'enabled',
						width : 80,
						renderer : ENABLEDRender
					}, {
						id : 'deptid',
						header : '所属部门编号',
						dataIndex : 'deptid',
						hidden : true
					}, {
						dataIndex : 'group_id',
						hidden : true
					}, {
						dataIndex : 'empid',
						hidden : true
					}, {
						dataIndex : 'pattern_id',
						hidden : true
					}]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
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
							name : 'code'
						}, {
							name : 'empname'
						}, {
							name : 'pattern_id'
						}, {
							name : 'pattern_shift_name'
						}, {
							name : 'priority'
						}, {
							name : 'enabled'
						}])
					});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('ksrq').getValue()
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
							text : '排班应用',
							iconCls : 'page_addIcon',
							handler : function() {
								addInit();
							}
						}, '-', {
							text : '删除',
							iconCls : 'page_delIcon',
							handler : function() {
								deleteAdcShiftApplyItems();
							}
						},  '->', new Ext.form.DateField({
							id : 'ksrq',
							name : 'ksrq',
							emptyText : '开始日期',
							format : 'Y-m-d',
							width : 130
						}), new Ext.form.DateField({
							id : 'jsrq',
							name : 'queryParam',
							emptyText : '结束日期',
							format : 'Y-m-d',
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

			/*
			 * 规律班次选择网格
			 */
			var sm_pattern = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
			var cm_pattern = new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer(), sm_pattern, {
						header : '班次编号',
						dataIndex : 'pattern_id',
						width : 80,
						hidden : true
					}, {
						header : '班次名称',
						dataIndex : 'pattern_shift_name',
						width : 160
					}, {
						id : 'deptname',
						header : '所属部门',
						dataIndex : 'deptname',
						width : 130
					}, {
						header : '循环周期',
						dataIndex : 'regular_cycle',
						width : 80
					}, {
						header : '周期单位',
						dataIndex : 'regular_cycle_unit',
						width : 80,
						renderer : CYCLE_UNITRender
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
					} ]);

			var store_pattern = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftpattern.do?reqCode=queryAdcShiftPatternItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'pattern_id'
						}, {
							name : 'pattern_shift_name'
						}, {
							name : 'deptid'
						}, {
							name : 'deptname'
						}, {
							name : 'regular_cycle'
						}, {
							name : 'regular_cycle_unit'
						}, {
							name : 'enabled'
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
			var grid_pattern = new Ext.grid.GridPanel({
				title : '<span class="commoncss">规律班次表</span>',
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
				Ext.getCmp("addAdcShiftApplyPanel").findById('deptid')
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
				store_pattern.load({
					params : {
						deptid : node.attributes.id,
						start : 0,
						limit : bbar_pattern.pageSize
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
			
			/**
			 * 循环开始点
			 */	
			var store_detail = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './adcshiftpattern.do?reqCode=queryAdcShiftPatternDetailItemForManage'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
									name : 'id'
								}, {
									name : 'pattern_id'
								}, {
									name : 'shift_id'
								}, {
									name : 'shift_name'
								}, {
									name : 'sort_no'
								}])
			});
			
			var sm_detail = new Ext.grid.CheckboxSelectionModel();
			var cm_detail = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(),  sm_detail, {
					dataIndex : 'id',
					hidden : true
				}, {
					dataIndex : 'pattern_id',
					hidden : true
				}, {
					dataIndex : 'shift_id',
					hidden : true
				}, {
					header : '排序',
					dataIndex : 'sort_no',
					width : 60
				}, {
					header : '基本班次',
					dataIndex : 'shift_name',
					width : 160
				}]);
			
			var grid_detail = new Ext.grid.GridPanel({
				height : 500,
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
				cm : cm_detail,
				sm : sm_detail
			});	
			
			var comboxDetail = new Ext.form.ComboBox({
				id : 'detailname',
				name : 'detailname',
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
				items : [ comboxWithTree, {
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
							id : 'empid',
							name : 'empid',
							hidden : true
						} ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [  comboxEmp, {
							id : 'pattern_id',
							name : 'pattern_id',
							hidden : true
						}, {
							id : 'apply_type',
							name : 'apply_type',
							hidden : true
						} ]
					} ]
				} ]
			});

			var addAdcShiftApplyWindow = new Ext.Window(
					{
						layout : 'border',
						width : 600,
						height : 500,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增班次应用</span>',
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
						items : [ addAdcShiftApplyPanel, grid_pattern ],
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
										saveAdcShiftApplyItem();
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
						queryParam : Ext.getCmp('ksrq').getValue(),
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
					addAdcShiftApplyPanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcShiftApplyPanel.getForm());
				}
				//var selectModel = deptTree.getSelectionModel();
				//var selectNode = selectModel.getSelectedNode();
				//Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				//Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				/*
				store_emp.load({
					parame : {
						deptid : selectNode.attributes.id,
						start : 0,
						limit : bbar_emp.pageSize
					}
				});
				store_group.load({
					parame : {
						deptid : selectNode.attributes.id
					}
				});
				*/
				addAdcShiftApplyWindow.show();
				addAdcShiftApplyWindow
						.setTitle('<span class="commoncss">新增排班数据</span>');
				Ext.getCmp('windowmode').setValue('add');
				comboxWithTree.setDisabled(false);
			}

			/**
			 * 保存班次应用数据
			 */
			function saveAdcShiftApplyItem() {
				var record = grid_pattern.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请选择要指定给该部门的规律班次!');
					return;
				}
				addAdcShiftApplyPanel.findById('pattern_id').setValue(
						record.get('pattern_id'));

				if (!addAdcShiftApplyPanel.form.isValid()) {
					return;
				}
				addAdcShiftApplyPanel.form.submit({
					url : './adcshiftapply.do?reqCode=saveAdcShiftApplyItem',
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
						Ext.MessageBox.alert('提示', '新增排班数据保存失败:<br>' + msg);
					}
				});
			}

			/**
			 * 删除班次应用
			 */
			function deleteAdcShiftApplyItems() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'apply_id');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>删除人员将同时删除和人员相关的权限信息,请慎重.</span><br>继续删除吗?',
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
													url : './adcshiftapply.do?reqCode=deleteAdcShiftApplyItems',
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