/**
 * 规律班次管理
 * 
 * @author xuyan
 * @since 2015-03-25
 */
Ext.onReady(function() {
	
	var cm_basic = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '班次编号',
				dataIndex : 'shift_id',
				width : 80
			}, {
				header : '班次名称',
				dataIndex : 'basic_shift_name',
				width : 100
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
				width : 100,
				renderer : SHIFT_TYPERender
			}]);

	/**
	 * 数据存储
	 */
	var store_basic = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './adcshiftbasic.do?reqCode=queryAdcShiftBasicItemForList'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
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
								}])
			});

	// 翻页排序时带上查询条件
	store_basic.on('beforeload', function() {
				this.baseParams = {
					//queryParam : Ext.getCmp('queryParam').getValue()
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
							fields : ['value', 'text'],
							data : [[10, '10条/页'], [20, '20条/页'],
									[50, '50条/页'], [100, '100条/页'],
									[250, '250条/页'], [500, '500条/页']]
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
				items : ['-', '&nbsp;&nbsp;', pagesize_combo_basic]
			});
	
	var grid_basic = new Ext.grid.GridPanel({
				title : '<span class="commoncss">基本班次表，双击指定到左侧表格</span>',
				//height : 500,
				width : 400,
				region: 'east',
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
				bbar : bbar_basic
			});
	
	store_basic.load({
				params : {
					start : 0,
					limit : bbar_basic.pageSize
				}
			});
	grid_basic.on('rowdblclick', function(grid, rowIndex, event) {
		var store = grid.getStore();
		var count = store.getCount();
		var shiftId = store.getAt(rowIndex).get('shift_id');
		var shiftName = store.getAt(rowIndex).get('basic_shift_name');
		if (count > 0){
			var rows = grid_detail.getSelectionModel().getSelections();
			if (Ext.isEmpty(rows)) {
				Ext.Msg.alert('提示', '请先在左边表格选中要指定班次的日期!');
				return;
			}
			
			//开始指定日期
			for (var i = 0; i < rows.length; i++){
				rows[i].set('shift_id', shiftId);
				rows[i].set('shift_name', shiftName);
			}
		}
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
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
				header : '班次编号',
				dataIndex : 'pattern_id',
				width : 80,
				hidden : true
			}, {
				header : '班次名称',
				dataIndex : 'pattern_shift_name',
				width : 100
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
				header : '操作人',
				dataIndex : 'operator_name',
				width : 80
			}, {
				header : '操作时间',
				dataIndex : 'operate_time',
				format : 'Y-m-d'
			}, {
				header : '是否启用',
				dataIndex : 'enabled',
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
			}, {
				dataIndex : 'operator',
				hidden : true
			}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './adcshiftpattern.do?reqCode=queryAdcShiftPatternItemForManage'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
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
								}])
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
							fields : ['value', 'text'],
							data : [[10, '10条/页'], [20, '20条/页'],
									[50, '50条/页'], [100, '100条/页'],
									[250, '250条/页'], [500, '500条/页']]
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
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			});
	var grid = new Ext.grid.GridPanel({
				title : '<span class="commoncss">规律班次表</span>',
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
				tbar : [{
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
								deleteAdcShiftPatternItems();
							}
						}, '->', new Ext.form.TextField({
									id : 'queryParam',
									name : 'queryParam',
									emptyText : '规律班次编号或名称',
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
						}],
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
				Ext.getCmp("addAdcShiftPatternPanel").findById('deptid')
						.setValue(node.attributes.id);
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
	
	var store_detail = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : './adcshiftpattern.do?reqCode=queryAdcShiftPatternDetailItemForManage'
				}),
		reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [{
							name : 'position_id'
						}, {
							name : 'pattern_id'
						}, {
							name : 'shift_id'
						}, {
							name : 'shift_name'
						}])
	});
		
	var sm_detail = new Ext.grid.CheckboxSelectionModel();
	var cm_detail = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(),  sm_detail,  {
			dataIndex : 'pattern_id',
			hidden : true
		}, {
			dataIndex : 'shift_id',
			hidden : true
		}, {
			header : '日期',
			dataIndex : 'position_id',
			renderer : patternRender,
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

	var cycle_unitCombo = new Ext.form.ComboBox({
		name : 'regular_cycle_unit',
		hiddenName : 'regular_cycle_unit',
		store : CYCLE_UNITStore,
		mode : 'local',
		triggerAction : 'all',
		valueField : 'value',
		displayField : 'text',
		value : '0',
		fieldLabel : '循环周期',
		emptyText : '请选择...',
		labelStyle : micolor,
		allowBlank : false,
		forceSelection : true,
		editable : false,
		typeAhead : true,
		anchor : "99%"
	});	
	
	//定义一个record
	var patternRec = Ext.data.Record.create([{
		name : 'position_id',
		type : 'string'
	}, {
		name : 'shift_id',
		type : 'string'				
	}, {
		name : 'pattern_id',
		type : 'string'				
	}]);
	
	cycle_unitCombo.on('select', function() {
		 var val = addAdcShiftPatternPanel.findById('regularcycle').getValue();
		 var patternId = addAdcShiftPatternPanel.findById('pattern_id').getValue();
		 var count = store_detail.getCount();
		 if (val != ''){
			 for (var i = 0; i <= val - 1; i++){
				if (i < count){
					store_detail.getAt(i).set('position_id', i + 1);
				}else{ 
					var row = new patternRec({});
					row.set('position_id', i + 1); 
					row.set('pattern_id', patternId);
					store_detail.insert(i, row);
				}
			 }
			while (val <= count){
				store_detail.removeAt(count);
				count--;
			}
		 }
	 });
	
	var centerPanel = new Ext.form.FormPanel({
		border : false,
		labelWidth : 60, // 标签宽度
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 3 3', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		region : 'center',
		height : 120,
		layout : 'border',
		items : [grid_detail, grid_basic]
	});
	
	var addAdcShiftPatternPanel = new Ext.form.FormPanel({
		id : 'addAdcShiftPatternPanel',
		border : false,
		labelWidth : 60, // 标签宽度
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 3 3', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		region : 'north',
		height : 120,
		items : [comboxWithTree, {
					fieldLabel : '班次名称',
					name : 'pattern_shift_name',
					xtype : 'textfield',
					allowblank : false,
					labelStyle : micolor,
					anchor : '100%'					
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : .5,
								layout : 'form',
								labelWidth : 60, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '循环周期',
											id : 'regularcycle',
											name : 'regular_cycle',
											xtype : 'numberfield', // 设置为数字输入框类型
											allowDecimals : false, // 是否允许输入小数
											allowNegative : false, // 是否允许输入负数
											anchor : '100%'
										}, enabledCombo, {
											id : 'windowmode',
											name : 'windowmode',
											hidden : true
										}, {
											id : 'dirtydata',
											name : 'dirtydata',
											hidden : true
										}]
							}, {
								columnWidth : .5,
								layout : 'form',
								labelWidth : 60, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [cycle_unitCombo, {
									id : 'pattern_id',
									name : 'pattern_id',
									hidden : true
								}, {
									id : 'deptid',
									name : 'deptid',
									hidden : true
								}]
							}]
				}]
	});
	
	var addAdcShiftPatternWindow = new Ext.Window(
			{
				layout : 'border',
				width : 700,
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
				pageX : document.body.clientWidth / 2 - 420 / 2,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [ addAdcShiftPatternPanel, centerPanel],
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
								var mode = Ext.getCmp('windowmode').getValue();
								
								var jsonArray = [];
								store_detail.each(function(record){
									jsonArray.push(record.data);
								});
								Ext.getCmp('dirtydata').setValue(Ext.encode(jsonArray));
								
								if (mode == 'add')
									saveAdcShiftPatternItem();
								else
									updateAdcShiftPatternItem();
							}
						},
						{
							text : '重置',
							id : 'btnReset',
							iconCls : 'tbar_synchronizeIcon',
							handler : function() {
								clearForm(addAdcShiftPatternPanel.getForm());
							}
						}, {
							text : '关闭',
							iconCls : 'deleteIcon',
							handler : function() {
								addAdcShiftPatternWindow.hide();
							}
						} ]
			});


	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [{
							title : '<span class="commoncss">组织机构</span>',
							iconCls : 'chart_organisationIcon',
							tools : [{
										id : 'refresh',
										handler : function() {
											deptTree.root.reload()
										}
									}],
							collapsible : true,
							width : 210,
							minSize : 160,
							maxSize : 280,
							split : true,
							region : 'west',
							autoScroll : true,
							margins : '3 3 3 3',
							// collapseMode:'mini',
							items : [deptTree]
						}, {
							region : 'center',
							layout : 'fit',
							border : false,
							margins : '3 3 3 3',
							items : [grid]
						}]
			});

	/**
	 * 根据条件查询班次信息
	 */
	function queryAdcShiftPatternItem() {
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
	 * 新增规律班次初始化
	 */
	function addInit() {
		Ext.getCmp('btnReset').hide();
		var flag = Ext.getCmp('windowmode').getValue();
		if (typeof(flag) != 'undefined') {
			addAdcShiftPatternPanel.form.getEl().dom.reset();
		} else {
			clearForm(addAdcShiftPatternPanel.getForm());
		}
		var selectModel = deptTree.getSelectionModel();
		var selectNode = selectModel.getSelectedNode();
		Ext.getCmp('deptname').setValue(selectNode.attributes.text);
		Ext.getCmp('deptid').setValue(selectNode.attributes.id);
		store_detail.removeAll();
		addAdcShiftPatternWindow.show();
		addAdcShiftPatternWindow.setTitle('<span class="commoncss">新增规律班次</span>');
		Ext.getCmp('windowmode').setValue('add');
		comboxWithTree.setDisabled(false);
		enabledCombo.setValue('1');
	}

	/**
	 * 保存规律班次数据
	 */
	function saveAdcShiftPatternItem() {
		if (!addAdcShiftPatternPanel.form.isValid()) {
			return;
		}
		addAdcShiftPatternPanel.form.submit({
					url : './adcshiftpattern.do?reqCode=saveAdcShiftPatternItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftPatternWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '规律班次数据保存失败:<br>' + msg);
					}
				});
	}

	/**
	 * 删除规律班次
	 */
	function deleteAdcShiftPatternItems() {
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的项目!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'pattern_id');
		Ext.Msg
				.confirm(
						'请确认',
						'<span style="color:red"><b>提示:</b>删除规律班次信息将不能恢复,请慎重.</span><br>继续删除吗?',
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
									url : './adcshiftpattern.do?reqCode=deleteAdcShiftPatternItem',
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

	/**
	 * 修改规律班次初始化
	 */
	function editInit() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
			return;
		}

		addAdcShiftPatternPanel.getForm().loadRecord(record);
		addAdcShiftPatternWindow.show();
		addAdcShiftPatternWindow.setTitle('<span class="commoncss">修改规律班次</span>');
		Ext.getCmp('windowmode').setValue('edit');
		Ext.getCmp('pattern_id').setValue(record.get('pattern_id'));
		store_detail.load({
			params : {
				pattern_id : record.get('pattern_id')
			}
		});
		Ext.getCmp('btnReset').hide();
		
	}

	/**
	 * 修改规律班次数据
	 */
	function updateAdcShiftPatternItem() {
		if (!addAdcShiftPatternPanel.form.isValid()) {
			return;
		}
		update();
	}

	/**
	 * 更新
	 */
	function update() {
		addAdcShiftPatternPanel.form.submit({
					url : './adcshiftpattern.do?reqCode=updateAdcShiftPatternItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcShiftPatternWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '规律班次数据修改失败:<br>' + msg);
					}
				});
	}
	
	function patternRender(value){
		var val = cycle_unitCombo.getValue();
		if (val == 1){
			return '第' + value + '天';			
		}else if (val == 2){
			return '星期' + val;
		}
	}	
});