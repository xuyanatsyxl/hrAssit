/**
 * 部门未打卡原因汇总表
 * 
 * @author 徐岩
 * @since 2015-01-21
 */
Ext
		.onReady(function() {

			var deptLevelCombo = new Ext.form.ComboBox({
				hiddenName : 'bmjb',
				fieldLabel : '汇总级别',
				triggerAction : 'all',
				emptyText : '请选择',
				store : new Ext.data.SimpleStore({
					fields : [ 'name', 'code' ],
					data : [ [ '一级部门', '1' ], [ '二级部门', '2' ],
							[ '三级部门', '3' ], [ '四级部门', '4' ],
							[ '五级部门', '5' ] ]
				}),
				displayField : 'name',
				valueField : 'code',
				mode : 'local',
				forceSelection : false, // 选中内容必须为下拉列表的子项
				editable : false,
				typeAhead : true,
				resizable : true,
				anchor : '100%'
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
				addDeptTree.render('addDeptTreeDiv');
				addDeptTree.root.reload();

			});

			var qForm = new Ext.form.FormPanel({
				id : 'qForm',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 120,
				items : [ comboxWithTree, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '开始日期',
							name : 'kssj',
							xtype : 'datefield', // 设置为数字输入框类型
							format : 'Y-m-d',
							anchor : '100%'
						}, deptLevelCombo, {
							id : 'deptid',
							name : 'deptid',
							hidden : true
						} ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '结束日期',
							name : 'jssj',
							xtype : 'datefield', // 设置为数字输入框类型
							format : 'Y-m-d',
							anchor : '100%'
						} ]
					} ]
				} ]
			});

			var qWindow = new Ext.Window({
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
				items : [ qForm ],
				buttons : [ {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
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
				width : 28
			});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ rownum, {
				header : '部门编码',
				dataIndex : 'deptid',
				sortable : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname',
				sortable : true
			}, {
				header : '未处理记录',
				dataIndex : 'wclsl',
				sortable : true
			}, {
				header : '违纪次数',
				dataIndex : 'wjsl',
				sortable : true
			}, {
				header : '休息次数',
				dataIndex : 'xxsl',
				sortable : true
			}, {
				header : '请假次数',
				dataIndex : 'qjsl',
				sortable : true
			}, {
				header : '工作原因',
				dataIndex : 'gzsl',
				sortable : true
			}, {
				header : '技术原因',
				dataIndex : 'jsyy',
				sortable : true
			} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'kqbc.do?reqCode=queryKqbcjlSumReport'
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
					name : 'wclsl'
				}, {
					name : 'wjsl'
				}, {
					name : 'xxsl'
				}, {
					name : 'qjsl'
				}, {
					name : 'gzyy'
				}, {
					name : 'jsyy'
				} ])
			});
/*
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
			
			*/

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
				}, '-', {
					text : '导出Excel',
					iconCls : 'page_excelIcon',
					handler : function() {
						if (store.getCount() > 0) {
							exportExcel('kqbc.do?reqCode=queryJbjlForExcel');
						} else {
							Ext.MessageBox.alert('提示', "当前没有可以导出的数据！！");
						}
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
				title : '<span class="commoncss">部门未打卡情况汇总表</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				tbar : tbar,
				//bbar : bbar,// 分页工具栏
				viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
					forceFit : true
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
				//params.start = 0;
				//params.limit = bbar.pageSize;
				store.load({
					params : params
				});
			}

		});