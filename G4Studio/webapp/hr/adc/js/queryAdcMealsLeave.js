/**
 * 就餐请假查询
 * 
 * @author xuyan
 * @since 2015-06-20
 */
Ext.onReady(function() {
	
	var store_emp = new Ext.data.Store(
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
				}, {
					name : 'deptid'
				}, {
					name : 'deptname'
				}])
			});
	
	var cm_emp = new Ext.grid.ColumnModel([
			{
				header : '食堂编号',
				dataIndex : 'room_id',
				width : 100
			}, {
				header : '食堂名称',
				dataIndex : 'room_name',
				width : 160
			}, {
				header : '所属部门',
				dataIndex : 'deptname',
				width : 130,
				hidden : true
			}, {
				dataIndex : 'deptid',
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
		Ext.getCmp('empname').setValue('[' + record.get('room_id') + ']' + record.get('room_name'));
		Ext.getCmp('room_id').setValue(record.get('room_id'));
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
		fieldLabel : '就餐食堂',
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
				Ext.getCmp("qForm").findById('deptid')
						.setValue(node.attributes.id);
				comboxEmp.reset();
				store_emp.reload({
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
				allowBlank : false,
				value : '',
				emptyText : '请选择...',
				fieldLabel : '就餐企业',
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
	
	var qForm = new Ext.form.FormPanel({
		id : 'qForm',
		border : false,
		defaultType : 'textfield',
		labelAlign : 'right',
		labelWidth : 65,
		frame : false,
		bodyStyle : 'padding:5 5 0',
		items : [ comboxWithTree, comboxEmp, {
			fieldLabel : '查询日期',
			name : 'start_date',
			xtype : 'datefield', // 设置为数字输入框类型
			format : 'Y-m-d',
			allowBlank : false,
			value : new Date(),
			labelStyle : micolor,
			anchor : '100%'
		}, {
			id : 'deptid',
			name : 'deptid',
			hidden : true
		}, {
			id : 'room_id',
			name : 'room_id',
			hidden : true
		} ]
	});

	var qWindow = new Ext.Window({
		title : '<span class="commoncss">查询条件</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 400, // 窗口宽度
		height : 180, // 窗口高度
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
				if (!Ext.getCmp('qForm').findById('deptid').getValue()){
					Ext.Msg.alert('提示', '必须选择部门！');
					return;
				}
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
		width : 40
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, {
		header : '食堂编号',
		dataIndex : 'room_id',
		sortable : true,
		width : 80			
	}, {
		header : '食堂名称',
		dataIndex : 'room_name',
		sortable : true,
		width : 160			
	}, {
		header : '及时饭假',
		dataIndex : 'jsfj',
		sortable : true,
		width : 80		
	}, {
		header : '不及时饭假',
		dataIndex : 'bjsfs',
		sortable : true,
		width : 80
	}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'adcshiftmeals.do?reqCode=queryAdcMealsLeave'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'jsfj'
		}, {
			name : 'bjsfj'
		}, {
			name : 'room_id'
		}, {
			name : 'room_name'
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
					[ 100, '100条/页' ], [ 250, '250条/页' ], [ 500, '500条/页' ] ]
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
		}, {
			text : '刷新',
			iconCls : 'arrow_refreshIcon',
			handler : function() {
				store.reload();
			}
		}]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		margins : '3 3 3 3',
		// collapsible : true,
		border : true,
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		title : '<span class="commoncss">当日请饭假汇总</span>',
		// height : 500,
		autoScroll : true,
		frame : true,
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		tbar : tbar,
		bbar : bbar,
		viewConfig : {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			forceFit : false
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
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

});