/**
 * 考评档案管理
 * 
 * @author xuyan
 * @since 2014-11-24
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
					text : '新建考评档案',
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
			var cm = new Ext.grid.ColumnModel(
					[
							new Ext.grid.RowNumberer(),
							sm,
							{
								header : '人员',
								dataIndex : 'daid',
								renderer : function(value, cellmeta, record) {
									return '<a href="javascript:void(0);"><img src="../resource/image/ext/edit1.png"/></a>';
								},
								width : 35
							}, {
								header : '档案名称',
								dataIndex : 'damc',
								width : 130
							}, {
								id : 'deptname',
								header : '所属部门',
								dataIndex : 'deptname',
								width : 130
							}, {
								header : '建档人',
								dataIndex : 'jdrname',
								width : 60
							}, {
								header : '建档日期',
								dataIndex : 'jdrq',
								width : 130
							}, {
								header : '状态',
								dataIndex : 'qybz',
								width : 80,
								renderer : QYBZRender
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
								dataIndex : 'jdr',
								hidden : true
							} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './kpgl.do?reqCode=queryKpdasForManage'
				}),
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'daid'
				}, {
					name : 'damc'
				}, {
					name : 'deptid'
				}, {
					name : 'deptname'
				}, {
					name : 'jdr'
				}, {
					name : 'jdrname'
				}, {
					name : 'jdrq'
				}, {
					name : 'qybz'
				}, {
					name : 'remark'
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
				title : '<span class="commoncss">考评档案列表</span>',
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
						deleteKpdaItems();
					}
				}, '->', new Ext.form.TextField({
					id : 'queryParam',
					name : 'queryParam',
					emptyText : '请输入档案名称',
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
						var fieldName = grid.getColumnModel().getDataIndex(
								columnIndex);
						if (fieldName == 'daid') {
							var daid = record.get('daid');
							userManageInit(daid);
						}
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
				Ext.getCmp("addKpdaFormPanel").findById('deptid').setValue(
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

			var qybzCombo = new Ext.form.ComboBox({
				name : 'qybz',
				hiddenName : 'qybz',
				store : QYBZStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '状态',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

			var addKpdaFormPanel = new Ext.form.FormPanel({
				id : 'addKpdaFormPanel',
				name : 'addKpdaFormPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [ {
					fieldLabel : '档案名称',
					name : 'damc',
					id : 'damc',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				}, comboxWithTree, qybzCombo, {
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
					id : 'daid',
					name : 'daid',
					hidden : true
				}, {
					id : 'updatemode',
					name : 'updatemode',
					hidden : true
				} ]
			});

			var addKpdaWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 400,
						height : 230,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增考评档案</span>',
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
						items : [ addKpdaFormPanel ],
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
											saveKpdaItem();
										else
											updateKpdaItem();
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
										addKpdaWindow.hide();
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
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					addKpdaFormPanel.form.getEl().dom.reset();
				} else {
					clearForm(addKpdaFormPanel.getForm());
				}
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				addKpdaWindow.show();
				addKpdaWindow.setTitle('<span class="commoncss">新增考评档案</span>');
				Ext.getCmp('windowmode').setValue('add');
				comboxWithTree.setDisabled(false);
				qybzCombo.setValue("1");
			}

			/**
			 * 保存考评档案数据
			 */
			function saveKpdaItem() {
				if (!addKpdaFormPanel.form.isValid()) {
					return;
				}
				addKpdaFormPanel.form.submit({
					url : './kpgl.do?reqCode=saveKpdaItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addKpdaWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '档案数据保存失败:<br>' + msg);
					}
				});
			}

			/**
			 * 删除人员
			 */
			function deleteKpdaItems() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'daid');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>只要未使用过的考评档案可以删除.</span><br>继续删除吗?',
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
													url : './kpgl.do?reqCode=deleteKpdaItems',
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
			 * 修改档案初始化
			 */
			function editInit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
					return;
				}
				addKpdaFormPanel.getForm().loadRecord(record);
				addKpdaWindow.show();
				addKpdaWindow.setTitle('<span class="commoncss">修改人员</span>');
				Ext.getCmp('windowmode').setValue('edit');
				Ext.getCmp('deptid_old').setValue(record.get('deptid'));
				Ext.getCmp('daid').setValue(record.get('daid'));
				Ext.getCmp('btnReset').hide();

			}

			/**
			 * 修改档案数据
			 */
			function updateKpdaItem() {
				if (!addKpdaFormPanel.form.isValid()) {
					return;
				}
				var deptid = Ext.getCmp('deptid').getValue();
				var deptid_old = Ext.getCmp('deptid_old').getValue();
				if (deptid != deptid_old) {
					Ext.Msg.confirm('确认', '修改所属部门将导致原有的汇总数据不准确! 继续保存吗?',
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
				addKpdaFormPanel.form.submit({
					url : './kpgl.do?reqCode=updateKpdaItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addKpdaWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '档案数据修改失败:<br>' + msg);
					}
				});
			}

			/**
			 * 员工管理初始化
			 */
			function userManageInit(daid) {
				/**
				 * 数据存储人员明细
				 */
				var store_mx = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
						url : './kpgl.do?reqCode=queryKpdaMxForManage'
					}),
					reader : new Ext.data.JsonReader({
						totalProperty : 'TOTALCOUNT',
						root : 'ROOT'
					}, [ {
						name : 'daid'
					}, {
						name : 'empid'
					}, {
						name : 'code'
					}, {
						name : 'name'
					}, {
						name : 'sex'
					}, {
						name : 'jobname'
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
						data : [ [ 10, '10条/页' ], [ 20, '20条/页' ],
								[ 50, '50条/页' ], [ 100, '100条/页' ],
								[ 250, '250条/页' ], [ 500, '500条/页' ] ]
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
					number = parseInt(comboBox.getValue());
					store_mx.reload({
						params : {
							start : 0,
							limit : bbar_mx.pageSize
						}
					});
				});

				var bbar_mx = new Ext.PagingToolbar({
					pageSize : number,
					store : store_mx,
					displayInfo : true,
					displayMsg : '显示{0}条到{1}条,共{2}条',
					emptyMsg : "没有符合条件的记录",
					items : [ '-', '&nbsp;&nbsp;', pagesize_combo_mx ]
				});

				var sm_mx = new Ext.grid.CheckboxSelectionModel();
				var cm_mx = new Ext.grid.ColumnModel([
						new Ext.grid.RowNumberer(),
						sm_mx,
						{
							dataIndex : 'empid',
							width : 35,
							hidden : true
						},
						{
							header : '员工编码',
							dataIndex : 'code',
							width : 80,
							editor : new Ext.grid.GridEditor(
									new Ext.form.TextField({
										allowBlank : false
									}))
						}, {
							header : '姓名',
							dataIndex : 'name',
							width : 100
						}, {
							header : '性别',
							dataIndex : 'sex',
							width : 60,
							renderer : SEXRender
						}, {
							header : '岗位名称',
							dataIndex : 'jobname',
							width : 160
						}, {
							dataIndex : 'daid',
							hidden : true
						} ]);

				var grid_mx = new Ext.grid.GridPanel({
					title : '<span class="commoncss">档案包含人员列表</span>',
					height : 600,
					// width:600,
					autoScroll : true,
					region : 'center',
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
						text : '新增人员',
						iconCls : 'page_addIcon',
						handler : function() {
							addEmp();
						}
					}, '-', {
						text : '删除人员',
						iconCls : 'page_delIcon',
						handler : function() {
							deleteKpdaItems();
						}
					} ],
					bbar : bbar_mx
				});

				var KpdaEmpWindow = new Ext.Window({
					layout : 'fit',
					width : 600,
					height : 500,
					resizable : false,
					draggable : true,
					closeAction : 'hide',
					modal : true,
					title : '<span class="commoncss">管理档案包含人员</span>',
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
					items : [ grid_mx ],
					buttons : [ {
						text : '关闭',
						iconCls : 'deleteIcon',
						handler : function() {
							KpdaEmpWindow.hide();
						}
					} ]
				});
				store_mx.load({
					params : {
						start : 0,
						limit : bbar_mx.pageSize,
						firstload : 'true',
						daid : daid
					}
				});
				KpdaEmpWindow.show();
			}

			function addEmp() {
				var store_emp = new Ext.data.Store({
					// 获取数据的方式
					proxy : new Ext.data.HttpProxy({
						url : './empl.do?reqCode=queryEmployeesForManage'
					}),
					// 数据读取器
					reader : new Ext.data.JsonReader({
						totalProperty : 'TOTALCOUNT', // 记录总数
						root : 'ROOT' // Json中的列表数据根节点
					}, [ {
						name : 'empid' // Json中的属性Key值
					}, {
						name : 'code'
					}, {
						name : 'name'
					}, {
						name : 'sex'
					}, {
						name : 'jobname'
					} ])
				});

				// 翻页排序时带上查询条件
				store_emp.on('beforeload', function() {
					this.baseParams = qForm.getForm().getValues();
				});
				// 每页显示条数下拉选择框
				var pagesize_combo = new Ext.form.ComboBox({
					name : 'pagesize',
					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.ArrayStore({
						fields : [ 'value', 'text' ],
						data : [ [ 10, '10条/页' ], [ 20, '20条/页' ],
								[ 50, '50条/页' ], [ 100, '100条/页' ],
								[ 250, '250条/页' ], [ 500, '500条/页' ] ]
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
					} ]
				});

				// 定义自动当前页行号
				var rownum = new Ext.grid.RowNumberer({
					header : 'NO',
					width : 28
				});

				// 定义列模型
				var cm = new Ext.grid.ColumnModel([ rownum, {
					header : 'empid',
					dataIndex : 'empid',
					hidden : false
				}, {
					header : '员工编码',
					dataIndex : 'code',
					sortable : true
				}, {
					header : '姓名',
					dataIndex : 'name'
				}, {
					header : '性别',
					dataIndex : 'sex'
				}, {
					header : '岗位',
					dataIndex : 'jobname'
				} ]);

				var grid = new Ext.grid.GridPanel({
					region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
					margins : '3 3 3 3',
					// collapsible : true,
					border : true,
					// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
					title : '<span class="commoncss">病人结算信息</span>',
					// height : 500,
					autoScroll : true,
					frame : true,
					store : store_emp, // 数据存储
					stripeRows : true, // 斑马线
					cm : cm, // 列模型
					tbar : tbar,
					bbar : bbar,// 分页工具栏
					viewConfig : {
						// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
						forceFit : true
					},
					loadMask : {
						msg : '正在加载表格数据,请稍等...'
					}
				});

				var qForm = new Ext.form.FormPanel({
					border : false,
					labelWidth : 60, // 标签宽度
					labelAlign : 'right', // 标签对齐方式
					bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
					buttonAlign : 'center',
					height : 120,
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
								fieldLabel : '员工编码',
								name : 'grbm',
								xtype : 'textfield', // 设置为数字输入框类型
								anchor : '100%'
							}, {
								fieldLabel : '现年龄从',
								name : 'xnl1',
								xtype : 'numberfield', // 设置为数字输入框类型
								allowDecimals : false, // 是否允许输入小数
								allowNegative : false, // 是否允许输入负数
								maxValue : 120,
								anchor : '100%'
							} ]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [ {
								fieldLabel : '姓名', // 标签
								id : 'xm',
								name : 'xm', // name:后台根据此name属性取值
								allowBlank : true, // 是否允许为空
								maxLength : 6, // 可输入的最大文本长度,不区分中英文字符
								anchor : '100%' // 宽度百分比
							}, {
								fieldLabel : '到',
								name : 'xnl2',
								xtype : 'numberfield', // 设置为数字输入框类型
								allowDecimals : false, // 是否允许输入小数
								allowNegative : false, // 是否允许输入负数
								maxValue : 120,
								anchor : '100%'
							} ]
						} ]
					}, {
						fieldLabel : '单位名称', // 标签
						name : 'dwmc', // name:后台根据此name属性取值
						maxLength : 20, // 可输入的最大文本长度,不区分中英文字符
						xtype : 'textfield',
						allowBlank : true,
						anchor : '100%'// 宽度百分比
					} ],
					buttons : [{
						text : '查询',
						iconCls : 'previewIcon',
						disabled : false,
						handler : function() {
							submitTheForm();
						}
					}, {
						text : '重置',
						iconCls : 'tbar_synchronizeIcon',
						disabled : false,
						handler : function() {
							submitTheForm();
						}
					}]
				});

				var qWindow = new Ext.Window({
					title : '<span class="commoncss">查询条件</span>', // 窗口标题
					layout : 'border', // 设置窗口布局模式
					width : 700, // 窗口宽度
					height : 600, // 窗口高度
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
					items : [{	
						collapsible : true,
						height : 200, 
						minSize : 160,
						maxSize : 280,
						split : true,
						region : 'north',
						autoScroll : true,
						margins : '3 3 3 3',
					   // collapseMode:'mini',
					   items : [ qForm ]
				     }, {
						region : 'center',
						layout : 'fit',
						border : false,
						//margins : '3 3 3 3',
						items : [ grid ]
					}],
					buttons : [ {
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
					} ]
				});
				qWindow.show();
			}

		});