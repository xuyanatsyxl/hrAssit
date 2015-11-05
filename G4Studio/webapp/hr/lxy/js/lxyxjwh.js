/**
 * 联销员星级维护
 * 
 * @author lichanqi
 * @since 2010-11-20
 */
Ext
		.onReady(function() {
			var var_ryid;
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
				Ext.getCmp("qForm").findById('deptid').setValue(
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
						// allowBlank : false,
						value : '',
						emptyText : '请选择...',
						fieldLabel : '所属部门',
						// labelStyle : micolor,
						anchor : '100%',
						mode : 'local',
						triggerAction : 'all',
						maxHeight : 390,
						// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
						tpl : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
						// allowBlank : false,
						onSelect : Ext.emptyFn
					});

			
			var YGXJCombo1 = new Ext.form.ComboBox({
				name : 'xygxj',
				//id:'xjwhygxj',
				hiddenName : 'xygxj',
				store : YGXJStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '',
				fieldLabel : '星级选择',
				emptyText : '请选择...',
				forceSelection : true,
				editable : false,
				allowBlank : false,
				typeAhead : true,
				labelStyle : micolor,
				anchor : "100%"
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
				labelWidth : 70, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 120,
				items : [ comboxWithTree, {
					border : false,
					items : [ {
						border : false,
						columnWidth : .5,
						layout : 'form',
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '姓名', // 标签
							name : 'xm', // name:后台根据此name属性取值
							allowBlank : true, // 是否允许为空
							maxLength : 6, // 可输入的最大文本长度,不区分中英文字符
							anchor : '100%' // 宽度百分比
						}, {
							fieldLabel : '身份证号', // 标签
							name : 'sfzh', // name:后台根据此name属性取值
							allowBlank : true, // 是否允许为空
							maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
							anchor : '100%' // 宽度百分比

						}, {

							fieldLabel : '供货单位', // 标签
							name : 'ghdw', // name:后台根据此name属性取值
							allowBlank : true, // 是否允许为空
							maxLength : 20, // 可输入的最大文本长度,不区分中英文字符
							anchor : '100%' // 宽度百分比
						}, {

							fieldLabel : '品牌', // 标签
							name : 'pp', // name:后台根据此name属性取值
							allowBlank : true, // 是否允许为空
							maxLength : 18, // 可输入的最大文本长度,不区分中英文字符
							anchor : '100%' // 宽度百分比
						}, {
							id : 'deptid',
							name : 'deptid',
							hidden : 'true'
						} ]
					} ]
				} ]
			});

			var qWindow = new Ext.Window({
				title : '<span class="commoncss">查询条件</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 330, // 窗口宽度
				height : 270, // 窗口高度
				closable : true, // 是否可关闭
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
						queryBalanceInfo(qForm.getForm());

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
						qForm.getForm().reset();
						qWindow.hide();
					}
				} ]
			});
			qWindow.show(); // 显示窗口

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});
			var sm = new Ext.grid.CheckboxSelectionModel();
			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ sm, rownum, {
				header : '员工编号',
				dataIndex : 'rybh'
			}, {
				header : '姓名',
				dataIndex : 'xm'
			}, {
				header : '性别',
				dataIndex : 'xb',
				renderer : XBRender
			}, {
				header : '员工星级',
				dataIndex : 'ygxj',
				sortable : true,
				renderer : YGXJRender
			}, {
				header : '部门编码',
				dataIndex : 'deptid',
				sortable : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname'
			}, {
				header : '品牌',
				dataIndex : 'pp'
			},

			{
				header : '身份证号',
				dataIndex : 'sfzh',
				width : 200
			}, {
				header : '上岗时间',
				format : 'Y-m-d',
				dataIndex : 'ydrq'
			}, {
				header : '获取星级时间',
				dataIndex : 'hqxjrq',
				format : 'y-M-d'
			}, {
				header : '星级有效期至',
				dataIndex : 'xjjsrq',
				format : 'y-M-d'
			}

			]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'lxy.do?reqCode=queryLxyxj'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'deptid'
				}, {
					name : 'deptname'
				}, {
					name : 'ryid'
				}, {
					name : 'rybh'
				}, {
					name : 'xm'
				}, {
					name : 'xb'
				}, {
					name : 'sfzh'
				}, {
					name : 'ydrq'
				}, {
					name : 'ygxj'

				}, {
					name : 'pp'
				}, {
					name : 'hqxjrq'

				}, {
					name : 'xjjsrq'
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
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
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
					text : '员工星级记录',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editXJinit();

					}
				}, {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				} ]
			});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				// collapsible : true,
				border : true,
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">联销员信息查询</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				sm : sm,
				tbar : tbar,
				bbar : bbar,// 分页工具栏
				viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
					forceFit : true
				},
				loadMask : {
					msg : '正在加载数据,请稍等...'
				}
			});
			// 监听行双击事件
			grid.on('rowdblclick', function(pGrid, rowIndex, event) {
				editXJinit();
			});
			// 布局
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ grid ]
			});

			// 查询表格数据
			function queryBalanceInfo(pForm) {
				if (!qForm.getForm().isValid())
					return;
				var params = pForm.getValues();
				params.start = 0;
				params.limit = bbar.pageSize;
				store.load({
					params : params
				});
				qForm.getForm().reset();
				qWindow.hide();
			}

			function editXJinit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.Msg.alert('提示', '请先选中要选者人员。');
					return;
				}
				var ryid = record.get("ryid");
				// Ext.getCmp('strryid').setValue(strChecked);
				xjstore.load({
					params : {

						ryid : ryid
					}

				});

				var_ryid = ryid;

				xjWindow.show();

			}

			// 添加星级记录start
		
			var xjwhForm = new Ext.form.FormPanel({
				id : 'xjwhForm',
				name : 'xjwhForm',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 85,
				frame : false,
				margins : '3 3 3 3',
				bodyStyle : 'padding:5 5 5 5',
				items : [ YGXJCombo1, {
				///	id:'xjwhhqxjrq',
					fieldLabel : '获取星级时间', // 标签
					xtype : 'datefield',
					format : 'Y-m-d',
					name : 'hqxjrq', // name:后台根据此name属性取值
					allowBlank : false,
					labelStyle : 'color:blue;',
					anchor : '100%'// 宽度百分比
				}, {

					//fieldLabel : '人员ID', // 标签
					id : 'ryid',
					name : 'ryid',
				    hidden : 'true'
				}, {
					//id : 'hr_eventid',
					name : 'hr_eventid',
				    hidden:'true'
				} ]

			});

			
			var addxjWindow = new Ext.Window({
				title : '<span class="commoncss">修改员工星级</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 300, // 窗口宽度
				height : 200, // 窗口高度
				closable : true, // 是否可关闭
				closeAction : 'hide', // 关闭策略
				collapsible : true, // 是否可收缩
				maximizable : false, // 设置是否可以最大化
				border : true, // 边框线设置
				constrain : true,
				titleCollapse : true,
				animateTarget : Ext.getBody(),
				pageY : 100, // 页面定位Y坐标
				pageX : document.body.clientWidth / 2 - 500 / 2, // 页面定位X坐标
				// 设置窗口是否可以溢出父容器
				buttonAlign : 'right',
				items : [ xjwhForm ],
				buttons : [ {
					text : '保存',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						savelxyxjwh();
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						xjwhForm.getForm().reset();
						addxjWindow.hide();
					}
				} ]
			});

			var xjsm = new Ext.grid.CheckboxSelectionModel();
			// 定义列模型
			var xjcm = new Ext.grid.ColumnModel([ xjsm, {
				dataIndex : 'ryid',
				hidden : true
			}, {
				dataIndex : 'hr_eventid',
				hidden : true

			}, {
				header : '部门',
				dataIndex : 'deptname'
			}, {
				header : "姓名",
				dataIndex : 'xm'
			}, {
				header : '星级', // 列标题
				dataIndex : 'xygxj', // 数据索引:和Store模型对应
				renderer : YGXJRender
			// sortable : true
			// 是否可排序
			}, {
				header : '获取星级时间',
				dataIndex : 'xhqxjrq',
				sortable : true,
				format : 'y-M-d',

				width : 200
			} ]);

			/**
			 * 数据存储
			 */
			var xjstore = new Ext.data.Store({
				// true to clear all modified record information each
				// time the store is loaded
				pruneModifiedRecords : true,
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'lxycsh.do?reqCode=queryLxybdjlxj'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'ryid'

				}, {
					name : 'hr_eventid' // Json中的属性Key值
				}, {
					name : 'xm'
				}, {
					name : 'xhqxjrq',

					dateFormat : 'Y-m-d'
				}, {
					name : 'xygxj'
				}, {
					name : 'deptname'
				} ])
			});

			// 表格工具栏
			var xjtbar = new Ext.Toolbar({
				items : [ {
					text : '新增一行',
					iconCls : 'addIcon',
					handler : function() {
						addxjInit();
					}
				}, {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						updatexjInit();
					}
				}, {
					text : '删除数据',
					iconCls : 'deleteIcon',
					handler : function() {
						deletexjInit();
					}
				} ]
			});

			// 表格实例
			var xjgrid = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体

				height : 335,
				width : 644,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				store : xjstore, // 数据存储
				stripeRows : true, // 斑马线
				cm : xjcm, // 列模型
				sm : xjsm,
				tbar : xjtbar, // 表格工具栏
				clicksToEdit : 1, // 单击、双击进入编辑状态
				/*
				 * viewConfig : { // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况 forceFit :
				 * true },
				 */
				loadMask : {
					msg : '正在加载数据,请稍等...'
				}
			});
			// 学历的分页
			var xjpagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				xjstore : new Ext.data.ArrayStore({
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
			var xjnumber = parseInt(xjpagesize_combo.getValue());
			xjpagesize_combo.on("select", function(comboBox) {
				xjbbar.pageSize = parseInt(comboBox.getValue());
				xjnumber = parseInt(comboBox.getValue());
				xjstore.reload({
					params : {
						start : 0,
						limit : xjbbar.pageSize
					}
				});
			});

			var xjbbar = new Ext.PagingToolbar({
				pageSize : number,
				store : xjstore,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', xjpagesize_combo ]
			});
			// 学历的分页结束

			// 监听行双击事件
			xjgrid.on('rowdblclick', function(pGrid, rowIndex, event) {
				updatexjInit();
			});
			
			
			var xjWindow = new Ext.Window({
				title : '<span class="commoncss">联系员星级维护</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 480, // 窗口宽度
				height : 330, // 窗口高度
				closable : true, // 是否可关闭
				closeAction : 'hide', // 关闭策略
				collapsible : true, // 是否可收缩
				maximizable : false, // 设置是否可以最大化
				border : true, // 边框线设置
				constrain : true,
				titleCollapse : true,
				animateTarget : Ext.getBody(),
				pageY : 100, // 页面定位Y坐标
				pageX : document.body.clientWidth / 2 - 500 / 2, // 页面定位X坐标
				// 设置窗口是否可以溢出父容器
				buttonAlign : 'right',
				items : [ xjgrid ],
				buttons : [ {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {

						xjWindow.hide();
					}
				} ]
			});

			function addxjInit() {
				// clearForm(xjForm.getForm());
				xjwhForm.form.reset();
				addxjWindow.setTitle('<span class="commoncss">添加员工历史星级记录</span>');
				//xjwhForm.getForm().getEl().dom.reset();
				// Ext.Msg.alert('提示','ryid:'+var_ryid);
				Ext.getCmp("xjwhForm").findById('ryid').setValue(var_ryid);
				addxjWindow.show();

			}

			function updatexjInit() {
				var record = xjgrid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.Msg.alert('提示', '请先选中要选者人员。');
					return;
				}
				// Ext.Msg.alert('提示',record.get('xygxj')+"---"+record.get("hqxjrq"));
				// addUserForm.getForm().loadRecord(record);
				xjwhForm.getForm().loadRecord(record);
				// Ext.getCmp('xjForm').findById('ryid').setValue(record.get('ryid'));
				// Ext.getCmp('xjwhForm').findById('xjwhygxj').setValue(record.get('xygxj'));
				// Ext.getCmp('xjwhForm').findById('xjwhhqxjrq').setValue(record.get('hqxjrq'));
				// Ext.getCmp('xjForm').findById('hr_eventid').setValue(record.get('hr_eventid'));
				addxjWindow.show();
			}

			function deletexjInit() {
				var record = xjgrid.getSelectionModel().getSelections();
				var strchecked = jsArray2JsString(record, "hr_eventid");
				Ext.Ajax.request({
					url : "lxycsh.do?reqCode=deletelxyxjwh",
					success : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						xjstore.reload();
						Ext.Msg.alert('提示', resultArray.msg);
					},
					failur : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						xjstore.reload();
						Ext.Msg.alert('提示', resultArray.msg);

					},
					params : {
						strchecked : strchecked
					}

				});
			}

			function savelxyxjwh() {
				if (!xjwhForm.form.isValid()) {
					return;

				}

				xjwhForm.form.submit({
					url : 'lxycsh.do?reqCode=savelxyxjwhItem',
					waitTitle : '提示',
					meothod : 'POST',
					waitMsg : '正在处理数据请稍后。。。',
					success : function(form, action) {
						// var
						// resultArray=Ext.util.JSON.decode(response.responseText);
						xjstore.reload();
						addxjWindow.hide();
						Ext.Msg.alert('提示', action.result.msg);

					},
					failure : function(form, action) {
						// var
						// resultArray=Ext.util.JSON.decode(response.responseText);
						xjstore.reload();
						addxjWindow.hide();
						Ext.Msg.alert('提示', action.result.msg);

					}

				});

			}

		});