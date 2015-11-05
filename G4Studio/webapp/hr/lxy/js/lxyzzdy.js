
Ext.onReady(function() {
	
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
						//allowBlank : false,
						value : '',
						emptyText : '请选择...',
						fieldLabel : '所属部门',
						//labelStyle : micolor,
						anchor : '100%',
						mode : 'local',
						triggerAction : 'all',
						maxHeight : 390,
						// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
						tpl : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
						//allowBlank : false,
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
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 120,
				items : [ comboxWithTree,  {
					layout : 'column',
					border : false,
					items : [ {
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
						},  {
							id : 'deptid',
							name : 'deptid',
							hidden : 'true'
						} ]
					}, {
						columnWidth : .5,
						layout : 'form',						
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '身份证号', // 标签
							name : 'sfzh', 
							anchor : '100%'// 宽度百分比					
						
							
						}]
					} ]
				}]
			});

			var qWindow = new Ext.Window({
				title : '<span class="commoncss">查询条件</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 430, // 窗口宽度
				height : 150, // 窗口高度
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
			var cm = new Ext.grid.ColumnModel([  sm,rownum,
			{
				header : '部门编码',
				dataIndex : 'deptid',
				sortable : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname'
			},
			{
				header:'员工编号',
				dataIndex:'rybh'
			},    
		    {
				header : '姓名',
				dataIndex : 'xm'
			}, {
				header : '性别',
				dataIndex : 'xb',
				renderer : XBRender
			},
			{
				header:'员工星级',
				dataIndex:'ygxj',
				sortable : true,
				renderer:YGXJRender
			},
			{

				header:'岗位',
				dataIndex:'gw',
				sortable : true,
				renderer:GWRender
				
			},
			
			{
				header:'品牌',
				dataIndex:'pp'
			},
			
			{
				header : '身份证号',
				dataIndex : 'sfzh',
				width : 200
			},{
				header:'上岗时间',
				format : 'Y-m-d',
				dataIndex:'ydrq'
			},{
				header:'获取星级时间',
				dataIndex:'hqxjrq'	,
				format:'y-M-d'
			},{
				header:'星级有效期至',
				dataIndex:'xjjsrq',
				format:'y-M-d'
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
				}, [  {
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
				},{
					name: 'ydrq'
				},{
					name:'ygxj'	
					
				},{					
					name:'pp'
				},{
					name:'hqxjrq'
					
				},{
					name:'xjjsrq'
				},{
					
					name:'gw'
				}])
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
				}
				,{
					text:'证章打印',
					iconCls:'printerIcon',
					handler:function(){
						printuser();
						
					}
				}			
				, {
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
				title : '<span class="commoncss">联销员异动记录查询</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				sm:sm,
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
			
			function printuser(){
				var row = grid.getSelectionModel().getSelections();
				if(Ext.isEmpty(row)){
					Ext.Msg.alert("提示","请选择要打印证章的人！");
				}
				var strChecked=jsArray2JsString(row,"ryid");
				//Ext.MessageBox.alert('提示', row.get('ryid'));
				Ext.Ajax.request({
					url : './lxyRpt.do?reqCode=lxyzzdymanager',
					success : function(response) {
						hideWaitMsg();
						doPrint('zhengzhang');
					},
					failure : function(response) {
						hideWaitMsg();
						Ext.Msg.alert('提示', "准备报表数据对象发生错误,请检查!");
					},
					params:{
						strChecked:strChecked
					}
					
					
				});
			}
			
			

		});