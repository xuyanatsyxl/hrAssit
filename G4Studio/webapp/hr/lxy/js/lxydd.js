Ext
		.onReady(function() {
var dept_id;
			var Root = new Ext.tree.AsyncTreeNode({
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});
			var DeptTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : '../user.do?reqCode=departmentTreeInit'
				}),
				root : Root,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});

			// 监听下拉树的节点单击事件
			DeptTree.on('click', function(node) {

				dept_id = node.attributes.id;
				store.load({
					params : {

						start : 0,
						limit : bbar.pageSize,
						deptid : dept_id
					}

				});

			});

			// 修改后的部门

			var updateaddRoot = new Ext.tree.AsyncTreeNode({
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});
			var updateaddDeptTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : '../user.do?reqCode=departmentTreeInit'
				}),
				root : updateaddRoot,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});

			// 监听下拉树的节点单击事件
			updateaddDeptTree.on('click', function(node) {
				updatecomboxWithTree.setValue(node.text);
				Ext.getCmp("updateForm").findById('updatedeptid').setValue(
						node.attributes.id);
				updatecomboxWithTree.collapse();
			});

			var updatecomboxWithTree = new Ext.form.ComboBox(
					{
						id : 'updatedeptname',
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
						// allowBlank : false,
						onSelect : Ext.emptyFn
					});

			// 监听下拉框的下拉展开事件
			updatecomboxWithTree.on('expand', function() {
				// 将UI树挂到treeDiv容器
				updateaddDeptTree.render('addDeptTreeDiv');
				// addDeptTree.root.expand(); //只是第一次下拉会加载数据
				updateaddDeptTree.root.reload(); // 每次下拉都会加载数据

			});

			var updateForm = new Ext.form.FormPanel({
				id:'updateForm',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 120,
				items : [ updatecomboxWithTree, {
					labelWidth : 60, // 标签宽度
					defaultType : 'textfield',
				
					border : false,
					items:[{						
						id : 'updatedeptid',
						name : 'updatedeptid', // name:后台根据此name属性取值
						hidden : true
					}]
					
				}, {
					labelWidth : 60, // 标签宽度
					defaultType : 'textfield',
				
					border : false,
					
					items : [ {
						id : 'str_ryid',
						name : 'str_ryid',
						hidden : true

					} ]

				} ]
			});

			var updateWindow = new Ext.Window({
				title : '<span class="commoncss">调整到什么部门</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 330, // 窗口宽度
				height : 130, // 窗口高度
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
				items : [ updateForm ],
				buttons : [ {
					text : '确定',
					iconCls : 'previewIcon',
					handler : function() {
						editRYid();

					}
				},{
					text:'关闭',
					iconCls:'deleteIcon',
					handler:function(){
						updateForm.getForm().reset();
						updateWindow.hide();
					}
					
				} ]
			});

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

			// 定义列模型
			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ sm, rownum, {
				dataIndex : 'ryid',
				hidden : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname',
				width : 120
			}, {
				header : '姓名',
				dataIndex : 'xm'
			}, {
				header : '性别',
				dataIndex : 'xb',
				renderer : XBRender
			}, {
				header : '身份证号',
				dataIndex : 'sfzh',
				width : 200
			}, {

				header : '品牌',
				dataIndex : 'pp',
				width : 100
			}, {
				header : '员工星级',
				dataIndex : 'ygxj',
				renderer : YGXJRender,
				width : 100

			},

			{
				header : '岗位',
				dataIndex : 'gw',
				width : 100,
				renderer : GWRender

			}, {

				header : '入企时间',
				dataIndex : 'ydrq',
				width : 120

			} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : './lxybd.do?reqCode=queryLxyddForManage'
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
					name : 'xm'
				}, {
					name : 'xb'
				}, {
					name : 'sfzh'
				}, {
					name : 'pp'
				}, {

					name : 'gw'
				}, {

					name : 'ydrq'
				}, {
					name : 'ygxj'
				} ])
			});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
						deptid:dept_id
				};
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
				items : [{
					text : '修改部门',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						updateRYdeptid();

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
				title : '<span class="commoncss">部门联销员调动</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				sm : sm,
				tbar : tbar,
				bbar : bbar,// 分页工具栏
				// viewConfig : {
				// // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : true
				// },
				loadMask : {
					msg : '正在加载数据,请稍等...'
				}
			});

			// 布局
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ {
					
					title:'<span class="commoncess">组织机构</span>',
					iconCls:'chart_organisationIcon',
					tools:[{
						id:'resfresh',
						handler:function(){
							DeptTree.root.reload()
						}
					}],
					
				collapsible:true,
				width:210,
				minSize:160,
				maxSize:280,
				split:true,
				region:'west',
				autoScroll:true,
				items:[DeptTree]
				},{
				region:'center',
				layout:'fit',
				border:false,
				margins:'3 3 3 3',
				items:[grid]
					
				} ]
			
			
			});
			
			function updateRYdeptid() {

				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要修改的人员，可以多选。');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'ryid');
				Ext.getCmp('str_ryid').setValue(strChecked);
				updateWindow.show();
			}

			function editRYid() {
				if (!updateForm.form.isValid()) {
					return;
				}

				updateForm.form.submit({
					url : "./lxybd.do?reqCode=updatelxydd",
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据，请稍后。。。',
					success : function(form, action) {
						updateWindow.hide();
						store.reload();
						form.reset();
						Ext.Msg.alert('提示', action.result.msg);
					},
					failure : function(action) {
						Ext.Msg.alert('提示', action.result.msg);
					}

				});
			}

		});