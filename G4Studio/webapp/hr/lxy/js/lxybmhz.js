Ext
		.onReady(function() {

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
							
				var deptid=node.attributes.id;
				store.load({
					params:{
						
						start:0,
						limit:bbar.pageSize,
						deptid:deptid
					}
					
				});
				
				
			});

			
			
			
			/*var qForm = new Ext.form.FormPanel({
				id:'qForm',
				region : 'north',
				margins : '3 3 3 3',
				title : '<span class="commoncss">查询条件<span>',
				collapsible : true,
				border : true,
				labelWidth : 90, // 标签宽度
				// frame : true, //是否渲染表单面板背景色
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 100,
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .25,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [comboxWithTree ]
					}, {

						columnWidth : .25,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [  {

							id : 'deptid',
							name : 'deptid',
							hidden : true

						}  ]

					} ]
				} ],
				buttons : [ {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryBalanceInfo(qForm.getForm());
					}
				}]
			});
*/
			
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ rownum,
			 {
				header : '部门ID',
				dataIndex : 'deptid',
				width : 80
			}, {
				header : '部门名称',
				dataIndex : 'deptname',
				width : 120
			}, {
				header : '部门总人数',
				dataIndex : 'rycount',	
				width : 80				
			}, { 
				header : '男员工',
				dataIndex : 'man',
				width : 60
			}, {
				header : '女员工',
				dataIndex : 'women',
				width : 60
			},{
				header:'无星级',
				dataIndex:'lxj',
				width:80
			},
			{
				header:'一星级',
				dataIndex:'yxj',
				width:80
			},
			{
				header:'二星级',
				dataIndex:'exj',
				width:80
			},
			{
				header:'三星级',
				dataIndex:'sxj',
				width:80
			},
			{
				header:'四星级',
				dataIndex:'sixj',
				width:80
			},
			{
				header:'五星级',
				dataIndex:'wxj',
				width:80
			}
			,{
				header:'店长',
				dataIndex:'gwdz',
				width:80
			}
			,{
				header:'联销员',
				dataIndex:'gwlxy',
				width:80
			}
			,{
				header:'临时促销员',
				dataIndex:'gwlscxy',
				width:80
			}, {
				header : '小时工',
				dataIndex : 'gwxsg',
				width : 80
			}, {
				header : '统招学历',
				dataIndex : 'tz',
				width : 80				
			},
			{
				header : '自考学历',
				dataIndex : 'zk',
				width : 80				
			}
			,
			{
				header : '其他学历',
				dataIndex : 'qtxl',
				width : 80				
			},
			{
				header : '未婚',
				dataIndex : 'wh',
				width : 60
				
			},
			{
				header : '已婚',
				dataIndex : 'yh',
				width : 60				
			},
			{
				header : '离异',
				dataIndex : 'ly',
				width : 60
			}, {
				header : '丧偶',
				dataIndex : 'so',
				sortable : true,
				width : 60
				}, {
				header : '婚姻状况其他',
				dataIndex : 'qt',
				width : 80
			}, 
			{
				header : '农业户口',
				dataIndex : 'ny',
				width : 60
				},
			{
				
				header : '非农业户口',
				dataIndex : 'fny',
				width : 80
				}]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : './lxyRpt.do?reqCode=querylxybmhzForManage'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					root : 'ROOT' // Json中的列表数据根节点
				}, [{
					name : 'deptid'
				}, {
					name : 'deptname'
				}, {
					name : 'man'
				}, {
					name : 'women'
				}, {
					name : 'rycount'
				}, {
					name : 'wh'
				}, {
					name : 'yh'
				}, {
					name : 'ly'
				}, {
					name : 'so'
				}, {
					name : 'qt'
				}, {
					name : 'ny'
				}, {
					name : 'fny'
				},{
					name:'tz'
				},
				{
					name:'zk'
				},{
					name:'qtxl'				
					
				},{
					name:'lxj'
				},
				{
					name:'yxj'
				},
				{
					name:'exj'
				},{
					name:'sxj'
				},{
					name:'sixj'
				},{
					name:'wxj'
				},{
					name:'gwdz'
				},{
					name:'gwlxy'
				},{
					
					name:'gwlscxy'
				}, {
					name : 'gwxsg'
				}
				])
			});

			// 翻页排序时带上查询条件
			/*store.on('beforeload', function() {
				this.baseParams = qForm.getForm().getValues();
			});*/
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

			
			var tbar=new Ext.Toolbar({
				items:[{
					text:'导出',
					iconCls:'page_excelIcon',
					handler:function(){
						if(store.getCount()>0){
							exportExcel('lxyRpt.do?reqCode=bmLxyhzForExcel');
							
						}else{
							
							Ext.MessageBox.alert("提示","当前没有可以导出的数据");
						}
						
					}
				}]
				
			});
			// 表格实例
			var grid = new Ext.grid.GridPanel({
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				// collapsible : true,
				border : false,
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				//title : '<span class="commoncss">部门联销员信息汇总</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				tbar:tbar,
				bbar : bbar,// 分页工具栏
				/*viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
					forceFit : true
				},*/
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
							addDeptTree.root.reload()
						}
					}],
					
				collapsible:true,
				width:210,
				minSize:160,
				maxSize:280,
				split:true,
				region:'west',
				autoScroll:true,
				items:[addDeptTree]
				},{
				region:'center',
				layout:'fit',
				border:false,
				margins:'3 3 3 3',
				items:[grid]
					
				} ]
			
			
			});

			// 查询表格数据
			/*function queryBalanceInfo(pForm) {
				if (!qForm.getForm().isValid())
					return;
				var params = pForm.getValues();
				params.start = 0;
				params.limit = bbar.pageSize;
				store.load({
					params : params
				});
			}*/

		});