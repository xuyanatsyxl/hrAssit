/**
 * 用户管理与授权
 * 
 * @author XiongChun
 * @since 2010-04-20
 */
Ext.onReady(function() {
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
				items : [{
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
						}]
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
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
				header : 'empid',
				dataIndex : 'empid',
				hidden : true
			}, {
				header : '员工编号',
				dataIndex : 'code',
				width : 80
			}, {
				header : '姓名',
				dataIndex : 'name',
				width : 80
			}, {
				id : 'deptname',
				header : '所属部门',
				dataIndex : 'deptname',
				width : 130,
				sortable : true
			}, {
				header : '性别',
				dataIndex : 'sex',
				width : 60,
				renderer : SEXRender
			}, {
				header : '出生年月日',
				dataIndex : 'birthday'
			}, {
				header : '身份证号',
				dataIndex : 'idcard',
				width : 120
			}, {
				header : '入企日期',
				dataIndex : 'hiredate'
			}, {
				header : '岗位',
				dataIndex : 'jobname',
				width : 60
			}, {
				header : '状态',
				dataIndex : 'dqzt',
				width : 60,
				renderer : DQZTRender
			}, {
				header : '人员编号',
				dataIndex : 'empid',
				hidden : true
			}, {
				id : 'remark',
				header : '备注',
				dataIndex : 'remark'
			}, {
				id : 'deptid',
				header : '所属部门编号',
				dataIndex : 'deptid',
				hidden : true
			}]);

	/**
	 * 数据存储
	 */
	var zbzwStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : 'empl.do?reqCode=queryZbzw4Paging'
				}),
		reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [{
							name : 'value'
						}, {
							name : 'text'
						}]),
		baseParams : {
			areacode : ''
		}
	});
	
	var zbzwCombo = new Ext.form.ComboBox({
		hiddenName : 'zbzwid',
		fieldLabel : '总部职务',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : zbzwStore,
		displayField : 'text',
		valueField : 'value',
		loadingText : '正在加载数据...',
		mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
		forceSelection : true,
		typeAhead : true,
		pageSize : 10,
		minListWidth : 270,
		resizable : true,
		editable : false,
		anchor : '100%'
	});
	
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './empl.do?reqCode=queryEmployeesForManage'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
									name : 'empid'
								}, {
									name : 'code'
								}, {
									name : 'name'
								}, {
									name : 'sex'
								}, {
									name : 'birthday'
								}, {
									name : 'idcard'
								}, {
									name : 'hiredate'
								}, {
									name : 'remark'
								}, {
									name : 'deptid'
								}, {
									name : 'deptname'
								}, {
									name : 'zbzwid'
								}, {
									name : 'jobname'
								}, {
									name : 'dyzbzw'
								}, {
									name : 'dqzt'
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
				title : '<span class="commoncss">人员信息表</span>',
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
							text : '修改',
							iconCls : 'page_edit_1Icon',
							handler : function() {
								editInit();
							}
						}, '-', {
							text : '删除',
							iconCls : 'page_delIcon',
							handler : function() {
								deleteEmplItems();
							}
						}, '-', {
							text : '与HR软件同步',
							iconCls : '',
							handler : function(){
								updateEmplDept();
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
				Ext.getCmp("addEmplFormPanel").findById('deptid')
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

	var sexCombo = new Ext.form.ComboBox({
				name : 'sex',
				hiddenName : 'sex',
				store : SEXStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '性别',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});


	var dqztCombo = new Ext.form.ComboBox({
				name : 'dqzt',
				hiddenName : 'dqzt',
				store : DQZTStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '人员状态',
				emptyText : '请选择...',
				allowBlank : false,
				labelStyle : micolor,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

	var addEmplFormPanel = new Ext.form.FormPanel({
				id : 'addEmplFormPanel',
				name : 'addEmplFormPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 70,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [{
					fieldLabel : '员工编号',
					name : 'code',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				},{
							fieldLabel : '姓名',
							name : 'name',
							id : 'name',
							allowBlank : false,
							labelStyle : micolor,
							anchor : '99%'
						}, sexCombo, comboxWithTree, {
							fieldLabel : '身份证号',
							name : 'idcard',
							labelStyle : micolor,
							allowBlank : false,
							anchor : '99%'
						}, {
							fieldLabel : '出生年月日',
							name : 'birthday',
							labelStyle : micolor,
							xtype : 'datefield',
							format : 'Y-m-d',
							anchor : '99%'
						}, {
							fieldLabel : '入企日期',
							name : 'hiredate',
							xtype : 'datefield',
							labelStyle : micolor,
							format : 'Y-m-d',
							allowBlank : false,
							anchor : '99%'
						}, {
							fieldLabel : '岗位',
							name : 'jobname',
							anchor : '99%'
						}, zbzwCombo, {
							fieldLabel : '备注',
							name : 'remark',
							allowBlank : true,
							anchor : '99%'
						}, dqztCombo, {
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
							id : 'empid',
							name : 'empid',
							hidden : true
						}, {
							id : 'updatemode',
							name : 'updatemode',
							hidden : true
						}]
			});

	var addEmplWindow = new Ext.Window({
				layout : 'fit',
				width : 400,
				height : 400,
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
				items : [addEmplFormPanel],
				buttons : [{
					text : '保存',
					iconCls : 'acceptIcon',
					handler : function() {
						if (runMode == '0') {
							Ext.Msg.alert('提示',
									'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
							return;
						}
						var mode = Ext.getCmp('windowmode').getValue();
						if (mode == 'add')
							saveUserItem();
						else
							updateUserItem();
					}
				}, {
					text : '重置',
					id : 'btnReset',
					iconCls : 'tbar_synchronizeIcon',
					handler : function() {
						clearForm(addEmplFormPanel.getForm());
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						addEmplWindow.hide();
					}
				}]
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
	 * 新增人员初始化
	 */
	function addInit() {
		Ext.getCmp('btnReset').hide();
		if (login_account == parent.DEFAULT_DEVELOP_ACCOUNT) {
			usertypeCombo.setReadOnly(false);
		}
		if (login_account == parent.DEFAULT_ADMIN_ACCOUNT) {
			usertypeCombo.setReadOnly(false);
		}
		// clearForm(addEmplFormPanel.getForm());
		var flag = Ext.getCmp('windowmode').getValue();
		//Ext.Msg.alert('提示', '请先选中要删除的项目!'+flag);
		if (typeof(flag) != 'undefined') {
			addEmplFormPanel.form.getEl().dom.reset();
		} else {
			clearForm(addEmplFormPanel.getForm());
		}
		var selectModel = deptTree.getSelectionModel();
		var selectNode = selectModel.getSelectedNode();
		Ext.getCmp('deptname').setValue(selectNode.attributes.text);
		Ext.getCmp('deptid').setValue(selectNode.attributes.id);
		addEmplWindow.show();
		addEmplWindow.setTitle('<span class="commoncss">新增人员</span>');
		Ext.getCmp('windowmode').setValue('add');
		comboxWithTree.setDisabled(false);
		// Ext.getCmp('btnReset').show();
		lockedCombo.setValue('0');
		usertypeCombo.setValue('1');
		sexCombo.setValue('0');
	}

	/**
	 * 保存人员数据
	 */
	function saveUserItem() {
		if (!addEmplFormPanel.form.isValid()) {
			return;
		}
		password1 = Ext.getCmp('password1').getValue();
		password = Ext.getCmp('password').getValue();
		if (password1 != password) {
			Ext.Msg.alert('提示', '两次输入的密码不匹配,请重新输入!');
			Ext.getCmp('password').setValue('');
			Ext.getCmp('password1').setValue('');
			return;
		}
		addEmplFormPanel.form.submit({
					url : './user.do?reqCode=saveUserItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addEmplWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据保存失败:<br>' + msg);
					}
				});
	}
	
	
	function updateEmplDept(){
		var rows = grid.getSelectionModel().getSelections();

		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要同步的项目!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'empid');
		Ext.Msg
				.confirm(
						'请确认',
						'<span style="color:red"><b>提示:</b>您要从HR系统中同步该人员的信息</span><br>继续吗?',
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
									url : './empl.do?reqCode=updateEmplByHrItem',
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
	 * 删除人员
	 */
	function deleteEmplItems() {
		var rows = grid.getSelectionModel().getSelections();


		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的项目!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'empid');
		Ext.Msg
				.confirm(
						'请确认',
						'<span style="color:red"><b>提示:</b>删除人员将不能恢复</span><br>继续删除吗?',
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
									url : './empl.do?reqCode=deleteEmplItem',
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
	 * 修改人员初始化
	 */
	function editInit() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
			return;
		}
		zbzwStore.load();
		addEmplFormPanel.getForm().loadRecord(record);
		addEmplWindow.show();
		addEmplWindow.setTitle('<span class="commoncss">修改人员</span>');
		Ext.getCmp('windowmode').setValue('edit');
		Ext.getCmp('deptid_old').setValue(record.get('deptid'));
		Ext.getCmp('empid').setValue(record.get('empid'));
		Ext.getCmp('btnReset').hide();
		
	}

	/**
	 * 修改人员数据
	 */
	function updateUserItem() {
		if (!addEmplFormPanel.form.isValid()) {
			return;
		}

		var deptid = Ext.getCmp('deptid').getValue();
		var deptid_old = Ext.getCmp('deptid_old').getValue();
		if (deptid != deptid_old) {
			Ext.Msg.confirm('确认', '修改所属部门将导致人员/角色映射、人员/菜单映射数据丢失! 继续保存吗?',
					function(btn, text) {
						if (btn == 'yes') {
							update();
						} else {
							return;
						}
					});
			return;
		} else {
			update();
		}
	}

	/**
	 * 更新
	 */
	function update() {
		addEmplFormPanel.form.submit({
					url : './empl.do?reqCode=updateEmplItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addEmplWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '人员数据修改失败:<br>' + msg);
					}
				});
	}


});