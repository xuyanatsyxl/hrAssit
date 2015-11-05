/**
 * 考评单据管理
 * 
 * @author XiongChun
 * @since 2010-04-20
 */
Ext.onReady(function() {
	//先调入考评档案
	var qKpdaForm = new Ext.form.FormPanel({
		border : false,
		labelWidth : 60, // 标签宽度
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		height : 120,
		items :[comboxWithTree, {
			layout : 'column',
			border : false,
			items []
		}]
	});
	
	var qKpdaWindow = new Ext.Window({
		title : '<span class="commoncss">查询条件</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 400, // 窗口宽度
		height : 160, // 窗口高度
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
		items : [qKpdaForm],
		buttons : [{
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryBalanceInfo(qForm.getForm());
						qWindow.collapse();
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
				}]
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
		Ext.getCmp("lxysgForm").findById('deptid').setValue(
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
				allowBlank : false,
				value : '',
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
	
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
				header : '授权',
				dataIndex : 'userid',
				renderer : function(value, cellmeta, record) {
					if (login_account == parent.DEFAULT_DEVELOP_ACCOUNT
							|| login_account == parent.DEFAULT_ADMIN_ACCOUNT) {
						if (record.data['usertype'] == '1') {
							return '<img src="../resource/image/ext/edit2.png"/>';
						}
					}
					return '<a href="javascript:void(0);"><img src="../resource/image/ext/edit1.png"/></a>';
				},
				width : 35
			}, {
				header : '姓名',
				dataIndex : 'username',
				width : 80
			}, {
				header : '登录帐户',
				dataIndex : 'account',
				width : 130
			}, {
				id : 'usertype',
				header : '人员类型',
				dataIndex : 'usertype',
				width : 80,
				renderer : USERTYPERender
			}, {
				id : 'deptname',
				header : '所属部门',
				dataIndex : 'deptname',
				width : 130
			}, {
				header : '性别',
				dataIndex : 'sex',
				width : 60,
				renderer : SEXRender
			}, {
				header : '人员状态',
				dataIndex : 'locked',
				width : 60,
				renderer : LOCKEDRender
			}, {
				header : '人员编号',
				dataIndex : 'userid',
				hidden : false,
				hidden : false,
				width : 80,
				sortable : true
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
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '../user.do?reqCode=queryUsersForManage'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [{
									name : 'userid'
								}, {
									name : 'username'
								}, {
									name : 'sex'
								}, {
									name : 'account'
								}, {
									name : 'locked'
								}, {
									name : 'deptid'
								}, {
									name : 'deptname'
								}, {
									name : 'remark'
								}, {
									name : 'usertype'
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
								deleteUserItems();
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
	grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
				var store = grid.getStore();
				var record = store.getAt(rowIndex);
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
				if (fieldName == 'userid' && columnIndex == 2) {
					var userid = record.get('userid');
					var deptid = record.get('deptid');
					var usertype = record.get('usertype');
					if (login_account == parent.DEFAULT_DEVELOP_ACCOUNT
							|| login_account == parent.DEFAULT_ADMIN_ACCOUNT) {
						if (usertype == '1') {
							Ext.MessageBox.alert('提示',
									'超级管理员和开发人员不能对业务经办员授权<br>'
											+ '业务经办员只能被其所属部门或上级部门的管理员授予权限');
							return;
						}
					}
					userGrantInit(userid, deptid, usertype);
				}
			});

	bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();
			});

	var addUserFormPanel = new Ext.form.FormPanel({
				id : 'addUserFormPanel',
				name : 'addUserFormPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [{
							fieldLabel : '人员名称',
							name : 'username',
							id : 'username',
							allowBlank : false,
							labelStyle : micolor,
							anchor : '99%'
						}, comboxWithTree, {
							fieldLabel : '登录帐户',
							name : 'account',
							id : 'account',
							labelStyle : micolor,
							allowBlank : false,
							anchor : '99%'
						}, {
							fieldLabel : '密码',
							name : 'password',
							id : 'password',
							labelStyle : micolor,
							inputType : 'password',
							allowBlank : false,
							anchor : '99%'
						}, {
							fieldLabel : '确认密码',
							name : 'password1',
							id : 'password1',
							inputType : 'password',
							labelStyle : micolor,
							allowBlank : false,
							anchor : '99%'
						}, usertypeCombo, lockedCombo, sexCombo, {
							fieldLabel : '备注',
							name : 'remark',
							allowBlank : true,
							anchor : '99%'
						}, {
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
							id : 'userid',
							name : 'userid',
							hidden : true
						}, {
							id : 'updatemode',
							name : 'updatemode',
							hidden : true
						}]
			});

	var addUserWindow = new Ext.Window({
				layout : 'fit',
				width : 400,
				height : 330,
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
				items : [addUserFormPanel],
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
						clearForm(addUserFormPanel.getForm());
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						addUserWindow.hide();
					}
				}]
			});

	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
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
		// clearForm(addUserFormPanel.getForm());
		var flag = Ext.getCmp('windowmode').getValue();
		//Ext.Msg.alert('提示', '请先选中要删除的项目!'+flag);
		if (typeof(flag) != 'undefined') {
			addUserFormPanel.form.getEl().dom.reset();
		} else {
			clearForm(addUserFormPanel.getForm());
		}
		var selectModel = deptTree.getSelectionModel();
		var selectNode = selectModel.getSelectedNode();
		Ext.getCmp('deptname').setValue(selectNode.attributes.text);
		Ext.getCmp('deptid').setValue(selectNode.attributes.id);
		addUserWindow.show();
		addUserWindow.setTitle('<span class="commoncss">新增人员</span>');
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
		if (!addUserFormPanel.form.isValid()) {
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
		addUserFormPanel.form.submit({
					url : './user.do?reqCode=saveUserItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addUserWindow.hide();
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

	/**
	 * 删除人员
	 */
	function deleteUserItems() {
		var rows = grid.getSelectionModel().getSelections();
		var fields = '';
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].get('usertype') == '3') {
				fields = fields + rows[i].get('username') + '<br>';
			}
		}
		if (fields != '') {
			Ext.Msg.alert('提示', '<b>您选中的项目中包含如下系统内置的只读项目</b><br>' + fields
							+ '<font color=red>系统内置人员不能删除!</font>');
			return;
		}
		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的项目!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'userid');
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
								Ext.Ajax.request({
									url : './user.do?reqCode=deleteUserItems',
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
		if (record.get('usertype') == '3') {
			Ext.MessageBox.alert('提示', '系统内置人员,不能修改!');
			return;
		}
		addUserFormPanel.getForm().loadRecord(record);
		usertypeCombo.setReadOnly(true);
		addUserWindow.show();
		addUserWindow.setTitle('<span class="commoncss">修改人员</span>');
		Ext.getCmp('windowmode').setValue('edit');
		Ext.getCmp('deptid_old').setValue(record.get('deptid'));
		Ext.getCmp('password').setValue('@@@@@@');
		Ext.getCmp('password1').setValue('@@@@@@');
		Ext.getCmp('userid').setValue(record.get('userid'));
		Ext.getCmp('btnReset').hide();
		
	}

	/**
	 * 修改人员数据
	 */
	function updateUserItem() {
		if (!addUserFormPanel.form.isValid()) {
			return;
		}
		password1 = Ext.getCmp('password1').getValue();
		password = Ext.getCmp('password').getValue();
		if (password == '@@@@@@' && password1 == '@@@@@@') {
			//Ext.getCmp('updatemode').setValue('1');
		} else {
			Ext.getCmp('updatemode').setValue('2');
			if (password1 != password) {
				Ext.Msg.alert('提示', '两次输入的密码不匹配,请重新输入!');
				Ext.getCmp('password').setValue('');
				Ext.getCmp('password1').setValue('');
				return;
			}
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
		addUserFormPanel.form.submit({
					url : './user.do?reqCode=updateUserItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addUserWindow.hide();
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

	/**
	 * 人员授权窗口初始化
	 */
	function userGrantInit(userid, deptid, usertype) {

		var selectRoleTab = new Ext.Panel({
			title : '<img src="./resource/image/ext/award_star_silver_3.png" align="top" class="IEPNG"> 选择角色',
			// iconCls: 'user_femaleIcon',
			autoLoad : {
				url : './user.do?reqCode=userGrantInit',
				scripts : true,
				text : parent.PAGE_LOAD_MSG,
				params : {
					userid : userid,
					deptid : deptid,
					usertype : usertype
				}
			}
		});

		var selectMenuTab = new Ext.Panel({
			title : '<img src="./resource/image/ext/config.png" align="top" class="IEPNG"> 选择菜单',
			// iconCls: 'user_femaleIcon',
			autoLoad : {
				url : './user.do?reqCode=selectMenuInit',
				scripts : true,
				text : parent.PAGE_LOAD_MSG,
				params : {
					userid : userid,
					deptid : deptid,
					usertype : usertype
				}
			}
		});

		var userGrantTabPanel = new Ext.TabPanel({
					activeTab : 0,
					width : 600,
					height : 250,
					border : false,
					region:'center',
					margins : '3 3 3 3',
					plain : true,// True表示为不渲染tab候选栏上背景容器图片
					defaults : {
						autoScroll : true
					},
					items : [selectRoleTab, selectMenuTab]
				});

		var userGrantWindow = new Ext.Window({
					layout : 'border',
					width : 400,
					height : document.body.clientHeight - 6,
					resizable : true,
					draggable : true,
					closeAction : 'close',
					title : '<span class="commoncss">人员授权</span>',
					iconCls : 'group_linkIcon',
					modal : true,
					pageY : 15,
					pageX : document.body.clientWidth / 2 - 420 / 2,
					collapsible : true,
					maximizable : false,
					// animateTarget: document.body,
					// //如果使用autoLoad,建议不要使用动画效果
					buttonAlign : 'right',
					constrain : true,
					items : [userGrantTabPanel],
					buttons : [{
								text : '关闭',
								iconCls : 'deleteIcon',
								handler : function() {
									userGrantWindow.close();
								}
							}]
				});
		userGrantWindow.show();
	}

});